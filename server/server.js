const express = require("express");
const cors = require("cors");
const solver = require("javascript-lp-solver");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const fetch = require("node-fetch");
const e = require("express");

async function fetchSleeperProjections() {
    const currentWeek = Math.ceil((new Date() - new Date("2023-09-05"))/604800000)
    if (currentWeek <= 18) { var current = currentWeek } 
    else { var current = 18 }
    const response = await fetch(`https://api.sleeper.app/projections/nfl/2023/${current}?season_type=regular&position%5B%5D=DEF&position%5B%5D=K&position%5B%5D=RB&position%5B%5D=QB&position%5B%5D=TE&position%5B%5D=WR&order_by=ppr`)
    let responseJson = await response.json()
    let s = responseJson.map((element) => {
        if (element.player.position === "DEF" ) {
            return {
                Name: element.player.last_name,
                Projection: element.stats.pts_ppr,
            }
        }
        else {
            return {
                Name: element.player.first_name + ' ' + element.player.last_name,
                Projection: element.stats.pts_ppr,
            }
        }
    })
    let sleeper = s.filter(s => s.Projection > 0)
    return sleeper 
}

async function fetchClassic(){
    let sleeperData = await fetchSleeperProjections()
    let response = await fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables')
    let responseData = await response.json()
    let responseTables = responseData.draftables
    let classicPlayers = []
    responseTables.map((element) => {
        if (sleeperData.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))) {
            let p = sleeperData.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))
            var proj = p.Projection
        }
        else {
            var proj = 0
        }
        if (element.draftStatAttributes[0].id === 90 && !classicPlayers.find(item => item.DraftTableId === element.playerId)){
            let details = {
                Name: element.displayName,
                Position: element.position,
                Salary: element.salary,
                Game: element.competition['name'],
                FFPG: element.draftStatAttributes[0].value,
                Test: element.draftStatAttributes[0].id,
                Team: element.teamAbbreviation,
                DraftTableId: element.playerId,
                Projection: proj,
                Status: element.status,
                [classicPlayers.length]: 1,
                [element.position]: 1,
            }
            classicPlayers.push(details)
        }        
    })
    return classicPlayers
}

app.get("/classicplayers", async (req, res) => { 
    let classicPlayers =  await fetchClassic()
    let qqb = []
    let qrb = []
    let qwr = []
    let qte = []
    let qdst = []
    let qflex = []
    for (let i=0; i < classicPlayers.length; i++){
        if (classicPlayers[i].Position === "QB"){
            qqb.push(classicPlayers[i])
        }
        else if (classicPlayers[i].Position === "RB"){
            qrb.push(classicPlayers[i])
            qflex.push(classicPlayers[i])
        }
        else if (classicPlayers[i].Position === "WR"){
            qwr.push(classicPlayers[i])
            qflex.push(classicPlayers[i])
        }
        else if (classicPlayers[i].Position === "TE"){
            qte.push(classicPlayers[i])
            qflex.push(classicPlayers[i])
        }
        else if (classicPlayers[i].Position === "DST"){
            qdst.push(classicPlayers[i])
        }
    } 
    res.json({ unique: classicPlayers, qqb: qqb, qrb: qrb, qwr: qwr, qte: qte, qdst: qdst, qflex: qflex})
})

app.get("/classicoptimizer", async (req, res) => { 
    let uniques = await fetchClassic()
    let mod = optimizeClassicModel(uniques)
    let flexPre = []
    let lineupPre = []
    let resultz = optimizeClassic(mod.players, mod.myObjTwo, uniques, flexPre, lineupPre)
    res.json({
        lineup: resultz.lineup, qb: resultz.QB, rb: resultz.RB, wr: resultz.WR, te: resultz.TE, dst: resultz.DST, flex: resultz.FLEX, result: resultz.result, usedSal: resultz.usedSal
    })
})

app.post("/classicoptimize", async (req, res) => {
    let unique =  await fetchClassic()
    let lineupPlayers = req.body.lp
    let fl = req.body.fl 
    let newLineupPlayers = [...lineupPlayers, ...fl]
    var uniques = unique.filter(function(objFromA) {
        return !newLineupPlayers.find(function(objFromB) {
            return objFromA.DraftTableId === objFromB.DraftTableId
        })
    })
    let mod = optimizeClassicModel(uniques)
    let myObjTwo = mod.myObjTwo
    let flexPre = []
    let lineupPre = []
    let val = 0
    let sal = 50000      
    for (let i = 0; i < lineupPlayers.length; i++) {
        val += lineupPlayers[i].Projection
        sal -= lineupPlayers[i].Salary
        let x = myObjTwo[`${lineupPlayers[i].Position}`]['min'] - 1
        myObjTwo[`${lineupPlayers[i].Position}`] = {'min' : x, 'max': x}
        myObjTwo['Salary'] = { 'max': sal }
        lineupPre.push(lineupPlayers[i])
    }
    if (fl.length !== 0 ) {
        val += fl[0].Projection
        sal -= fl[0].Salary
        myObjTwo['Salary'] = { 'max': sal }
        myObjTwo['FLEX'] = { 'min': 0, 'max': 0 }
        flexPre.push(fl[0])
    }
    let resultz = optimizeClassic(mod.players, myObjTwo, uniques, lineupPre, flexPre) 
    res.json({
        lineup: resultz.lineup, qb: resultz.QB, rb: resultz.RB, wr: resultz.WR, te: resultz.TE, dst: resultz.DST, flex: resultz.FLEX, result: resultz.result + val, usedSal: resultz.usedSal
    })
})

