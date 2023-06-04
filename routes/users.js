var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const token = uid2(32);
const hash = bcrypt.hashSync('password', 10);



router.get('/', function(req, res, next) { //faire un /users pour utiliser la route
  User.find().then(data => {
    res.json(data); // Envoie la liste des utilisateurs 
  }).catch(err => {
    res.status(500).json({ error: 'Une erreur s est produite lors de la récupération des utilisateurs.' });
  });
});

// ---- route SignUp -- CheckBody vérifie que l'élément email et password ne sont pas vide.

router.get('/signup', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
}

// ---- SIGNUP : Si l'user n'est pas déjà connecté alors on créé un nouvel utilisateur

User.findOne({email: req.body.email}).then(data => {
  if(data === null) {
    
    const newUser = new User({
      nom: req.body.nom,
      prenom: req.body.prenom,
      password: hash,
      email: req.body.email,
      token: uid2(32),
      inscriptionDate: req.body.inscriptionDate,
      entreprise: req.body.entreprise,
      role: req.body.role,
    })
    
    // SIGNUP: save user en base de données. 
    newUser.save().then(newDoc => {
      res.json({ result: true, message: 'User have good SignedUp!'})
    })
} else {
    res.json({ result: false, error: 'User already exists' })
  }
})
});


// !! SIGNIN --- Avec la fonction CheckBody, on vérifie que email et password ne sont pas des champs vides/
router.post('/signin', (req, res) => {
  if(!checkBody(req.body, (['email', 'password']))) {
    res.json({result: false, error: 'Missing or empty fields'})
  }

  // SIGNIN --- On recherche dans le modèle User, un email existant, si l'email et sont password crorespondent on connecte.
  User.findOne({email: req.body.email}).then(data => {
    console.log('email _', req.body.email)
    if(bcrypt.compareSync(req.body.password, data.password)) {
      res.json({result: true, token: data.token});
    } else {
      res.json({result: false, token: 'User not found or wrong password'})
      console.log('mdp _', data.password)
    }
  })
})

module.exports = router;
