const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({	
	dateDebut: { type: Date },
	dateFin: { type: Date },
	dateDemandeReservation: { type: Date },
	dateReponseReservation: { type: Date },
	tarif: Number,
	paye: Boolean,
	paiementDate: Date,
	bungalow: { type: mongoose.Schema.Types.ObjectId, ref: 'bungalows' },
	users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});

const Reservation = mongoose.model('reservations', reservationSchema);

module.exports = Reservation;
