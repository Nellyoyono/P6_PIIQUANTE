//------import------
//importation de express pour l'enregistrement et la connexion des utilisateurs
const express = require("express");
//importation du router avec la méthode mise à disposition par Express
const router = express.Router();
//chemin vers User controllers
const userCtrl = require("../controllers/user");

//---------CREATION DES ROUTES --------------//
//envoie de l'adresse mail
router.post("/signup", userCtrl.signup);
//envoie du mot de passe
//vérifie les informations d'identification de l'utilisateur, en renvoyant l'identifiant userID depuis la base de données et un TokenWeb JSON signé(contenant également l'identifiant userID)
router.post("/login", userCtrl.login);

// ----------EXPORT------------------
module.exports = router;