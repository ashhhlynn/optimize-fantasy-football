import React from 'react'
import { Table, Icon } from 'semantic-ui-react'

function ClassicQueue(props) {

    const sortPos = (e) => {
        e.preventDefault()
        props.sortPos()    
    }
    
    const sortProjection = (e) => {
        e.preventDefault()
        props.sortProjection()
    }

    const sortFFPG= (e) => {
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

    const setPlayer = (e, player) => {
        e.preventDefault()
        props.setPlayer(player)
    }
      
    const playercells = props.players.map (player => 
        <Table.Row>
            <Table.Cell style={{borderBottom:".2px", borderColor:"grey",textAlign:"center"}}>{player.Position}</Table.Cell>
            <Table.Cell style={{borderBottom:".2px", borderColor:"grey"}}><b>{player.Name}</b> {player.Team}<br></br>{player.Game}</Table.Cell>
            <Table.Cell style={{borderBottom:".2px", borderColor:"grey"}}>{player.FFPG}</Table.Cell>
            <Table.Cell style={{borderBottom:".2px", borderColor:"grey"}}>{player.Projection}</Table.Cell>
            <Table.Cell style={{borderBottom:".2px", borderColor:"grey"}}>${player.Salary}</Table.Cell>
            <Table.Cell style={{borderBottom:".2px", borderColor:"grey"}}>
                <center>
                    <Icon onClick={(event) => setPlayer(event, player)} style={{cursor:"pointer"}}  size="large" name="plus circle" />
                </center>
            </Table.Cell> 
        </Table.Row>
    )
    
    return (
        <div className="dfsClassic" style={{marginLeft:"5.3%"}}>
            <Table style={{width:"504px", marginTop:"0%", borderColor:"white", color:"white"}} sortable fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: "1px", border:"none", backgroundColor:"#2e333c", color:"white", width:"38px", textAlign:"center"}}onClick={(e) => sortPos(e)}>POS</Table.HeaderCell>
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: "1px", border:"none", backgroundColor:"#2e333c", color:"white", width:"134px"}}onClick={(e) => sortName(e)}>PLAYER</Table.HeaderCell>                    
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: "1px", border:"none", backgroundColor:"#2e333c", color:"white", width:"44px"}}onClick={(e) => sortFFPG(e)}>FFPG</Table.HeaderCell>
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: "1px", border:"none", backgroundColor:"#2e333c", color:"white", width:"46px"}}onClick={(e) => sortProjection(e)}>PROJ</Table.HeaderCell>
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: "1px", border:"none", backgroundColor:"#2e333c", color:"white", width:"60px"}}onClick={(e) => sortMoney(e)}>SALARY</Table.HeaderCell>
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: "1px",  border:"none", backgroundColor:"#2e333c", color:"white", width:"42px"}}></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {playercells}
                </Table.Body>
            </Table>
        </div>
    )
}

export default ClassicQueue