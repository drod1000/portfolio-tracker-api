const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.send('Positions')
})

router.post('/', function (req, res) {
  console.log(req.body)
  res.send('You added a stock to your positions')
})

module.exports = router