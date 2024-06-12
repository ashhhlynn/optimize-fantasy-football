import React from 'react'
import { Table, Popup, Label, ListItem, Icon } from 'semantic-ui-react'

function CaptainLineupHeader(props) {

    return (
        <>
        <div className="classicPop" style={{marginBottom:"-.2%",marginLeft:"-56.5%"}}>
            <Popup
            position='left center'
            style={{marginTop:"-16%"}}
            wide   
            trigger={
            <Label style={{cursor:"pointer", letterSpacing:".2px", fontSize:"12px", backgroundColor:"#61dafb"}} size="large">
                <span style={{marginLeft:"0%"}}>SHOWDOWN <Icon name='announcement'/></span>
            </Label>
            }>
                <ListItem as='li'>Optimize DraftKings lineup for highest projection</ListItem>
                <ListItem as='li'>Contests and salaries updated live weekly</ListItem>
                <ListItem as='li'>Select players to require in optimized lineup</ListItem>
            </Popup>
        </div>
        <Table fixed style={{marginTop:".5%", marginLeft:"11%", width:"520px", backgroundColor:"#181a1f", borderColor:"white"}}>
            <Table.Row>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"left", width:"74px"}}> <b>PROJ. {props.projection.toFixed(2)}</b></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"right", width:"80px"}}>Rem. Salary: <span style={{marginLeft:"2%", color:"#61dafb", fontSize:"16px"}}> ${props.salary}</span></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"right", width:"80px"}}>Rem./Player: <span style={{marginLeft:"2%", color:"#61dafb", fontSize:"16px"}}> ${props.salaryPerPlayer}</span></Table.Cell>
            </Table.Row>
        </Table>
        </>
    )
}

export default CaptainLineupHeader