# Optimize Daily
<table>
  <tr>
    <td>
Daily Fantasy Football lineup builder and optimizer application created with Node.js and React.js, featuring live DraftKings contest data and projections from Sleeper. Build DraftKings contest lineups manually from player queue or optimize with linear programming for the highest projected lineup given salary and position constraints. Updated weekly during the NFL season for the Sunday Classic and two Showdown contests.  
    </td>
  </tr>
</table> 

Check out the <a href="https://optimize-daily.netlify.app/">live</a> and <a href="https://vimeo.com/930504746">video</a> demos.

## Technologies Used
- JavaScript
- React.js
- Node.js
- Express.js
- DraftKings API
- Sleeper API
- lp-solver.js
- Semantic UI React
- HTML & CSS
- Netlify & Render

## Features
- Fetch from DraftKings API to access live TNF/MNF Showdown and Sunday Classic contest data
- Fetch from Sleeper API to access player projections for week (PPR scoring)
- Sort player queue by position, name, projection, FPPG, and salary
- Calculate optimal lineup (highest proj. value) given salary and position constraints with lp-solver.js 
- Manually add (or remove) players to lineup from player queue
- Option to include manually selected players in optimization calculation
- View lineup total projection and remaining salary data

## Media 
![Screenshot (190)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/80af461d-e490-4ba9-831a-f17d04faa4b0)
![Screenshot (192)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/d2a85433-04ff-4d3e-b89b-2ba3f6afded0)

## Setup
- ` git clone < this repository > `
- ` cd client  `
- ` npm install `
- ` npm start `

## License 
This project is MIT licensed.
