/* eslint-disable camelcase */
const debug = require('debug')('opet:adDataMapper');
const client = require('./database');

const adDataMapper = {
  /** a general Ad type
   * @typedef {object} Ad
   * @property {number} id - ad id
   * @property {string} title - ad title
   * @property {string} content - ad content
   * @property {string} city - ad city
   * @property {string} postal_code - ad postal code
   * @property {number} user_id - user id
   * @property {array<AdUser>} user - ad user with id first_name and last_name
   * @property {string} created_at - ad creation date
   * @property {string} updated_at - ad update date
   */

  /** an AdUser type
   * @typedef {object} AdUser
   * @property {number} id - user id
   * @property {string} first_name - user first_name
   * @property {string} last_name - user last_name
   */

  /**
   * find all entries from the relation "ad"
   *
   * @returns {array<Ad>} array of ad entries
   */
  findAllAds: async (limit, start) => {
    const query = {
      text: `
        SELECT
          "ad".*,
          json_agg(json_build_object('id', "user"."id",'first_name', "user"."first_name", 'last_name', "user"."last_name")) AS "user"
        FROM "ad"
        LEFT JOIN "user" ON "ad"."user_id" = "user".id
        GROUP BY "ad".id
        LIMIT $1
        OFFSET $2
      `,
      values: [limit, start],
    };
    const results = await client.query(query);
    return results.rows;
  },

  /**
   * find an entry from the relation "ad" according to its id
   *
   * @param {number} id - id of the ad
   * @returns {Object<Ad>} an ad entry
   */
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

  /**
   * find all entries from the relation "ad" according to its user id
   *
   * @param {number} id - the user's id
   * @returns {array<Ad>} array of ad entries
   */
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

  /**
   * create an entry in the relation "ad"
   *
   * @param {Object} createAdObj - the ad to create
   * @param {number} user_id - the user's id
   * @returns {array<Ad>} array of ad entries
   */
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

  /**
   * modify an entry in the relation "ad"
   *
   * @param {Object} updateAdObj - the ad to update
   * @param {number} id - id of the ad
   * @returns {Object<Ad>} array of ad entries
   */
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

  /**
   * remove an entry in the relation "ad"
   *
   * @param {number} id - id of the ad
   */
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