function optimizeClassicModel(uniques){
    let flexes = uniques.filter(element => element.Position === "RB" || element.Position === "TE" || element.Position === "WR")
    let duplicates = flexes.map((element) => {
        let i = uniques.indexOf(uniques.find(e => e.DraftTableId === element.DraftTableId))
            return {
                ...element,
                FLEX: 1,
                [i]: 1,
                [element.Position]: 0,
            }
    })  
    const players = [...uniques, ...duplicates]
    let myObjTwo = {}
    myObjTwo['QB'] = { 'min': 1, 'max': 1 }
    myObjTwo['RB'] = { 'min': 2, 'max': 2 }
    myObjTwo['WR'] = { 'min': 3, 'max': 3 }
    myObjTwo['TE'] = { 'min': 1, 'max': 1 }
    myObjTwo['DST'] = { 'min': 1, 'max': 1 }
    myObjTwo['FLEX'] = { 'min': 1, 'max': 1 }
    myObjTwo['Salary'] = { 'max': 50000 }
    for (let i = 0; i < uniques.length; i++) {
        myObjTwo[i] = {'max': 1}
    }
    return {players, myObjTwo}
}

function optimizeClassic(players, myObjTwo, uniques, lineupPre, flexPre) {
    let obj = Object.assign({}, players)
    let myObj = {}
    for (let i = 0; i < players.length; i++) {
        myObj[i] = 1      
    }
    myObj['QB'] = 1
    myObj['RB'] = 1
    myObj['WR'] = 1
    myObj['TE'] = 1
    myObj['DST'] = 1
    myObj['FLEX'] = 1
    const model = {
        optimize: "Projection",
        opType: "max",
        ints: myObj,
        constraints: myObjTwo,   
        variables: obj,
    };        
    const results = solver.Solve(model);
    let QB = []
    let RB = []
    let WR = []
    let TE = []
    let FLEX = []
    let DST = []
    let lineup = []
    let result = results.result
    let usedSal = 0
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
            usedSal += players[key].Salary
        }
    }
    for (let i=0; i < lineupPre.length; i++) {
        if (lineupPre[i].Position === 'QB'){
            QB.push(lineupPre[i])
        }
        else if (lineupPre[i].Position === 'RB'){
            RB.push(lineupPre[i])
        }
        else if (lineupPre[i].Position === 'WR'){
            WR.push(lineupPre[i])
        }
        else if (lineupPre[i].Position === 'TE'){
            TE.push(lineupPre[i])
        }
        else if (lineupPre[i].Position === 'DST'){
            DST.push(lineupPre[i])
        }
    }
    if (flexPre.length !== 0){
        FLEX.push(flexPre[0])
        lineup.push(flexPre[0])
    }
    lineup.concat(lineupPre)
    return {QB, RB, WR, TE, DST, FLEX, lineup, result, usedSal}   
}

async function fetchCaptain(num) {
    let sleeperData = await fetchSleeperProjections()
    let response = await fetch(`https://api.draftkings.com/draftgroups/v1/draftgroups/${num}/draftables`)
    let dkData = await response.json()
    return {
        sleeperData, dkData
    }    
}

async function updateCaptain(num) {
    let x = await fetchCaptain(num)
    let data = x.dkData
    let sleeperdata = x.sleeperData
    let flexesQueue = []
    let crownsQueue = []
    data.draftables.map((element) => {
        if (element.draftStatAttributes[0].id === 90){
            if (sleeperdata.find(i => i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))) {
                let p = sleeperdata.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))
                var proj = p.Projection
            }
            else {
                var proj = 0    
            }
            let details = {
                Name: element.displayName,
                Position: element.position,
                Salary: element.salary,
                Game: element.competition['name'],
                FFPG: element.draftStatAttributes[0].value,
                Test: element.draftStatAttributes[0].id,
                Team: element.teamAbbreviation,
                DraftTableId: element.playerId,
                Status: element.status,
            }
            if (!flexesQueue.find(p => p.DraftTableId === element.playerId )){
                let newElement = {
                    ...details,
                    FLEX: 1,
                    [flexesQueue.length]: 1,
                    Projection: proj
                }
                flexesQueue.push(newElement)
            }
            else {
                var ind = flexesQueue.findIndex(p => p.DraftTableId === element.playerId )
                let newElement = {
                    ...details,
                    CROWN: 1,
                    [ind]: 1,
                    Projection: proj * 1.5
                }
                crownsQueue.push(newElement)
            }
        }
    })
    return {
        crownsQueue, flexesQueue
    }
}

