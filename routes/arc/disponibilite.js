var express = require("express");
var router = express.Router();

const Disponibilite = require("../models/disponibilites");
const Bungalow = require("../models/bungalows");

router.get("/bb", function (req, res, next) {
  //faire un /lieu date nbr pers
  // const { lieu, dateDebut, nbrSemaine, nombrePersonnes } = req.query

  console.log(req.query)
  
  Disponibilite.find(
  //   {
  //   $or: [
  //     { 'bungalow.ville': destination },
  //    { 'bungalow.departementNom': destination }
  //   ]
  // }
  )
    .populate("bungalow")
    // .populate('users')
    .then((data) => {

      if (!data || data.length === 0) {
        return res.json({ message: "Aucune disponibilité ne correspond à votre recherche." });
      } else {
        return res.json(data);
      }




  




      
    });
//   .catch(err => {
//     res.status(500).json({ error: 'Une erreur s est produite lors de la récupération des dispo.' });
//   });
});


router.post('/', async (req,res) => {
  console.log(req.body)
  const newDoc = await Disponibilite.create({ bungalow: req.body.bungalow })
  res.json(newDoc)
})







module.exports = router;
