var express = require('express');
var router = express.Router();

const User = require('../models/users');



router.get('/', function(req, res, next) { //faire un /users pour utiliser la route
  User.find().then(data => {
    res.json(data); // Envoie la liste des utilisateurs 
  }).catch(err => {
    res.status(500).json({ error: 'Une erreur s est produite lors de la récupération des utilisateurs.' });
  });
});




module.exports = router;
