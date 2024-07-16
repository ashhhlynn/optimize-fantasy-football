const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const solver = require("javascript-lp-solver");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

let sleeperProjections = {};
let [classicPlayers, classicCombined, captainQueue1, captainQueue2, classicConstraint] = [[], {}, {}, {}, {}];
let classicInt = {
    'QB': 1,
    'RB': 1,
    'WR': 1,
    'TE': 1,
    'DST': 1,
    'FLEX': 1
};

startApp();

function startApp() {
    fetch("https://api.sleeper.app/projections/nfl/2023/18?season_type=regular&position%5B%5D=DEF&position%5B%5D=K&position%5B%5D=RB&position%5B%5D=QB&position%5B%5D=TE&position%5B%5D=WR&order_by=ppr")
    .then((res)=> res.json())
    .then(data => {
        data.map((p) => {
            if (p.stats.pts_ppr > 0) {  
                let name = p.player.position === "DEF" ?  p.player.last_name : p.player.first_name + ' ' + p.player.last_name
                sleeperProjections[name] = p.stats.pts_ppr
            }
        });
        fetchClassicPlayers();
        fetchCaptainPlayers();
    });    
};

function fetchClassicPlayers() {
    fetch("https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables")
    .then((res)=> res.json())
    .then(data => {
        for (let z=0; z < data.draftables.length; z++) {
            if (data.draftables[z].draftStatAttributes[0].id === 90) {
                let p = data.draftables[z];
                let sleeper = Object.keys(sleeperProjections).find(key => key === p.displayName || key.slice(0,10) === p.displayName.slice(0,10));
                var proj = sleeper !== undefined ? sleeperProjections[sleeper] : 0
                let details = {
                    ...p, 
                    Projection: proj, 
                    [p.position]: 1, 
                    [z]: 1
                };    
                classicPlayers.push(details);
                if (proj > 0) {
                    classicCombined[z] = details
                    classicInt[z] = 1
                    classicConstraint[z] = {'max': 1}
                }
                if (z !== data.draftables.length - 1 && p.playerId === data.draftables[z+1].playerId) {
                    if (proj > 0) {
                        classicCombined[z + 1000] = {
                            ...details, 
                            [p.position]: 0, 
                            FLEX: 1
                        }
                        classicInt[z + 1000] = 1
                    }
                    z++ 
                }
            }
        }
    });   
};

function fetchCaptainPlayers() {
    fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98584/draftables')
    .then(response => response.json())
    .then(data1 => {
        fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98585/draftables')
        .then(response => response.json())
        .then(data2 => {
            captainQueue1 = getCaptainPlayers(data1.draftables);
            captainQueue2 = getCaptainPlayers(data2.draftables);
        });
    });
};

function getCaptainPlayers(data) {
    let [flexesQueue, crownsQueue] = [[],[]];
    data.map((p) => {
        if (p.draftStatAttributes[0].id === 90) {
            let sleeper = Object.keys(sleeperProjections).find(key => key === p.displayName || key.slice(0,10) === p.displayName.slice(0,10));
            var proj = sleeper !== undefined ? sleeperProjections[sleeper] : 0
            let details = {
                Name: p.displayName,
                Position: p.position,
                Game: p.competition['name'],
                Time: p.competition['startTime'],
                FFPG: p.draftStatAttributes[0].value,
                Team: p.teamAbbreviation,
                DraftTableId: p.playerId,
                Status: p.status,
                Salary: p.salary,
            };
            let ind = crownsQueue.findIndex(x => x.DraftTableId === p.playerId );
            if (ind === -1) {
                let newPlayer = {
                    ...details, 
                    CROWN: 1, 
                    [crownsQueue.length]: 1, 
                    Projection: proj * 1.5
                };
                crownsQueue.push(newPlayer);
            } else {
                let newPlayer = {
                    ...details, 
                    FLEX: 1, 
                    [ind]: 1, 
                    Projection: proj
                };
                flexesQueue.push(newPlayer);
            }
        }
    });
    let combinedQueue = [...crownsQueue, ...flexesQueue];
    return { flexesQueue, combinedQueue }    
}; 

