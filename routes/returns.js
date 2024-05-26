const express = require("express");
const { Rental, validate } = require("../models/rental");

const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId) return res.status(400).send("customerId needed");
  if (!req.body.movieId) return res.status(400).send("movieId needed");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) return res.status(404).send("rental not found");
  if (rental.dateReturned) return res.status(400).send("rental processed.");

  res.status(200).send("");
});

module.exports = router;
