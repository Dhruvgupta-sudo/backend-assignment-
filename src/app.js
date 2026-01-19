const express = require("express");
const app = express();

const setupMiddleware = require("./middleware/middleware");
const setupRoutes = require("./routes/v1/routes");

// Setup Middleware
setupMiddleware(app);

// Setup Routes
setupRoutes(app);

module.exports = app;
