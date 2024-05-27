const winston = require("winston");
const config = require("config");
require("winston-mongodb");
require("express-async-errors");

const db = config.get("db");

module.exports = function () {
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true,
      handleRejections: true,
    })
  );

  winston.add(
    new winston.transports.MongoDB({
      db: db,
      level: "error",
    })
  );

  if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({
        format: winston.format.simple(),
        handleExceptions: true,
        handleRejections: true,
      })
    );
  }
};
