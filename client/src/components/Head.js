import React from 'react'
import { Menu, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function Head(props) {
    
    const alertMessage = () => {
        window.alert("Note: Contests are updated Thursday mornings.")
    }

    const soonMessage = () => {
        window.alert("Sunday Night Football coming soon!")
    }

    return (
        <div className="header">
            <Menu style={{background:"inherit", borderBottom:"0", boxShadow:"none", color:"#61dafb"}}>
                <h1>Optimize Daily</h1>
            </Menu>
            <div className="schedule"> 
            <br></br>    
                <Label.Group>
                    <Label as={Link} onClick={alertMessage} to="/trcaptain"  size="large" basic style={{color:"#effbfe"}} circular>
                        <h5 style={{marginTop:"23.5%"}}>{props.thursday}</h5>
                        <p style={{marginTop:"-26%", marginBottom:"20.5%"}}>Captain</p>
                    </Label>
                    <Label as={Link} onClick={alertMessage} to="/" basic size="large" style={{backgroundColor:"#effbfe"}} circular>
                        <h5 style={{marginTop:"23.5%"}}>{props.sunday}</h5>
                        <p style={{marginTop:"-26%", marginBottom:"20.5%"}}>Classic</p>
                    </Label>
                    <Label as={Link} to="/" onClick={soonMessage} basic size="large" style={{backgroundColor:"#effbfe"}}circular>
                        <h5 style={{marginTop:"23.5%"}}>{props.sunday}</h5>
                        <p style={{marginBottom:"20.5%", marginTop:"-26%"}}>Captain</p>
                    </Label>
                    <Label as={Link} basic onClick={alertMessage}  to="/moncaptain" size="large" style={{backgroundColor:"#effbfe"}}circular>
                        <h5 style={{marginTop:"23.5%"}}>{props.monday}</h5>
                        <p style={{marginTop:"-26%", marginBottom:"20.5%"}}>Captain</p>
                    </Label>
                </Label.Group>
                <br></br>
            </div>
        </div>
    )
}

export default Head