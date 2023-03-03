const debug = require('debug')('opet:server'); // to log debug messages

require('dotenv').config(); // variables d'environnement
const express = require('express'); // express
const cors = require('cors'); // cors
const rateLimit = require("express-rate-limit"); // Limite rate
const expressSwagger = require('express-jsdoc-swagger');
const path = require('path');

const router = require('./app/routers'); // router

const app = express();

const swaggerOptions = {
  info: {
    version: '1.0.0',
    title: 'Petsitter Friendly',
    description: 'This is an API for an app to find and contact petsitters',
  },
  baseDir: path.join(__dirname, 'app'),
  filesPattern: './**/*.js',
  swaggerUIPath: '/api-docs',
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

expressSwagger(app)(swaggerOptions);

const PORT = process.env.PORT || 3000;

// Body Parser
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

// For cross origin requests
app.use('/', cors({
  origin: process.env.CORS_DOMAINS ?? '*', // allow all origins
}), router);

// On limite le nombre de requête des clients
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// pour ne plus utiliser controllerHandler on pass next (=tous les middlewares suivants) dans try:
// app.use((req, res, next) => {
//   try {
//     next();
//   } catch (err) {
//     debug(err.message);
//     const status = err.statusCode || 500;
//     const { message } = err;
//     res.status(status).json({ error: message });
//   }
// });

// Routage
app.use(router);

app.listen(PORT, () => {
  debug(`App listening on port http://localhost:${PORT}`);
});
