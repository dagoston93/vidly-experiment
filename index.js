require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const config = require("config");
const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

const error = require("./middleware/error");

winston.add(
  new winston.transports.File({
    filename: "logfile.log",
    handleExceptions: true,
    handleRejections: true,
  })
);

winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly",
    level: "error",
  })
);

// const p = Promise.reject(new Error("welll... we failed..."));
// p.then(() => console.log("done..."));
// throw new Error("xf");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined...");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.error(err.message));

const app = express();

app.use(express.json());

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

// Add error middleware LAST
app.use(error);

app.get("/", (req, res) => {
  res.send("Vidly!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
