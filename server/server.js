const express = require("express");
const cors = require("cors");
const solver = require("javascript-lp-solver");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const fetch = require("node-fetch");

let sleeperObj = {};
let [classicPlayers, classicCombinedObj, classicIntObj, classicConstraintObj] = [[], {}, {}, {}];
let [captainQueue1, captainQueue2] = [{}, {}];
classicConstraintObj['QB'] = { 'min': 1, 'max': 1 };
classicConstraintObj['RB'] = { 'min': 2, 'max': 2 };
classicConstraintObj['WR'] = { 'min': 3, 'max': 3 };
classicConstraintObj['TE'] = { 'min': 1, 'max': 1 };
classicConstraintObj['DST'] = { 'min': 1, 'max': 1 };
classicConstraintObj['FLEX'] = { 'min': 1, 'max': 1 };
classicConstraintObj['salary'] = { 'max': 50000 };

fetchSleeperProjections();

function fetchSleeperProjections(){
    fetch("https://api.sleeper.app/projections/nfl/2023/18?season_type=regular&position%5B%5D=DEF&position%5B%5D=K&position%5B%5D=RB&position%5B%5D=QB&position%5B%5D=TE&position%5B%5D=WR&order_by=ppr")
    .then((res)=> res.json())
    .then(data => {
        data.map((element) => {
            if (element.stats.pts_ppr > 0){  
                var name = element.player.position === "DEF" ?  element.player.last_name : element.player.first_name + ' ' + element.player.last_name 
                sleeperObj[name] = element.stats.pts_ppr
            }
        })
        fetchClassicPlayers()
        fetchCaptainPlayers()
    })
};

function fetchClassicPlayers() {
    fetch("https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables")
    .then((res)=> res.json())
    .then(data => {
        for (let z=0; z < data.draftables.length; z++) {
            if (data.draftables[z].draftStatAttributes[0].id === 90) {
                let element = data.draftables[z]
                let sleeperElement = Object.keys(sleeperObj).find(key => key === element.displayName || key.slice(0,10) === element.displayName.slice(0,10))
                var proj = sleeperElement !== undefined ? sleeperObj[sleeperElement] : 0
                var details = {...element, Projection: proj, [element.position]: 1, [z]: 1}    
                classicPlayers.push(details)
                if (proj > 0){
                    classicCombinedObj[z] = details
                    classicIntObj[z] = 1
                    classicConstraintObj[z] = {'max': 1}
                }
                if (z !== data.draftables.length - 1 && element.playerId === data.draftables[z+1].playerId) {
                    if (proj > 0) {
                        classicCombinedObj[z + 1000] = {...details, [element.position]: 0, FLEX: 1}
                        classicIntObj[z + 1000] = 1
                    } 
                    z++ 
                }
            }   
        }
    })   
};

function fetchCaptainPlayers() {
    fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98584/draftables')
    .then(response => response.json())
    .then(data1 => {
        fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98585/draftables')
        .then(response => response.json())
        .then(data2 => {
            captainQueue1 = getCaptainPlayers(data1.draftables)
            captainQueue2 = getCaptainPlayers(data2.draftables)
        })
    })
};

function getCaptainPlayers(data) {
    let [flexesQueue, crownsQueue] = [[],[]]
    data.map((element) => {
        if (element.draftStatAttributes[0].id === 90) {
            let sleeperElement = Object.keys(sleeperObj).find(key => key === element.displayName || key.slice(0,10) === element.displayName.slice(0,10))
            var proj = sleeperElement !== undefined ? sleeperObj[sleeperElement] : 0
            let details = {
                Name: element.displayName,
                Position: element.position,
                Game: element.competition['name'],
                Time: element.competition['startTime'],
                FFPG: element.draftStatAttributes[0].value,
                Test: element.draftStatAttributes[0].id,
                Team: element.teamAbbreviation,
                DraftTableId: element.playerId,
                Status: element.status,
                Salary: element.salary,
            }
            var ind = crownsQueue.findIndex(p => p.DraftTableId === element.playerId )
            if (ind === -1) {
                let newElement = {...details, CROWN: 1, [crownsQueue.length]: 1, Projection: proj * 1.5}
                crownsQueue.push(newElement)
            }
            else {
                let newElement = {...details, FLEX: 1, [ind]: 1, Projection: proj}
                flexesQueue.push(newElement)
            }
        }
    })
    let combinedQueue = [...crownsQueue, ...flexesQueue]
    return {combinedQueue, flexesQueue}    
}; 

