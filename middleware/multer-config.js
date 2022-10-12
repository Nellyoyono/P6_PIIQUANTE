//importation du package multer qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require("multer");

//appel de MINE TYPE pour les images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//fonction "diskStorage" pour les images téléchargées par le user dans le disque
const storage = multer.diskStorage({
//fonction "destination" d'enregistrement des fichiers dans le dossier images qui prend 3 arguments (requète, file et un callback)
destination: (req, file, callback) => {
callback(null, "images");//Le callback renvoie vers la destination d'enregistrement qui est le dossier images
  },
//fonction "filename" qui prends 3 arguments
filename: (req, file, callback) => {
console.log(file);

// fonction d'origine du nom avec la méthode split et appellant .join
 // on crée le nom du fichier : prend le nom d'origine, le split 
// et remplace les espaces par des undescores
    const name = file.originalname.split(" ").join("_");
    
//utilisation de MINE TYPES
//on génère l'extension du fichier
const extension = MIME_TYPES[file.mimetype];

//appel du calback en ajoutant un date now
callback(null, name + Date.now() + "." + extension);
  },
});

//appel de la méthode multer et on lui passe storage
module.exports = multer({ storage: storage }).single("image"); 
