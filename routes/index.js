var express = require('express');
var router = express.Router();
const Disponibilite = require("../models/disponibilites");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




module.exports = router;
