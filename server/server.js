const express = require("express");
const cors = require("cors");
const solver = require("javascript-lp-solver");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const fetch = require("node-fetch");

let sleeperObj = {}
let classicPlayers = []
let classicConstraintObj = {}
classicConstraintObj['QB'] = { 'min': 1, 'max': 1 }
classicConstraintObj['RB'] = { 'min': 2, 'max': 2 }
classicConstraintObj['WR'] = { 'min': 3, 'max': 3 }
classicConstraintObj['TE'] = { 'min': 1, 'max': 1 }
classicConstraintObj['DST'] = { 'min': 1, 'max': 1 }
classicConstraintObj['FLEX'] = { 'min': 1, 'max': 1 }
classicConstraintObj['salary'] = { 'max': 50000 }
let classicIntegerObj = {}
let classicCombinedObj = {}

fetchSleeperProjections()

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
    })
}

function fetchClassicPlayers() {
    fetch("https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables")
    .then((res)=> res.json())
    .then(data => {
        let counter = 0
        for (let z=0; z < data.draftables.length; z++) {
            if (data.draftables[z].draftStatAttributes[0].id === 90) {
                let element = data.draftables[z]
                let sleeperElement = Object.keys(sleeperObj).find(key => key === element.displayName || key.slice(0,10) === element.displayName.slice(0,10))
                var proj = sleeperElement !== undefined ? sleeperObj[sleeperElement] : 0
                var details = {...element, Projection: proj, [element.position]: 1, [counter]: 1}    
                classicPlayers.push(details)
                if (proj > 0) {
                    classicCombinedObj[counter] = details
                    classicIntegerObj[counter] = 1
                    classicConstraintObj[counter] = {'max': 1}
                }
                if (z !== data.draftables.length - 1 && element.playerId === data.draftables[z+1].playerId) {
                    var detailsTwo = {...details, [element.position]: 0, FLEX: 1}
                    if (proj > 0) {
                        classicCombinedObj[counter + 1000] = detailsTwo
                        classicIntegerObj[counter + 1000] = 1
                    }    
                    z++  
                }
                counter += 1
            }   
        }
    })   
}

app.get("/classicplayers", (req, res) => { 
    let sortedPlayers = {qall: classicPlayers, qqb: [], qrb: [], qwr: [], qte: [], qdst: [], qflex: []}
    for (let i=0; i < classicPlayers.length; i++) {
        let pos =  'q' + classicPlayers[i].position.toLowerCase()
        if (pos === 'qrb' || pos === 'qwr' || pos === 'qte'){
            sortedPlayers['qflex'] = [...sortedPlayers['qflex'], classicPlayers[i]]
        }
        sortedPlayers[pos] = [...sortedPlayers[pos],  classicPlayers[i]] 
    } 
    res.json(sortedPlayers)    
})

app.get("/classicoptimizer", (req, res) => { 
    let num = 0.025
    let results = optimizeClassic(classicConstraintObj, classicCombinedObj, num)
    let endResult = sortClassicResults(results)
    res.json(endResult)
})

app.post("/classicoptimize", (req, res) => {
    let lineupPlayers = req.body.lp
    let fl = req.body.fl 
    let classicConstraint = {...classicConstraintObj}
    let classicAllObj = {...classicCombinedObj}
    let sal = 50000
    let val = 0 
    for (let i = 0; i < lineupPlayers.length; i++) {
        let numb = Object.keys(lineupPlayers[i])[0]
        let numbTwo = Number(numb) + 1000
        delete classicAllObj[numb]
        delete classicAllObj[numbTwo]
        let x = classicConstraint[`${lineupPlayers[i].position}`]['min'] - 1
        classicConstraint[`${lineupPlayers[i].position}`] = {'min' : x, 'max': x}
        sal -= lineupPlayers[i].salary
        val += lineupPlayers[i].Projection
    }  
    if (fl.length !== 0){
        let numb = Object.keys(fl[0])[0]
        let numbTwo = Number(numb) + 1000
        delete classicAllObj[numb]
        delete classicAllObj[numbTwo]
        classicConstraint['FLEX'] = { 'min': 0, 'max': 0 }
        sal -= fl[0].salary
        val += fl[0].Projection
    }
    classicConstraint['salary'] = { 'max': sal }
    let results = optimizeClassic(classicConstraint, classicAllObj, 0)
    let endResult = sortClassicResults(results, lineupPlayers)
    endResult['usedSal'] += (50000 - sal)
    endResult['result'] += val
    if (fl.length !== 0){
        endResult['flex'] = [...endResult['flex'], fl[0]] 
        endResult['lineup'] = [...endResult['lineup'], fl[0]]
    }    
    res.json(endResult)
})

function optimizeClassic(classicConstraint, classicAll, num) {
    classicIntegerObj['QB'] = 1
    classicIntegerObj['RB'] = 1
    classicIntegerObj['WR'] = 1
    classicIntegerObj['TE'] = 1
    classicIntegerObj['DST'] = 1
    classicIntegerObj['FLEX'] = 1
    const model = {
        optimize: "Projection",
        opType: "max",
        ints: classicIntegerObj,
        constraints: classicConstraint,   
        variables: classicAll,
        options: {
            "tolerance": num
        }
    }    
    const results = solver.Solve(model)
    return results
}

