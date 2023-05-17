var express = require("express");
var router = express.Router();

const Disponibilite = require("../models/disponibilites");

//faire un /lieu date nbr pers
// , dateDebut, nombrePersonnes

// console.log(bungalow_dispo)

router.get("/:destination/:dateSouhait/:inputcapacite", async (req, res) => {
  const destination = req.params.destination;

  const dateSouhait = new Date(req.params.dateSouhait);
  // const dateSouhait = date("2023-08-01T00:00:00.000Z")

  const inputcapacite = parseInt(req.params.inputcapacite);

  // création des critères de recherche en fonction destination date et nbr de pers max

  let matchCritere = {
    $or: [
      { "bungalow_dispo.ville": destination },
      { "bungalow_dispo.departementNom": destination },
    ],
  };
  //-------------------------------Date de souhait

  // //-----------------------------Capacité
  if (inputcapacite) {
    matchCritere.capacite = {
      $gte: parseInt(inputcapacite),
    };
  }

  // ---------------------Filtre date souhait entre debut fin dispo

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
    {
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
  console.log(dateSouhait);
  console.log(results[0].dateFin);
  return res.json(results);
});

module.exports = router;

// router.post("/", async (req, res) => {
//   console.log(req.body);
//   const newDoc = await Disponibilite.create({ bungalow: req.body.bungalow });
//   res.json(newDoc);
