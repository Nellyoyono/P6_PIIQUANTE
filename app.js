//Installation de express
const express = require('express');

//Installation de Moogose est le module pour utiliser MongoDB
const mongoose = require("mongoose");

//installation du module qui donne accès au chemin de fichiers
const path = require("path");

//sécuriser les en-tête http (headers) de l'application express
const helmet = require("helmet");

//import "dotenv": charger les variables d'environnement stockées dans le fichier .env et protége les informations de connexion
const dotenv = require("dotenv");
dotenv.config();



//------Importation de routes vers l'utilisateur et les sauces 
//parcours des routes 
const sauceRoutes = require("./routes/sauce");
//parcours des utilisateurs 
const userRoutes = require("./routes/user");

//appel au module Express avec sa fonction
const app = express();


//---connection Base de données Mongoose
mongoose.connect('mongodb+srv://Piiquanteprojet2209:teste@cluster0.owwqvaf.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//gérer les requêtes 'POST' venant du frontend : besoin d'extraire le corps JSON des requêtes
app.use(express.json())

// middelware de configuration de CORS
//qui permet aux 2 ports front et end de communiquer entre eux
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // lorigin qui a le droit dacceder cest tout le monde"*"// permet d'accéder a l'API depuis n'importe quelle origine
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    ); // autorisation d'utiliser certains headers sur l'objet requête
    res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS"); // permet d'envoyer des requêtes avec ces méthodes
    next(); // passe l'exécution au middleware suivant
  });


//-----les routes d'API

//route pour accéder aux images du dossier image
app.use("/images", express.static(path.join(__dirname, "images")));
//route pour les sauces
app.use("/api/sauces", sauceRoutes);
//route pour l'authentification des utilisateurs
app.use("/api/auth/", userRoutes);

// je protège l'appli de certaines vulnerabilités en protégeant les en-têtes
app.use(helmet());

//export ce module "app" pour y accéder depuis les autres fichiers
module.exports = app;





















