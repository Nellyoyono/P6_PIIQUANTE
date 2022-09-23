//---------importation mongoose----------------
//avec
const mongoose = require("mongoose");
//pluging de moogose validator prévalide les informations avant de les enregistrer
const uniqueValidator = require("mongoose-unique-validator");

//---------creation schema du schema de validation---------------
const userSchema = mongoose.Schema({
//adresse mail de l'utilisateur avec H de type string et unique
  email: { type: String, required: true, unique: true },//"unique" s'assure que deux utilisateurs ne puissent pas utiliser la même adresse e-mail
  password: { type: String, required: true }, //mot de passe de l'utilisateur
});

//-----------application du pluging uniqueVaidator au shéma de données---
// mongoose uniqueVaidator s'assure que 2 utilisateurs ne puissent pas utiliser la même adresse e-mail
userSchema.plugin(uniqueValidator);


//-------Exportation du shéma sous forme de model en utilisant la fonctionmodel()
module.exports = mongoose.model("User", userSchema);


