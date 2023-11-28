# Optimize Daily
> Fantasy Football lineup builder application created with Node.js and React.js, featuring live DraftKings contest data and projections from Sleeper API. Manually build lineup from player queue or use linear programming optimizer to generate highest projected lineup given salary and position constraints. Front end deployed to Netlify and back end deployed to Render. 

Check out the <a href="https://optimize-daily.netlify.app/">live</a> and <a href="https://vimeo.com/882763463/ab148b0626">video</a> demos.

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
- Fetch from DraftKings API to access live TNF Showdown and Sunday Classic contest data
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
![Screenshot (146)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/7d180b77-a9c2-45b8-8081-389b07a9f96b)

## Setup
- ` git clone < this repository > `
- ` cd client  `
- ` npm start `
- ` cd server `
- ` npm run dev `

## Acknowledgements
This project was created by Ashley.

## License 
This project is MIT licensed.
