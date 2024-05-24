const express = require("express");
const winston = require("winston");

const initValidation = require("./startup/validation");
const initRoutes = require("./startup/routes");
const initDatabase = require("./startup/database");
const initLogging = require("./startup/logging");
const initConfig = require("./startup/config");

const app = express();
initLogging();
initConfig();
initValidation();
initDatabase();
initRoutes(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}`);
});

module.exports = server;
