import React from 'react';
import { Table, Icon } from 'semantic-ui-react';

function ClassicQueue({sortFFPG, sortPlayers, sortName, players, setPlayer }) {
    const playercells = players.map(player => 
        <Table.Row>
            <Table.Cell style={{ textAlign:"center" }}>{player.position}</Table.Cell>
            <Table.Cell>
                {player.displayName} 
                {player.status === "None" ? <></> : player.status === "IR" ? 
                    <span style={{ color:"#61dafb", fontWeight:"700" }}> {player.status.substr(0,2)}
                    </span>
                    : 
                    <span style={{ color:"#61dafb", fontWeight:"700" }}> {player.Status.substr(0,1)}
                    </span>
                }
                <br/>
                <span style={{ fontSize:"11px", letterSpacing:".4px" }}>{player.competition['name']}</span>
            </Table.Cell>
            <Table.Cell>{player.teamAbbreviation}</Table.Cell>
            <Table.Cell>{player.draftStatAttributes[0].value}</Table.Cell>
            <Table.Cell>{player.Projection}</Table.Cell>
            <Table.Cell>${player.salary}</Table.Cell>
            <Table.Cell style={{ textAlign:"center" }}>
                <Icon 
                    onClick={() => setPlayer(player)} 
                    size="large" 
                    name="plus circle" 
                />
            </Table.Cell> 
        </Table.Row>
    );
    
    return (
        <div className="dfsClassic">
            <Table className='classicQueue' sortable fixed>
                <Table.Header>
                    <Table.Row className='classicQueueHeader'>
                        <Table.HeaderCell style={{ width:"36px" }} id='position' onClick={sortPlayers}>POS.</Table.HeaderCell>
                        <Table.HeaderCell style={{ width:"100px" }} onClick={sortName}>PLAYER</Table.HeaderCell>                    
                        <Table.HeaderCell style={{ width:"40px" }} id='teamAbbreviation' onClick={sortPlayers}>TEAM</Table.HeaderCell>                    
                        <Table.HeaderCell style={{ width:"42px" }} onClick={sortFFPG}>FFPG</Table.HeaderCell>
                        <Table.HeaderCell style={{ width:"44px" }} id='Projection' onClick={sortPlayers}>PROJ.</Table.HeaderCell>
                        <Table.HeaderCell style={{ width:"50px" }} id='salary' onClick={sortPlayers}>SALARY</Table.HeaderCell>
                        <Table.HeaderCell style={{ width:"36px" }}></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body className='classicQueueBody'>
                    {playercells}
                </Table.Body>
            </Table>
        </div>
    );
};

export default ClassicQueue;