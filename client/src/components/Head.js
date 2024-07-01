import React from 'react';
import { Menu, Icon, Button, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function Head({ clDate, sdDate1, sdDate2 }) {
    return (
        <div className="header">
            <Menu style={{
                background:"inherit", 
                borderBottom:"0", 
                boxShadow:"none", 
                color:"#dcf4fb"
            }}>
                <h2>Optimize Daily</h2>
                <Menu.Menu position="right">
                    <Menu.Item style={{ marginLeft:"0%" }}> 
                        <Popup
                            content={`Sun ${clDate}`}
                            key={1}
                            header={"Classic Contest"}
                            trigger={
                                <Button as={Link} to="/">
                                    <Icon 
                                        name="football ball" 
                                        size="big" 
                                        style={{ fontSize:"170%" }}
                                    />
                                </Button>
                            }
                        />
                    </Menu.Item>
                    <Menu.Item style={{ marginLeft:"-14%" }}>
                        <Popup
                            content={`${sdDate1} and ${sdDate2}`}
                            key={1}
                            header={"Showdown Contest"}
                            trigger={
                                <Button as={Link} to="/showdown2">
                                    <Icon 
                                        name="chess queen" 
                                        size="big" 
                                        style={{ fontSize:"180%" }}
                                    />
                                </Button>
                            }
                        />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
            <br />
        </div>
    );
};

export default Head;