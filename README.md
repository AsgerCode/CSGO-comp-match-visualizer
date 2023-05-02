This project was developed as an interview assignment for [Blast.tv](https://blast.tv/), where I was tasked with parsing a CS:GO competitive match file and creating a way for the user to visualize the parsed contents on the browser. I decided to go with Next.js as I have past experience with it and it makes development significantly faster. Tests could've used a bit more work, but due to this project not being used in production, I decided to focus more on business logic and the actual task at hand. Most tests were written while developing on a TDD approach.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
The API was implemented using Next.js API routes, which I wouldn't have used on a bigger application, that was going into production.

The stats I chose to be visualized are the scoreboard of the match, average round time, a nemesis score (highest count of where a specific player killed another specific player), highest headshot percentage that dynamically adjusts when there are more than 1 player with the highest headshot percentage and lastly, a scoreboard that updates dynamiclaly depending on the time of the match that the user picks with a range slider.

## Getting Started

After cloning this repo, install the dependencies using:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


You can find the tests on [./tests]. To run them:

```bash
npm run test
```