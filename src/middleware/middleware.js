const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const setupMiddleware = (app) => {
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = setupMiddleware;
