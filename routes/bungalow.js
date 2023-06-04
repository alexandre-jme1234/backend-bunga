var express = require("express");
var router = express.Router();
const Bungalow = require("../models/bungalows");

router.post("/", async (req, res) => {
  const newDoc = await Bungalow.create(req.body);
  res.json(newDoc);
});

//---------route bungalow dispo

router.get('/', async (req, res) => {
  const bungalows = await Bungalow.find()
  return res.json({ bungalows })
})

router.get('/hello', (req, res) => {
  return res.json({ message: 'hello'})
})

router.get("/dispo", async (req, res) => {
  console.log(req.query.dateString);
  const destination = req.query.destination;

  // formatage input dateSouhait = date("2023-08-01T00:00:00.000Z")

  const dateSouhait = new Date(req.query.dateString);

  const inputcapacite = parseInt(req.query.bodyCounter);
  console.log("datesouhait", dateSouhait);
  console.log("destination", destination);
  console.log("inputcapacite", inputcapacite);
  let matchCritere = {};
  //-- MatchCriter  : Filtre de recherche en fonction destination. Stocke aux critères au bon format avant de requêter la BDD.
  if (destination !== undefined) {
    matchCritere = {
      $or: [{ ville: destination }, { departementNom: destination }],
    };
  }
  //-- Filtre de capacite du bungalow
  if (inputcapacite) {
    const parsedCapacite = parseInt(inputcapacite);

  // ----- isNaN : seulement si parsedCapacite est un nombre, on renvoit tous les bungalows qui ont la capacité (enfant+adulte) >=
    if (!isNaN(parsedCapacite)) {
      matchCritere.capacite = { $gte: parsedCapacite };
    }
  }

  //-- Filtre date de demarrage souhaité de la location
  if (dateSouhait) {
    // --- convertir Parsed en Date. 
    const parsedDate = new Date(dateSouhait);

    // --- Renvoie strictement la date en heure en nombre.
    if (!isNaN(parsedDate.getTime())) {
      // ---- Date comprise entre date de début($lte date Min) & date de fin(&gte date Max)
      matchCritere.$and = [
        { "disponibilites.dateDebut": { $lte: parsedDate } },
        { "disponibilites.dateFin": { $gte: parsedDate } },
      ];
    }
  }
  // --- mettre toutes les bungalows et leurs disponibilités en les aggrégate.
  const results = await Bungalow.aggregate([
    {
      $lookup: {
        from: "disponibilites",
        localField: "_id",
        // ---- clé étrangère : bungalow.
        foreignField: "bungalow",
        as: "disponibilites",
      },
    },
    {
      //ajout dans l'aggregat results capaciteAdulte + capaciteEnfant pour filtre capacité
      $addFields: {
        capacite: { $add: ["$capaciteAdulte", "$capaciteEnfant"] },
      },
    },
        // ---- Filtre les valeurs du client pour qu'elle soit comprise par la BDD.
    {
      $match: matchCritere,
    },
  ]);
  res.json({ success: true, results });
});

module.exports = router;
