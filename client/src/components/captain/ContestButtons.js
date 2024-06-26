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
               <span>{sdDate1}<br/><b>{sdTeams1}</b></span>
            </Button>
            <Button 
                circular 
                color="white" 
                basic
                as={Link} to="/showdown2" 
                inverted 
                style={{marginRight:"3%"}}
            >
                <span>{sdDate2}<br/><b>{sdTeams2}</b></span>
            </Button>
        </div>
    );
};

export default ContestButtons;