var express = require('express')
var router = express.Router()

// define the home page route
router.get('/', function (req, res) {
  res.send('Watchlist')
})
// define the about route
router.post('/', function (req, res) {
  res.send('You added a stock to your watchlist')
})

module.exports = router