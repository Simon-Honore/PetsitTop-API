const debug = require('debug')('opet:server'); // to log debug messages

require('dotenv').config(); // variables d'environnement
const express = require('express'); // express
const router = require('./app/routers'); // router

const app = express();
const PORT = process.env.PORT || 3000;

// Routage
app.use(router);
// app.get('/', (req, res) => {
//   res.send('Hello world !!');
// });

// Body parsing middlewares
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
  debug(`App listening on port http://localhost:${PORT}`);
});
