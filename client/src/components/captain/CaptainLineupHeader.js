import React from 'react'
import { Table } from 'semantic-ui-react'

function CaptainLineupHeader(props) {

    return (
        <>
        <Table fixed style={{marginTop:".5%", marginLeft:"11%", width:"520px", backgroundColor:"#22262c", borderColor:"white"}}>
            <Table.Row>
                <Table.Cell style={{color:"white", textAlign:"left", width:"44px"}}>Rem. Salary</Table.Cell>
                <Table.Cell style={{color:"#80E1FB", fontSize:"16px", textAlign:"left", width:"36px"}}><b>${props.salary}</b></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"left", width:"44px"}}>Rem./Player</Table.Cell>
                <Table.Cell style={{color:"#80E1FB", fontSize:"16px", textAlign:"left", width:"40px"}}><b>${props.salaryPerPlayer}</b></Table.Cell>
                <Table.Cell style={{color:"#80E1FB", fontSize:"16px", textAlign:"right", width:"50px"}}><b>{props.projection.toFixed(2)}</b></Table.Cell>
            </Table.Row>
        </Table>
        </>
    )
}

export default CaptainLineupHeader