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
            <Table.Cell style={{textAlign:"center",borderBottom:".05px", borderColor:"#fafafa"}}>{player.Position}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",borderColor:"#fafafa"}}>{player.Name} {player.Injury}<br></br><span style={{fontSize:"11px", letterSpacing:".4px"}}>{player.Game}</span></Table.Cell>
            <Table.Cell style={{borderBottom:".05px",borderColor:"#fafafa"}}>{player.Team}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",borderColor:"#fafafa"}}>{player.FFPG}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",  borderColor:"#fafafa"}}>{player.Projection}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",  borderColor:"#fafafa"}}>${player.Salary}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",  borderColor:"#fafafa"}}>
                <center>
                    <Icon onClick={(event) => setPlayer(event, player)} style={{cursor:"pointer"}}  size="large" name="plus circle" />
                </center>
            </Table.Cell> 
        </Table.Row>
    )
    
    return (
        <div className="dfsClassic" style={{marginLeft:"3%"}}>
            <Table style={{width:"528px", color:"#fafafa"}} sortable fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{border:"none", fontSize:"12px", letterSpacing: ".5px", backgroundColor:"#2e323c", color:"white", width:"36px", textAlign:"center", fontWeight:"normal"}}onClick={(e) => sortPos(e)}>POS.</Table.HeaderCell>
                        <Table.HeaderCell style={{border:"none", fontSize:"12px", letterSpacing: ".5px", backgroundColor:"#2e323c", color:"white", width:"100px", fontWeight:"normal"}}onClick={(e) => sortName(e)}>PLAYER</Table.HeaderCell>                    
                        <Table.HeaderCell style={{border:"none", fontSize:"12px", letterSpacing: ".5px", backgroundColor:"#2e323c", color:"white", width:"40px", fontWeight:"normal"}}onClick={(e) => sortName(e)}>TEAM</Table.HeaderCell>                    
                        <Table.HeaderCell style={{border:"none", fontSize:"12px", letterSpacing: ".5px", backgroundColor:"#2e323c", color:"white", width:"42px", fontWeight:"normal"}}onClick={(e) => sortFFPG(e)}>FFPG</Table.HeaderCell>
                        <Table.HeaderCell style={{border:"none", fontSize:"12px", letterSpacing: ".5px", backgroundColor:"#2e323c", color:"white", width:"44px", fontWeight:"normal"}}onClick={(e) => sortProjection(e)}>PROJ.</Table.HeaderCell>
                        <Table.HeaderCell style={{border:"none", fontSize:"12px", letterSpacing: ".5px", backgroundColor:"#2e323c", color:"white", width:"50px",  fontWeight:"normal"}}onClick={(e) => sortMoney(e)}>SALARY</Table.HeaderCell>
                        <Table.HeaderCell style={{border:"none", fontWeight:"normal", fontSize:"12px",   backgroundColor:"#2e323c", color:"white", width:"36px"}}></Table.HeaderCell>
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