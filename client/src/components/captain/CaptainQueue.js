import React from 'react';
import { Table, Icon } from 'semantic-ui-react';

function CaptainQueue({ sortPos, sortProjection, sortFFPG, sortMoney, sortName, players, setCrownPlayer, setFlexPlayer }) {

    const playercells = players.map(player => 
        <Table.Row>
            <Table.Cell style={{textAlign:"center"}}>{player.Position}</Table.Cell>
            <Table.Cell>
                {player.Name} 
                {player.Status === "None" ? <></> : player.Status === "IR" ? 
                    <span style={{color:"#61dafb", fontWeight:"700"}}> {player.Status.substr(0,2)}</span> 
                : 
                    <span style={{color:"#61dafb", fontWeight:"700"}}> {player.Status.substr(0,1)}</span>
                }
                <br/><span style={{fontSize:"11px", letterSpacing:".4px"}}>{player.Team}</span>
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
            <Table className='showdownQueue' striped sortable fixed>
                <Table.Header>
                    <Table.Row className='classicQueueHeader'>
                        <Table.HeaderCell style={{width:"40px"}} onClick={sortPos}>POS.</Table.HeaderCell>
                        <Table.HeaderCell style={{width:"130px"}} onClick={sortName}>PLAYER</Table.HeaderCell>                    
                        <Table.HeaderCell style={{width:"46px"}} onClick={sortFFPG}>FFPG</Table.HeaderCell>
                        <Table.HeaderCell style={{width:"48px"}} onClick={sortProjection}>PROJ.</Table.HeaderCell>
                        <Table.HeaderCell style={{width:"62px"}} onClick={sortMoney}>SALARY</Table.HeaderCell>
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