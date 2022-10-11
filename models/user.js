//---------importation mongoose
const mongoose = require("mongoose");//création d'un model user avec mongoose

//pluging de moogose validator 
const uniqueValidator = require("mongoose-unique-validator");

//---------creation schema du schema de validation
const userSchema = mongoose.Schema({
//adresse mail de l'utilisateur avec H de type string et unique
  email: { type: String, required: true, unique: true },//"unique" s'assure que deux utilisateurs ne puissent pas utiliser la même adresse e-mail
  password: { type: String, required: true }, //mot de passe de l'utilisateur
});

//-----------application du pluging uniqueVaidator au shéma de données
// mongoose uniqueVaidator s'assure que 2 utilisateurs ne puissent pas utiliser la même adresse e-mail
userSchema.plugin(uniqueValidator);


//-------Exportation du shéma sous forme de model en utilisant la fonctionmodel()
module.exports = mongoose.model("User", userSchema);
//on utilise la fonction modèle de mongoose, le modéle va s'appeler User, et on lui passer userSchema comme schéma de données

