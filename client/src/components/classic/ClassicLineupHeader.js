import React from 'react'
import { Table } from 'semantic-ui-react'

function ClassicLineupHeader(props) {

    return (
        <>
        <Table fixed style={{marginTop:"0%", marginLeft:"11%", width:"520px", backgroundColor:"#181a1f", borderColor:"white"}}>
            <Table.Row>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"left", width:"74px"}}> <b>PROJ. {props.projection.toFixed(2)}</b></Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"right", width:"58px"}}>Rem. Salary</Table.Cell>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"right", width:"52px"}}>${props.salary}</Table.Cell>
                <Table.Cell style={{color:"white", textAlign:"right", width:"58px"}}>Rem./Player</Table.Cell>
                <Table.Cell style={{color:"#61dafb", fontSize:"16px", textAlign:"right", width:"50px"}}>${props.salaryPerPlayer}</Table.Cell>
            </Table.Row>
        </Table>
        </>
    )
}

export default ClassicLineupHeader