import React, { useState, useEffect } from 'react'
import { Button, Grid, Label, Icon, Modal, ModalContent, ModalActions, Loader } from 'semantic-ui-react'
import CaptainLineupHeader from './CaptainLineupHeader.js'
import CaptainLineup from './CaptainLineup.js'
import CaptainQueue from './CaptainQueue.js'
import { Link } from 'react-router-dom'

function MondayCaptainHome(props) {

    const [players, setPlayers] = useState([])
    const [salary, setSalary] = useState(50000)
    const [salaryPerPlayer, setSalaryPerPlayer] = useState(8333)
    const [projection, setProjection] = useState(0)
    const [playerCount, setPlayerCount] = useState(6)
    const [crown, setCrown] = useState([])
    const [flexPlayers, setFlexPlayers] = useState([])
    const [open, setOpen] = useState(false)
    const [isLoading, setLoading] = useState(false);

    const url = "https://optimize-daily.onrender.com"

    useEffect(() => {
        fetchPlayerQueue()
      },[])

    const fetchPlayerQueue = () => {
        fetch(`${url}/moncaptainplayers`)
        .then((res)=> res.json())
        .then(data => {
            setPlayers(data.flexes)   
        })
    }

    const optimizeWithout = () => {
        setOpen(false)
        let fp = []
        let cp = []
        optimizePlayers(fp, cp)
    }

    const optimizeWith = () => {
        setOpen(false)
        let fp = flexPlayers
        let cp = crown
        optimizePlayers(fp, cp)
    }

    const optimizePlayers = (fp, cp) => {
        setLoading(true)
        fetch(`${url}/optimizedcaptainmon`, {
            method: "POST",
            body: JSON.stringify({
                fp, cp
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then(response => response.json())
        .then(data => {
            let ssum = data.crown[0].Salary * 1.5
            let psum = data.crown[0].Projection * 1.5
            setCrown(data.crown)
            setFlexPlayers(data.fps)
            data.fps.forEach(value => {
                ssum += value.Salary;
                psum += value.Projection;
            });  
            setSalary(50000 - ssum)
            setProjection(psum)      
            setSalaryPerPlayer(0)
            setPlayerCount(0)
            setLoading(false)
        })
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

    const setCrownPlayer = (player) => {
        if (crown.length === 0 && !flexPlayers.find(p => p.DraftTableId === player.DraftTableId)) {
            let s = salary - player.Salary * 1.5
            if (playerCount === 1) {
                setSalaryPerPlayer(0)
            }
            else {
                setSalaryPerPlayer(parseInt(s/(playerCount - 1)))
            }
            setSalary(s)
            setPlayerCount(playerCount - 1)
            setProjection(projection + player.Projection * 1.5)
            setCrown([player])
        }
    }

    const setFlexPlayer = (player) => {
        if (flexPlayers.length < 5 && !flexPlayers.find(p => p.DraftTableId === player.DraftTableId) && crown.DraftTableId !== player.DraftTableId) {
            let s = salary - player.Salary
            if (playerCount === 1) {
                setSalaryPerPlayer(0)
            }
            else {
                setSalaryPerPlayer(parseInt(s/(playerCount - 1)))
            }
            setSalary(s)
            setPlayerCount(playerCount - 1)
            setProjection(projection + player.Projection)
            setFlexPlayers(flexPlayers => [...flexPlayers, player])
        }
    }

    const removeCrownPlayer = (player) => {
        let s = salary + player.Salary * 1.5
        setSalaryPerPlayer(parseInt(s/(playerCount + 1)))
        setSalary(s)
        setPlayerCount(playerCount + 1)
        setProjection(projection - player.Projection * 1.5)
        setCrown([])
    }

    const removeFlexPlayer = (player) => {
        let s = salary + player.Salary
        setSalaryPerPlayer(parseInt(s/(playerCount + 1)))
        setSalary(s)
        setPlayerCount(playerCount + 1)
        setProjection(projection - player.Projection)
        let x = flexPlayers.filter(f => f !== player)
        setFlexPlayers(x)
    }

    return (
        <div>
            <div class="contestButtons">
                <Button circular color="white" basic as={Link} to="/showdown1" inverted style={{marginRight:"5%", backgroundColor:"inherit"}}>
                    <span style={{fontWeight:"normal", fontSize:"12.5px",color:"white"}}>{props.sdDow1} {props.sdDate1}<br></br><b>{props.sdTeams1}</b></span>
                </Button>
                <Button circular color="white" as={Link} basic to="/showdown2" inverted style={{marginRight:"3%", backgroundColor:"inherit"}}>
                    <span style={{fontSize:"12.5px",color:"white"}}>{props.sdDow2} {props.sdDate2}<br></br><b>{props.sdTeams2}</b></span>
                </Button>
            </div>
            <Grid divider vert style={{marginTop:"2%"}}>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        {isLoading ? 
                            <Loader active /> : <Loader />
                        }
                        <CaptainLineupHeader
                            salary={salary}
                            salaryPerPlayer={salaryPerPlayer}
                            projection={projection}
                        />
                        <CaptainLineup 
                            flexPlayers={flexPlayers}
                            crown={crown}
                            removeFlexPlayer={removeFlexPlayer}
                            removeCrownPlayer={removeCrownPlayer}
                        />
                        <Modal
                        style={{width:"305px"}}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        trigger={<Button style={{width: "230px", marginLeft:"6%", marginBottom:"1.75%",color:"#181a1f", backgroundColor:"#61dafb"}}>OPTIMIZE LINEUP</Button>}
                        >
                            <ModalContent style={{textAlign:"center"}}>
                                <p style={{fontFamily:"Helvetica", fontSize:"15px", fontWeight:"bold"}}>Include selected players?</p>
                                <ModalActions>
                                    <Button basic color="teal"  style={{marginLeft:"1.5%", width:"110px"}} onClick={optimizeWith}>
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
                        <Label style={{fontSize:"11.5px", marginBottom:".2%",backgroundColor:"#61dafb", marginLeft:"46%"}}>
                            <Icon name="chess queen" color="black"/>x1.5 Projection & Salary
                        </Label>
                        <CaptainQueue 
                            setCrownPlayer={setCrownPlayer}
                            setFlexPlayer={setFlexPlayer}
                            sortMoney={sortMoney}
                            sortPos={sortPos}
                            sortProjection={sortProjection}
                            sortName={sortName}
                            sortFFPG={sortFFPG}
                            players={players}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}

export default MondayCaptainHome