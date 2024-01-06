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
            <Table.Cell style={{textAlign:"center", borderBottom:".05px",borderColor:"#fafafa"}}>{player.Position}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",borderColor:"#fafafa"}}>{player.Name} 
            {player.Status === "None" ?
                <></>
            : 
            player.Status === "IR" ? 
                <><span style={{color:"#61dafb", fontWeight:"700"}}> {player.Status.substr(0,2)}</span></> 
            : 
                <><span style={{color:"#61dafb", fontWeight:"700"}}> {player.Status.substr(0,1)}</span></> 
            }
            <br></br><span style={{fontSize:"11px", letterSpacing:".4px"}}>{player.Team}</span></Table.Cell>         
            <Table.Cell style={{borderBottom:".05px",borderColor:"#fafafa"}}>{player.FFPG}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",borderColor:"#fafafa"}}>{player.Projection}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",borderColor:"#fafafa"}}>${player.Salary}</Table.Cell>
            <Table.Cell style={{borderBottom:".05px",borderColor:"#fafafa"}}>
                <center>
                    <Icon onClick={(event) => setFlexPlayer(event, player)} style={{cursor:"pointer"}} name="plus circle"/>
                    <Icon onClick={(event) => setCrownPlayer(event, player)} style={{cursor:"pointer"}} name="chess queen"/>
                </center>
            </Table.Cell>
        </Table.Row>
    )
    
    return (
        <div className="dfs" style={{marginLeft:"4.7%"}}>
            <Table striped style={{width:"510px", marginTop:"0%", color:"#fafafa"}}sortable fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell style={{fontSize:"12px", letterSpacing: ".5px", backgroundColor:"#2e323c", color:"white", border:"none",fontWeight:"normal", width:"40px", textAlign:"center"}}onClick={(e) => sortPos(e)}>POS.</Table.HeaderCell>
                        <Table.HeaderCell style={{border:"none", fontWeight:"normal",  fontSize:"12px", letterSpacing: ".5px",  backgroundColor:"#2e323c", color:"white", width:"130px"}}onClick={(e) => sortName(e)}>PLAYER</Table.HeaderCell>                    
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px",  backgroundColor:"#2e323c", color:"white", border:"none", width:"46px"}}onClick={(e) => sortFFPG(e)}>FFPG</Table.HeaderCell>
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px",  backgroundColor:"#2e323c", color:"white",  border:"none", width:"48px"}}onClick={(e) => sortProjection(e)}>PROJ.</Table.HeaderCell>
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px",  backgroundColor:"#2e323c", color:"white",border:"none", width:"62px"}}onClick={(e) => sortMoney(e)}>SALARY</Table.HeaderCell>
                        <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px",  backgroundColor:"#2e323c", color:"white",  border:"none", width:"60px"}}></Table.HeaderCell>
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