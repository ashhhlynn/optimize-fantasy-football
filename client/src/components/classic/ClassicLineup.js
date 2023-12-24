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
        <Table fixed style={{borderColor:"white", color:"#fafafa", marginTop:"-2.5%", marginLeft:"11%", width:"520px"}}>           
            <Table.Header >
                <Table.Row >
                    <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px", width:"54px", color:"white",  backgroundColor:"#2e323c"}}>POS.</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px", width:"160px", color:"white",  backgroundColor:"#2e323c"}}>PLAYER</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px",  width:"56px", color:"white", backgroundColor:"#2e323c"}}>TEAM</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px", width:"56px", color:"white",  backgroundColor:"#2e323c"}}>PROJ.</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal", fontSize:"12px", letterSpacing: ".5px",  width:"72px", color:"white", backgroundColor:"#2e323c"}}>SALARY</Table.HeaderCell>
                    <Table.HeaderCell style={{fontWeight:"normal",  fontSize:"12px", letterSpacing: ".5px",  width:"35px", color:"white", backgroundColor:"#2e323c"}}></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>           
                <Table.Row>
                    <Table.Cell>QB</Table.Cell>
                    {qb ? 
                        <>
                        <Table.Cell>{qb.Name}</Table.Cell>
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
                        <Table.Cell>{rbs[0].Name}</Table.Cell>
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
                        <Table.Cell>{rbs[1].Name}</Table.Cell>
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
                        <Table.Cell>{wrs[0].Name}</Table.Cell>
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
                        <Table.Cell>{wrs[1].Name}</Table.Cell>
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
                        <Table.Cell>{wrs[2].Name}</Table.Cell>
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
                        <Table.Cell>{te.Name}</Table.Cell>
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
                        <Table.Cell>{flex.Name}</Table.Cell>
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
                        <Table.Cell>{dst.Name}</Table.Cell>
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