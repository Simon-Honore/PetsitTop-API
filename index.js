const debug = require('debug')('opet:server'); // to log debug messages

require('dotenv').config(); // environment variables
const express = require('express'); // express
const expressSwagger = require('express-jsdoc-swagger'); // swagger for API doc
const cors = require('cors'); // cors
const swaggerOptions = require('./app/helpers/swagger'); // swagger options
const limiter = require('./app/helpers/limiter'); // rate-limit
const router = require('./app/routers'); // routers

const app = express();

// Swagger setup
expressSwagger(app)(swaggerOptions);

// Body Parsers setup :
// -----parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// -----parse application/json
app.use(express.json());

// CORS setup : For cross origin requests
app.use('/', cors({
  origin: process.env.CORS_DOMAINS.split(','), // allows our client domain or all origins
}), router);

// Client requests limiter setup :
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

// Routers setup :
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  debug(`App listening on port http://localhost:${PORT}`);
  console.log(`App listening on port http://localhost:${PORT}`); // For debugging online
});
