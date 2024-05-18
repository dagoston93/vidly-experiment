const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.error(err.message));

const app = express();

app.use(express.json());
app.use("/api/genres", genres);

app.get("/", (req, res) => {
  res.send("Vidly!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
