const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.error(err.message));

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
});

const Genre = mongoose.model("Genre", genreSchema);

const router = express.Router();

async function getGenres() {
  const genres = await Genre.find();
  return genres;
}

async function getGenre(id) {
  try {
    const genre = await Genre.findById(id);
    return genre;
  } catch {
    return null;
  }
}

async function saveGenre(genre) {
  return await genre.save();
}

async function deleteGenre(id) {
  return await Genre.findByIdAndDelete(id);
}

router.get("/", (req, res) => {
  getGenres().then((genres) => res.send(genres));
});

router.get("/:id", (req, res) => {
  getGenre(req.params.id).then((genre) => {
    if (!genre) {
      res.status(404).send("The genre with the given ID was not found.");
      return;
    }
    res.send(genre);
  });
});

// Testing: https://web.postman.co/workspace (Postman Desktop Agent must be running...)
router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }
  const genre = new Genre({
    name: req.body.name,
  });

  try {
    saveGenre(genre).then((genre) => res.send(genre));
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

router.put("/:id", (req, res) => {
  getGenre(req.params.id).then((genre) => {
    if (!genre) {
      res.status(404).send("The genre with the given ID was not found.");
      return;
    }

    const { error } = validateGenre(req.body);
    if (error) {
      // 400 Bad Request
      res.status(400).send(error.details[0].message);
      return;
    }

    try {
      genre.name = req.body.name;
      saveGenre(genre).then((genre) => res.send(genre));
    } catch (ex) {
      res.status(400).send(ex.message);
    }
  });
});

router.delete("/:id", (req, res) => {
  deleteGenre(req.params.id)
    .then((genre) => {
      if (!genre) {
        res.status(404).send("The genre with the given ID was not found.");
        return;
      }

      res.send(genre);
    })
    .catch(() =>
      res.status(404).send("The genre with the given ID was not found.")
    );
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

module.exports = router;
