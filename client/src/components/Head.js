import React from 'react'
import { Menu, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function Head(props) {
    
    const alertMessage = () => {
        window.alert("Coming Soon!")
    }

    return (
        <div className="header">
            <Menu style={{background:"inherit", borderBottom:"0", boxShadow:"none", color:"#61dafb"}}>
                <h1>Optimize Daily</h1>
            </Menu>
            <div className="schedule">     
                <Label.Group>
                    <Label as={Link} to="/trcaptain" basic size="large" style={{backgroundColor:"#282c34"}}circular>
                        <h5 style={{marginTop:"23.5%"}}>{props.monday}</h5>
                        <p style={{marginTop:"-26%", marginBottom:"20.5%"}}>Captain</p>
                    </Label>
                    <Label as={Link} onClick={alertMessage}to="/trcaptain" basic size="large" style={{backgroundColor:"#282c34"}} circular>
                        <h5 style={{marginTop:"23.5%"}}>{props.thursday}</h5>
                        <p style={{marginTop:"-26%", marginBottom:"20.5%"}}>Captain</p>
                    </Label>
                    <Label as={Link} to="/" basic size="large" style={{backgroundColor:"#282c34"}} circular>
                        <h5 style={{marginTop:"23.5%"}}>{props.sunday}</h5>
                        <p style={{marginTop:"-26%", marginBottom:"20.5%"}}>Classic</p>
                    </Label>
                    <Label as={Link} to="/" onClick={alertMessage} basic size="large" style={{backgroundColor:"#282c34"}}circular>
                        <h5 style={{marginTop:"23.5%"}}>{props.sunday}</h5>
                        <p style={{marginBottom:"20.5%", marginTop:"-26%"}}>Captain</p>
                    </Label>
                </Label.Group>
            </div>
        </div>
    )
}

export default Head