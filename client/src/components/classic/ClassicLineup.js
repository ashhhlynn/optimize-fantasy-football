import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import BlankCells from '../BlankCells.js';

function ClassicLineup({ qb, rbs, wrs, te, dst, flex, removePlayer }) {
    return (
        <Table className="classicLineup" fixed >          
            <Table.Header>
                <Table.Row className='classicLineupHeader'>
                    <Table.HeaderCell style={{width:"54px"}}>POS.</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"160px"}}>PLAYER</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"56px"}}>TEAM</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"56px"}}>PROJ.</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"72px"}}>SALARY</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"35px"}}></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>           
                <Table.Row>
                    <Table.Cell>QB</Table.Cell>
                    {qb ? 
                        <>
                        <Table.Cell>{qb.displayName}</Table.Cell>
                        <Table.Cell>{qb.teamAbbreviation}</Table.Cell>
                        <Table.Cell>{qb.Projection}</Table.Cell>
                        <Table.Cell>${qb.salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(qb)}/></center></Table.Cell>
                        </>
                    :   
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>RB</Table.Cell>
                    {rbs.length > 0? 
                        <>
                        <Table.Cell>{rbs[0].displayName}</Table.Cell>
                        <Table.Cell>{rbs[0].teamAbbreviation}</Table.Cell>
                        <Table.Cell>{rbs[0].Projection}</Table.Cell>
                        <Table.Cell>${rbs[0].salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(rbs[0])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>RB</Table.Cell>
                    {rbs.length > 1 ? 
                        <>
                        <Table.Cell>{rbs[1].displayName}</Table.Cell>
                        <Table.Cell>{rbs[1].teamAbbreviation}</Table.Cell>
                        <Table.Cell>{rbs[1].Projection}</Table.Cell>
                        <Table.Cell>${rbs[1].salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(rbs[1])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>WR</Table.Cell>
                    {wrs.length > 0 ? 
                        <>
                        <Table.Cell>{wrs[0].displayName}</Table.Cell>
                        <Table.Cell>{wrs[0].teamAbbreviation}
                        </Table.Cell>
                        <Table.Cell>{wrs[0].Projection}</Table.Cell>
                        <Table.Cell>${wrs[0].salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(wrs[0])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>WR</Table.Cell>
                    {wrs.length > 1? 
                        <>
                        <Table.Cell>{wrs[1].displayName}</Table.Cell>
                        <Table.Cell>{wrs[1].teamAbbreviation}</Table.Cell>
                        <Table.Cell>{wrs[1].Projection}</Table.Cell>
                        <Table.Cell>${wrs[1].salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(wrs[1])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>WR</Table.Cell>
                    {wrs.length > 2? 
                        <>
                        <Table.Cell>{wrs[2].displayName}</Table.Cell>
                        <Table.Cell>{wrs[2].teamAbbreviation}</Table.Cell>
                        <Table.Cell>{wrs[2].Projection}</Table.Cell>
                        <Table.Cell>${wrs[2].salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(wrs[2])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>TE</Table.Cell>
                    {te ? 
                        <>
                        <Table.Cell>{te.displayName}</Table.Cell>
                        <Table.Cell>{te.teamAbbreviation}</Table.Cell>
                        <Table.Cell>{te.Projection}</Table.Cell>
                        <Table.Cell>${te.salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(te)}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>FLEX</Table.Cell>
                    {flex.length !== 0 ? 
                        <>
                        <Table.Cell>{flex[0].displayName}</Table.Cell>
                        <Table.Cell>{flex[0].teamAbbreviation}</Table.Cell>
                        <Table.Cell>{flex[0].Projection}</Table.Cell>
                        <Table.Cell>${flex[0].salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(flex[0])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
                <Table.Row>
                    <Table.Cell>DST</Table.Cell>
                    {dst ? 
                        <>
                        <Table.Cell>{dst.displayName}</Table.Cell>
                        <Table.Cell>{dst.teamAbbreviation}</Table.Cell>
                        <Table.Cell>{dst.Projection}</Table.Cell>
                        <Table.Cell>${dst.salary}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removePlayer(dst)}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
            </Table.Body>
        </Table>
    );
};

export default ClassicLineup;