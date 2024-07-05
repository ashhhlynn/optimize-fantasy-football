import React, { useState, useEffect } from 'react';
import { Button, Grid, Label, Icon, Modal, ModalContent, ModalActions, Loader } from 'semantic-ui-react';
import ClassicQueue from './ClassicQueue.js';
import ClassicLineupHeader from './ClassicLineupHeader.js';
import ClassicLineup from './ClassicLineup.js';

function ClassicHome() {
    const [queue, setQueue] = useState({
        qall: [],
        qqb: [],
        qrb: [],
        qwr: [],
        qte: [],
        qdst: [],
        qflex: [],
    });
    const [players, setPlayers] = useState([]); 
    const [lineupNumbers, setLineupNumbers] = useState({
        salary: 50000,
        salaryPerPlayer: 5555,
        playerCount: 9,
        projection: 0,
    });
    const [qb, setQb] = useState();
    const [rbs, setRbs] = useState([]);
    const [wrs, setWrs] = useState([]);
    const [te, setTe] = useState();
    const [dst, setDst] = useState();
    const [flex, setFlex] = useState([]);
    const [lineupPlayers, setLineupPlayers] = useState([]);
    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const url = "https://optimize-daily.onrender.com";

    useEffect(() => {
        fetchPlayerQueue()
    },[]);

    const fetchPlayerQueue = () => {
        fetch(`${url}/classicplayers`)
        .then((res)=> res.json())
        .then(data => {
            setQueue(data)
            setPlayers(data.qall)
        })
    };

    const filterQueue = (event) => setPlayers(queue[event.target.id]); 

    const sortFFPG = (event) => {
        event.preventDefault()
        setPlayers([...players.slice().sort((item1, item2) => item2.draftStatAttributes[0].value - item1.draftStatAttributes[0].value)])
    };

    const sortName = (event) => {
        event.preventDefault()
        setPlayers([...players.slice().sort((item1, item2) => item2.displayName < item1.displayName ? 1 : -1)])
    };

    const sortPlayers = (event) => {
        event.preventDefault()
        setPlayers([...players.slice().sort((item1, item2) => item2[`${event.target.id}`] < item1[`${event.target.id}`] ? -1 : 1)])
    };

    const setPlayer = (player) => {
        if (!lineupPlayers.find(p => p.playerId === player.playerId)) { 
            if (player.position === "RB" && rbs.length < 2) {
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
            else if (flex.length < 1 && (player.position === "RB" || player.position === "WR"  || player.position === "TE")) {
                setFlex([player])
                setLineupData(player)
            }
            else if (player.position === "QB" && !qb ) {
                setLineupData(player)
                setQb(player)
            }
            else if (player.position === "DST" && !dst) {
                setDst(player)
                setLineupData(player)
            }
        }
    };

    const setLineupData = (player) => {   
        setLineupPlayers(lineupPlayers => [...lineupPlayers, player])  
        let salPer = lineupNumbers.playerCount === 1 ? 0 : parseInt((lineupNumbers.salary - player.salary)/(lineupNumbers.playerCount - 1))
        setLineupNumbers({
            projection: lineupNumbers.projection + player.Projection,
            salary: lineupNumbers.salary - player.salary,
            playerCount: lineupNumbers.playerCount - 1,
            salaryPerPlayer: salPer
        })
    };

    const removePlayer = (player) => {
        removeLineupData(player)
        if (player === flex[0]) { setFlex([]) }  
        else if (player.position === "QB") { setQb() }
        else if (player.position === "RB") {
            let z = rbs.filter(f => f !== player)
            setRbs(z)
        }
        else if (player.position === "WR") {
            let z = wrs.filter(f => f !== player)
            setWrs(z)
        }
        else if (player.position === "TE") { setTe() }
        else if (player.position ==="DST" ) { setDst() }
    };

    const removeLineupData = (player) => {
        let x = lineupPlayers.filter(f => f.playerId !== player.playerId)
        setLineupPlayers(x)
        setLineupNumbers({
            projection: lineupNumbers.projection - player.Projection,
            salaryPerPlayer: parseInt((lineupNumbers.salary + player.salary)/(lineupNumbers.playerCount + 1)),
            salary: lineupNumbers.salary + player.salary,
            playerCount: lineupNumbers.playerCount + 1
        })
    };
   
    const optimizeWith = () => {
        setOpen(false)
        if (flex.length > 0 || lineupPlayers.length > 0) {
            let lp = flex.length > 0 ? lineupPlayers.filter(p => p.playerId !== flex[0].playerId) : lineupPlayers
            let fl = flex 
            setLoading(true)
            fetch(`${url}/classicoptimize`, {
                method: "POST",
                body: JSON.stringify({ lp, fl }),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
            .then(response => response.json())
            .then(data => {
                setOptimizedLineup(data)
            })
        }
        else { optimizeWithout() }
    };

    const optimizeWithout = () => {
        setOpen(false)
        setLoading(true)
        fetch(`${url}/classicoptimizer`)
        .then((res)=> res.json())
        .then(data => {
            setOptimizedLineup(data)
        })
    };

    const setOptimizedLineup = (data) => {
        setQb(data.qb[0])
        setRbs(data.rb)
        setWrs(data.wr)
        setDst(data.dst[0])
        setTe(data.te[0])
        setFlex(data.flex)
        setLineupNumbers({
            salary: 50000-data.usedSal,
            projection: data.result,
            salaryPerPlayer: 0,
            playerCount: 0
        })
        setLineupPlayers(data.lineup)
        setLoading(false)
    };

    return (
        <Grid divider vert style={{ marginTop:".5%" }}>
            <Grid.Row columns={2}>
                <Grid.Column> 
                    {isLoading ? <Loader active /> : <Loader />}
                    <ClassicLineupHeader lineupNumbers={lineupNumbers} />
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
                        style={{ width:"305px" }}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        open={open}
                        trigger={
                            <div className="optimizeLabel">
                                <Label className="optimizeLabel" size="big">OPTIMIZE</Label>
                            </div>
                        }
                    >
                        <ModalContent style={{ textAlign:"center" }}>
                            <p style={{
                                fontFamily:"Helvetica", 
                                fontSize:"15px", 
                                fontWeight:"bold"
                            }}>
                                Include selected players?
                            </p>
                            <ModalActions>
                                <Button 
                                    basic 
                                    color="teal" 
                                    onClick={optimizeWith}
                                    style={{
                                        marginLeft:"1.5%", 
                                        width:"110px"
                                    }} 
                                >
                                    <Icon name='checkmark' /> Yes
                                </Button>
                                <Button 
                                    basic 
                                    color='grey' 
                                    onClick={optimizeWithout}
                                    style={{ width:"110px" }} 
                                >
                                    <Icon name='remove' /> No
                                </Button>
                            </ModalActions>
                        </ModalContent>
                    </Modal>
                </Grid.Column>
                <Grid.Column>
                    <Label.Group className='posLabel' >
                        <Label onClick={filterQueue} id='qqb'>QB</Label>
                        <Label onClick={filterQueue} id='qrb'>RB</Label>
                        <Label onClick={filterQueue} id='qwr'>WR</Label>
                        <Label onClick={filterQueue} id='qte'>TE</Label>
                        <Label onClick={filterQueue} id='qdst'>DST</Label>
                        <Label onClick={filterQueue} id='qflex'>FLEX</Label>
                        <Label onClick={filterQueue} id='qall'>ALL</Label>
                    </Label.Group>
                    <ClassicQueue 
                        sortName={sortName}
                        sortFFPG={sortFFPG}
                        sortPlayers={sortPlayers}
                        players={players}
                        setPlayer={setPlayer}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default ClassicHome;