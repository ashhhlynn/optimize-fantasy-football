import React from 'react'
import { Table, Popup, Label, ListItem } from 'semantic-ui-react'

function CaptainLineupHeader({ lineupNumbers }) {
    return (
        <>
        <div className="showdownPop">
            <Popup
                position='left center'
                style={{ marginTop:"-16%" }}
                wide   
                trigger={
                    <Label size="large">SHOWDOWN </Label>
                }
            >
                <ListItem as='li'>Optimize DraftKings lineup for highest projection</ListItem>
                <ListItem as='li'>Contests and salaries updated live weekly</ListItem>
                <ListItem as='li'>Select players to require in optimized lineup</ListItem>
            </Popup>
        </div>
        <Table className='classicLineupInfo' fixed>
            <Table.Row>
                <Table.Cell style={{
                    color:"#61dafb", 
                    fontSize:"16px", 
                    textAlign:"left", 
                    width:"74px"
                }}> 
                    <b>PROJ. {Math.abs(lineupNumbers.projection).toFixed(2)}</b>
                </Table.Cell>
                <Table.Cell style={{
                    color:"white", 
                    textAlign:"right", 
                    width:"80px"
                }}>
                    Rem. Salary: 
                    <span style={{
                        marginLeft:"2%", 
                        color:"#61dafb", 
                        fontSize:"16px"
                    }}> 
                        ${lineupNumbers.salary}
                    </span>
                </Table.Cell>
                <Table.Cell style={{
                    color:"white", 
                    textAlign:"right", 
                    width:"80px"
                }}>
                    Rem./Player: 
                    <span style={{
                        marginLeft:"2%", 
                        color:"#61dafb", 
                        fontSize:"16px"
                    }}>
                        ${lineupNumbers.salaryPerPlayer}
                    </span>
                </Table.Cell>
            </Table.Row>
        </Table>
        </>
    );
};

export default CaptainLineupHeader;