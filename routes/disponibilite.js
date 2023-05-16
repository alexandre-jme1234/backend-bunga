var express = require("express");
var router = express.Router();

const Disponibilite = require("../models/disponibilites");

//faire un /lieu date nbr pers
// , dateDebut, nombrePersonnes

// console.log(bungalow_dispo)

router.get("/tt/:destination", async (req, res) => {
  const destination = req.params.destination;
  console.log(req.params);

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
      $match: {
        $or: [
        {"bungalow_dispo.ville": destination},
        {"bungalow_dispo.departementNom": destination}
        ]
      },
    },
  ]);
  return res.json(results);
});

module.exports = router;

// router.post("/", async (req, res) => {
//   console.log(req.body);
//   const newDoc = await Disponibilite.create({ bungalow: req.body.bungalow });
//   res.json(newDoc);
