import React from 'react'
import { Table } from 'semantic-ui-react'

function CaptainLineupHeader(props) {

    return (
        <>
        <Table fixed style={{ marginTop:"4%", marginLeft:"12.9%", width:"520px", backgroundColor:"#333842", borderColor:"white"}}>
            <Table.Row>
                <Table.Cell style={{color:"white", textAlign:"left", width:"43px"}}>Rem. Salary</Table.Cell>
                <Table.Cell style={{color:"#80E1FB", fontSize:"16px", textAlign:"left", width:"38px"}}><b>${props.salary}</b></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"left", width:"43px"}}>Rem./Player</Table.Cell>
                <Table.Cell style={{color:"#80E1FB",  fontSize:"16px", textAlign:"left", width:"40px"}}><b>${props.salaryPerPlayer}</b></Table.Cell>
                <Table.Cell style={{color:"#80E1FB", fontSize:"16px",textAlign:"right",width:"55px"}}><b>{props.projection.toFixed(2)}</b></Table.Cell>
            </Table.Row>
        </Table>
        </>
    )
}

export default CaptainLineupHeader