const express = require("express");
const cors = require("cors");
const solver = require("javascript-lp-solver");
const app = express();

app.use(cors());
app.use(express.json());

const current = Math.ceil((new Date() - new Date("2023-09-04"))/604800000)

function getSunday() {
    let sundayDate = new Date("2023-09-05")
    sundayDate.setDate(sundayDate.getDate() + (current-1)*7 + 5)
    let sun = String(sundayDate.getFullYear()) + '-' + String(sundayDate.getMonth() + 1).padStart(2, '0') + '-' + String(sundayDate.getDate() + 1).padStart(2, '0') + 'T00:00:00'
    return (
        sun
    )
}

function getThursday() {
    let thursdayDate = new Date("2023-09-05")
    thursdayDate.setDate(thursdayDate.getDate() + (current-1)*7 + 2)
    let tr =  String(thursdayDate.getFullYear()) + '-' + String(thursdayDate.getMonth() + 1).padStart(2, '0') + '-' + String(thursdayDate.getDate() + 1).padStart(2, '0') + 'T00:00:00'
    return (
        tr
    )
}

app.get("/dates", (req, res) => {   
    const tr = getThursday()
    const sun = getSunday()
    res.json({
        tr: tr, sun: sun, current: current
    });
})

fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/95253/draftables')
.then((res)=> res.json())
.then(data => {  
    fetch('https://api.sleeper.app/projections/nfl/2023/10?season_type=regular&position%5B%5D=DEF&position%5B%5D=RB&position%5B%5D=QB&position%5B%5D=TE&position%5B%5D=WR&order_by=ppr')
    .then((res)=> res.json())
    .then(datas => {
        let s = datas.map((element) => {
            if (element.player.position === "DEF") {
                return {
                    Name: element.player.last_name,
                    Projection: element.stats.pts_ppr
                }
            }
            else {
                return {
                    Name: element.player.first_name + ' ' + element.player.last_name,
                    Projection: element.stats.pts_ppr
                }
            }
        })
        let sleeper = s.filter(s => s.Projection > 0)   

        let z = data.draftables.map((element) => {
            if (sleeper.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))) {
                let p = sleeper.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))
                let pro = p.Projection
                return {
                    Name: element.displayName,
                    Position: element.position,
                    Salary: element.salary,
                    Game: element.competition['name'],
                    FFPG: parseInt(element.draftStatAttributes[0].value),
                    Test: element.draftStatAttributes[0].id,
                    Team: element.teamAbbreviation,
                    DraftTableId: element.playerId,
                    Projection: pro
                }
            }
            else { 
                return {
                    Name: element.displayName,
                    Position: element.position,
                    Salary: element.salary,
                    Game: element.competition['name'],
                    FFPG: parseInt(element.draftStatAttributes[0].value),
                    Test: element.draftStatAttributes[0].id,
                    Team: element.teamAbbreviation,
                    DraftTableId: element.playerId,
                    Projection: 0
                }
            }
        })
        let x = z.filter(y => y.Test === 90)

        const u = x.reduce((accumulator, current) => {
            if (!accumulator.find((item) => item.DraftTableId === current.DraftTableId)) {
                accumulator.push(current);
            }
            return accumulator;
        }, []);

        let uniques = u.map((element) => {
            return {
                ...element,
                [u.indexOf(element)]: 1,
                [element.Position]: 1,
            }
        })

        let q = uniques.filter(d => d.Position === "QB")
        let r = uniques.filter(d => d.Position === "RB")
        let w = uniques.filter(d => d.Position === "WR")
        let t = uniques.filter(d => d.Position === "TE")
        let d = uniques.filter(d => d.Position === "DST")
        let f = uniques.filter(d=> d.Position === "RB" || d.Position === "TE" || d.Position === "WR")

        app.get("/classicplayers", (req, res) => {
            res.json({unique: uniques, qqb: q, qrb: r, qwr: w, qte: t, qdst: d, qflex: f});
        })

        let duplicates = f.map((element) => {
            let i = uniques.indexOf(uniques.find(e => e.DraftTableId === element.DraftTableId))
            return {
                ...element,
                FLEX: 1,
                [i]: 1,
                [element.Position]: 0,
            }
        })
        let players = [...uniques, ...duplicates]

        let obj = Object.assign({}, players)
        let myObj = {}
        let myObjTwo = {}
        for (let i = 0; i < players.length; i++) {
            myObj[i] = 1      
        }
        myObj['QB'] = 1
        myObj['RB'] = 1
        myObj['WR'] = 1
        myObj['TE'] = 1
        myObj['DST'] = 1
        myObj['FLEX'] = 1

        for (let i = 0; i < uniques.length; i++) {
            myObjTwo[i] = {'max': 1}
        }
        myObjTwo['Salary'] = {'max': 50000}
        myObjTwo['QB'] = { 'min': 1, 'max': 1 }
        myObjTwo['RB'] = { 'min': 2, 'max': 2 }
        myObjTwo['WR'] = { 'min': 3, 'max': 3 }
        myObjTwo['TE'] = { 'min': 1, 'max': 1 }
        myObjTwo['DST'] = { 'min': 1, 'max': 1 }
        myObjTwo['FLEX'] = { 'min': 1, 'max': 1 }

        const model = {
            optimize: "Projection",
            opType: "max",
            ints: myObj,
            constraints: myObjTwo,   
            variables: obj,
        };        
        const results = solver.Solve(model);
        console.log(results)

        let QB = []
        let RB = []
        let WR = []
        let TE = []
        let FLEX = []
        let DST = []
        let lineup = []
        for (const [key, value] of Object.entries(results)) {
            if (value === 1) {
                if (players[key].FLEX === 1) {    
                    let f = uniques.find(p => p.Name === players[key].Name)
                    FLEX.push(f)
                }
                else {
                    if (players[key].QB === 1) {
                        QB.push(players[key])
                    }
                    else if (players[key].RB === 1) {
                        RB.push(players[key])
                    }
                    else if (players[key].WR === 1) {
                        WR.push(players[key])
                    }
                    else if (players[key].TE === 1) {
                        TE.push(players[key])
                    }
                    else if (players[key].DST === 1) {
                        DST.push(players[key])
                    }
                }
                lineup.push(players[key])
            }
        }
        app.get("/optimizedclassic", (req, res) => {
            res.json({
                lineup: lineup, qb: QB, rb: RB, wr: WR, te: TE, dst: DST, flex: FLEX, result: results.result
            });
        });  
    })
    fetchCaptain()
})

