import React from 'react'
import { Table, Icon, Header } from 'semantic-ui-react'
import BlankCells from '../BlankCells.js'

function CaptainLineup(props) {
      
    const removeCrownPlayer = (e, player) => {
        e.preventDefault()
        props.removeCrownPlayer(player)
    }
    
    const removeFlexPlayer = (e, player) => {
        e.preventDefault()
        props.removeFlexPlayer(player)
    }

    let flexPlayers = props.flexPlayers
    let crown= props.crown

    return (
        <>
        <Table fixed style={{borderColor:"white", color:"#fafafa", marginTop:"-2.5%", marginLeft:"11%", width:"520px"}}>           
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px", width:"54px", color:"white",  backgroundColor:"#2e323c"}}>POS.</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px",  width:"180px", color:"white", backgroundColor:"#2e333c"}}>PLAYER</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal",  fontSize:"12px", letterSpacing: ".5px", width:"56px", color:"white", backgroundColor:"#2e333c"}}>TEAM</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal",  fontSize:"12px", letterSpacing: ".5px", width:"56px", color:"white", backgroundColor:"#2e333c"}}>PROJ.</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal",  fontSize:"12px", letterSpacing: ".5px",  width:"72px", color:"white", backgroundColor:"#2e333c"}}>SALARY</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px",  width:"35px", color:"white", backgroundColor:"#2e333c"}}></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Header as='h4' image>
                            <Header.Content><Icon size="large" style={{marginTop:"14%", color:"white", marginLeft:"8%"}}name="chess queen"/></Header.Content>
                        </Header>
                    </Table.Cell>
                    {crown.length !== 0 ?
                        <>
                        <Table.Cell>{crown[0].Name} {crown[0].Position}</Table.Cell>
                        <Table.Cell>{crown[0].Team}</Table.Cell>
                        <Table.Cell>{(crown[0].Projection * 1.5).toFixed(2)}</Table.Cell>
                        <Table.Cell>${crown[0].Salary * 1.5}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removeCrownPlayer(event, crown[0])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 0? 
                        <>
                        <Table.Cell>{flexPlayers[0].Name} {flexPlayers[0].Position}</Table.Cell>
                        <Table.Cell>{flexPlayers[0].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[0].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[0].Salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" style={{cursor:"pointer"}} onClick={(event) => removeFlexPlayer(event, flexPlayers[0])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 1? 
                        <>
                        <Table.Cell>{flexPlayers[1].Name} {flexPlayers[1].Position}</Table.Cell>
                        <Table.Cell>{flexPlayers[1].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[1].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[1].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removeFlexPlayer(event, flexPlayers[1])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 2 ? 
                        <>
                        <Table.Cell>{flexPlayers[2].Name} {flexPlayers[2].Position}</Table.Cell>
                        <Table.Cell>{flexPlayers[2].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[2].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[2].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removeFlexPlayer(event, flexPlayers[2])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 3? 
                        <>
                        <Table.Cell>{flexPlayers[3].Name} {flexPlayers[3].Position}</Table.Cell>
                        <Table.Cell>{flexPlayers[3].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[3].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[3].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removeFlexPlayer(event, flexPlayers[3])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 4? 
                        <>
                        <Table.Cell>{flexPlayers[4].Name} {flexPlayers[4].Position}</Table.Cell>
                        <Table.Cell>{flexPlayers[4].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[4].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[4].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removeFlexPlayer(event, flexPlayers[4])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
              </Table.Body>
            </Table>
        </>
    )
}

export default CaptainLineup