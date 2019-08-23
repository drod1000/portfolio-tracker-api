const express = require('express')
const router = express.Router()


router.get('/', function (req, res) {
  res.send('Watchlist')
})

router.post('/', function (req, res) {
  console.log(req.body)
  res.send('You added a stock to your watchlist')
})

module.exports = router