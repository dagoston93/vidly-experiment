const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  genre: genreSchema,
  numberInStock: {
    type: Number,
    min: 0,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genre: Joi.object({ name: Joi.string().min(3).max(50).required() }),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0),
  });

  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
