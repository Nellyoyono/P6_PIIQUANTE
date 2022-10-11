//---imports---------

//on importe notre nouveau modèle mongoose pour l'utiliser dans l'application
const Sauce = require("../models/sauce");
// importer le package "file system" qui permet de modifer le system des fichiers
const fs = require("fs");



//-----Afficher toutes les Sauces

//Utilisation de la méthode find() du modèle Mongoose qui renvoit un tableau de toutes les Sauces de notre base de données

exports.getAllSauce = (req, res, next) => {
  //Récupération de la liste compléte des sauces avec method sauce.find
  Sauce.find()
  .then((sauce) => {res.status(200).json(sauce); //réussite code 200
    }) 
    .catch((error) => {res.status(404).json({ error: error });//si erreur on retourne un message d'erreur
    });
};

//-------- Afficher une Sauce
  
exports.getOneSauce = (req, res, rest) => {
    //méthode find() permet de renvoyer un tableau contenant tous les sauce dans la base de données
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {res.status(200).json(sauce);
      })
      .catch((error) => {res.status(404).json({error: error,});//réponse d'erreur avec code 404
      });
  };


  //--------- Modifier une Sauce
exports.modifySauce = (req, res, next) => {
    //création d'un objet en demande si il y a une image à modifier
    const sauceObject = req.file? {
    //récupération les infos des objets
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`}
      : { ...req.body }; //sinon reprise de l'objet en gardant l'image initiale
    //Modification de la sauce avec la méthode 'upateOne'
      Sauce.updateOne(
      { _id: req.params.id },//sélection de l'objet par son id
      { ...sauceObject, _id: req.params.id }//pour modifier dans la base de donnée
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
  
      .catch((error) => res.status(400).json({ error }));
  };
 //----------- Supprimer une Sauce
  exports.deleteSauce = (req, res, next) => {
    //Récupération de l'objet à supprimé avec 'findOne' et id
    Sauce.findOne({ _id: req.params.id })//avant de modifier l'objet, on va le chercher pour obtenir l'url de l'image
      .then((Sauce) => {
        const filename = Sauce.imageUrl.split("/images/")[1];//récupération du fichier
        fs.unlink(`images/${filename}`, () => {   //avec ce nom de fichier, on appelle unlink pour suppr le fichier
          Sauce.deleteOne({ _id: req.params.id })//on supprime le document correspondant de la base de données
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(400).json({ error }));
  };

//----------gestion des likes et dislike (Post/:id/like)----


exports.likeSauce = (req, res, next) => {

//case 1 Si l'utilisateur like une sauce. On incrémente de +1 pour le like
  if (req.body.like === 1) { 
    Sauce.updateOne({ _id: req.params.id}, //on recherche la sauce avec le _id présent dans la requête
    { $inc: { likes: +1 },//on incrémente de 1 la valeur de likes
    $push: { usersLiked:req.body.userId } })//on ajoute l'utilisateur dans le array usersLiked
     .then(() => res.status(200).json({ message: 'Like enregistré !'}))
     .catch(error => res.status(400).json({ error }));

  
 //Cas n°2: L'utilisateur Dislike une sauce. On incrémente de +1 pour le dislike. 
    } else if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id },//on recherche la sauce avec le _id présent dans la requête
        { $inc: { dislikes: +1 },//on incrémente de 1 la valeur de dislikes
        $push: { usersDisliked: req.body.userId  } }) //on rajoute l'utilisateur à l'array usersDiliked
     .then(() => res.status(200).json({ message: 'Dislike enregistré !'}))
     .catch(error => res.status(400).json({ error }));


//---retirer like ou dislike 
//Cas n°3: L'utilisateur annule son choix. Il annule son like donc on décremente de 1 son choix.
//Il annule un dislike donc on décremente de 1 son choix.
    } else { 
      Sauce.findOne({ _id: req.params.id })
      .then( sauce => {
        // Si l'userId existe dans 'usersLiked'
        if(sauce.usersLiked.includes(req.body.userId )) {//on vérifie si le user a déjà like cette sauce
          Sauce.updateOne({ _id: req.params.id },
            { $inc: { likes: -1 }, //on décrémente la valeur des likes de 1 (soit -1)=Retire le likes
             $pull: { usersLiked: req.body.userId } }) //si oui, on va mettre à jour la sauce avec le _id présent 
          .then(() => res.status(201).json({ message: "Like retiré !" }))
          .catch((error) => res.status(400).json({ error }));
        }
        // Si l'userId existe dans 'usersDisliked'
        else if(sauce.usersDisliked.includes(req.body.userId)) { //on vérifie si l'utilisateur a déjà dislike cette sauce
          Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId  } })
          .then(() => res.status(201).json({ message: "Dislike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
        }
        // Si userId n'est pas présent dans les Arrays.
        else {res.status(403).json({ message: "Impossible d'interagir."})
        .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch(() => res.status(500).json({ message: 'Impossible de trouver la sauce!' })); //réponse d'erreur avec code 500
    
  }
};

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
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
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



