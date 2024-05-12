const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("Vidly!");
});

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send("The genre with the given ID was not found.");
    return;
  }

  res.send(genre);
});

// Testing: https://web.postman.co/workspace (Postman Desktop Agent must be running...)
app.post("/api/genres", (req, res) => {
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

app.put("/api/genres/:id", (req, res) => {
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

app.delete("/api/genres/:id", (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
