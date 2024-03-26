
 
    fetch("https://optimize-daily.onrender.com/gameschedule")
    .then((res)=> res.json())
    .then(data => {
      setSdTeams1(data.sd1.name)
      setSdTeams2(data.sd2.name)
      let startDay1 = data.sd1.startTime.substr(0,10)
      let sddate1 = startDay1.substr(5,5)
      setSdDate1(sddate1)
      let d1 = new Date(startDay1)
      let dow1 = String(d1.getDay())
      let startDay2 = data.sd2.startTime.substr(0,10)
      let sddate2 = startDay2.substr(5,5)
      setSdDate2(sddate2)
      let d2 = new Date(startDay2)
      let dow2 = String(d2.getDay())
      const dayNames = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
      setSdDow1(dayNames[dow1])
      setSdDow2(dayNames[dow2])
      let cldate = data.cl.startTime.substr(5,5)
      setClDate(cldate)
    })


app.get("/gameschedule", (req, res) => { 
    fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98582/draftables')
    .then(response => response.json())
    .then(data => {
        let cl = data.draftables[0].competition
        fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98585/draftables')
        .then(response => response.json())
        .then(data2 => {
            let sd2 = data2.draftables[0].competition
            fetch('https://api.draftkings.com/draftgroups/v1/draftgroups/98584/draftables')
            .then(response => response.json())
            .then(data1 => {
                let sd1 = data1.draftables[0].competition
                res.json({
                    sd2: sd2, sd1: sd1, cl: cl
                });
            })
        })
    })
})


async function fetchSleeperProjections() {
    const current = Math.ceil((new Date() - new Date("2023-09-05"))/604800000)
    if (current <= 18) {
        const response = await fetch(`https://api.sleeper.app/projections/nfl/2023/${current}?season_type=regular&position%5B%5D=DEF&position%5B%5D=K&position%5B%5D=RB&position%5B%5D=QB&position%5B%5D=TE&position%5B%5D=WR&order_by=ppr`)
        let responseJson = response.json()
        return responseJson
    }
    else {
        const response = await fetch(`https://api.sleeper.app/projections/nfl/2023/18?season_type=regular&position%5B%5D=DEF&position%5B%5D=K&position%5B%5D=RB&position%5B%5D=QB&position%5B%5D=TE&position%5B%5D=WR&order_by=ppr`)
        let responseJson = response.json()
        return responseJson
    }
}
   
