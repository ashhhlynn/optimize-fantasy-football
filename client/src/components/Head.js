import React from 'react'
import { Divider, Icon, Menu, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function Head(props) {
    
    return (
        <div className="head">
            <Menu style={{background:"inherit", color:"#61dafb"}}>
                <h1> Optimize Daily <Icon style={{marginTop:"-.5%"}} name="football ball"/></h1>
                <Menu.Menu position="right"  style={{marginRight:"3.5%"}}>
                    <div className="schedulebuttons">
                        <Label.Group>
                            <Label as={Link} to="/trcaptain" basic style={{backgroundColor:"#282c34" }}circular>
                                <h5 style={{marginTop:"27%"}}>{props.thursday}</h5>
                                <p style={{ marginTop:"-26%", marginBottom:"20%"}}>Captain</p>
                            </Label>
                            <Label as={Link} to="/"  basic style={{backgroundColor:"#282c34"}}circular>
                                <h5 style={{ marginTop:"27%"}}>{props.sunday}</h5>
                                <p style={{marginTop:"-26%", marginBottom:"20%"}}>Classic</p>
                            </Label>
                        </Label.Group>
                    </div>
                </Menu.Menu>
            </Menu>
            <Divider></Divider>
        </div>
    )
}

export default Head