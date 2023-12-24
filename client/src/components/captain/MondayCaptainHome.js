import React, { useState, useEffect } from 'react'
import { Button, Grid, Label, Icon } from 'semantic-ui-react'
import CaptainLineupHeader from './CaptainLineupHeader.js'
import CaptainLineup from './CaptainLineup.js'
import CaptainQueue from './CaptainQueue.js'

function MondayCaptainHome() {

    const [players, setPlayers] = useState([])
    const [salary, setSalary] = useState(50000)
    const [salaryPerPlayer, setSalaryPerPlayer] = useState(8333)
    const [projection, setProjection] = useState(0)
    const [playerCount, setPlayerCount] = useState(6)
    const [crown, setCrown] = useState([])
    const [flexPlayers, setFlexPlayers] = useState([])
   
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

    const fetchOptimized = () => {
        fetch(`${url}/optimizedcaptainmon`)
        .then((res) => res.json())
        .then((data) => { 
            let ssum = data.crown.Salary * 1.5
            let psum = data.crown.Projection * 1.5
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
            setCrown(player)
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
            <Grid divider vert style={{marginTop:"2%"}}>
                <Grid.Row columns={2}>
                    <Grid.Column>
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
                        <Button circular onClick={fetchOptimized} size="big" style={{marginLeft:"5%", backgroundColor:"#61dafb"}}>
                            Optimize
                        </Button>
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