//---imports --------
const express = require("express");

// creation d'un router avec la methode router d'express
const router = express.Router();

//importation du controlleur "sauce"const sauceCtrl = require('../controllers/sauce');
const saucesCtrl = require("../controllers/sauces");

//importation du middleware d'authentification
const auth = require('../middleware/auth');

//importation du middleware "multer"
const multer = require('../middleware/multer-config');

// Routes ((CRUD: create/read/update/delete)----)


router.get('/', auth, saucesCtrl.getAllSauce);//afficher toutes les sauces
router.get('/:id', auth, saucesCtrl.getOneSauce);//afficher une sauce par son id
router.put('/:id', auth, multer, saucesCtrl.modifySauce);//modifier une sauce, seul l'utilisateur créé la sauce peut la modifier, multer pour les images entrants
router.delete('/:id', auth, saucesCtrl.deleteSauce);//supprimer une sauce, seul l'utilisateur créé la sauce peut la supprimer
router.post('/:id/like', auth, saucesCtrl.likeSauce);//gérer les "likes" et "dislikes"
router.post('/', auth, multer, saucesCtrl.createSauce);//créer une sauce + obligation d'authentifier + multer pour les images entrants

// ----------EXPORT------------------
module.exports = router;  //exporter ce module "router" pour le réutiliser ailleurs