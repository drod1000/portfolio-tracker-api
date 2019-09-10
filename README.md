# Portfolio Tracker

I built this to automate keeping track of my stock portfolio. I have a bash script that runs every morning that results in a daily email update so I don't have to check anymore.

There is also a client application that can be found here: https://github.com/drod1000/portfolio-tracker-client

## Tech Used

* [Express](https://expressjs.com) - Server
* [MySQL](https://www.mysql.com) - Database
* [Knex](http://knexjs.org) - Query Builder
* [typedi](https://www.npmjs.com/package/typedi) - Dependency Injection
* [Axios](https://www.npmjs.com/package/axios) - HTTP Client
* [Moment.js](https://momentjs.com) - Date Handling

## External APIs

* [Sendgrid](https://sendgrid.com) - Email Notification
* [World Trading Data](https://www.worldtradingdata.com) - Stock Data

## Available Scripts

In the project directory, you can run:

### `npm start dev`

Runs the express in development mode.

### `npm start daily-update`

Fetches latest data from World Trading Data and sends an email using Sendgrid to the user (me)
