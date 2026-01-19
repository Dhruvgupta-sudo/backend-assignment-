const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   
  max: 100,                   
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false
});


const setupMiddleware = (app) => {
  app.use('/api', limiter);
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = setupMiddleware;
