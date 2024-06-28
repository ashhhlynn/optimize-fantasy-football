import React from 'react';
import { Table, Icon, Header } from 'semantic-ui-react';
import BlankCells from '../BlankCells.js';

function CaptainLineup({ flexPlayers, crown, removeCrownPlayer, removeFlexPlayer }) {

    return (
        <>
        <Table fixed className='classicLineup'>           
            <Table.Header>
                <Table.Row className='classicLineupHeader'>
                    <Table.HeaderCell style={{width:"54px"}}>POS.</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"180px"}}>PLAYER</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"56px"}}>TEAM</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"56px"}}>PROJ.</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"72px"}}>SALARY</Table.HeaderCell>
                    <Table.HeaderCell style={{width:"35px"}}></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        <Header as='h4' image>
                            <Header.Content>
                                <Icon 
                                    size="large" 
                                    style={{
                                    marginTop:"14%", 
                                    color:"white", 
                                    marginLeft:"8%"
                                }}
                                    name="chess queen"
                                />
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    {crown.length !== 0 ?
                        <>
                        <Table.Cell>{crown[0].Name} {crown[0].Position}</Table.Cell>
                        <Table.Cell>{crown[0].Team}</Table.Cell>
                        <Table.Cell>{(crown[0].Projection * 1.5).toFixed(2)}</Table.Cell>
                        <Table.Cell>${crown[0].Salary * 1.5}</Table.Cell>
                        <Table.Cell><center><Icon name="close" onClick={() => removeCrownPlayer(crown[0])}/></center></Table.Cell>
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
                        <Table.Cell><center><Icon name="close" onClick={() => removeFlexPlayer(flexPlayers[0])}/></center></Table.Cell>
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
                        <Table.Cell><center><Icon name="close" onClick={() => removeFlexPlayer(flexPlayers[1])}/></center></Table.Cell>
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
                        <Table.Cell><center><Icon name="close" onClick={() => removeFlexPlayer(flexPlayers[2])}/></center></Table.Cell>
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
                        <Table.Cell><center><Icon name="close" onClick={() => removeFlexPlayer(flexPlayers[3])}/></center></Table.Cell>
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
                        <Table.Cell><center><Icon name="close" onClick={() => removeFlexPlayer(flexPlayers[4])}/></center></Table.Cell>
                        </>
                    :
                        <BlankCells/>
                    }
                </Table.Row>
              </Table.Body>
            </Table>
        </>
    );
};

export default CaptainLineup;