const express = require("express");
const { Rental, validate } = require("../models/rental");

const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Unauthorized");
  if (!req.body.customerId) return res.status(400).send("customerId needed");
  if (!req.body.movieId) return res.status(400).send("movieId needed");

  const rental = await Rental.findOne({
    customerId: req.body.customerId,
    movieId: req.body.movieId,
  });

  if (!rental) return res.status(404).send("rental not found");
});

module.exports = router;
