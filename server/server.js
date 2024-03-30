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
    let sleeper = []
    responseJson.map((element) => {
        if (element.stats.pts_ppr > 0){  
            if (element.player.position === "DEF" ) {
                var name = element.player.last_name
            }
            else {
                var name = element.player.first_name + ' ' + element.player.last_name
            }
            let details = {
                Name: name,
                Projection: element.stats.pts_ppr,
            }
            sleeper.push(details)
        }
    })
    return sleeper 
}

async function fetchClassic(){
    let sleeperData = await fetchSleeperProjections()
    let response = await fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables')
    let responseData = await response.json()
    let responseTables = responseData.draftables
    let classicPlayers = []
    let flexPlayers = []
    let counter = 0
    let intCounter = 0
    let constraintObj = {}
    let intObj = {}
    responseTables.map((element) => {
        if (sleeperData.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))) {
            let p = sleeperData.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))
            var proj = p.Projection
        }
        else {
            var proj = 0
        }
        if (element.draftStatAttributes[0].id === 90){
            var playerDetails = {
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
                [element.position]: 1,
            }        
            if (counter === 0){
                constraintObj[0] = {'max': 1}
                var details = {...playerDetails, 0: 1}
                classicPlayers.push(details)
                counter += 1
            }
            else if (classicPlayers[counter-1].DraftTableId !== element.playerId){
                constraintObj[counter] = {'max': 1}
                var details = {...playerDetails, [counter]: 1}
                classicPlayers.push(details)
                counter += 1
            }
            else {
                var details = {...classicPlayers[counter-1], FLEX: 1, [element.position]: 0}
                flexPlayers.push(details)
            }
            intObj[intCounter] = {'max': 1}
            intCounter += 1
        }
    })
    return {classicPlayers, flexPlayers, constraintObj, intObj}
}

app.get("/classicplayers", async (req, res) => { 
    let classicPlayersData =  await fetchClassic()
    let classicPlayers = classicPlayersData.classicPlayers
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
    let classicPlayersData =  await fetchClassic()
    let uniques = classicPlayersData.classicPlayers
    const players = [...uniques, ...classicPlayersData.flexPlayers]
    let constraintObj = optimizeClassicModelTwo(classicPlayersData.constraintObj)
    let results = sortOptimize(players, constraintObj, classicPlayersData.intObj)
    let endResult = sortResults(results, uniques, players)
    res.json(
        endResult
    )
})

app.post("/classicoptimize", async (req, res) => {
    let classicPlayersData =  await fetchClassic()
    let unique = classicPlayersData.classicPlayers
    let duplicate = classicPlayersData.flexPlayers
    let lineupPlayers = req.body.lp
    let fl = req.body.fl 
    let constraintObj = optimizeClassicModelTwo(classicPlayersData.constraintObj)
    let sal = 50000
    for (let i = 0; i < lineupPlayers.length; i++) {
        var uniques = unique.filter(p => p.DraftTableId !== lineupPlayers[i].DraftTableId)
        var duplicates = duplicate.filter(p => p.DraftTableId !== lineupPlayers[i].DraftTableId)
        sal -= lineupPlayers[i].Salary
        let x = constraintObj[`${lineupPlayers[i].Position}`]['min'] - 1
        constraintObj[`${lineupPlayers[i].Position}`] = {'min' : x, 'max': x}
    }
    if (fl.length !== 0 ) {
        sal -= fl[0].Salary
        constraintObj['FLEX'] = { 'min': 0, 'max': 0 }
    }
    constraintObj['Salary'] = { 'max': sal }
    const players = [...uniques, ...duplicates]
    let results = sortOptimize(players, constraintObj, classicPlayersData.intObj)
    let endResult = sortResults(results, uniques, players, lineupPlayers, fl)
    res.json(
       endResult
    )
})

function optimizeClassicModelTwo(constraintObj) {
    constraintObj['QB'] = { 'min': 1, 'max': 1 }
    constraintObj['RB'] = { 'min': 2, 'max': 2 }
    constraintObj['WR'] = { 'min': 3, 'max': 3 }
    constraintObj['TE'] = { 'min': 1, 'max': 1 }
    constraintObj['DST'] = { 'min': 1, 'max': 1 }
    constraintObj['FLEX'] = { 'min': 1, 'max': 1 }
    constraintObj['Salary'] = { 'max': 50000 }
    return constraintObj
}

function sortOptimize(players, constraintObj, intObj) {
    let obj = Object.assign({}, players)
    intObj['QB'] = 1
    intObj['RB'] = 1
    intObj['WR'] = 1
    intObj['TE'] = 1
    intObj['DST'] = 1
    intObj['FLEX'] = 1
    const model = {
        optimize: "Projection",
        opType: "max",
        ints: intObj,
        constraints: constraintObj,   
        variables: obj,
    }    
    const results = solver.Solve(model);
    return results
}

function sortResults(resultz, uniques, players, lineupPlayers=[], fl=[]) {
    let sortedResults = {lineup: [], qb: [], rb: [], wr: [], te: [], dst: [], flex: [], result: 0, usedSal: 0}
    sortedResults['result'] += resultz.result
    for (let i=0; i < lineupPlayers.length; i++){
        let pos = lineupPlayers[i].Position.toLowerCase()
        sortedResults[pos] = [...sortedResults[pos], lineupPlayers[i]]
        sortedResults['lineup'] = [...sortedResults['lineup'], lineupPlayers[i]]
        sortedResults['usedSal'] += lineupPlayers[i].Salary
        sortedResults['result'] += lineupPlayers[i].Projection
    }
    if (fl.length !== 0 ) {
        sortedResults['flex'] = [fl[0]] 
        sortedResults['lineup'] = [...sortedResults['lineup'], fl[0]]
        sortedResults['usedSal'] += fl[0].Salary
        sortedResults['result'] += fl[0].Projection
    }
    for (const [key, value] of Object.entries(resultz)) {
        if (value === 1) {
            if (players[key].FLEX === 1) {    
                let playerInd = Object.keys(players[key])[0]
                let flexPlayer = uniques[playerInd]
                sortedResults['flex'] = [flexPlayer]
                sortedResults['lineup'] = [...sortedResults['lineup'], flexPlayer]
                sortedResults['usedSal'] += flexPlayer.Salary
            }
            else {
                let pos = uniques[key].Position.toLowerCase()
                sortedResults[pos] = [...sortedResults[pos], uniques[key]]
                sortedResults['lineup'] = [...sortedResults['lineup'], uniques[key]]
                sortedResults['usedSal'] += uniques[key].Salary
             }
        }
    }
    return sortedResults
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