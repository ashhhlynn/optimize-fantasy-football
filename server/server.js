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
    for (let z=0; z < responseTables.length; z++){
        if (responseTables[z].draftStatAttributes[0].id === 90){
            let element = responseTables[z]
            let sleeperPlayer = sleeperData.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))
            if (sleeperPlayer !== undefined){
                var proj = sleeperPlayer.Projection
            }
            else {
                var proj = 0 
            }
            intObj[intCounter] = {'max': 1}
            constraintObj[counter] = {'max': 1}
            var details = {
                ...element, 
                Projection: proj,
                [element.position]: 1,
                [counter]: 1
            }    
            classicPlayers.push(details)
            if (z !== responseTables.length - 1 && element.playerId === responseTables[z+1].playerId){
                var detailsTwo = {
                    ...details, 
                    [element.position]: 0,
                    FLEX: 1, 
                }
                flexPlayers.push(detailsTwo)
                intCounter += 1
                intObj[intCounter] = {'max': 1}
                z++
            }
            counter += 1
            intCounter += 1
        }   
    }    
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
        if (classicPlayers[i].position === "QB"){
            qqb.push(classicPlayers[i])
        }
        else if (classicPlayers[i].position === "RB"){
            qrb.push(classicPlayers[i])
            qflex.push(classicPlayers[i])
        }
        else if (classicPlayers[i].position === "WR"){
            qwr.push(classicPlayers[i])
            qflex.push(classicPlayers[i])
        }
        else if (classicPlayers[i].position === "TE"){
            qte.push(classicPlayers[i])
            qflex.push(classicPlayers[i])
        }
        else if (classicPlayers[i].position === "DST"){
            qdst.push(classicPlayers[i])
        }
    } 
    res.json({ unique: classicPlayers, qqb: qqb, qrb: qrb, qwr: qwr, qte: qte, qdst: qdst, qflex: qflex})
})

app.get("/classicoptimizer", async (req, res) => { 
    let classicPlayersData =  await fetchClassic()
    let uniques = classicPlayersData.classicPlayers
    const players = [...uniques, ...classicPlayersData.flexPlayers]
    let constraintObj = classicConstraintModel(classicPlayersData.constraintObj)
    let results = optimizeClassic(players, constraintObj, classicPlayersData.intObj)
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
    let constraintObj = classicConstraintModel(classicPlayersData.constraintObj)
    let sal = 50000
    for (let i = 0; i < lineupPlayers.length; i++) {
        var uniques = unique.filter(p => p.playerId !== lineupPlayers[i].playerId)
        var duplicates = duplicate.filter(p => p.playerId !== lineupPlayers[i].playerId)
        sal -= lineupPlayers[i].salary
        let x = constraintObj[`${lineupPlayers[i].position}`]['min'] - 1
        constraintObj[`${lineupPlayers[i].position}`] = {'min' : x, 'max': x}
    }
    if (fl.length !== 0 ) {
        sal -= fl[0].salary
        constraintObj['FLEX'] = { 'min': 0, 'max': 0 }
    }
    constraintObj['Salary'] = { 'max': sal }
    const players = [...uniques, ...duplicates]
    let results = optimizeClassic(players, constraintObj, classicPlayersData.intObj)
    let endResult = sortResults(results, uniques, players, lineupPlayers, fl)
    res.json(
       endResult
    )
})

function classicConstraintModel(constraintObj) {
    constraintObj['QB'] = { 'min': 1, 'max': 1 }
    constraintObj['RB'] = { 'min': 2, 'max': 2 }
    constraintObj['WR'] = { 'min': 3, 'max': 3 }
    constraintObj['TE'] = { 'min': 1, 'max': 1 }
    constraintObj['DST'] = { 'min': 1, 'max': 1 }
    constraintObj['FLEX'] = { 'min': 1, 'max': 1 }
    constraintObj['salary'] = { 'max': 50000 }
    return constraintObj
}

function optimizeClassic(players, constraintObj, intObj) {
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
    const results = solver.Solve(model)
    return results
}

function sortResults(results, uniques, players, lineupPlayers=[], fl=[]) {
    let sortedResults = {lineup: [], qb: [], rb: [], wr: [], te: [], dst: [], flex: [], result: 0, usedSal: 0}
    sortedResults['result'] += results.result
    for (let i=0; i < lineupPlayers.length; i++){
        let pos = lineupPlayers[i].position.toLowerCase()
        sortedResults[pos] = [...sortedResults[pos], lineupPlayers[i]]
        sortedResults['lineup'] = [...sortedResults['lineup'], lineupPlayers[i]]
        sortedResults['usedSal'] += lineupPlayers[i].salary
        sortedResults['result'] += lineupPlayers[i].Projection
    }
    if (fl.length !== 0 ) {
        sortedResults['flex'] = [fl[0]] 
        sortedResults['lineup'] = [...sortedResults['lineup'], fl[0]]
        sortedResults['usedSal'] += fl[0].salary
        sortedResults['result'] += fl[0].Projection
    }
    for (const [key, value] of Object.entries(results)) {
        if (value === 1) {
            if (players[key].FLEX === 1) {    
                let playerInd = Object.keys(players[key])[0]
                let flexPlayer = uniques[playerInd]
                sortedResults['flex'] = [flexPlayer]
                sortedResults['lineup'] = [...sortedResults['lineup'], flexPlayer]
                sortedResults['usedSal'] += flexPlayer.salary
            }
            else {
                let pos = uniques[key].position.toLowerCase()
                sortedResults[pos] = [...sortedResults[pos], uniques[key]]
                sortedResults['lineup'] = [...sortedResults['lineup'], uniques[key]]
                sortedResults['usedSal'] += uniques[key].salary
             }
        }
    }
    return sortedResults
}

