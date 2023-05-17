var express = require("express");
var router = express.Router();

const Disponibilite = require("../models/disponibilites");

//Objectif route avec requete sur destination, date souhaité, nbr pers 


router.get("/:destination/:dateSouhait/:inputcapacite", async (req, res) => {
  const destination = req.params.destination;

// formatage input dateSouhait = date("2023-08-01T00:00:00.000Z")
  const dateSouhait = new Date(req.params.dateSouhait);
  
  const inputcapacite = parseInt(req.params.inputcapacite);

  //-- Filtre de recherche en fonction destination

  let matchCritere = {
    $or: [
      { "bungalow_dispo.ville": destination },
      { "bungalow_dispo.departementNom": destination },
    ],
  };
 

  //-- Filtre de recherche en fonction  de la Capacité
  if (inputcapacite) {
    matchCritere.capacite = {
      $gte: parseInt(inputcapacite),
    };
  }

  // --Filtre de recherche en fonction input datesouhait entre debut fin dispo

  if (dateSouhait) {
    matchCritere.$and = [
      { dateDebut: { $lte: dateSouhait } },
      { dateFin: { $gte: dateSouhait } },
    ];
  }

  const results = await Disponibilite.aggregate([
    {
      $lookup: {
        from: "bungalows",
        localField: "bungalow",
        foreignField: "_id",
        as: "bungalow_dispo",
      },
    },
    {//preparation data capaciteAdulte + capaciteEnfant pour filtre capacité
      $addFields: {
        capacite: {
          $sum: [
            { $arrayElemAt: ["$bungalow_dispo.capaciteAdulte", 0] },
            { $arrayElemAt: ["$bungalow_dispo.capaciteEnfant", 0] },
          ],
        },
      },
    },
 




    {
      $match: matchCritere,
    },
  ]);
  // pour visualiser les dates pour controle sur la console
  // console.log(dateSouhait);
  // console.log(results[0].dateFin);
  return res.json(results);
});

module.exports = router;

// router.post("/", async (req, res) => {
//   console.log(req.body);
//   const newDoc = await Disponibilite.create({ bungalow: req.body.bungalow });
//   res.json(newDoc);
