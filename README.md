# Optimize Daily
<table>
  <tr>
    <td>
Fantasy Football lineup builder application created with Node.js and React.js, featuring live DraftKings contest data and projections from Sleeper API. Manually build lineup from player queue or use linear programming optimizer to generate highest projected lineup given salary and position constraints. Front end deployed to Netlify and back end deployed to Render. 
    </td>
  </tr>
</table> 

Check out the <a href="https://optimize-daily.netlify.app/">live</a> and <a href="https://vimeo.com/891037624">video</a> demos.

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

## Features
- Fetch from DraftKings API to access live TNF/MNF Showdown and Sunday Classic contest data
- Fetch from Sleeper API to access player projections for week (PPR scoring)
- Sort player queue by position, name, projection, FPPG, and salary
- Calculate optimal lineup (highest proj. value) given salary and position constraints with lp-solver.js 
- Manually add (or remove) players to lineup from player queue
- View lineup total projection and remaining salary data

## To Implement
- Queue Opponent Rank (and sorting)
- Sunday night showdown contests
- Injury designations live for queue
- Data errors

## Media 
![Screenshot (172)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/b892c9d2-fd56-4a02-95ff-e513d550c061)
![Screenshot (171)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/47e16135-eb44-41fa-b4ea-807702fc555e)

## Setup
- ` git clone < this repository > `
- ` cd client  `
- ` npm install `
- ` npm start `

## License 
This project is MIT licensed.
