import React from 'react'
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function ContestButtons(props) {
    return (
        <div class="contestButtons">
            <Button color="white" circular basic as={Link} to="/showdown1" inverted style={{marginRight:"5%", backgroundColor:"inherit"}}>
                <span style={{fontSize:"12.5px",color:"white"}}>{props.sdDow1} {props.sdDate1}<br></br><b>{props.sdTeams1}</b></span>
            </Button>
            <Button circular color="white" as={Link} basic to="/showdown2" inverted style={{marginRight:"3%", backgroundColor:"inherit"}}>
                <span style={{fontSize:"12.5px",color:"white"}}>{props.sdDow2} {props.sdDate2}<br></br><b>{props.sdTeams2}</b></span>
            </Button>
        </div>
    )
}

export default ContestButtons