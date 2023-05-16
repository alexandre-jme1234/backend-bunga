const mongoose = require("mongoose");

const disponibiliteSchema = mongoose.Schema({
  dateDebut: { type: Date },
  dateFin: { type: Date },
  dateDemandeReservation: { type: Date },
  dateReponseReservation: { type: Date },
  tarif: Number,
  paye: Boolean,
  paiementDate: Date,
  bungalow: { type: mongoose.Schema.Types.ObjectId, ref: "bungalows" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Disponibilite = mongoose.model("disponibilites", disponibiliteSchema);

module.exports = Disponibilite;
