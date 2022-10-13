# P6_PIIQUANTE

C'est projet est destiné à construire une API sécurisée pour une application web de critique d'avis gastronomique.

# Exigences de sécurité

-Le mot de passe de l'utilisateur doit être hashé

-L'authentification doit être renforcée sur toutes les routes sauce requises

-Les emails dans la base de données sont uniques et un plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler les erreurs

-La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la machine d'un utilisateur

-Un plugin Mongoose doit assurer la remontée des erreurs issues de la base de données

-Les versions les plus récentes des logiciels sont utilisées avec des correctifs de sécurité actualisés

-Le contenu du dossier images ne doit pas être téléchargé sur GitHub

Clonez ce repository.

# Piquante - Backend
Depuis le dossier backend : Telechargez et ouvrez Node.js. Tapez la commande suivante : "npm start". Puis lancez le serveur en tapant la commande : "nodemon server".

Le serveur doit fonctionner sur "localhost" avec le port par défaut "3000".

# Piquante - Frontend (angular)
Le frontend présente la partie utilisateur de l'application. Il doit être lancé avec un serveur local , et nécessite que le backend soit lancé lui aussi pour fonctionner correctement.
Pour faire fonctionner le projet, Exécutez npm run start

# Development server
Démarrer ng serve pour avoir accès au serveur de développement. 
Rendez-vous sur http://localhost:4200/. 
L'application va se recharger automatiquement si vous modifiez un fichier source.

# Authentification routes :
POST: /api/auth/signup
POST: /api/auth/login

# Sauces routes :
GET: /api/sauces
GET: /api/sauces/:id
POST: /api/sauces
PUT: /api/sauces/:id
DELETE: /api/sauces/:id
POST: /api/sauces/:id/like

