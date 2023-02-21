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

  /**
   * Fetch available petsitters from database
   * @returns {array} array of users
   */
  findAllAvailablePetsitters: async () => {
    debug('findAllAvailablePetsitters');
    const query = {
      text: `
        SELECT 
          "user".*,
          ARRAY_AGG("pet_type"."name") AS "pet_types",
          "role"."name" AS "role_name"
        FROM
          "user"
        INNER JOIN "user_has_pet_type" ON "user"."id"="user_has_pet_type"."user_id"
        INNER JOIN "pet_type" ON "user_has_pet_type"."pet_type_id"="pet_type"."id"
        INNER JOIN "user_has_role" ON "user"."id"="user_has_role"."user_id"
        INNER JOIN "role" ON "user_has_role"."role_id"="role"."id"
        WHERE "user"."availability" = true AND "role"."name" = 'petsitter'
        GROUP BY "user"."id", "role"."name";
      `,
    };
    const results = await client.query(query);
    return results.rows;
  },

  /**
   * Fetch available petsitters from database : filter by department and pet type
   * @returns {array} array of users
   */
  findAllAvailablePetsittersFilter: async (department, petType) => {
    debug('findAllAvailablePetsittersFilter');
    const query = {
      text: `
        SELECT 
          "user".*,
          ARRAY_AGG("pet_type"."name") AS "pet_types",
          "role"."name" AS "role_name"
        FROM
          "user"
        INNER JOIN "user_has_pet_type" ON "user"."id"="user_has_pet_type"."user_id"
        INNER JOIN "pet_type" ON "user_has_pet_type"."pet_type_id"="pet_type"."id"
        INNER JOIN "user_has_role" ON "user"."id"="user_has_role"."user_id"
        INNER JOIN "role" ON "user_has_role"."role_id"="role"."id"
        WHERE 
          "user"."availability" = true
          AND "role"."name" = 'petsitter'
          AND "user"."postal_code" LIKE $1||'%'
        GROUP BY "user"."id", "role"."name"
        HAVING $2 = ANY(ARRAY_AGG("pet_type"."name"));
      `,
      values: [department, petType],
    };
    const results = await client.query(query);
    return results.rows;
  },

  // (
  //   SELECT ARRAY_AGG("role"."name") AS "role_names"
  //   FROM "role"
  //   WHERE "role"."id" IN
  //   (
  //     SELECT "role_id"
  //     FROM "user_has_role"
  //     WHERE "user_has_role"."user_id"="user"."id"
  //   )
  // )

};

module.exports = userDataMapper;

// OK avec imbriquées
// SELECT
// "user".*,
// (
//   SELECT ARRAY_AGG("pet_type"."name")
//   FROM "pet_type"
//   WHERE "pet_type"."id" IN
//   (
//     SELECT "pet_type_id"
//     FROM "user_has_pet_type"
//     WHERE "user_has_pet_type"."user_id"="user"."id"
//   )
// ) AS "pet_types"
// FROM "user"
// WHERE "user"."availability" = true AND 'petsitter' IN
//   (
//     SELECT UNNEST(ARRAY_AGG("role"."name"))
//     FROM "role"
//     WHERE "role"."id" IN
//     (
//       SELECT "role_id"
//       FROM "user_has_role"
//       WHERE "user_has_role"."user_id" = "user"."id"
//     )
// );
