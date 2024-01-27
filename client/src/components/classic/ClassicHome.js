
import React, { useState, useEffect } from 'react'
import { Button, Grid, Label, Icon, Modal, ModalContent, ModalActions } from 'semantic-ui-react'
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
    const [flex, setFlex] = useState()
    const [lineupPlayers, setLineupPlayers] = useState([])
    const [salary, setSalary] = useState(50000)
    const [salaryPerPlayer, setSalaryPerPlayer] = useState(5555)
    const [playerCount, setPlayerCount] = useState(9)
    const [projection, setProjection] = useState(0)
    const [open, setOpen] = useState(false)

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
        if (!lineupPlayers.find(p => p.DraftTableId === player.DraftTableId)) { 
            if (player.Position === "QB" && !qb ) {
              setLineupData(player)
              setQb(player)
            }
            else if (player.Position === "RB" && rbs.length < 2) {
              setRbs(rbs => [...rbs, player])
              setLineupData(player)
            }
            else if (player.Position === "WR" && wrs.length < 3) {
              setWrs(wrs => [...wrs, player])
              setLineupData(player)
            }
            else if (player.Position === "TE" && !te) {
              setTe(player)
              setLineupData(player)
            }
            else if (player.Position === "DST" && !dst) {
              setDst(player)
              setLineupData(player)
            }
            else if (!flex && (player.Position === "RB" || player.Position === "WR"  || player.Position === "TE")) {
              setFlex(player)
              setLineupData(player)
            }
        }
    }

    const optimizeWithout = () => {
        setOpen(false)
        let lp = []
        optimizePlayers(lp)
    }

    const optimizeWith = () => {
        setOpen(false)
        let lp = lineupPlayers
        optimizePlayers(lp)
    }

    const optimizePlayers = (lp) => {
        fetch(`${url}/classicoptimize`, {
            method: "POST",
            body: JSON.stringify({
                lp
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then(response => response.json())
        .then(data => {
            let s = 0
            for (let i = 0; i < data.lineup.length; i++ ) {
                s += data.lineup[i].Salary;
            } 
            setSalary(50000-s)
            setProjection(data.result)
            setSalaryPerPlayer(0)
            setPlayerCount(0)
            setLineupPlayers(data.lineup)
            setQb(data.qb[0])
            setRbs(data.rb)
            setWrs(data.wr)
            setDst(data.dst[0])
            setTe(data.te[0])
            setFlex(data.flex[0])
        })
    }

    const setLineupData = (player) => {     
        setProjection(projection + player.Projection)
        setLineupPlayers(lineupPlayers => [...lineupPlayers, player])
        let s = salary - player.Salary
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
        if (player === flex) {
          setFlex()
        }  
        else if (player.Position === "QB") {
          setQb()
        }
        else if (player.Position === "RB") {
          let z = rbs.filter(f => f !== player)
          setRbs(z)
        }
        else if (player.Position === "WR") {
          let z = wrs.filter(f => f !== player)
          setWrs(z)
        }
        else if (player.Position === "TE") {
          setTe()
        }
        else if (player.Position ==="DST" ) {
          setDst()
        }
    }

    const removeLineupData = (player) => {
        setProjection(projection - player.Projection)
        let s = salary + player.Salary
        setSalaryPerPlayer(parseInt(s/(playerCount + 1)))
        setSalary(s)
        setPlayerCount(playerCount + 1)
        let x = lineupPlayers.filter(f => f.DraftTableId !== player.DraftTableId)
        setLineupPlayers(x)
    }

    const sortPos = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.Position < item1.Position ? -1 : 1)])
    }

    const sortProjection = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.Projection < item1.Projection ? -1 : 1)])
    }

    const sortFFPG = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.FFPG < item1.FFPG ? -1 : 1)])
    }

    const sortMoney = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.Salary < item1.Salary ? -1 : 1)])
    }

    const sortName = () => {
        setPlayers([...players.slice().sort((item1, item2) => item2.Name < item1.Name ? 1 : -1)])
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
            <Grid divider vert style={{marginTop:"2%"}}>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Modal
                        style={{width:"300px"}}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        trigger={<Button style={{marginRight:"57%", backgroundColor:"#61dafb"}}>OPTIMIZE</Button>}
                        >
                            <ModalContent style={{textAlign:"center"}}>
                                <p style={{fontSize:"15px", fontWeight:"bold"}}>Keep selected players in lineup?</p>
                                <ModalActions>
                                    <Button basic color='green' onClick={optimizeWith}>
                                        <Icon name='checkmark' /> Yes
                                    </Button>
                                    <Button basic color='red' onClick={optimizeWithout}>
                                        <Icon name='remove' /> No
                                    </Button>
                                </ModalActions>
                            </ModalContent>
                        </Modal>
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
                    </Grid.Column>
                    <Grid.Column>
                        <Label.Group style={{height:"46px",cursor:"pointer", marginLeft:"24%", marginBottom:"-2.3%"}}>
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