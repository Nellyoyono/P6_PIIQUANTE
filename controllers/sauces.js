//---imports---------

// importer le package "jsonwebtoken" pour créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");
//on importe notre nouveau modèle mongoose pour l'utiliser dans l'application
const Sauce = require("../models/sauces");
// importer le package "file system" qui permet de modifer le system des fichiers
const fs = require("fs");

//-------------LES 4 ETATS DU CRUD---------------//

//-----Creation de l'objet d'une Sauce
exports.createSauce = (req, res, next) => {
    //converti en json et je parse l'objet
    const sauceObject = JSON.parse(req.body.sauce);
    //suppression de l'id  généré automatiquement et envoyé par le front-end. 
    //L'id de la sauce est créé par la base MongoDB lors de la création dans la base
    delete sauceObject._id;
    //creation d'un new objet Sauce
    const sauce = new Sauce({
      ...sauceObject,
    //on modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    //sauvegarde de la sauce dans la base de donnée
    sauce.save()
      //newSauce retourne un status de réussite
      .then(() => res.status(201).send({ message: "Sauce enregistrée !" }))
      //en cas de souci nous recuperons l'erreur 
      .catch((error) => {
        console.log(error);
        res.status(400).json({ error });
      });
  };
  //-----afficher toutes les Sauces
  exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then((sauce) => {
        res.status(200).json(sauce);
      })
      .catch((error) => {
        res.status(404).json({ error: error });
      });
  };
  //-------- Afficher une Sauce
  exports.getOneSauce = (req, res, rest) => {
    //méthode find() permet de renvoyer un tableau contenant tous les sauce dans la base de données
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        res.status(200).json(sauce);
      })
      .catch((error) => {
        res.status(404).json({
          error: error,
        });
      });
  };
  
  //--------- Modifier une Sauce
  exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        }
      : { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }//pour modifier dans la base de donnée
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
  
      .catch((error) => res.status(400).json({ error }));
  };
  //----------- Supprimer une Sauce
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })//avant de modifier l'objet, on va le chercher pour obtenir l'url de l'image
      .then((Sauce) => {
        const filename = Sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {   //avec ce nom de fichier, on appelle unlink pour suppr le fichier
          Sauce.deleteOne({ _id: req.params.id })//on supprime le document correspondant de la base de données
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(400).json({ error }));
  };
  
  //--------------Gestion des Dislikes et Likes ------------------//
  // Like/Dislike une sauce.
exports.likeSauce = (req,res) => {
  const sauceId = req.params.id;
  const likeStatus = req.body.like;
  const userId = req.body.userId;
  switch(likeStatus) {
    // Si il s'agit d'un like
    case 1:
      Sauces.updateOne({ _id: sauceId }, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
      .then(() => res.status(200).json({ message: 'Like enregistré !'}))
      .catch(error => res.status(400).json({ error }));
      break;
    // Si il s'agit d'un dislike
    case -1:
      Sauces.updateOne({ _id: sauceId }, { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } })
      .then(() => res.status(200).json({ message: 'Dislike enregistré !'}))
      .catch(error => res.status(400).json({ error }));
      break;
    // Pour retiré son like/dislike
    case 0:
      Sauces.findOne({ _id: sauceId })
      .then( sauce => {
        // Si l'userId existe dans 'usersLiked'
        if(sauce.usersLiked.includes(userId)) {
          Sauces.updateOne(
            { _id: sauceId },
            { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
          )
          .then(() => res.status(201).json({ message: "Like retiré !" }))
          .catch((error) => res.status(400).json({ error }));
        }
        // Si l'userId existe dans 'usersDisliked'
        else if(sauce.usersDisliked.includes(userId)) {
          Sauces.updateOne(
            { _id: sauceId },
            { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
          )
          .then(() => res.status(201).json({ message: "Dislike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
        }
        // Si userId n'est pas présent dans les Arrays.
        else {
          res.status(403).json({ message: "Impossible d'interagir."})
          .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch(() => res.status(500).json({ message: 'Impossible de trouver la sauce!' }));
      break;
  }
};
  