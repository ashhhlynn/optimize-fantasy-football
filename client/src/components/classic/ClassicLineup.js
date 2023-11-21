import { Table, Icon } from 'semantic-ui-react'
import React from 'react'

function ClassicLineup(props) {
    
    const removePlayer = (e, player) => {
        e.preventDefault()
        props.removePlayer(player)
    }

    let qb = props.qb
    let te = props.te
    let rbs = props.rbs
    let wrs = props.wrs
    let dst = props.dst
    let flex = props.flex

    return (
        <>
        <Table fixed style={{backgroundColor:"#2a2f37", borderColor:"white", color:"white", marginTop:"-2.5%", marginLeft:"13%", width:"520px"}}>           
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{width:"54px", color:"white", backgroundColor:"#333842"}}>POS</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"180px", color:"white", backgroundColor:"#333842"}}>PLAYER</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"56px", color:"white", backgroundColor:"#333842"}}>TEAM</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"56px", color:"white", backgroundColor:"#333842"}}>PROJ</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"72px", color:"white", backgroundColor:"#333842"}}>SALARY</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"35px", color:"white", backgroundColor:"#333842"}}>
                        <center><Icon name="close"/></center>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>           
                <Table.Row>
                    <Table.Cell>QB</Table.Cell>
                    {qb ? 
                        <>
                        <Table.Cell><b>{qb.Name}</b></Table.Cell>
                        <Table.Cell>{qb.Team}</Table.Cell>
                        <Table.Cell>{qb.Projection}</Table.Cell>
                        <Table.Cell>${qb.Salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" style={{cursor:"pointer"}} onClick={(event) => removePlayer(event, qb)}/></center></Table.Cell>
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
                    <Table.Cell>RB</Table.Cell>
                    {rbs.length > 0? 
                        <>
                        <Table.Cell><b>{rbs[0].Name}</b></Table.Cell>
                        <Table.Cell>{rbs[0].Team}</Table.Cell>
                        <Table.Cell>{rbs[0].Projection}</Table.Cell>
                        <Table.Cell>${rbs[0].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removePlayer(event, rbs[0])}/></center></Table.Cell>
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
                    <Table.Cell>RB</Table.Cell>
                    {rbs.length > 1 ? 
                        <>
                        <Table.Cell><b>{rbs[1].Name}</b></Table.Cell>
                        <Table.Cell>{rbs[1].Team}</Table.Cell>
                        <Table.Cell>{rbs[1].Projection}</Table.Cell>
                        <Table.Cell>${rbs[1].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removePlayer(event, rbs[1])}/></center></Table.Cell>
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
                    <Table.Cell>WR</Table.Cell>
                    {wrs.length > 0 ? 
                        <>
                        <Table.Cell><b>{wrs[0].Name}</b></Table.Cell>
                        <Table.Cell>{wrs[0].Team}
                        </Table.Cell>
                        <Table.Cell>{wrs[0].Projection}</Table.Cell>
                        <Table.Cell>${wrs[0].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removePlayer(event, wrs[0])}/></center></Table.Cell>
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
                    <Table.Cell>WR</Table.Cell>
                    {wrs.length > 1? 
                        <>
                        <Table.Cell><b>{wrs[1].Name}</b></Table.Cell>
                        <Table.Cell>{wrs[1].Team}</Table.Cell>
                        <Table.Cell>{wrs[1].Projection}</Table.Cell>
                        <Table.Cell>${wrs[1].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removePlayer(event, wrs[1])}/></center></Table.Cell>
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
                    <Table.Cell>WR</Table.Cell>
                    {wrs.length > 2? 
                        <>
                        <Table.Cell><b>{wrs[2].Name}</b></Table.Cell>
                        <Table.Cell>{wrs[2].Team}</Table.Cell>
                        <Table.Cell>{wrs[2].Projection}</Table.Cell>
                        <Table.Cell>${wrs[2].Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removePlayer(event, wrs[2])}/></center></Table.Cell>
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
                    <Table.Cell>TE</Table.Cell>
                    {te ? 
                        <>
                        <Table.Cell><b>{te.Name}</b></Table.Cell>
                        <Table.Cell>{te.Team}</Table.Cell>
                        <Table.Cell>{te.Projection}</Table.Cell>
                        <Table.Cell>${te.Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close"  onClick={(event) => removePlayer(event, te)}/></center></Table.Cell>
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
                    {flex ? 
                        <>
                        <Table.Cell><b>{flex.Name}</b></Table.Cell>
                        <Table.Cell>{flex.Team}</Table.Cell>
                        <Table.Cell>{flex.Projection}</Table.Cell>
                        <Table.Cell>${flex.Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removePlayer(event, flex)}/></center></Table.Cell>
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
                    <Table.Cell>DST</Table.Cell>
                    {dst ? 
                        <>
                        <Table.Cell><b>{dst.Name}</b></Table.Cell>
                        <Table.Cell>{dst.Team}</Table.Cell>
                        <Table.Cell>{dst.Projection}</Table.Cell>
                        <Table.Cell>${dst.Salary}</Table.Cell>
                        <Table.Cell><center><Icon style={{cursor:"pointer"}} name="close" onClick={(event) => removePlayer(event, dst)}/></center></Table.Cell>
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

export default ClassicLineup