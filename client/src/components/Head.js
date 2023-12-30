import React from 'react'
import { Menu, Icon, Button, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function Head(props) {

    return (
        <div className="header">
            <Menu style={{background:"inherit", borderBottom:"0", boxShadow:"none", color:"#dcf4fb"}}>
                <h2>Optimize Daily</h2>
                <Menu.Menu position="right">
                    <Menu.Item style={{marginLeft:"0%"}}> 
                        <Popup
                            content={`Sun ${props.sunday} (updated Thursday)`}
                            key={1}
                            header={"Classic Contest"}
                            trigger={
                            <Button as={Link} to="/" style={{width: "40px",background:"inherit"}}>
                                <Icon name="football ball" size="big" style={{cursor:"pointer", fontSize:"170%",color:"#61dafb"}}/>
                            </Button>
                            }
                        />
                    </Menu.Item>
                    <Menu.Item style={{marginLeft:"-14%"}}>
                        <Popup
                            content={`Thurs ${props.thursday} and Sat 12-30 (updated Thursdays)`}
                            key={1}
                            header={"Showdown Contest"}
                            trigger={
                            <Button style={{width: "40px",background:"inherit"}} as={Link} to="/trcaptain">
                                <Icon name="chess queen" size="big" style={{cursor:"pointer", fontSize:"180%",color:"#61dafb"}}/>
                            </Button>
                            }
                        />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
            <br></br>
        </div>
    )
}

export default Head