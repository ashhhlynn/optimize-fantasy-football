# Optimize Daily
> Fantasy Football lineup builder application created with Node.js and React.js, featuring live Draft Kings contest data and projections from Sleeper API. Manually build lineup from player queue or use linear programming optimizer to generate highest projected lineup given salary and position constraints.  

Coming soon - <a href="https://optimize-daily.netlify.app/">live</a> and <a href="https://vimeo.com/882763463/ab148b0626">video</a> demos.

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
- Fetch from Draft Kings API to access live TNF Showdown and Sunday Classic contest data
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
![Screenshot (141)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/46fffab2-f512-4fe9-ad15-3d6dbdfb3d21)

![Screenshot (142)](https://github.com/ashhhlynn/optimize-fantasy-football/assets/84604278/9bc39246-3e4f-40d1-8b2f-a7dca891be79)

## Setup
- ` git clone < this repository > `
- ` cd client  `
- ` npm start `
- ` cd server `
- ` npm run dev `
