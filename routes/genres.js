const express = require("express");
const Joi = require("joi");

const router = express.Router();

const genres = [
  {
    id: 1,
    name: "Action",
  },
  {
    id: 2,
    name: "Sci-Fi",
  },
  {
    id: 3,
    name: "Documentary",
  },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre with the given ID was not found.");
    return;
  }

  res.send(genre);
});

// Testing: https://web.postman.co/workspace (Postman Desktop Agent must be running...)
router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

router.put("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
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

  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre with the given ID was not found.");
    return;
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

module.exports = router;