app.get("/dates", (req, res) => { 
    let d1 = new Date(captainQueue1.combinedQueue[0].Time.substr(0,10))
    let d2 = new Date(captainQueue2.combinedQueue[0].Time.substr(0,10))
    const dayNames = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
    res.json({
        clDate: classicPlayers[0].competition.startTime.substr(5,5), 
        sdTeams1: captainQueue1.combinedQueue[0].Game, 
        sdTeams2: captainQueue2.combinedQueue[0].Game,
        sdDate1: dayNames[d1.getDay()] + ' ' + captainQueue1.combinedQueue[0].Time.substr(5,5), 
        sdDate2: dayNames[d2.getDay()] + ' ' + captainQueue2.combinedQueue[0].Time.substr(5,5)
    })    
});

app.get("/classicplayers", (req, res) => { 
    let sortedPlayers = {qall: classicPlayers, qqb: [], qrb: [], qwr: [], qte: [], qdst: [], qflex: []}
    for (let i=0; i < classicPlayers.length; i++) {
        let pos =  'q' + classicPlayers[i].position.toLowerCase()
        if (pos === 'qrb' || pos === 'qwr' || pos === 'qte') { sortedPlayers['qflex'] = [...sortedPlayers['qflex'], classicPlayers[i]] }
        sortedPlayers[pos] = [...sortedPlayers[pos],  classicPlayers[i]] 
    } 
    res.json(sortedPlayers)    
});

app.get("/classicoptimizer", (req, res) => { 
    let sortedResults = {lineup: [], qb: [], rb: [], wr: [], te: [], dst: [], flex: [], result: 0, usedSal: 0}
    let results = optimizeClassic(classicConstraintObj, classicCombinedObj, .025)
    let endResult = sortClassicResults(results, sortedResults)
    res.json(endResult)
});

app.post("/classicoptimize", (req, res) => {
    let sortedResults = {lineup: [], qb: [], rb: [], wr: [], te: [], dst: [], flex: [], result: 0, usedSal: 0}
    let lineupPlayers = req.body.lp
    let fl = req.body.fl 
    let classicConstraint = {...classicConstraintObj}
    let classicAllObj = {...classicCombinedObj}    
    for (let i = 0; i < lineupPlayers.length; i++) {
        delete classicAllObj[Object.keys(lineupPlayers[i])[0]]
        delete classicAllObj[Number(Object.keys(lineupPlayers[i])[0]) + 1000]
        let x = classicConstraint[`${lineupPlayers[i].position}`]['min'] - 1
        classicConstraint[`${lineupPlayers[i].position}`] = {'min' : x, 'max': x}
        sortedResults['usedSal'] += lineupPlayers[i].salary   
        sortedResults['result'] += lineupPlayers[i].Projection        
        let pos = lineupPlayers[i].position.toLowerCase()
        sortedResults[pos] = [...sortedResults[pos], lineupPlayers[i]]
        sortedResults['lineup'] = [...sortedResults['lineup'], lineupPlayers[i]]
    }  
    if (fl.length !== 0){        
        delete classicAllObj[Object.keys(fl[0])[0]]
        delete classicAllObj[Number(Object.keys(fl[0])[0]) + 1000]
        classicConstraint['FLEX'] = { 'min': 0, 'max': 0 }
        sortedResults['usedSal'] += fl[0].salary   
        sortedResults['result'] += fl[0].Projection   
        sortedResults['flex'] = [fl[0]] 
        sortedResults['lineup'] = [...sortedResults['lineup'], fl[0]]
    }
    classicConstraint['salary'] = { 'max': 50000 - sortedResults['usedSal'] }    
    let results = optimizeClassic(classicConstraint, classicAllObj, 0)
    let endResult = sortClassicResults(results, sortedResults)
    res.json(endResult)
});

function optimizeClassic(classicConstraint, classicAll, num) {
    classicIntObj['QB'] = 1
    classicIntObj['RB'] = 1
    classicIntObj['WR'] = 1
    classicIntObj['TE'] =  1
    classicIntObj['DST'] = 1
    classicIntObj['FLEX'] = 1
    const model = {
        optimize: "Projection",
        opType: "max",
        ints: classicIntObj,
        constraints: classicConstraint,   
        variables: classicAll,
        options: {"tolerance": num}
    }    
    return solver.Solve(model)
};