async function captainOneData() {
    let num = 98584
    const queue = await updateCaptain(num)
    return queue
}

async function captainTwoData() {
    let num = 98585
    const queue = await updateCaptain(num)
    return queue
}

app.get("/trcaptainplayers", async (req, res) => { 
    const queue = await captainOneData()
    const crownsQueue = queue.crownsQueue
    const flexesQueue = queue.flexesQueue
    res.json({
        crowns: crownsQueue, flexes: flexesQueue
    })
})

app.get("/moncaptainplayers", async (req, res) => { 
    const queue = await captainTwoData()
    const crownsQueue = queue.crownsQueue
    const flexesQueue = queue.flexesQueue
    res.json({
        crowns: crownsQueue, flexes: flexesQueue
    });
})

app.post("/optimizedcaptain", async (req, res) => {
    const queue = await captainOneData()
    let optData = captainOptData(queue, req.body.fp, req.body.cp)
    let results = optimizeCaptain(optData.crownsQueue, optData.flexesQueue,  optData.myObjSTwo, optData.cp, optData.myObjSTwo)
    res.json({
        crown: results.cp, fps: results.fps
    })
});

app.post("/optimizedcaptainmon", async (req, res) => {
    const queue = await captainTwoData()
    let optData = captainOptData(queue, req.body.fp, req.body.cp)
    let results = optimizeCaptain(optData.crownsQueue, optData.flexesQueue,  optData.myObjSTwo, optData.cp, optData.myObjSTwo)
    res.json({
        crown: results.cp, fps: results.fps
    })
})

function captainOptData(queue, lineupP, crownP) {
    const cq = queue.crownsQueue
    const fq = queue.flexesQueue
    var cQueue = cq.filter(function(objFromA) {
        return !lineupP.find(function(objFromB) {
            return objFromA.DraftTableId === objFromB.DraftTableId
        })
    })
    var fQueue = fq.filter(function(objFromA) {
        return !lineupP.find(function(objFromB) {
            return objFromA.DraftTableId === objFromB.DraftTableId
        })
    })
    var crownsQueue = cQueue.filter(function(objFromC) {
        return !crownP.find(function(objFromD) {
            return objFromC.DraftTableId === objFromD.DraftTableId
        })
    })
    var flexesQueue = fQueue.filter(function(objFromC) {
        return !crownP.find(function(objFromD) {
            return objFromC.DraftTableId === objFromD.DraftTableId
        })
    })
    let myObjSTwo = {}
    for (let i = 0; i < flexesQueue.length; i++) {
        myObjSTwo[i] = {'max': 1}
    }
    myObjSTwo['Salary'] = {'max': 50000}
    myObjSTwo['CROWN'] = { 'min': 1, 'max': 1 }
    myObjSTwo['FLEX'] = { 'min': 5, 'max': 5 }
    let sal = 50000 
    let cp = []
    let fps = []
    if (crownP.length !== 0){
        cp.push(crownP[0])
        myObjSTwo['CROWN'] = { 'min': 0, 'max': 0 }
        sal -= crownP[0].Salary * 1.5
    }
    for (let i = 0; i < lineupP.length; i++) {
        sal -= lineupP[i].Salary
        let x = myObjSTwo['FLEX']['min'] - 1
        myObjSTwo['FLEX'] = {'min' : x, 'max': x}
        fps.push(lineupP[i])
    }
    myObjSTwo['Salary'] = {'max': sal}
    return {crownsQueue, flexesQueue, myObjSTwo, cp, fps}
}

function optimizeCaptain(crownsQueue, flexesQueue, myObjSTwo, cp, fps) {
    let all = [...crownsQueue, ...flexesQueue]
    let objS = Object.assign({}, all)
    let myObjS = {}
    for (let i = 0; i < all.length; i++) {
        myObjS[i] = 1      
    }
    myObjS['FLEX'] = 1
    myObjS['CROWN'] = 1
    const modelS = {
        optimize: "Projection",
        opType: "max",
        ints: myObjS,
        constraints: myObjSTwo,
        variables: objS,
    };
    const results = solver.Solve(modelS);
    for (const [key, value] of Object.entries(results)) {
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
    return {cp, fps}
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})