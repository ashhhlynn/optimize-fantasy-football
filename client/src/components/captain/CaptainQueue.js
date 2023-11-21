import React from 'react'
import { Table, Icon } from 'semantic-ui-react'

function CaptainQueue(props) {

    const sortPos = (e) => {
        e.preventDefault()
        props.sortPos()    
    }
    
    const sortProjection = (e) => {
        e.preventDefault()
        props.sortProjection()
    }

    const sortFFPG = (e) => {
        e.preventDefault()
        props.sortFFPG()
    }
    
    const sortMoney = (e) => {
        e.preventDefault()
        props.sortMoney()
    }
    
    const sortName = (e) => {
        e.preventDefault()
        props.sortName()
    }

    const setCrownPlayer = (e, player) => {
        e.preventDefault()
        props.setCrownPlayer(player)
    }
      
    const setFlexPlayer = (e, player) => {
        e.preventDefault()
        props.setFlexPlayer(player)
    }
      
    const playercells = props.players.map(player => 
        <Table.Row >
            <Table.Cell style={{textAlign:"center"}}>{player.Position}</Table.Cell>
            <Table.Cell>
                <b>{player.Name}</b> {player.Team}<br></br>{player.Game}
            </Table.Cell>         
            <Table.Cell>
                {player.FFPG}
            </Table.Cell>
            <Table.Cell>
                {player.Projection}
            </Table.Cell>
            <Table.Cell>
                ${player.Salary}
            </Table.Cell>
            <Table.Cell>
                <center>
                    <Icon onClick={(event) => setFlexPlayer(event, player)} style={{cursor:"pointer"}} name="user plus"/>
                    <Icon onClick={(event) => setCrownPlayer(event, player)} style={{cursor:"pointer"}}  name="chess queen" />
                </center>
            </Table.Cell>
        </Table.Row>
    )
    
    return (
        <div className="dfs" style={{marginLeft:"4%"}}>
            <Table style={{width:"504px", marginTop:"0%", backgroundColor:"#2a2f37", borderColor:"white", color:"white",}}sortable fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{ color:"white", border:"none", backgroundColor:"#333842",  width:"40px", textAlign:"center"}}onClick={(e) => sortPos(e)}>POS</Table.HeaderCell>
                        <Table.HeaderCell style={{color:"white", backgroundColor:"#333842",  border:"none", width:"126px"}}onClick={(e) => sortName(e)}>PLAYER</Table.HeaderCell>                    
                        <Table.HeaderCell style={{color:"white", backgroundColor:"#333842", border:"none", width:"46px"}}onClick={(e) => sortFFPG(e)}>FFPG</Table.HeaderCell>
                        <Table.HeaderCell style={{color:"white", backgroundColor:"#333842",  border:"none", width:"48px"}}onClick={(e) => sortProjection(e)}>PROJ</Table.HeaderCell>
                        <Table.HeaderCell style={{color:"white", backgroundColor:"#333842",  border:"none", width:"62px"}}onClick={(e) => sortMoney(e)}>SALARY</Table.HeaderCell>
                        <Table.HeaderCell style={{color:"white", backgroundColor:"#333842", border:"none", width:"60px"}}><center><Icon name="add"/></center></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {playercells}
                </Table.Body>
            </Table>
        </div>
    )
}

export default CaptainQueue