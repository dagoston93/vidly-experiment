const _ = require("lodash");
const express = require("express");
const { User, validate } = require("../models/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    // 400 Bad Request
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User with given e-mail already registered.");
  }

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
