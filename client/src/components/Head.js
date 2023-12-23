import React from 'react'
import { Menu, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function Head(props) {
    
    const alertMessage = () => {
        window.alert("Contests are updated Thursday mornings.")
    }

    const soonMessage = () => {
        window.alert("Sunday Night contests coming soon.")
    }

    return (
        <div className="header">
            <Menu style={{background:"inherit", borderBottom:"0", boxShadow:"none", color:"#dcf4fb"}}>
                <h2>Optimize Daily</h2>
            </Menu>
            <div className="schedule"> 
            <br></br>    
                <Label.Group>
                    <Label as={Link} onClick={alertMessage} to="/trcaptain"  size="large" inverted basic style={{backgroundColor:"inherit"}} circular>
                        <h5 style={{marginTop:"20.5%"}}>{props.thursday}</h5>
                        <p style={{marginTop:"-22%", marginBottom:"20.5%"}}>Captain</p>
                    </Label>
                    <Label as={Link} onClick={alertMessage} to="/" basic size="large" inverted style={{backgroundColor:"inherit"}} circular>
                        <h5 style={{marginTop:"20.5%"}}>{props.sunday}</h5>
                        <p style={{marginTop:"-22%", marginBottom:"20.5%"}}>Classic</p>
                    </Label>
                    <Label as={Link} to="/" onClick={soonMessage} basic size="large"inverted style={{backgroundColor:"inherit"}}circular>
                        <h5 style={{marginTop:"20.5%"}}>{props.sunday}</h5>
                        <p style={{marginTop:"-22%", marginBottom:"21%", marginRight:"9%", marginLeft:"9%"}}>Captain</p>
                    </Label>
                    <Label as={Link} basic onClick={alertMessage}  to="/moncaptain" size="large" inverted style={{backgroundColor:"inherit"}}circular>
                        <h5 style={{marginTop:"20.5%"}}>{props.monday}</h5>
                        <p style={{marginTop:"-22%", marginBottom:"21%", marginRight:"9%", marginLeft:"9%"}}>Captain</p>
                    </Label>
                </Label.Group>
                <br></br>
            </div>
        </div>
    )
}

export default Head