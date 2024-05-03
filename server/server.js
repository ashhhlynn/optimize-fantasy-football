const express = require("express");
const cors = require("cors");
const solver = require("javascript-lp-solver");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const fetch = require("node-fetch");
const e = require("express");

let sleeperObj = {}
let classicPlayers = []
let classicFlex = []
let classicCombined = []
let classicConstraintObj = {}
classicConstraintObj['QB'] = { 'min': 1, 'max': 1 }
classicConstraintObj['RB'] = { 'min': 2, 'max': 2 }
classicConstraintObj['WR'] = { 'min': 3, 'max': 3 }
classicConstraintObj['TE'] = { 'min': 1, 'max': 1 }
classicConstraintObj['DST'] = { 'min': 1, 'max': 1 }
classicConstraintObj['FLEX'] = { 'min': 1, 'max': 1 }
classicConstraintObj['salary'] = { 'max': 50000 }
let classicIntObj = {}
classicIntObj['QB'] = 1
classicIntObj['RB'] = 1
classicIntObj['WR'] = 1
classicIntObj['TE'] = 1
classicIntObj['DST'] = 1
classicIntObj['FLEX'] = 1

fetchSleeperObj()

function fetchSleeperObj(){
    fetch("https://api.sleeper.app/projections/nfl/2023/18?season_type=regular&position%5B%5D=DEF&position%5B%5D=K&position%5B%5D=RB&position%5B%5D=QB&position%5B%5D=TE&position%5B%5D=WR&order_by=ppr")
    .then((res)=> res.json())
    .then(data => {
        data.map((element) => {
            if (element.stats.pts_ppr > 0){  
                if (element.player.position === "DEF" ) {
                    var name = element.player.last_name
                }
                else {
                    var name = element.player.first_name + ' ' + element.player.last_name
                }
                sleeperObj[name] = element.stats.pts_ppr
            }
        })
        fetchClassicPlayers()
    })
}

function fetchClassicPlayers() {
    fetch("https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables")
    .then((res)=> res.json())
    .then(data => {
        let counter = 0
        let intCounter = 0
        for (let z=0; z < data.draftables.length; z++) {
            if (data.draftables[z].draftStatAttributes[0].id === 90) {
                let element = data.draftables[z]
                let sleeperElement = Object.keys(sleeperObj).find(key => key === element.displayName || key.slice(0,10) === element.displayName.slice(0,10))
                if (sleeperElement !== undefined) {
                    var proj = sleeperObj[sleeperElement]
                }
                else {
                    var proj = 0
                }
                classicIntObj[intCounter] = {'max': 1}
                classicConstraintObj[counter] = {'max': 1}
                var details = {
                    ...element, 
                    Projection: proj,
                    [element.position]: 1,
                    [counter]: 1
                }    
                classicPlayers.push(details)
                if (z !== data.draftables.length - 1 && element.playerId === data.draftables[z+1].playerId) {
                    var detailsTwo = {
                        ...details, 
                        [element.position]: 0,
                        FLEX: 1, 
                    }
                    classicFlex.push(detailsTwo)
                    intCounter += 1
                    classicIntObj[intCounter] = {'max': 1}
                    z++
                }
                counter += 1
                intCounter += 1
            }   
        }
        classicCombined.push(...classicPlayers)
        classicCombined.push(...classicFlex)
    })   
}