app.get("/dates", (req, res) => { 
    let d1 = new Date(captainQueue1.flexesQueue[0].Time.substr(0,10));
    let d2 = new Date(captainQueue2.flexesQueue[0].Time.substr(0,10));
    const dayNames = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
    res.json({
        clDate: classicPlayers[0].competition.startTime.substr(5,5), 
        sdTeams1: captainQueue1.flexesQueue[0].Game, 
        sdTeams2: captainQueue2.flexesQueue[0].Game,
        sdDate1: dayNames[d1.getDay()] + ' ' + captainQueue1.flexesQueue[0].Time.substr(5,5), 
        sdDate2: dayNames[d2.getDay()] + ' ' + captainQueue2.flexesQueue[0].Time.substr(5,5)
    });   
});

app.get("/classicplayers", (req, res) => { 
    let sortedPlayers = { qall: classicPlayers, qqb: [], qrb: [], qwr: [], qte: [], qdst: [], qflex: [] };
    for (let i=0; i < classicPlayers.length; i++) {
        let pos =  'q' + classicPlayers[i].position.toLowerCase();
        if (pos === 'qrb' || pos === 'qwr' || pos === 'qte') { sortedPlayers['qflex'] = [...sortedPlayers['qflex'], classicPlayers[i]] }
        sortedPlayers[pos] = [...sortedPlayers[pos],  classicPlayers[i]] 
    } 
    res.json(sortedPlayers);    
});

app.post("/optimizeclassic", (req, res) => {
    let lineupPlayers = req.body.lp;
    let fl = req.body.fl; 
    let sortedResults = { lineup: [], qb: [], rb: [], wr: [], te: [], dst: [], flex: [], result: 0, remSal: 50000 };
    classicConstraint['QB'] = { 'min': 1, 'max': 1 };
    classicConstraint['RB'] = { 'min': 2, 'max': 2 };
    classicConstraint['WR'] = { 'min': 3, 'max': 3 };
    classicConstraint['TE'] = { 'min': 1, 'max': 1 };
    classicConstraint['DST'] = { 'min': 1, 'max': 1 };
    classicConstraint['FLEX'] = { 'min': 1, 'max': 1 };
    classicConstraint['salary'] = { 'max': 50000 };
    if (fl.length !== 0 || lineupPlayers.length !== 0) {
        var classicConstraintNew = {...classicConstraint};
        var classicAll = {...classicCombined};
        for (let i = 0; i < lineupPlayers.length; i++) {
            delete classicAll[Object.keys(lineupPlayers[i])[0]];
            delete classicAll[Number(Object.keys(lineupPlayers[i])[0]) + 1000];
            let playerPos = lineupPlayers[i].position;
            classicConstraintNew[`${playerPos}`]['min'] -= 1 
            classicConstraintNew[`${playerPos}`]['max'] -= 1 
            sortedResults['remSal'] -= lineupPlayers[i].salary   
            sortedResults['result'] += lineupPlayers[i].Projection             
            sortedResults[playerPos.toLowerCase()] = [...sortedResults[playerPos.toLowerCase()], lineupPlayers[i]]
            sortedResults['lineup'] = [...sortedResults['lineup'], lineupPlayers[i]]
        }  
        if (fl.length !== 0) {        
            delete classicAll[Object.keys(fl[0])[0]];
            delete classicAll[Number(Object.keys(fl[0])[0]) + 1000];
            classicConstraintNew['FLEX'] = { 'min': 0, 'max': 0 }
            sortedResults['remSal'] -= fl[0].salary   
            sortedResults['result'] += fl[0].Projection
            sortedResults['flex'] = fl
        }
        classicConstraintNew['salary'] = { 'max': sortedResults['remSal'] }    
    } else {
        var classicAll = classicCombined;
        var classicConstraintNew = classicConstraint;
    }
    const model = {
        optimize: "Projection",
        opType: "max",
        ints: classicInt,
        constraints: classicConstraintNew,   
        variables: classicAll,
        options: { "tolerance": .025 }
    };    
    let results = solver.Solve(model);
    for (const [key, value] of Object.entries(results)) {
        if (value === 1) {
            if (classicCombined[key].FLEX === 1) {    
                var player = classicCombined[key-1000];
                sortedResults['flex'] = [player]
            } else {
                var player = classicCombined[key];
                sortedResults[player.position.toLowerCase()] = [...sortedResults[player.position.toLowerCase()], player]
            }
            sortedResults['lineup'] = [...sortedResults['lineup'], player]
            sortedResults['remSal'] -= player.salary        
        }
    }
    sortedResults['result'] += results.result
    res.json(sortedResults);
});

