var express = require('express')
var router = express.Router()

// define the home page route
router.get('/', function (req, res) {
  res.send('Home Page')
})
// define the about route
router.get('/about', function (req, res) {
  res.send('Home Page # About')
})

module.exports = router