app.get("/classicplayers", (req, res) => { 
    let qqb = []
    let qrb = []
    let qwr = []
    let qte = []
    let qdst = []
    let qflex = []
    for (let i=0; i < classicPlayers.length; i++) {
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
    res.json({ 
        unique: classicPlayers, qqb: qqb, qrb: qrb, qwr: qwr, qte: qte, qdst: qdst, qflex: qflex
    })    
})

app.get("/classicoptimizer", (req, res) => { 
    let results = optimizeClassic(classicConstraintObj, classicCombined)
    let endResult = sortClassicResults(results, classicCombined)
    res.json(
        endResult
    )
})

app.post("/classicoptimize", (req, res) => {
    let lineupPlayers = req.body.lp
    let fl = req.body.fl 
    let classicConstraint = {...classicConstraintObj}
    let sal = 50000
    let classicAll = [...classicCombined]
    for (let i = 0; i < lineupPlayers.length; i++) {
        classicAll.filter(p => p.playerId !== lineupPlayers[i].playerId)
        sal -= lineupPlayers[i].salary
        let x = classicConstraint[`${lineupPlayers[i].position}`]['min'] - 1
        classicConstraint[`${lineupPlayers[i].position}`] = {'min' : x, 'max': x}
    }  
    if (fl.length !== 0){
        sal -= fl[0].salary
        classicConstraint['FLEX'] = { 'min': 0, 'max': 0 }
        classicAll.filter(p => p.playerId !== fl[0].playerId)
    }
    classicConstraint['salary'] = { 'max': sal }
    let results = optimizeClassic(classicConstraint, classicAll)
    let endResult = sortClassicResults(results, classicAll, lineupPlayers, fl)
    res.json(
       endResult
    )
})

function optimizeClassic(classicConstraint, classicAll) {
    let playersObj = Object.assign({}, classicAll)
    console.log(playersObj)
    const model = {
        optimize: "Projection",
        opType: "max",
        ints: classicIntObj,
        constraints: classicConstraint,   
        variables: playersObj,
    }    
    const results = solver.Solve(model)
    return results
}

function sortClassicResults(results, classicAll, lineupPlayers=[], fl=[]) {
    let sortedResults = {lineup: [], qb: [], rb: [], wr: [], te: [], dst: [], flex: [], result: 0, usedSal: 0}
    let value = results.result 
    let usedSal = 0 
    for (const [key, value] of Object.entries(results)) {
        if (value === 1) {
            if (classicAll[key].FLEX === 1) {    
                let flexPlayer = classicPlayers.find(p => p.playerId === classicAll[key].playerId)
                sortedResults['flex'] = [flexPlayer]
                sortedResults['lineup'] = [...sortedResults['lineup'], flexPlayer]
                usedSal += flexPlayer.salary
            }
            else {
                let pos =  classicAll[key].position.toLowerCase()
                sortedResults[pos] = [...sortedResults[pos],  classicAll[key]]
                sortedResults['lineup'] = [...sortedResults['lineup'],  classicAll[key]]
                usedSal +=  classicAll[key].salary
             }
        }
    }
    for (let i=0; i < lineupPlayers.length; i++){
        let pos = lineupPlayers[i].position.toLowerCase()
        sortedResults[pos] = [...sortedResults[pos], lineupPlayers[i]]
        sortedResults['lineup'] = [...sortedResults['lineup'], lineupPlayers[i]]
        usedSal += lineupPlayers[i].salary
        value += lineupPlayers[i].Projection
    }
    if (fl.length !== 0 ) {
        sortedResults['flex'] = [fl[0]] 
        sortedResults['lineup'] = [...sortedResults['lineup'], fl[0]]
        usedSal += fl[0].salary
        value += fl[0].Projection
    }
    sortedResults['result'] = value
    sortedResults['usedSal'] = usedSal
    return sortedResults
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

async function fetchCaptain(num) {
    let response = await fetch(`https://api.draftkings.com/draftgroups/v1/draftgroups/${num}/draftables`)
    let data = await response.json()
    let flexesQueue = []
    let crownsQueue = []
    data.draftables.map((element) => {
        if (element.draftStatAttributes[0].id === 90){
            let sleeperElement = Object.keys(sleeperObj).find(key => key === element.displayName || key.slice(0,10) === element.displayName.slice(0,10))
            if (sleeperElement !== undefined){
                var proj = sleeperObj[sleeperElement]
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