/* eslint-disable camelcase */
const debug = require('debug')('opet:adDataMapper');
const client = require('./database');

const adDataMapper = {
  findAllAds: async () => {
    const query = {
      text: `
        SELECT
          "ad".*,
          json_agg(json_build_object('id', "user"."id",'first_name', "user"."first_name", 'last_name', "user"."last_name")) AS "user"
        FROM "ad"
        LEFT JOIN "user" ON "ad"."user_id" = "user".id
        GROUP BY "ad".id
      `,
    };
    const results = await client.query(query);
    return results.rows;
  },
  findAdById: async (id) => {
    debug(`findAdById(${id})`);
    const query = {
      text: `
        SELECT * FROM "ad"
        WHERE id = $1
      `,
      values: [id],
    };
    const results = await client.query(query);
    return results.rows[0];
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

  // Update ad by id
  updateAdById: async (id, updateAdObj) => {
    debug(`updateAdById(${id})`);
    debug('updateAdObj', updateAdObj);

    const query = {
      text: `
        SELECT * FROM update_ad($1);
      `,
      values: [{ ...updateAdObj, id }],
    };

    const results = await client.query(query);
    return results.rows[0];
  },

  // Delete ad by id
  deleteAdById: async (id) => {
    debug(`deleteAdById(${id})`);
    const query = {
      text: `
        DELETE FROM "ad"
        WHERE id = $1
      `,
      values: [id],
    };
    await client.query(query);
  },
};

module.exports = adDataMapper;
