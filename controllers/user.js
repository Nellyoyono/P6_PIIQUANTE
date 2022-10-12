//--------imports

// package de chiffrement bcrypt
const bcrypt = require("bcrypt"); 
//schéma des données utilisateurs
const User = require("../models/user"); 
//package "jsonwebtoken
const jwt = require("jsonwebtoken");

//--------fonction sign up inscription des utilisateurs

exports.signup = (req, res, next) => {
    bcrypt
    //hashage 10 fois du mot de passe avec bcrypt
    .hash(req.body.password, 10)
    //on recupere le H de mot de passe que l'on va enregistrer dans un nouveau users que lon va enregistrer
    //dans la base de données
    .then((hash) => {

    // on crée un nouvel utilisateur
      const user = new User({
        email: req.body.email, //comme adresmail, on va recupère le corps de la requête  
        password: hash, // hash le mot de passe quand l'utilisateur le crée
      });
      user
        .save() // on utilise la méthode Save de notre user pour l’enregistrer dans la base de données
        .then(() =>
          res.status(201).json({ message: "Utilisateur créé avec succès !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
//envoie l'erreur 500 dans un objet
    .catch((error) => res.status(500).json({ error }));
};

//-----fonction login permet aux utilisateurs existants de se connecter
exports.login = (req, res, next) => {
    // méthode findOne qui permet de vérifier si l'user existe et que c'est bien son mot de passe 
    User.findOne({ email: req.body.email })
      .then((user) => {
        console.log("user", user);
        if (!user) {
          // s'il n'existe pas retourne une erreur avec un message flou
          return res.status(401).json({ error: "Paire login/mot de pass incorecte !"});
        }
        bcrypt
          // fonction compare de bcrypt pour comparer les entrées (le mot de passe entré) et les données( hash enregistré dans la base de données)
          .compare(req.body.password, user.password)
          .then((valid) => {
            console.log("validation", valid);
            if (!valid) {
              // si c'est différent on retourne une erreur 401 avec message flo
              return res.status(401).json({ error:"Paire login/mot de pass incorecte !"});
            }
            res.status(200).json({
            //si le mot de passe est correct on retourne code 200 contenant l'ID utilisateur et un token
              userId: user._id,
              //appel de la fonction "sign" avec les arguments userid et la clefs secrète pour l'encodage-- 
              token: jwt.sign(
                //création du token et expiration de 24H
                { userId: user._id },
                "RANDOM_TOKEN_SECRET", // avec une clé secrète
                { expiresIn: "24h" } // qui est valide 24h
              ),
            });
          })
          //sinon erreur server (500)
          .catch((error) => res.status(500).json({ error }));
      })
      //sinon erreur de donnés 500
      .catch((error) => res.status(500).json({ error }));
  };
