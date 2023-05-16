const mongoose = require('mongoose');

const bungalowSchema = mongoose.Schema({
	nom: String,
	surface: Number,
	chambre: Number,
	terrasse: Number,
	capaciteAdulte: Number,
	capaciteEnfant: Number,
	climatisation: Boolean,
	télévision: Boolean,
	wifi: Boolean,
	lave_vaisselle: Boolean,
	machineCafe: Boolean,
	plancha: Boolean,
	piscine: Boolean,
	barbecue: Boolean,
	chien: Boolean,
	adresse1: String,
	adresse2: String,
	ville: String,
	codePostal: String,
	departementNom:String,
	image: String,
	proprietaire: {
		prenom: { type: String
		},
		nom: {	  type: String
		},
		email: {  type: String
		}
	  }
});

const Bungalow = mongoose.model('bungalows', bungalowSchema);

module.exports = Bungalow;
