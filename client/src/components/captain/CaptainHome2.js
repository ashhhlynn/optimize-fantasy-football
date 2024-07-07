import React, { useState, useEffect } from 'react';
import { Button, Grid, Label, Icon, Modal, ModalContent, ModalActions, Loader } from 'semantic-ui-react';
import CaptainLineupHeader from './CaptainLineupHeader.js';
import CaptainLineup from './CaptainLineup.js';
import CaptainQueue from './CaptainQueue.js';
import ContestButtons from './ContestButtons.js';

function CaptainHome2({ sdTeams1, sdDate1, sdTeams2, sdDate2 }) {
    const [players, setPlayers] = useState([]);
    const [crown, setCrown] = useState([]);
    const [flexPlayers, setFlexPlayers] = useState([]);
    const [lineupNumbers, setLineupNumbers] = useState({
        salary: 50000,
        salaryPerPlayer: 8333,
        playerCount: 6,
        projection: 0,
    });
    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const url = "https://optimize-daily.onrender.com";
    
    useEffect(() => {
        fetch(`${url}/captainplayers2`)
        .then((res)=> res.json())
        .then(data => {
            setPlayers(data.flexes)   
        })
    },[]);

    const sortPlayers = (event) => {
        event.preventDefault();   
        setPlayers([...players.slice().sort((a, b) => b[`${event.target.id}`] - a[`${event.target.id}`])]);
    };

    const sortNames = (event) => {
        event.preventDefault();
        setPlayers([...players.slice().sort((a, b) => b[`${event.target.id}`] < a[`${event.target.id}`] ? 1 : -1)]);
    };

    const setCrownPlayer = (player) => {
        if (crown.length === 0 && !flexPlayers.find(p => p.DraftTableId === player.DraftTableId)) {            
            setCrown([player]);
            let salPer = lineupNumbers.playerCount === 1 ? 0 : parseInt((lineupNumbers.salary - player.Salary * 1.5)/(lineupNumbers.playerCount - 1))
            setLineupNumbers({
                salary:  lineupNumbers.salary - player.Salary * 1.5,
                salaryPerPlayer: salPer,
                playerCount: lineupNumbers.playerCount - 1,
                projection: lineupNumbers.projection + player.Projection * 1.5
            });
        }
    };

    const setFlexPlayer = (player) => {
        if (flexPlayers.length < 5 && !flexPlayers.find(p => p.DraftTableId === player.DraftTableId) && !crown.find(p => p.DraftTableId === player.DraftTableId)) {
            setFlexPlayers(flexPlayers => [...flexPlayers, player]);
            let salPer = lineupNumbers.playerCount === 1 ? 0 : parseInt((lineupNumbers.salary - player.Salary)/(lineupNumbers.playerCount - 1))            
            setLineupNumbers({
                salary:  lineupNumbers.salary - player.Salary,
                salaryPerPlayer: salPer,
                playerCount: lineupNumbers.playerCount - 1,
                projection: lineupNumbers.projection + player.Projection 
            });
        }
    };

    const removeCrownPlayer = (player) => {
        setCrown([]);
        setLineupNumbers({
            salaryPerPlayer: parseInt((lineupNumbers.salary + player.Salary * 1.5)/(lineupNumbers.playerCount + 1)),
            playerCount: lineupNumbers.playerCount + 1,
            projection: lineupNumbers.projection - player.Projection * 1.5, 
            salary:  lineupNumbers.salary + player.Salary * 1.5
        });
    };

    const removeFlexPlayer = (player) => {
        let z = flexPlayers.filter(p => p !== player);
        setFlexPlayers(z);
        setLineupNumbers({
            salaryPerPlayer: parseInt((lineupNumbers.salary + player.Salary)/(lineupNumbers.playerCount + 1)),
            playerCount: lineupNumbers.playerCount + 1,
            projection: lineupNumbers.projection - player.Projection, 
            salary:  lineupNumbers.salary + player.Salary
        });
    };

    const optimizePlayers = (fp, cp) => {
        setOpen(false);
        setLoading(true);
        fetch(`${url}/optimizedcaptain2`, {
            method: "POST",
            body: JSON.stringify({fp, cp}),
            headers: {"Content-type": "application/json; charset=UTF-8"},
        })
        .then(response => response.json())
        .then(data => {
            setCrown(data.crown);
            setFlexPlayers(data.fps);
            setLineupNumbers({
                salary: data.sSum,
                projection: data.pSum,
                salaryPerPlayer: 0,
                playerCount: 0
            });
            setLoading(false);
        });
    };

    return (
        <div>
            <ContestButtons 
                sdTeams1={sdTeams1} 
                sdDate1={sdDate1} 
                sdDate2={sdDate2} 
                sdTeams2={sdTeams2}
            />
            <Grid divider vert style={{ marginTop:"2%" }}>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        {isLoading ? <Loader active /> : <Loader />}
                        <CaptainLineupHeader lineupNumbers={lineupNumbers} />
                        <CaptainLineup 
                            flexPlayers={flexPlayers}
                            crown={crown}
                            removeFlexPlayer={removeFlexPlayer}
                            removeCrownPlayer={removeCrownPlayer}
                        />
                        <Modal
                            style={{ width:"305px" }}
                            onClose={() => setOpen(false)}
                            onOpen={() => setOpen(true)}
                            open={open}
                            trigger={
                                <div className="optimizeLabel">
                                    <Label size="big">OPTIMIZE</Label>
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
                                        style={{
                                            marginLeft:"1.5%", 
                                            width:"110px"
                                        }} 
                                        onClick={()=>optimizePlayers(flexPlayers, crown)}
                                    >
                                        <Icon name='checkmark' /> Yes
                                    </Button>
                                    <Button 
                                        basic 
                                        color='grey' 
                                        style={{ width:"110px" }} 
                                        onClick={()=>optimizePlayers([],[])}
                                    >
                                        <Icon name='remove' /> No
                                    </Button>
                                </ModalActions>
                            </ModalContent>
                        </Modal>
                    </Grid.Column>
                    <Grid.Column>
                        <Label className='showdownLabel' style={{ marginLeft:"46%" }}>
                            <Icon name="chess queen" color="black" />x1.5 Projection & Salary
                        </Label>
                        <CaptainQueue 
                            sortPlayers={sortPlayers}
                            sortNames={sortNames}
                            setCrownPlayer={setCrownPlayer}
                            setFlexPlayer={setFlexPlayer}
                            sortProjection={sortPlayers}
                            players={players}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export default CaptainHome2;