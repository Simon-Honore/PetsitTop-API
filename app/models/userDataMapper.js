const debug = require('debug')('opet:userDataMapper');
const client = require('./database');

const userDataMapper = {
  /**
   * Fetch all users from database
   * @returns {array} array of users
   */
  findAllUsers: async () => {
    debug('findAllUsers');
    const query = {
      text: 'SELECT * FROM "user" ORDER BY "id"',
    };
    const results = await client.query(query);
    return results.rows;
  },

  findAllAvailablePetsitters: async () => {
    debug('findAllAvailablePetsitters');
    const query = {
      text: `
        SELECT 
          "user".*,
          (
            SELECT ARRAY_AGG("pet_type"."name") AS "pet_types"
            FROM "pet_type"
            WHERE "pet_type"."id" IN
            (
              SELECT "pet_type_id"
              FROM "user_has_pet_type"
              WHERE "user_has_pet_type"."user_id"="user"."id"
            )
          )
        FROM "user"
        WHERE "user"."availability" = true;
      `,
    };
    const results = await client.query(query);
    return results.rows;
  },

};

module.exports = userDataMapper;