function sortClassicResults(results, sortedResults) {
    for (const [key, value] of Object.entries(results)) {
        if (value === 1) {
            if (classicCombinedObj[key].FLEX === 1) {    
                var player = classicPlayers.find(p => p.playerId === classicCombinedObj[key].playerId)
                sortedResults['flex'] = [player]
            }
            else {
                var player = classicCombinedObj[key]
                sortedResults[player.position.toLowerCase()] = [...sortedResults[player.position.toLowerCase()], player]
            }
            sortedResults['lineup'] = [...sortedResults['lineup'], player]
            sortedResults['usedSal'] += player.salary        
        }
    }
    sortedResults['result'] += results.result
    return sortedResults
};

app.get("/captainplayers1", (req, res) => { 
    res.json({ flexes: captainQueue1.flexesQueue });
});

app.get("/captainplayers2", (req, res) => { 
    res.json({ flexes: captainQueue2.flexesQueue });
}); 

app.post("/optimizedcaptain1", (req, res) => {    
    let results = optimizeCaptain(captainQueue1, req.body.fp, req.body.cp)
    res.json({
        crown: results.selectedCrown, fps: results.selectedLineup, sSum: results.sSum, pSum: results.pSum
    });
});

app.post("/optimizedcaptain2", (req, res) => {
    let results = optimizeCaptain(captainQueue2, req.body.fp, req.body.cp)
    res.json({
        crown: results.selectedCrown, fps: results.selectedLineup, sSum: results.sSum, pSum: results.pSum
    });
});

function optimizeCaptain(queue, selectedLineup, selectedCrown){
    let captainConstraintObj = {}
    captainConstraintObj['Salary'] = {'max': 50000}
    captainConstraintObj['CROWN'] = { 'min': 1, 'max': 1 }
    captainConstraintObj['FLEX'] = { 'min': 5, 'max': 5 }
    let captainIntObj = {}
    captainIntObj['FLEX'] = captainIntObj['CROWN'] = 1    
    let allQueue = [...queue.combinedQueue]
    for (let i=0; i < queue.flexesQueue.length; i++) {
        captainConstraintObj[i] = {'max': 1}
        captainIntObj[i] = 1      
    }
    for (let i=queue.flexesQueue.length; i < allQueue.length; i++) { captainIntObj[i] = 1 }
    let [salary, projTotal] = [0, 0]
    if (selectedCrown.length !== 0) {
        captainConstraintObj['CROWN'] = { 'min': 0, 'max': 0 }
        salary += selectedCrown[0].Salary * 1.5
        projTotal += selectedCrown[0].Projection * 1.5
        allQueue = allQueue.filter(p => p.DraftTableId !== selectedCrown[0].DraftTableId)
    }
    for (let i = 0; i < selectedLineup.length; i++) {
        salary += selectedLineup[i].Salary
        projTotal += selectedLineup[i].Projection
        captainConstraintObj['FLEX'] = {'min' : captainConstraintObj['FLEX']['min'] - 1, 'max': captainConstraintObj['FLEX']['min'] - 1}       
        allQueue = allQueue.filter(p => p.DraftTableId !== selectedLineup[i].DraftTableId)
    }
    captainConstraintObj['Salary'] = {'max': 50000 - salary}
    const model = {
        optimize: "Projection",
        opType: "max",
        ints: captainIntObj,
        constraints: captainConstraintObj,
        variables: allQueue,
    };
    const results = solver.Solve(model);
    let sSum = captainConstraintObj['Salary']['max']
    for (const [key, value] of Object.entries(results)) {
        if (value === 1) {
            if (allQueue[key].CROWN === 1) {
                let c = queue.flexesQueue.find(p => p.Name === allQueue[key].Name)
                selectedCrown.push(c)
                sSum = sSum - (c.Salary * 1.5)
            }
            else {
                selectedLineup.push(allQueue[key])
                sSum = sSum - allQueue[key].Salary
            }
        }
    }
    let pSum = Math.round((results.result + projTotal)*100)/100
    return {selectedCrown, selectedLineup, sSum, pSum}
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});