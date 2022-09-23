//------import------
//importation de express pour l'enregistrement et la connexion des utilisateurs
const express = require("express");
//importation du router
const router = express.Router();
//chemin vers User controllers
const usersCtrl = require("../controllers/users");

//---------CREATION DES ROUTES --------------//
//envoie de l'adresse mail
router.post("/signup", usersCtrl.signup);
//envoie du mot de passe
router.post("/login", usersCtrl.login);

// ----------EXPORT------------------
module.exports = router;