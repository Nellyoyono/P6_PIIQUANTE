//---imports

//on importe notre nouveau modèle mongoose pour l'utiliser dans l'application
const Sauce = require("../models/sauce");
// importer le package "file system" qui permet de modifer le system des fichiers
const fs = require("fs");



//-----afficher toutes les sauces

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
  .then((sauce) => {res.status(200).json(sauce);
    }) 
    .catch((error) => {res.status(404).json({ error: error });
    });
};

//-------afficher une Sauce
  
exports.getOneSauce = (req, res, rest) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {res.status(200).json(sauce);
      })
      .catch((error) => {res.status(404).json({error: error,});
      });
  };


  //--------modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`}
      : { ...req.body }; 
      Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
  
      .catch((error) => res.status(400).json({ error }));
  };
 //-----------supprimer une Sauce
  exports.deleteSauce = (req, res, next) => {
   
    Sauce.findOne({ _id: req.params.id })
      .then((Sauce) => {
        const filename = Sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {   
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(400).json({ error }));
  };

//---------gestion des likes et dislike (Post/:id/like)


exports.likeSauce = (req, res, next) => {

  if (req.body.like === 1) { 
    Sauce.updateOne({ _id: req.params.id},
    { $inc: { likes: +1 },
    $push: { usersLiked:req.body.userId } })
     .then(() => res.status(200).json({ message: 'Like enregistré !'}))
     .catch(error => res.status(400).json({ error }));

  
  
    } else if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id },
        { $inc: { dislikes: +1 },
        $push: { usersDisliked: req.body.userId  } }) 
     .then(() => res.status(200).json({ message: 'Dislike enregistré !'}))
     .catch(error => res.status(400).json({ error }));


//---retirer like ou dislike 

    } else { 
      Sauce.findOne({ _id: req.params.id })
      .then( sauce => {
        if(sauce.usersLiked.includes(req.body.userId )) {
          Sauce.updateOne({ _id: req.params.id },
            { $inc: { likes: -1 }, 
             $pull: { usersLiked: req.body.userId } })  
          .then(() => res.status(201).json({ message: "Like retiré !" }))
          .catch((error) => res.status(400).json({ error }));
        }
        else if(sauce.usersDisliked.includes(req.body.userId)) { 
          Sauce.updateOne({ _id: req.params.id },{ $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId  } })
          .then(() => res.status(201).json({ message: "Dislike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
        }
   
        else {res.status(403).json({ message: "Impossible d'interagir."})
        .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch(() => res.status(500).json({ message: 'Impossible de trouver la sauce!' })); 
    
  }
};

//-----creation de l'objet d'une Sauce
exports.createSauce = (req, res, next) => {
    
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
   
    sauce.save()
     
      .then(() => res.status(201).send({ message: "Sauce enregistrée !" }))
     
      .catch((error) => {
        console.log(error);
        res.status(400).json({ error });
      });
  };



