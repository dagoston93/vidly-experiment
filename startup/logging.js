const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

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
      db: "mongodb://localhost/vidly",
      level: "error",
    })
  );

  winston.add(
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
      handleExceptions: true,
      handleRejections: true,
    })
  );
};
