import React from 'react'
import { Table } from 'semantic-ui-react'

function ClassicLineupHeader(props) {

    return (
        <>
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