import React, { useState, useEffect } from 'react'
import { Button, Grid, Label, Icon, Modal, ModalContent, ModalActions, Loader } from 'semantic-ui-react'
import ClassicQueue from './ClassicQueue.js'
import ClassicLineupHeader from './ClassicLineupHeader.js'
import ClassicLineup from './ClassicLineup.js'

function ClassicHome() {

    const [players, setPlayers] = useState([])
    const [qqbs, setQQbs] = useState([])
    const [qrbs, setQRbs] = useState([])
    const [qwrs, setQWrs] = useState([])
    const [qtes, setQTes] = useState([])
    const [qdsts, setQDsts] = useState([])
    const [qflexs, setQFlexs] = useState([])
    const [qall, setQAll] = useState([])
    const [qb, setQb] = useState()
    const [rbs, setRbs] = useState([])
    const [wrs, setWrs] = useState([])
    const [te, setTe] = useState()
    const [dst, setDst] = useState()
    const [flex, setFlex] = useState([])
    const [lineupPlayers, setLineupPlayers] = useState([])
    const [salary, setSalary] = useState(50000)
    const [salaryPerPlayer, setSalaryPerPlayer] = useState(5555)
    const [playerCount, setPlayerCount] = useState(9)
    const [projection, setProjection] = useState(0)
    const [open, setOpen] = useState(false)
    const [isLoading, setLoading] = useState(false);

    const url = "https://optimize-daily.onrender.com"

    useEffect(() => {
        fetchPlayerQueue()
    },[])

    const fetchPlayerQueue = () => {
        fetch(`${url}/classicplayers`)
        .then((res)=> res.json())
        .then(data => {
            setQQbs(data.qqb)
            setQRbs(data.qrb)
            setQWrs(data.qwr)
            setQTes(data.qte)
            setQDsts(data.qdst)
            setQFlexs(data.qflex)
            setPlayers(data.unique)
            setQAll(data.unique)
        })
    }

    const setPlayer = (player) => {
        if (!lineupPlayers.find(p => p.playerId === player.playerId)) { 
            if (player.position === "QB" && !qb ) {
                setLineupData(player)
                setQb(player)
            }
            else if (player.position === "RB" && rbs.length < 2) {
                setRbs(rbs => [...rbs, player])
                setLineupData(player)
            }
            else if (player.position === "WR" && wrs.length < 3) {
                setWrs(wrs => [...wrs, player])
                setLineupData(player)
            }
            else if (player.position === "TE" && !te) {
                setTe(player)
                setLineupData(player)
            }
            else if (player.position === "DST" && !dst) {
                setDst(player)
                setLineupData(player)
            }
            else if (flex.length < 1 && (player.position === "RB" || player.position === "WR"  || player.position === "TE")) {
                setFlex([player])
                setLineupData(player)
            }
        }
    }

    const optimizeWith = () => {
        setOpen(false)
        let fl = flex
        let answer = 'yes'
        if (fl.length > 0 ) {
            let lp = lineupPlayers.filter(p => p.playerId !== flex[0].playerId)
            optimizePlayers(lp, fl, answer)
        } 
        else if (lineupPlayers.length > 0){
            let lp = lineupPlayers 
            optimizePlayers(lp, fl, answer)
        }
        else {
            optimizeWithout()
        }
    }

    const optimizeWithout = () => {
        setOpen(false)
        setLoading(true)
        fetch(`${url}/classicoptimizer`)
        .then((res)=> res.json())
        .then(data => {
            setQb(data.qb[0])
            setRbs(data.rb)
            setWrs(data.wr)
            setDst(data.dst[0])
            setTe(data.te[0])
            setFlex(data.flex)
            setSalary(50000-data.usedSal)
            setProjection(data.result)
            setSalaryPerPlayer(0)
            setPlayerCount(0)
            setLineupPlayers(data.lineup)
            setLoading(false)
        })
    }

    const optimizePlayers = (lp, fl, answer) => {
        setLoading(true)
        fetch(`${url}/classicoptimize`, {
            method: "POST",
            body: JSON.stringify({
                lp, fl, answer
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then(response => response.json())
        .then(data => {
            setQb(data.qb[0])
            setRbs(data.rb)
            setWrs(data.wr)
            setDst(data.dst[0])
            setTe(data.te[0])
            setFlex(data.flex)
            setSalary(50000-data.usedSal)
            setProjection(data.result)
            setSalaryPerPlayer(0)
            setPlayerCount(0)
            setLineupPlayers(data.lineup)
            setLoading(false)
        })
    }

    const setLineupData = (player) => {     
        setProjection(projection + player.Projection)
        setLineupPlayers(lineupPlayers => [...lineupPlayers, player])
        let s = salary - player.salary
        if (playerCount === 1) {
            setSalaryPerPlayer(0)
        }
        else {
            setSalaryPerPlayer(parseInt(s/(playerCount - 1)))
        }
        setSalary(s)
        setPlayerCount(playerCount - 1)
    }

    const removePlayer = (player) => {
        removeLineupData(player)
        if (player === flex[0]) {
            setFlex([])
        }  
        else if (player.position === "QB") {
            setQb()
        }
        else if (player.position === "RB") {
            let z = rbs.filter(f => f !== player)
            setRbs(z)
        }
        else if (player.position === "WR") {
            let z = wrs.filter(f => f !== player)
            setWrs(z)
        }
        else if (player.position === "TE") {
            setTe()
        }
        else if (player.position ==="DST" ) {
            setDst()
        }
    }

    const removeLineupData = (player) => {
        setProjection(projection - player.Projection)
        let s = salary + player.salary
        setSalaryPerPlayer(parseInt(s/(playerCount + 1)))
        setSalary(s)
        setPlayerCount(playerCount + 1)
        let x = lineupPlayers.filter(f => f.playerId !== player.playerId)
        setLineupPlayers(x)
    }

    const sortPos = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.position < item1.position ? -1 : 1)])
    }

    const sortProjection = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.Projection < item1.Projection ? -1 : 1)])
    }

    const sortFFPG = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.draftStatAttributes[0].value < item1.draftStatAttributes[0].value ? -1 : 1)])
    }

    const sortMoney = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.salary < item1.salary ? -1 : 1)])
    }

    const sortName = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.displayName < item1.displayName ? 1 : -1)])
    }
 
    const setQPlayers = () => {
        setPlayers(qqbs)
    }

    const setRPlayers = () => {
        setPlayers(qrbs)
    }

    const setWPlayers = () => {
        setPlayers(qwrs)
    }

    const setTPlayers = () => {
        setPlayers(qtes)
    }

    const setFPlayers = () => {
        setPlayers(qflexs)
    }

    const setDPlayers = () => {
        setPlayers(qdsts)
    }

    const setAllPlayers = () => {
        setPlayers(qall)
    }

    return (
        <div>
            <Grid divider vert style={{marginTop:".5%"}}>
                <Grid.Row columns={2}>
                    <Grid.Column> 
                        {isLoading ? 
                            <Loader active /> : <Loader />
                        }
                        <ClassicLineupHeader
                            salary={salary}
                            salaryPerPlayer={salaryPerPlayer}
                            projection={projection}
                        />
                        <ClassicLineup 
                            qb={qb}
                            te={te}
                            rbs={rbs}
                            wrs={wrs}
                            flex={flex}
                            dst={dst}
                            removePlayer={removePlayer}
                        />
                        <Modal
                        style={{width:"305px"}}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        trigger={
                            <div className="optimizeLabel">
                                <Label size="big" style={{cursor:"pointer", backgroundColor:"#61dafb", fontWeight:"normal", fontSize:"17px", letterSpacing:".5px"}}>OPTIMIZE</Label>
                            </div>
                        }
                        >
                            <ModalContent style={{textAlign:"center"}}>
                                <p style={{fontFamily:"Helvetica", fontSize:"15px", fontWeight:"bold"}}>Include selected players?</p>
                                <ModalActions>
                                    <Button basic color="teal" style={{marginLeft:"1.5%", width:"110px"}} onClick={optimizeWith}>
                                        <Icon name='checkmark' /> Yes
                                    </Button>
                                    <Button basic color='grey' style={{width:"110px"}} onClick={optimizeWithout}>
                                        <Icon name='remove' /> No
                                    </Button>
                                </ModalActions>
                            </ModalContent>
                        </Modal>
                    </Grid.Column>
                    <Grid.Column>
                        <Label.Group style={{height:"46px", cursor:"pointer", marginLeft:"24%", marginTop:"1.85%",marginBottom:"-2.3%"}}>
                            <Label onClick={setQPlayers} style={{fontSize:"11.5px", backgroundColor:"#61dafb"}}>QB</Label>
                            <Label onClick={setRPlayers} style={{fontSize:"11.5px", marginLeft:"-.5%", backgroundColor:"#61dafb"}}>RB</Label>
                            <Label onClick={setWPlayers} style={{fontSize:"11.5px", marginLeft:"-.5%", backgroundColor:"#61dafb"}}>WR</Label>
                            <Label onClick={setTPlayers} style={{fontSize:"11.5px",marginLeft:"-.5%", backgroundColor:"#61dafb"}}>TE</Label>
                            <Label onClick={setDPlayers} style={{fontSize:"11.5px",marginLeft:"-.5%", backgroundColor:"#61dafb"}}>DST</Label>
                            <Label onClick={setFPlayers} style={{fontSize:"11.5px", marginLeft:"-.5%", backgroundColor:"#61dafb"}}>FLEX</Label>
                            <Label onClick={setAllPlayers} style={{fontSize:"11.5px",marginLeft:"-.5%", backgroundColor:"#61dafb"}}>ALL</Label>
                        </Label.Group>
                        <ClassicQueue 
                            sortMoney={sortMoney}
                            sortPos={sortPos}
                            sortProjection={sortProjection}
                            sortName={sortName}
                            players={players}
                            setPlayer={setPlayer}
                            sortFFPG={sortFFPG}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}

export default ClassicHome