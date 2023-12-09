import React from 'react'
import { Table } from 'semantic-ui-react'

function ClassicLineupHeader(props) {

    return (
        <>
        <Table fixed style={{marginTop:"0%", marginLeft:"11%", width:"520px", backgroundColor:"#181a1f", borderColor:"white"}}>
            <Table.Row>
                <Table.Cell style={{color:"white", textAlign:"left", width:"44px"}}>Rem. Salary</Table.Cell>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"left", width:"36px"}}><b>${props.salary}</b></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"left", width:"44px"}}>Rem./Player</Table.Cell>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"left", width:"40px"}}><b>${props.salaryPerPlayer}</b></Table.Cell>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"right", width:"50px"}}><b>{props.projection.toFixed(2)}</b></Table.Cell>
            </Table.Row>
        </Table>
        </>
    )
}

export default ClassicLineupHeader