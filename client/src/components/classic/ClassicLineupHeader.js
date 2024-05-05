import React from 'react'
import { Table, Label, Popup, Icon, ListItem } from 'semantic-ui-react'

function ClassicLineupHeader(props) {

    return (
        <>
        <div className="classicPop" style={{marginBottom:"-2.12%",marginLeft:"-60%"}}>
            <Popup
            position='left center'
            style={{marginTop:"-16%"}}
            wide   
            trigger={
            <Label style={{cursor:"pointer", fontSize:"15px", backgroundColor:"#61dafb", fontWeight:"normal", letterSpacing:"0px"}} size='large'>
                <span style={{marginLeft:"0%"}}>Classic <Icon name='announcement'/></span>
            </Label>
            }>
                <ListItem as='li'>Optimize DraftKings lineup for highest projection</ListItem>
                <ListItem as='li'>Contests and salaries updated live weekly</ListItem>
                <ListItem as='li'>Select players to require in optimized lineup</ListItem>
            </Popup>
        </div>
        <Table fixed style={{marginLeft:"11%", width:"520px", backgroundColor:"#181a1f", borderColor:"white"}}>
            <Table.Row>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"left", width:"74px"}}> <b>PROJ. {props.projection.toFixed(2)}</b></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"right", width:"80px"}}>Rem. Salary: <span style={{marginLeft:"2%", color:"#61dafb", fontSize:"16px"}}> ${props.salary}</span></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"right", width:"80px"}}>Rem./Player: <span style={{marginLeft:"2%", color:"#61dafb", fontSize:"16px"}}> ${props.salaryPerPlayer}</span></Table.Cell>
            </Table.Row>
        </Table>
        </>
    )
}

export default ClassicLineupHeader