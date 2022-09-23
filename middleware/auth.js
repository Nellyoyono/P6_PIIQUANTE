// pour créer des token aléatoires et uniques pour la connexion
const jwt = require("jsonwebtoken");

// j'exporte le module de token
//Cette Fonction, fait que seul le bon utililsateur puisse changer sa sauce
module.exports = (req, res, next) => {
    try {
// récupérer le token dans le header autorisation, le split
// et récupérer le deuxième élément du tableau renvoyé
      const token = req.headers.authorization.split(" ")[1];

// décoder le token avec fonction verify de jwt, le token payload et sa clé secrète en argument
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      // extraire le userId grace au token
      const userId = decodedToken.userId;
//ajout d'un attribut à l'objet "request" le rend accessible à tous les middlewares  
      req.auth = {
            userId: userId
        };
 
// si on a un userId dans le corps de la requête
// et qu'il est différent du userId = erreur
      if (req.body.userId && req.body.userId !== userId) {
        throw "Identifiant non valide"; //Renvoie l'erreur
      } else {
// si tout va bien, le prochain Middleware est appelé
        next();
      }
    } catch (error) {
      console.log("erreur d'authentification", error);
      
// renvoyer une erreur 401, problème d'authentification
      res.status(401).json({ error: error | "Requête non authentifiée" });
    }
  };