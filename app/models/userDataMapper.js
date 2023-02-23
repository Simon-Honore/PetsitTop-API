/* eslint-disable camelcase */
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
  findPetsByUserId: async (id) => {
    debug('findPetsByUserId');
    debug('id', id);
    const query = {
      text: `
        SELECT
          "pet"."id",
          "pet"."name",
          "pet"."presentation",
          "pet_type"."name" AS "pet_type"
        FROM "pet" 
        JOIN "pet_type" ON "pet"."pet_type_id"="pet_type"."id"       
        WHERE "pet"."user_id" = $1;
      `,
      values: [id],
    };
    const results = await client.query(query);
    return results.rows; // retourne un tableau contenant des objets (chaque pet = un objet)
  },

  findAdsByUserId: async (id) => {
    debug('findAdsByUserId');
    debug('id', id);
    const query = {
      text: `
        SELECT
          "ad"."id",
          "ad"."title",
          "ad"."content",
          "ad"."city",
          "ad"."postal_code"
        FROM "ad"        
        WHERE "ad"."user_id" = $1
      `,
      values: [id],
    };
    const results = await client.query(query);
    return results.rows; // retourne un tableau contenant des objets (chaque ad = un objet)
  },

  findUserByEmail: async (email) => {
    debug('findUserByEmail');
    debug('email', email);
    const query = {
      text: `
        SELECT * from "user"
        WHERE "email" = $1;
      `,
      values: [email],
    };
    const results = await client.query(query);
    return results.rows[0];
  },

  findUserById: async (id) => {
    debug('findUserById');
    debug('id', id);
    const query = {
      text: `
        SELECT 
          "user".*,
          ARRAY_AGG(DISTINCT "pet_type"."name" ORDER BY "pet_type"."name" DESC) AS "pet_types",
          ARRAY_AGG(DISTINCT "role"."name") AS "role_names",
          ARRAY_AGG(DISTINCT "pet"."id") AS "pets",
          ARRAY_AGG(DISTINCT "ad"."id") AS "ads"
        FROM
          "user"
        LEFT JOIN "user_has_pet_type" ON "user"."id"="user_has_pet_type"."user_id"
        LEFT JOIN "pet_type" ON "user_has_pet_type"."pet_type_id"="pet_type"."id"
        LEFT JOIN "user_has_role" ON "user"."id"="user_has_role"."user_id"
        LEFT JOIN "role" ON "user_has_role"."role_id"="role"."id"
        LEFT JOIN "pet" ON "pet"."user_id" = "user"."id"
        LEFT JOIN "ad" ON "ad"."user_id" = "user"."id"
        WHERE 
          "user"."id" = $1
        GROUP BY "user"."id";
      `,
      values: [id],
    };
    const results = await client.query(query);

    const resultRows = results.rows[0];

    // Ajout Pets (dans une propriété "pets" qui contient un tableau avec le détail de chaque "pet")
    const petsList = await userDataMapper.findPetsByUserId(id);
    resultRows.pets = petsList;

    // Ajout Ads
    const adsList = await userDataMapper.findAdsByUserId(id);
    resultRows.ads = adsList;

    return resultRows;
  },

  // Ajout d'un user avec ses roles
  createUser: async (createObj) => {
    debug('createObj', createObj);
    debug('createUser');

    // A partir de l'objet "createObj"(=request.body), je récupère role_petsitter et role_petsitter
    // et création nouvel objet "createObj2" qui comporte les autres propriétés pour la table user
    const { role_petsitter, role_petowner, ...createObj2 } = createObj;

    // Insertion de l'user dans la table "user"
    const query = {
      text: `
        SELECT * FROM new_user($1);
      `,
      values: [createObj2],
    };
    // debug('query', query);
    const results = await client.query(query);

    // Insertion du role dans la table "user_has_role" :
    // un enregistrement si role petsitter, 1 enregistrement si role petowner

    // on récupère l'id du user qu'on vient d'insérer en table "user" :
    const { id } = results.rows[0];

    // Par défaut le role est petowner
    const newObj = { user_id: id, role_id: 2 };

    const query2 = {
      text: `
        SELECT * FROM new_user_has_role($1);
      `,
      values: [newObj],
    };

    const resultsRow = results.rows[0];
    resultsRow.roles = [];

    // debug('role_petsitter', role_petsitter);
    if (role_petsitter === 'true') {
      newObj.role_id = 1;
      const resultPetsitter = await client.query(query2);
      // debug('resultPetsitter :', resultPetsitter.rows[0]);
      // on rajoute une propriété à notre objet final result.rows[0]
      // results.rows[0].role_petsitter = resultPetsitter.rows[0].role_id;
      resultsRow.roles.push(resultPetsitter.rows[0].role_id);
    }
    // debug('role_petowner', role_petowner);
    if (role_petowner === 'true') {
      newObj.role_id = 2;
      const resultPetowner = await client.query(query2);
      // debug('resultPetowner :', resultPetowner.rows[0]);
      // results.rows[0].role_petowner = resultPetowner.rows[0].role_id;
      resultsRow.roles.push(resultPetowner.rows[0].role_id);
    }

    // debug('objet final :', results.rows[0]);

    // Pour faire une seule requete : à voir plus tard
    // const createRoleObj = {
    //   user_id: id,
    //   role: {
    //     role_petsitter: role_petsitter ? 1 : null,
    //     role_petowner: role_petowner ? 2 : null,
    //   }
    // }
    // const query2 = {
    //   text: `
    //     INSERT INTO "user_has_role" ("user_id", "role_id")
    //     VALUES
    //     (user_id, role.role_petsitter),
    //     (user_id, role.role_petowner)
    //   `
    // }

    return results.rows[0];
  },
};

module.exports = userDataMapper;
