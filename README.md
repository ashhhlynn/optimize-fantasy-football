# Optimize Daily
> Fantasy Football lineup builder application created with Node.js, React.js, and Draft Kings contest data with projections via Sleeper. The back end features a linear programming optimizer that generates the highest projected lineup given salary and position constraints, and the front end allows manually setting lineup from player queue. 

Coming soon - <a href="https://netlify.app/">live</a> and <a href="https://vimeo.com/">video</a> demos.

## Technologies Used
- JavaScript
- React.js
- Node.js
- Express.js
- Draft Kings API
- Sleeper API
- lp-solver.js
- Semantic UI React
- HTML & CSS

## Features
- Fetch from Draft Kings API to access live DFS contest projection and salary data
- Fetch from Sleeper API to access player projections for contest (PPR scoring)
- Sort player queue by position, name, projection, FPPG, and salary
- Calculate optimal lineup (highest proj. value) given salary and position constraints with lp-solver.js 
- Manually add (or remove) players to lineup from player queue
- View lineup total projection and remaining salary data

## To Implement
- Queue Opponent Rank (and sorting)
- Sunday and Monday night showdown contests
- Injury designations live for queue
- Correct data and data errors

## Media 
- Coming soon

## Setup
- ` git clone < this repository > `
- ` cd client  `
- ` npm start `
- ` cd server `
- ` npm run dev `
