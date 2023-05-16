var express = require("express");
var router = express.Router();

const Disponibilite = require("../models/disponibilites");
const Bungalow = require("../models/bungalows");

router.get("/aa", function (req, res, next) {
    const { destination, dateDebut, nombrePersonnes } = req.query;
  
    if (destination && !dateDebut && !nombrePersonnes) {
      // Recherche avec seulement la destination -----------------------
      Disponibilite.find({
        ville: destination,
      })
        .populate("bungalow")
        .then((data) => {
          if (!data || data.length === 0) {
            return res.json({ message: "Aucune disponibilité ne correspond à votre recherche." });
          } else {
            return res.json(data);
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des disponibilités.",
          });
        });
    } else if (destination && dateDebut && !nombrePersonnes) {
      // Recherche avec la  destination et dateDebut---------------------
      Disponibilite.find({
        ville: destination,
        dateDebut: dateDebut,
      })
        .populate("bungalow")
        .then((data) => {
          if (!data || data.length === 0) {
            return res.json({ message: "Aucune disponibilité ne correspond à votre recherche." });
          } else {
            return res.json(data);
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des disponibilités.",
          });
        });
    } else if (destination && dateDebut && nombrePersonnes) {
      // recherche avec trois données renseignées---------------------------
      Disponibilite.find({
        ville: destination,
        dateDebut: dateDebut,
        nombrePersonnes: { $lte: nombrePersonnes },
      })
        .populate("bungalow")
        .then((data) => {
          if (!data || data.length === 0) {
            return res.json({ message: "Aucune disponibilité ne correspond à votre recherche." });
          } else {
            return res.json(data);
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des disponibilités.",
          });
        });
    } else {
      return res.status(400).json({ error: "Paramètres de recherche invalides." });
    }
  });


router.post('/', async (req,res) => {
  console.log(req.body)
  const newDoc = await Disponibilite.create({ bungalow: req.body.bungalow })
  res.json(newDoc)
})







module.exports = router;
