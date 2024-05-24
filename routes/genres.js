const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

const { Genre, validate } = require("../models/genre");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  //throw new Error("Could not get genres...");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found.");
  }
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  let genre = new Genre({
    name: req.body.name,
  });

  genre = await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    res.status(404).send("The genre with the given ID was not found.");
    return;
  }

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre) {
    res.status(404).send("The genre with the given ID was not found.");
    return;
  }

  res.send(genre);
});

module.exports = router;
