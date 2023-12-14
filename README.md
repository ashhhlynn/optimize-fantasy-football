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
![Screenshot (170)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/64f861fe-d3d1-4f7b-af65-4d75614ca3b9)
![Screenshot (169)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/dc3ebef8-0167-4dd8-b619-ed918a3f334e)

## Setup
- ` git clone < this repository > `
- ` cd client  `
- ` npm install `
- ` npm start `

## License 
This project is MIT licensed.
