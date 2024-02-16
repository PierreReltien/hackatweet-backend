var express = require('express');
var router = express.Router();
require('../models/connection');

const User = require('../models/users');
const { checkBody } = require ('../modules/checkboby');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const Tweet = require('../models/tweets');

//--> Route Post signup

router.post('/signup', (req, res) => {

  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Champ vide ou manquant' });
    return;
  }

//--> Vérification d'un compte déjà existant

  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        firstname: req.body.firstname,
        username: req.body.username,
        password: hash,
        token: uid2(32),
        canTweet: true,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User déjà existant dans la database
      res.json({ result: false, error: 'Utilisateur déjà existant' });
    }
  });
});

//--> Route Post signin

router.post('/signin', (req, res) => {

  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Champ vide ou manquant' });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'Utilisateur non trouvé ou mot de passe erroné' });
    }
  });
});


//--> route poster un tweet

router.post('/tweet', (req, res) => {
  try {
    // Vérification du champ de message
    if (!checkBody(req.body, ['message', 'token'])) {
      return res.json({ result: false, error: 'Utilisateur inexistant ou non connecté' });
    }

    // Création d'un nouveau tweet avec l'_ID (via token) de l'utilisateur connecté
   
  User.findOne({token : req.body.token}).then(data => {

    const newTweet = new Tweet({
      username: data._id,
      message: req.body.message,
      liked: 0,
    });
  
    // Enregistrement du tweet dans la base de données
    
    newTweet.save().then((data) => {
      return res.json({ result: true, tweet: data });
      
    });
      

  }) 
   
  } catch (error) {
    console.error(error);
    // En cas d'erreur, renvoyer un message d'erreur
    return res.json({ result: false, error: 'Une erreur est survenue lors de la publication du message' });
  }
});



//—> récupérer tous les tweets

router.get('/tweet', (req, res) => {

  Tweet.find()
    .then(data => {
      if (data) {
        res.json({ result: true, Tweet });
      } else {
        res.json({ result: false, error: 'pas de nouveau message' });
      }
    });
});


//--> Effacer un tweet par le biais de la corbeille
/*
router.delete('/tweet', (req, res) => {
 
  
    }

*/



module.exports = router;