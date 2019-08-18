var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  res.send('Home Page')
})

router.get('/about', function (req, res) {
  res.send('Home Page # About')
})

module.exports = router