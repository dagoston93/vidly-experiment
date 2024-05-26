const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Unauthorized");
  if (!req.body.customerId) return res.status(400).send("customerId needed");
  if (!req.body.moviedId) return res.status(400).send("movieId needed");
});

module.exports = router;
