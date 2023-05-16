var express = require("express");
var router = express.Router();
const Bungalow = require("../models/bungalows");

router.post("/", async (req, res) => {
  const newDoc = await Bungalow.create(req.body);
  res.json(newDoc);
});

module.exports = router;