app.get("/captainplayers1", (req, res) => { 
    res.json({ flexes: captainQueue1.flexesQueue });
});

app.get("/captainplayers2", (req, res) => { 
    res.json({ flexes: captainQueue2.flexesQueue });
}); 

app.post("/optimizedcaptain1", (req, res) => {    
    let results = optimizeCaptain(captainQueue1, req.body.fp, req.body.cp);
    res.json(results);
});

app.post("/optimizedcaptain2", (req, res) => {
    let results = optimizeCaptain(captainQueue2, req.body.fp, req.body.cp);
    res.json(results)
});

function optimizeCaptain(queue, selectedLineup, selectedCrown) {
    let combinedQueue = [...queue.combinedQueue];
    let projTotal = 0;
    let captainConstraint = {
        'Salary': {'max': 50000},
        'CROWN': { 'min': 1, 'max': 1 },
        'FLEX': { 'min': 5, 'max': 5 }
    };
    let captainInt = { 'FLEX': 1, 'CROWN': 1 };
    for (let i=0; i < queue.flexesQueue.length; i++) {
        captainConstraint[i] = {'max': 1}
        captainInt[i] = 1      
        captainInt[i + queue.flexesQueue.length] = 1
    }
    if (selectedCrown.length !== 0) {
        captainConstraint['CROWN'] = { 'min': 0, 'max': 0 }
        combinedQueue = combinedQueue.filter(p => p.DraftTableId !== selectedCrown[0].DraftTableId)
        projTotal += selectedCrown[0].Projection * 1.5
        captainConstraint['Salary']['max'] -= selectedCrown[0].Salary * 1.5
    }
    for (let i = 0; i < selectedLineup.length; i++) {
        captainConstraint['FLEX']['min'] -= 1
        captainConstraint['FLEX']['max'] -= 1
        combinedQueue = combinedQueue.filter(p => p.DraftTableId !== selectedLineup[i].DraftTableId)
        projTotal += selectedLineup[i].Projection
        captainConstraint['Salary']['max'] -= selectedLineup[i].Salary
    }
    const model = {
        optimize: "Projection",
        opType: "max",
        ints: captainInt,
        constraints: captainConstraint,
        variables: combinedQueue,
    };
    const results = solver.Solve(model);
    let salarySum = captainConstraint['Salary']['max'];
    for (const [key, value] of Object.entries(results)) {
        if (value === 1) {
            if (combinedQueue[key].CROWN === 1) {
                let crown = queue.flexesQueue.find(p => p.Name === combinedQueue[key].Name);
                selectedCrown.push(crown);
                salarySum -= crown.Salary * 1.5
            } else {
                selectedLineup.push(combinedQueue[key]);
                salarySum -= combinedQueue[key].Salary
            }
        }
    }
    let projSum = results.result + projTotal;
    return { crown: selectedCrown, fps: selectedLineup, sSum: salarySum, pSum: projSum }
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});