require('dotenv').config()
const mysql = require('mysql')
const express = require('express')
const app = express()
const home = require('./controllers/home')
const position = require('./controllers/position')
const watchlist = require('./controllers/watchlist')

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

connection.connect(err => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
})

app.use('/', home)
app.use('/position', position)
app.use('/watchlist', watchlist)

app.listen(3000)