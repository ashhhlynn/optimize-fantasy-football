import React from 'react';
import { Table, Icon } from 'semantic-ui-react';

function CaptainQueue({ sortPlayers, sortNames, players, setCrownPlayer, setFlexPlayer }) {
    const playercells = players.map(player => 
        <Table.Row>
            <Table.Cell style={{textAlign:"center"}}>{player.Position}</Table.Cell>
            <Table.Cell>
                {player.Name} 
                {player.Status === "None" ? <></> : player.Status === "IR" ? 
                    <span style={{color:"#61dafb", fontWeight:"700"}}> {player.Status.substr(0,2)}
                    </span>
                : 
                    <span style={{color:"#61dafb", fontWeight:"700"}}> {player.Status.substr(0,1)}
                    </span>
                }
                <br/>
                <span style={{
                    fontSize:"11px", 
                    letterSpacing:".4px"}}
                >
                    {player.Team}
                </span>
            </Table.Cell>         
            <Table.Cell>{player.FFPG}</Table.Cell>
            <Table.Cell>{player.Projection}</Table.Cell>
            <Table.Cell>${player.Salary}</Table.Cell>
            <Table.Cell style={{textAlign:"center"}}>
                <Icon onClick={() => setFlexPlayer(player)} name="plus circle" />
                <Icon onClick={() => setCrownPlayer(player)} name="chess queen" />
            </Table.Cell>
        </Table.Row>
    );
    
    return (
        <div className="dfs" style={{marginLeft:"4.7%"}}>
            <Table 
                className='showdownQueue' 
                striped 
                sortable 
                fixed
            >
                <Table.Header>
                    <Table.Row className='classicQueueHeader'>
                        <Table.HeaderCell style={{width:"40px"}} id='Position' onClick={sortNames}>POS.</Table.HeaderCell>
                        <Table.HeaderCell style={{width:"130px"}} id='Name' onClick={sortNames}>PLAYER</Table.HeaderCell>                    
                        <Table.HeaderCell style={{width:"46px"}} id='FFPG' onClick={sortPlayers}>FFPG</Table.HeaderCell>
                        <Table.HeaderCell style={{width:"48px"}} id='Projection' onClick={sortPlayers}>PROJ.</Table.HeaderCell>
                        <Table.HeaderCell style={{width:"62px"}} id='Salary' onClick={sortPlayers}>SALARY</Table.HeaderCell>
                        <Table.HeaderCell style={{width:"60px"}}></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body className='classicQueueBody'>
                    {playercells}
                </Table.Body>
            </Table>
        </div>
    );
};

export default CaptainQueue;