async function fetchCaptain(num) {
    let sleeperdata = await fetchSleeperProjections()
    let response = await fetch(`https://api.draftkings.com/draftgroups/v1/draftgroups/${num}/draftables`)
    let data = await response.json()
    let flexesQueue = []
    let crownsQueue = []
    data.draftables.map((element) => {
        if (element.draftStatAttributes[0].id === 90){
            sleeperPlayer = sleeperdata.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))
            if (sleeperPlayer !== undefined){
                var proj = sleeperPlayer.Projection
            }
            else {
                var proj = 0    

            }
            let details = {
                Name: element.displayName,
                Position: element.position,
                Game: element.competition['name'],
                FFPG: element.draftStatAttributes[0].value,
                Test: element.draftStatAttributes[0].id,
                Team: element.teamAbbreviation,
                DraftTableId: element.playerId,
                Status: element.status,
            }
            if (!crownsQueue.find(p => p.DraftTableId === element.playerId )){
                let newElement = {
                    ...details,
                    Salary: element.salary,
                    CROWN: 1,
                    [crownsQueue.length]: 1,
                    Projection: proj * 1.5
                }
                crownsQueue.push(newElement)
            }
            else {
                var ind = crownsQueue.findIndex(p => p.DraftTableId === element.playerId )
                let newElement = {
                    ...details,
                    Salary: element.salary, 
                    FLEX: 1,
                    [ind]: 1,
                    Projection: proj 
                }
                flexesQueue.push(newElement)
            }
        }
    })
    return {
        crownsQueue, flexesQueue
    }
}
   
async function captainOneData() {
    let num = 98584
    const queue = await fetchCaptain(num)
    return queue
}

async function captainTwoData() {
    let num = 98585
    const queue = await fetchCaptain(num)
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
    let optData = optimizeCaptainData(queue, req.body.fp, req.body.cp)
    let results = optimizeCaptain(optData.crownsQueue, optData.flexesQueue, optData.constraintObj2, req.body.cp, req.body.fp)
    res.json({
        crown: results.cp, fps: results.fps
    })
});

app.post("/optimizedcaptainmon", async (req, res) => {
    const queue = await captainTwoData()
    let optData = optimizeCaptainData(queue, req.body.fp, req.body.cp)
    let results = optimizeCaptain(optData.crownsQueue, optData.flexesQueue, optData.constraintObj2, req.body.cp, req.body.fp)
    res.json({
        crown: results.cp, fps: results.fps
    })
})

function optimizeCaptainData(queue, selectedLineup, selectedCrown) {
    let selectedCombine = [...selectedLineup, ...selectedCrown]
    var crownsQueue = queue.crownsQueue.filter(function(objFromC) {
        return !selectedCombine.find(function(objFromD) {
            return objFromC.DraftTableId === objFromD.DraftTableId
        })
    })
    var flexesQueue = queue.flexesQueue.filter(function(objFromC) {
        return !selectedCombine.find(function(objFromD) {
            return objFromC.DraftTableId === objFromD.DraftTableId
        })
    })
    let constraintObj2 = {}
    constraintObj2['Salary'] = {'max': 50000}
    constraintObj2['CROWN'] = { 'min': 1, 'max': 1 }
    constraintObj2['FLEX'] = { 'min': 5, 'max': 5 }
    let salary = 0
    if (selectedCrown.length !== 0){
        constraintObj2['CROWN'] = { 'min': 0, 'max': 0 }
        salary += selectedCrown[0].Salary * 1.5
    }
    for (let i = 0; i < selectedLineup.length; i++) {
        salary += selectedLineup[i].Salary
        let x = constraintObj2['FLEX']['min'] - 1
        constraintObj2['FLEX'] = {'min' : x, 'max': x}
    }
    constraintObj2['Salary'] = {'max': 50000 - salary}
    for (let i = 0; i < flexesQueue.length; i++) {
        constraintObj2[i] = {'max': 1}
    }
    return {crownsQueue, flexesQueue, constraintObj2}
}

function optimizeCaptain(crownsQueue, flexesQueue, constraintObj2, selectedCrown, selectedLineup) {
    let all = [...crownsQueue, ...flexesQueue]
    let obj2 = Object.assign({}, all)
    let intObj2 = {}
    for (let i = 0; i < all.length; i++) {
        intObj2[i] = 1      
    }
    intObj2['FLEX'] = 1
    intObj2['CROWN'] = 1
    const modelS = {
        optimize: "Projection",
        opType: "max",
        ints: intObj2,
        constraints: constraintObj2,
        variables: obj2,
    };
    const results = solver.Solve(modelS);
    let fps = selectedLineup
    let cp = selectedCrown
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