const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

const db = config.get("db");

module.exports = function () {
  mongoose
    .connect(db)
    .then(() => winston.info(`Connected to MongoDb (DB: ${db})`));
};
