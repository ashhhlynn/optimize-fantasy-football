import React from 'react'
import { Table } from 'semantic-ui-react'

function ClassicLineupHeader(props) {

    return (
        <>
        <Table fixed style={{ marginTop:"4%", marginLeft:"12.9%", width:"520px", backgroundColor:"inherit", borderColor:"white"}}>
            <Table.Row>
                <Table.Cell style={{color:"white", textAlign:"right", width:"63px"}}>Rem. Salary</Table.Cell>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"left", width:"56px"}}><b>${props.salary}</b></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"right", width:"63px"}}>Rem./Player</Table.Cell>
                <Table.Cell style={{color:"#61dafb",  fontSize:"16px", textAlign:"left", width:"50px"}}><b>${props.salaryPerPlayer}</b></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"right",width:"38px"}}>PROJ</Table.Cell>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px",textAlign:"left",width:"50px"}}><b>{props.projection.toFixed(2)}</b></Table.Cell>
            </Table.Row>
        </Table>
        </>
    )
}

export default ClassicLineupHeader