const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");

const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

const express = require("express");
const Joi = require("joi");

const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("rental not found");
  if (rental.dateReturned) return res.status(400).send("rental processed.");

  rental.return();
  await rental.save();

  await Movie.findByIdAndUpdate(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );
  res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
