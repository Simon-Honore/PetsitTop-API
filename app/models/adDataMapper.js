/* eslint-disable camelcase */
const debug = require('debug')('opet:adDataMapper');
const client = require('./database');

const adDataMapper = {
  findAllAds: async () => {
    const query = {
      text: `
        SELECT * FROM "ad"
      `,
    };
    const results = await client.query(query);
    return results.rows;
  },
  findAdsByUserId: async (id) => {
    debug('findAdsByUserId');
    const query = {
      text: `
        SELECT * FROM "ad"
        WHERE user_id = $1
      `,
      values: [id],
    };
    const results = await client.query(query);
    return results.rows;
  },

  // Création d'une annonce
  createAdByUserId: async (createAdObj, user_id) => {
    debug('createAd');
    debug('createAdObj', createAdObj);

    const query = {
      text: `
        SELECT * FROM new_ad($1);
      `,
      values: [{ ...createAdObj, user_id }],
    };

    const results = await client.query(query);
    return results.rows[0];
  },
};

module.exports = adDataMapper;
