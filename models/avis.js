const mongoose = require('mongoose');

const avisSchema = mongoose.Schema({
	note: Number,
	date: Date,
	commentaire: String,
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
	bungalow: { type: mongoose.Schema.Types.ObjectId, ref: 'bungalows' },
});

const Avis = mongoose.model('avis', avisSchema);

module.exports = Avis;
