import React from 'react'
import { Table, Icon, Header } from 'semantic-ui-react'

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
        <Table fixed style={{marginTop:"-2%", marginLeft:"14%", width:"520px"}}>           
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{width:"54px", backgroundColor:"#f0f0f0"}}>POS</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"180px", backgroundColor:"#f0f0f0"}}>PLAYER</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"56px", backgroundColor:"#f0f0f0"}}>TEAM</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"56px", backgroundColor:"#f0f0f0"}}>PROJ</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"72px", backgroundColor:"#f0f0f0"}}>SALARY</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"35px", backgroundColor:"#f0f0f0"}}>
                        <center><Icon name="close"/></center>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Header as='h4' image>
                            <Header.Content><Icon size="large" style={{marginLeft:"8%"}}name="chess queen"/></Header.Content>
                        </Header>
                    </Table.Cell>
                    {crown.length !== 0 ?
                        <>
                        <Table.Cell><b>{crown.Name} {crown.Position}</b></Table.Cell>
                        <Table.Cell>{crown.Team}</Table.Cell>
                        <Table.Cell>{parseInt(crown.Projection * 1.5)}</Table.Cell>
                        <Table.Cell>${parseInt(crown.Salary * 1.5)}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removeCrownPlayer(event, crown)}/></center></Table.Cell>
                        </>
                    :
                        <> 
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        </>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 0? 
                        <>
                        <Table.Cell><b>{flexPlayers[0].Name} {flexPlayers[0].Position}</b></Table.Cell>
                        <Table.Cell>{flexPlayers[0].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[0].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[0].Salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" style={{cursor:"pointer"}} onClick={(event) => removeFlexPlayer(event, flexPlayers[0])}/></center></Table.Cell>
                        </>
                    :
                        <> 
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        </>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 1? 
                        <>
                        <Table.Cell><b>{flexPlayers[1].Name} {flexPlayers[1].Position}</b></Table.Cell>
                        <Table.Cell>{flexPlayers[1].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[1].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[1].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removeFlexPlayer(event, flexPlayers[1])}/></center></Table.Cell>
                        </>
                    :
                        <> 
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        </>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 2 ? 
                        <>
                        <Table.Cell><b>{flexPlayers[2].Name} {flexPlayers[2].Position}</b></Table.Cell>
                        <Table.Cell>{flexPlayers[2].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[2].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[2].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removeFlexPlayer(event, flexPlayers[2])}/></center></Table.Cell>
                        </>
                    :
                        <> 
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        </>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 3? 
                        <>
                        <Table.Cell><b>{flexPlayers[3].Name} {flexPlayers[3].Position}</b></Table.Cell>
                        <Table.Cell>{flexPlayers[3].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[3].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[3].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close"  onClick={(event) => removeFlexPlayer(event, flexPlayers[3])}/></center></Table.Cell>
                        </>
                    :
                        <> 
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        </>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flexPlayers.length > 4? 
                        <>
                        <Table.Cell><b>{flexPlayers[4].Name} {flexPlayers[4].Position}</b></Table.Cell>
                        <Table.Cell>{flexPlayers[4].Team}</Table.Cell>
                        <Table.Cell>{flexPlayers[4].Projection}</Table.Cell>
                        <Table.Cell>${flexPlayers[4].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close"  onClick={(event) => removeFlexPlayer(event, flexPlayers[4])}/></center></Table.Cell>
                        </>
                    :
                        <> 
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                        </>
                    }
                </Table.Row>
              </Table.Body>
            </Table>
        </>
    )
}

export default CaptainLineup