function sortClassicResults(results, lineupPlayers=[]) {
    let sortedResults = {lineup: [], qb: [], rb: [], wr: [], te: [], dst: [], flex: [], result: results.result, usedSal: 0}
    let usedSal = 0 
    for (const [key, value] of Object.entries(results)) {
        if (value === 1) {
            if (classicCombinedObj[key].FLEX === 1) {    
                let flexPlayer = classicPlayers.find(p => p.playerId === classicCombinedObj[key].playerId)
                sortedResults['flex'] = [flexPlayer]
                sortedResults['lineup'] = [...sortedResults['lineup'], flexPlayer]
                usedSal += flexPlayer.salary
            }
            else {
                let pos =  classicCombinedObj[key].position.toLowerCase()
                sortedResults[pos] = [...sortedResults[pos],  classicCombinedObj[key]]
                sortedResults['lineup'] = [...sortedResults['lineup'],  classicCombinedObj[key]]
                usedSal +=  classicCombinedObj[key].salary
            }
        }
    }
    for (let i=0; i < lineupPlayers.length; i++){
        let pos = lineupPlayers[i].position.toLowerCase()
        sortedResults[pos] = [...sortedResults[pos], lineupPlayers[i]]
        sortedResults['lineup'] = [...sortedResults['lineup'], lineupPlayers[i]]
    }
    sortedResults['usedSal'] = usedSal
    return sortedResults
}

app.get("/trcaptainplayers", async (req, res) => { 
    const queue = await captainOneData()
    res.json({
        crowns: queue.crownsQueue, flexes: queue.flexesQueue
    })
})

app.get("/moncaptainplayers", async (req, res) => { 
    const queue = await captainTwoData()
    res.json({
        crowns: queue.crownsQueue, flexes: queue.flexesQueue
    });
})

app.post("/optimizedcaptain", async (req, res) => {
    const queue = await captainOneData()
    let optData = optimizeCaptainData(queue, req.body.fp, req.body.cp)
    let results = optimizeCaptain(optData.allQueue, queue.flexesQueue, optData.captainConstraintObj, req.body.cp, req.body.fp)
    res.json({
        crown: results.cp, fps: results.fps
    })
});

app.post("/optimizedcaptainmon", async (req, res) => {
    const queue = await captainTwoData()
    let optData = optimizeCaptainData(queue, req.body.fp, req.body.cp)
    let results = optimizeCaptain(optData.allQueue, queue.flexesQueue, optData.captainConstraintObj, req.body.cp, req.body.fp)
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
            var proj = sleeperElement !== undefined ? sleeperObj[sleeperElement] : 0
            let details = {
                Name: element.displayName,
                Position: element.position,
                Game: element.competition['name'],
                FFPG: element.draftStatAttributes[0].value,
                Test: element.draftStatAttributes[0].id,
                Team: element.teamAbbreviation,
                DraftTableId: element.playerId,
                Status: element.status,
                Salary: element.salary,
            }
            var ind = crownsQueue.findIndex(p => p.DraftTableId === element.playerId )
            if (ind === -1){
                let newElement = {...details, CROWN: 1, [crownsQueue.length]: 1, Projection: proj * 1.5}
                crownsQueue.push(newElement)
            }
            else {
                let newElement = {...details, FLEX: 1, [ind]: 1, Projection: proj}
                flexesQueue.push(newElement)
            }
        }
    })
    return {crownsQueue, flexesQueue}
}

function optimizeCaptainData(queue, selectedLineup, selectedCrown) {
    let allQueue = [...queue.crownsQueue, ...queue.flexesQueue]
    let captainConstraintObj = {}
    captainConstraintObj['Salary'] = {'max': 50000}
    captainConstraintObj['CROWN'] = { 'min': 1, 'max': 1 }
    captainConstraintObj['FLEX'] = { 'min': 5, 'max': 5 }
    let salary = 0
    if (selectedCrown.length !== 0){
        captainConstraintObj['CROWN'] = { 'min': 0, 'max': 0 }
        salary += selectedCrown[0].Salary * 1.5
        allQueue = allQueue.filter(p => p.DraftTableId !== selectedCrown[0].DraftTableId)
    }
    for (let i = 0; i < selectedLineup.length; i++) {
        salary += selectedLineup[i].Salary
        let x = captainConstraintObj['FLEX']['min'] - 1
        captainConstraintObj['FLEX'] = {'min' : x, 'max': x}       
        allQueue = allQueue.filter(p => p.DraftTableId !== selectedLineup[i].DraftTableId)
    }
    captainConstraintObj['Salary'] = {'max': 50000 - salary}
    return {allQueue, captainConstraintObj}
}

function optimizeCaptain(allQueue, flexesQueue, captainConstraintObj, selectedCrown, selectedLineup) {
    let captainAll = Object.assign({}, allQueue)
    let captainIntObj = {}
    for (let i = 0; i < flexesQueue.length; i++) {
        captainConstraintObj[i] = {'max': 1}
        captainIntObj[i] = 1      
    }
    for (let i = flexesQueue.length; i < allQueue.length; i++) {
        captainIntObj[i] = 1      
    }
    captainIntObj['FLEX'] = 1
    captainIntObj['CROWN'] = 1
    const modelS = {
        optimize: "Projection",
        opType: "max",
        ints: captainIntObj,
        constraints: captainConstraintObj,
        variables: captainAll,
    };
    const results = solver.Solve(modelS);
    let fps = selectedLineup
    let cp = selectedCrown
    for (const [key, value] of Object.entries(results)) {
        if (value === 1) {
            if (allQueue[key].CROWN === 1) {
                let c = flexesQueue.find(p => p.Name === allQueue[key].Name)
                cp.push(c)
            }
            else {
                fps.push(allQueue[key])
            }
        }
    }
    return {cp, fps}
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})