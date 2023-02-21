const debug = require('debug')('opet:database');

const { Client } = require('pg');

const client = new Client(process.env.DATABASE_URL);

client.connect().then(() => {
  debug('database client connected');
});

module.exports = client;