async function getSleeperProjections() {  
    let response = await fetchSleeperProjections()
    let s = response.map((element) => {
        if (element.player.position === "DEF") {
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
    return (
        sleeper
    ) 
}

async function fetchClassic(num) {
    let sleeperData = await getSleeperProjections()
    let response = await fetch(`https://api.draftkings.com/draftgroups/v1/draftgroups/${num}/draftables`)
    let dkData = await response.json()
    return {
        sleeperData, dkData
    }    
}

async function updateClassic(num) {
    let d = await fetchClassic(num)
    let data = d.dkData
    let sleeperdata = d.sleeperData
    let z = data.draftables.map((element) => {
        if (sleeperdata.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))) {
            let p = sleeperdata.find(i=> i.Name === element.displayName || i.Name.slice(0,10) === element.displayName.slice(0,10))
            let pro = p.Projection
            return {
                Name: element.displayName,
                Position: element.position,
                Salary: element.salary,
                Game: element.competition['name'],
                FFPG: element.draftStatAttributes[0].value,
                Test: element.draftStatAttributes[0].id,
                Team: element.teamAbbreviation,
                DraftTableId: element.playerId,
                Projection: pro,
                Status: element.status
            }
        }
        else { 
            return {
                Name: element.displayName,
                Position: element.position,
                Salary: element.salary,
                Game: element.competition['name'],
                FFPG: element.draftStatAttributes[0].value,
                Test: element.draftStatAttributes[0].id,
                Team: element.teamAbbreviation,
                DraftTableId: element.playerId,
                Projection: 0,
                Status: element.status
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
    return uniques
}

async function classicData() {
    let num = 98582
    const uniques = await updateClassic(num)
    return uniques
}

app.get("/classicplayers", async (req, res) => { 
    const uniques = await classicData()
    let q = uniques.filter(d => d.Position === "QB")
    let r = uniques.filter(d => d.Position === "RB")
    let w = uniques.filter(d => d.Position === "WR")
    let t = uniques.filter(d => d.Position === "TE")
    let d = uniques.filter(d => d.Position === "DST")
    let f = uniques.filter(d=> d.Position === "RB" || d.Position === "TE" || d.Position === "WR")
    res.json({unique: uniques, qqb: q, qrb: r, qwr: w, qte: t, qdst: d, qflex: f});
})

app.post("/classicoptimize", async (req, res) => {
    const unique = await classicData()
    let myObjTwo = {}
    myObjTwo['QB'] = { 'min': 1, 'max': 1 }
    myObjTwo['RB'] = { 'min': 2, 'max': 2 }
    myObjTwo['WR'] = { 'min': 3, 'max': 3 }
    myObjTwo['TE'] = { 'min': 1, 'max': 1 }
    myObjTwo['DST'] = { 'min': 1, 'max': 1 }
    myObjTwo['FLEX'] = { 'min': 1, 'max': 1 }
    myObjTwo['Salary'] = { 'max': 50000 }
    for (let i = 0; i < unique.length; i++) {
        myObjTwo[i] = {'max': 1}
    }
    let QB = []
    let RB = []
    let WR = []
    let TE = []
    let FLEX = []
    let DST = []
    let lineup = []
    let val = 0
    let lineupPlayers = req.body.lp
    let fl = req.body.fl 
    if (req.body.answer === 'yes' && lineupPlayers.length !== 0 || fl.length !== 0 ) {
        let sal = 50000 
        for (let i = 0; i < lineupPlayers.length; i++) {
            sal -= lineupPlayers[i].Salary
            let x = myObjTwo[`${lineupPlayers[i].Position}`]['min'] - 1
            myObjTwo[`${lineupPlayers[i].Position}`] = {'min' : x, 'max': x}
            lineup.push(lineupPlayers[i])
            val += lineupPlayers[i].Projection
            myObjTwo['Salary'] = { 'max': sal }
            if (lineup[i].Position === 'QB'){
                QB.push(lineup[i])
            }
            else if (lineup[i].Position === 'RB'){
                RB.push(lineup[i])
            }
            else if (lineup[i].Position === 'WR'){
                WR.push(lineup[i])
            }
            else if (lineup[i].Position === 'TE'){
                TE.push(lineup[i])
            }
            else if (lineup[i].Position === 'DST'){
                DST.push(lineup[i])
            }
        }
        if (fl.length !== 0 ) {
            FLEX.push(fl[0])
            sal -= fl[0].Salary
            myObjTwo['Salary'] = { 'max': sal }
            myObjTwo['FLEX'] = { 'min': 0, 'max': 0 }
            val += fl[0].Projection
            lineup.push(fl[0])
        }
        let newLineupPlayers = [...lineupPlayers, ...fl]
        var uniques = unique.filter(function(objFromA) {
            return !newLineupPlayers.find(function(objFromB) {
                return objFromA.DraftTableId === objFromB.DraftTableId
            })
        })
    } 
    else {
        var uniques = unique
    }
    let f = uniques.filter(d=> d.Position === "RB" || d.Position === "TE" || d.Position === "WR")
    let duplicates = f.map((element) => {
        let i = uniques.indexOf(uniques.find(e => e.DraftTableId === element.DraftTableId))
        return {
            ...element,
            FLEX: 1,
            [i]: 1,
            [element.Position]: 0,
        }
    })
    const players = [...uniques, ...duplicates]
    let results = optimizeClassic(players, myObjTwo) 
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
    res.json({
        lineup: lineup, qb: QB, rb: RB, wr: WR, te: TE, dst: DST, flex: FLEX, result: results.result + val
    })
})

function optimizeClassic(players, myObjTwo) {
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
    return (results)   
}

async function fetchCaptain(num) {
    let sleeperData = await getSleeperProjections()
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
    let y = data.draftables.map((element) => {
        return {
            Name: element.displayName,
            Position: element.position,
            Salary: element.salary,
            Game: element.competition['name'],
            FFPG: element.draftStatAttributes[0].value,
            Test: element.draftStatAttributes[0].id,
            Team: element.teamAbbreviation,
            DraftTableId: element.playerId,
            Status: element.status
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
                Projection: pro,
            }
        }
        else {
            return {
                ...element,
                [i]: 1,
                CROWN: 1,
                Projection: 0,
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
                Projection: pro,
            }
        }
        else {
            return {
                ...element,
                [flexes.indexOf(element)]: 1,
                FLEX: 1,
                Projection: 0,
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
    const crownsQueue = queue.crownsQueue
    const flexesQueue = queue.flexesQueue
    return {crownsQueue, flexesQueue}
}

async function captainTwoData() {
    let num = 98585
    const queue = await updateCaptain(num)
    const crownsQueue = queue.crownsQueue
    const flexesQueue = queue.flexesQueue
    return {crownsQueue, flexesQueue}
}

app.get("/trcaptainplayers", async (req, res) => { 
    const queue = await captainOneData()
    const crownsQueue = queue.crownsQueue
    const flexesQueue = queue.flexesQueue
    res.json({
        crowns: crownsQueue, flexes: flexesQueue
    });
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
    let lineupP = req.body.fp
    let crownP = req.body.cp
    let optData = captainOptData(queue, lineupP, crownP)
    let crownsQueue = optData.crownsQueue
    let flexesQueue = optData.flexesQueue
    let myObjSTwo = optData.myObjSTwo
    let cp = optData.cp
    let fps = optData.fps
    let all = [...crownsQueue, ...flexesQueue]
    let results = optimizeCaptain(all, myObjSTwo)
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
    res.json({
        crown: cp, fps: fps
    })
});

app.post("/optimizedcaptainmon", async (req, res) => {
    const queue = await captainTwoData()
    let lineupP = req.body.fp
    let crownP = req.body.cp
    let optData = captainOptData(queue, lineupP, crownP)
    let crownsQueue = optData.crownsQueue
    let flexesQueue = optData.flexesQueue
    let myObjSTwo = optData.myObjSTwo
    let cp = optData.cp
    let fps = optData.fps
    let all = [...crownsQueue, ...flexesQueue]
    let results = optimizeCaptain(all, myObjSTwo)
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
    res.json({
        crown: cp, fps: fps
    })
});

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

function optimizeCaptain(all, myObjSTwo) {
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
    return(results)
}
