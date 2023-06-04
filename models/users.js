const mongoose = require('mongoose');



const userSchema = mongoose.Schema({
	nom: String,
	prenom: String,
	email: String,
	token: String,
	inscriptionDate: Date,
	entreprise: String,
	role: String,
	password: String
});

const User = mongoose.model('users', userSchema);

module.exports = User;
