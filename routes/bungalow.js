var express = require("express");
var router = express.Router();
const Bungalow = require("../models/bungalows");

router.post("/", async (req, res) => {
  const newDoc = await Bungalow.create(req.body);
  res.json(newDoc);
});

//---------route bungalow dispo

router.get("/dispo", async (req, res) => {
  console.log(req.query.dateString)
    const destination = req.query.destination;
    // formatage input dateSouhait = date("2023-08-01T00:00:00.000Z")
    // ====> remettre la date en dynamique
    const dateSouhait = new Date(req.query.dateString);
    // const dateSouhait = new Date(2023-07-19);
    const inputcapacite = parseInt(req.query.bodyCounter);
    console.log("datesouhait", dateSouhait)
    console.log("destination", destination)
    console.log("inputcapacite", inputcapacite)
    let matchCritere = {}
    //-- Filtre de recherche en fonction destination
    if (destination !== undefined) {
    matchCritere = {
      $or: [{ ville: destination }, { departementNom: destination }],
    };}
    //-- Filtre de capacite du bungalow
    if (inputcapacite) {
      const parsedCapacite = parseInt(inputcapacite);
      if (!isNaN(parsedCapacite)) {
        matchCritere.capacite = { $gte: parsedCapacite };
      }
    }
    //-- Filtre date de demarrage demarrage souhaité de la location
    if (dateSouhait) {
      const parsedDate = new Date(dateSouhait);
      if (!isNaN(parsedDate.getTime())) {
        matchCritere.$and = [
          { "disponibilites.dateDebut": { $lte: parsedDate } },
          { "disponibilites.dateFin": { $gte: parsedDate } },
        ];
      }
    }
    // 

    const results  = await Bungalow.aggregate([
      {
        $lookup: {
          from: "disponibilites",
          localField: "_id",
          foreignField: "bungalow",
          as: "disponibilites",
        },
      },
      {
        //preparation data capaciteAdulte + capaciteEnfant pour filtre capacité

        $addFields: {
          capacite: { $add: ["$capaciteAdulte", "$capaciteEnfant"] },
        },
      },
      {
        $match: matchCritere,
      },
    ]);
    res.json({ success: true, results});
  // } catch (error) {
  //   res.status(500).send(error);
  // }
});




module.exports = router;
