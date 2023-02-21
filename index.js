const debug = require('debug')('opet:server'); // to log debug messages

require('dotenv').config(); // variables d'environnement
const express = require('express'); // express
// const cors = require('cors'); // cors
const router = require('./app/routers'); // router

const app = express();
const PORT = process.env.PORT || 3000;

// For cross origin requests
// app.use('/', cors({
//   origin: '*', // allow all origins
// }), router);

// Body Parser
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse application/json
app.use(express.json());

// app.post('/example', (req, res) => {
//   res.send(req.body);
// });

// Routage
app.use(router);

app.listen(PORT, () => {
  debug(`App listening on port http://localhost:${PORT}`);
});