const fetchCaptain = () => {
    fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/95260/draftables')
    .then((res)=> res.json())
    .then(data => {
        fetch('https://api.sleeper.app/projections/nfl/2023/10?season_type=regular&position%5B%5D=DEF&position%5B%5D=RB&position%5B%5D=QB&position%5B%5D=TE&position%5B%5D=WR&order_by=ppr')
        .then((res)=> res.json())
        .then(sdata => {
            let sd = sdata.map((element) => {
                if (element.player.position === "DEF"){
                    return {
                        Name: element.player.last_name,
                        Projection: element.stats.pts_ppr
                    }
                }
                else {
                    return {
                        Name: element.player.first_name + ' ' + element.player.last_name,
                        Projection: element.stats.pts_ppr
                    }
                }
            })
            let sleeperdata = sd.filter(s => s.Projection > 0)        

            let y = data.draftables.map((element) => {
                return {
                    Name: element.displayName,
                    Position: element.position,
                    Salary: element.salary,
                    Game: element.competition['name'],
                    FFPG: parseInt(element.draftStatAttributes[0].value),
                    Test: element.draftStatAttributes[0].id,
                    Team: element.teamAbbreviation,
                    DraftTableId: element.playerId,
                }
            })
            let z = y.filter(y => y.Test === 90)

            let flexes = []
            const crowns = z.reduce((accumulator, current) => {
                if (!accumulator.find((item) => item.DraftTableId === current.DraftTableId)) {
                    accumulator.push(current);
                }
                else {
                    flexes.push(current)
                }
                return accumulator;
            }, []);

            let crownsQueue = crowns.map((element) => {
                let i = flexes.indexOf(flexes.find(e => e.DraftTableId === element.DraftTableId))
                if (sleeperdata.find(i=> i.Name === element.Name || i.Name.slice(0,10) === element.Name.slice(0,10))) {
                    let p = sleeperdata.find(i=> i.Name === element.Name || i.Name.slice(0,10) === element.Name.slice(0,10))
                    let pro = p.Projection * 1.5
                    return {
                        ...element,
                        [i]: 1,
                        CROWN: 1,
                        Projection: pro
                    }
                }
                else {
                    return {
                        ...element,
                        [i]: 1,
                        CROWN: 1,
                        Projection: 0
                    }
                }
            })

            let flexesQueue = flexes.map((element) => {
                if (sleeperdata.find(i=> i.Name === element.Name || i.Name.slice(0,10) === element.Name.slice(0,10))) {
                    let p = sleeperdata.find(i=> i.Name === element.Name || i.Name.slice(0,10) === element.Name.slice(0,10))
                    let pro = p.Projection
                    return {
                        ...element,
                        [flexes.indexOf(element)]: 1,
                        FLEX: 1,
                        Projection: pro
                    }
                }
                else {
                    return {
                        ...element,
                        [flexes.indexOf(element)]: 1,
                        FLEX: 1,
                        Projection: 0
                    }
                }
            })  

            app.get("/captainplayers", (req, res) => {
                res.json({
                crowns: crownsQueue, flexes: flexesQueue
                });
            })
            optimizeCaptain(crownsQueue, flexesQueue)
        })
    })
}

const optimizeCaptain = (crownsQueue, flexesQueue) => {
    let all = [...crownsQueue, ...flexesQueue]
    let objS = Object.assign({}, all)
    let myObjS = {}
    let myObjSTwo = {}
    for (let i = 0; i < all.length; i++) {
        myObjS[i] = 1      
    }
    myObjS['FLEX'] = 1
    myObjS['CROWN'] = 1
    for (let i = 0; i < flexesQueue.length; i++) {
        myObjSTwo[i] = {'max': 1}
    }
    myObjSTwo['Salary'] = {'max': 50000}
    myObjSTwo['CROWN'] = { 'min': 1, 'max': 1 }
    myObjSTwo['FLEX'] = { 'min': 5, 'max': 5 }

    const modelS = {
        optimize: "Projection",
        opType: "max",
        ints: myObjS,
        constraints: myObjSTwo,
        variables: objS,
    };
    const resultsS = solver.Solve(modelS);

    let cp = []
    let fps = []
    for (const [key, value] of Object.entries(resultsS)) {
        if (value === 1) {
            if (all[key].CROWN === 1) {
                let c = flexesQueue.find(p => p.Name === all[key].Name)
                cp.push(c)
            }
            else {
                fps.push(all[key])
            }
        }
    }
    app.get("/optimizedcaptain", (req, res) => {
        res.json({
            crown: cp[0], fps: fps
        });
    }); 
    console.log(resultsS)
}

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});
