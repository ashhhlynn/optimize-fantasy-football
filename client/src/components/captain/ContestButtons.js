import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function ContestButtons({ sdDate1, sdTeams1, sdDate2, sdTeams2 }) {
    return (
        <div class="contestButtons">
            <Button 
                color="white" 
                circular 
                basic 
                as={Link} to="/showdown1" 
                inverted 
                style={{marginRight:"5%"}}
            >
                {sdDate1}<br/> 
                <p><b>{sdTeams1}</b></p>
            </Button>
            <Button 
                circular 
                color="white" 
                basic
                as={Link} to="/showdown2" 
                inverted 
                style={{marginRight:"3%"}}
            >
                {sdDate2}<br/>
                <p><b>{sdTeams2}</b></p>
            </Button>
        </div>
    );
};

export default ContestButtons;