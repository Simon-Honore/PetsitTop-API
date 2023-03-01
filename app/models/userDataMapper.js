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

  // findPetsByUserId: async (id) => {
  //   debug('findPetsByUserId');
  //   debug('id', id);
  //   const query = {
  //     text: `
  //       SELECT
  //         "pet"."id",
  //         "pet"."name",
  //         "pet"."presentation",
  //         "pet_type"."name" AS "pet_type"
  //       FROM "pet"
  //       JOIN "pet_type" ON "pet"."pet_type_id"="pet_type"."id"
  //       WHERE "pet"."user_id" = $1;
  //     `,
  //     values: [id],
  //   };
  //   const results = await client.query(query);
  //   return results.rows; // retourne un tableau contenant des objets (chaque pet = un objet)
  // },

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
        jsonb_agg(DISTINCT jsonb_build_object('id', "role"."id",'name', "role"."name")) AS "roles",
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "pet_type_to_petsit"."id",'name', "pet_type_to_petsit"."name")) FILTER (WHERE "pet_type_to_petsit"."id" IS NOT NULL), '[]') AS "pet_types",
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "pet"."id",'name', "pet"."name", 'presentation', "pet"."presentation", 'pet_type', "pet_type_qualify"."name")) FILTER (WHERE "pet"."id" IS NOT NULL), '[]') AS "pets",
        COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', "ad"."id",'title', "ad"."title", 'content', "ad"."content", 'city', "ad"."city", 'postal_code', "ad"."postal_code")) FILTER (WHERE "ad"."id" IS NOT NULL), '[]') AS "ads"
      
      FROM
        "user"
      
      LEFT JOIN "user_has_pet_type" ON "user"."id"="user_has_pet_type"."user_id"
      LEFT JOIN "pet_type" AS "pet_type_to_petsit" ON "user_has_pet_type"."pet_type_id"= "pet_type_to_petsit"."id"
      LEFT JOIN "user_has_role" ON "user"."id"="user_has_role"."user_id"
      LEFT JOIN "role" ON "user_has_role"."role_id"="role"."id"
      LEFT JOIN "pet" ON "pet"."user_id" = "user"."id"
      LEFT JOIN "pet_type" AS "pet_type_qualify" ON "pet"."pet_type_id"= "pet_type_qualify"."id"       
      LEFT JOIN "ad" ON "ad"."user_id" = "user"."id"
      
      WHERE 
          "user"."id" = $1
      
      GROUP BY "user"."id";
      `,
      values: [id],
    };
    const results = await client.query(query);
    debug(results.rows[0]);

    return results.rows[0];
  },

  findUserWithRoleAndPetTypeById: async (id) => {
    debug('findUserWithRoleAndPetTypeById');
    debug('id', id);
    const query = {
      text: `
        SELECT
          "user".*,
          ARRAY_AGG(DISTINCT "role"."name") AS "role_names",
          ARRAY_AGG(DISTINCT "user_has_pet_type"."pet_type_id") AS "pet_types_ids"
        FROM "user"
        LEFT JOIN "user_has_role" ON "user"."id"="user_has_role"."user_id"
        LEFT JOIN "role" ON "user_has_role"."role_id"="role"."id"
        LEFT JOIN "user_has_pet_type" ON "user"."id"="user_has_pet_type"."user_id"
        WHERE 
          "user"."id" = $1
        GROUP BY "user"."id";
      `,
      values: [id],
    };
    const results = await client.query(query);

    return results.rows[0];
  },

  // Add one user with their roles
  createUser: async (createObj) => {
    debug('createObj', createObj);
    debug('createUser');

    // we extract "role_petsitter" + "role_petowner" + array "pet_type" from createObj(req.body)
    // we create "createObj2" with all the other properties that can be inserted in "user" table
    const {
      role_petsitter, role_petowner, pet_type, ...createObj2
    } = createObj;

    // Insertion de l'user dans la table "user"
    const queryUser = {
      text: `
        SELECT * FROM new_user($1);
      `,
      values: [createObj2],
    };
    // debug('query', query);
    const results = await client.query(queryUser);

    // Insert roles into table "user_has_role" :
    // 1 insert if role petsitter and/or 1 insert if role petowner

    // we get the id of the user we just inserted in table "user" :
    const { id: userId } = results.rows[0];

    // default role is petowner
    const userRoleObj = { user_id: userId, role_id: 2 };

    const queryUserRole = {
      text: `
        SELECT * FROM new_user_has_role($1);
      `,
      values: [userRoleObj],
    };

    const resultsRow = results.rows[0];
    // we add a "roles" property to the user we'll return (array of the role or roles)
    resultsRow.roles = [];

    // debug('role_petsitter', role_petsitter);
    if (role_petsitter === 'true') {
      userRoleObj.role_id = 1;
      const resultPetsitter = await client.query(queryUserRole);
      // debug('resultPetsitter :', resultPetsitter.rows[0]);

      // we push the role_id in the array of the "roles" property
      resultsRow.roles.push(resultPetsitter.rows[0].role_id);
    }
    // debug('role_petowner', role_petowner);
    if (role_petowner === 'true') {
      userRoleObj.role_id = 2;
      const resultPetowner = await client.query(queryUserRole);
      // debug('resultPetowner :', resultPetowner.rows[0]);

      // we push the role_id in the array of the "roles" property
      resultsRow.roles.push(resultPetowner.rows[0].role_id);
    }

    // we add the pet-types for this user in the table "user_has_pet_type":
    // pet_types is an array of string, so first we cast to numbers:
    let petTypesToNumbers = [];
    if (pet_type) { // Si pet_type est vide, on ne fait rien
      petTypesToNumbers = pet_type.map(Number);
    }

    const queryUserPetTypes = {
      text: `
        SELECT * FROM new_user_has_pet_type($1, $2);
      `,
      values: [userId, petTypesToNumbers],
    };

    const resultsPetType = await client.query(queryUserPetTypes);
    debug('resultsPetType :', resultsPetType.rows);

    const allPetTypes = resultsPetType.rows;

    // we add a "pet_types" property to the user we'll return (array of the pet_type(s))
    resultsRow.pet_types = [];
    // for each "pet_type" of the petsitter we push the "pet_type_id" in the "pet_types" array
    allPetTypes.forEach((petType) => {
      resultsRow.pet_types.push(petType.pet_type_id);
    });

    // debug('objet final :', results.rows[0]);

    return results.rows[0];
  },

  // Modify one user
  modifyUser: async (id, modifyObj, userBeforeSave) => {
    debug('modifyUser');
    debug('id', id);
    debug('modifyObj', modifyObj);
    debug('userBeforeSave', userBeforeSave);

    // we extract "role_petsitter" + "role_petowner" + array "pet_type" from createObj(req.body)
    // we create "createObj2" with all the other properties that can be inserted in "user" table
    const {
      role_petsitter, role_petowner, pet_type, ...modifyUserObj
    } = modifyObj;

    let results = {};

    // Modify user in table "user"

    // Check if unchanged email : use update_user function
    if (userBeforeSave.email === modifyObj.email) {
      debug('email identique');
      const { email, ...modifyObjNoEmail } = modifyUserObj;
      const queryUser = {
        text: `
          SELECT * FROM update_user($1)
        `,
        values: [{ ...modifyObjNoEmail, id }],
      };
      results = await client.query(queryUser);
    } else {
      // use update_userWithEmail function if new email
      debug('email différent');
      const queryUser = {
        text: `
          SELECT * FROM update_userWithEmail($1)
        `,
        values: [{ ...modifyUserObj, id }],
      };
      results = await client.query(queryUser);
    }
    // const { id: userId } = results.rows[0];
    debug('userAfterSave', results.rows[0]);

    // Modify role in table "user_has_role"

    // ---------IDEALEMENT : REFACTO DE CE QUI SUIT DANS UNE AUTRE FONCTION
    // ---------PAR EXEMPLE "modifyUserHasRole"
    //---------

    // array of promises of the following async queries :
    const promises = [];

    // 1) Check if role_petsitter already exists for this user
    if (userBeforeSave.role_names.includes('petsitter')) {
      // debug('userBeforeChangeRole.includes("petsitter")');

      // if it does AND role_petsitter=false in body : we delete the role
      if (role_petsitter === 'false') {
        // debug('role_petsitter === "false"');
        const queryUserRole = {
          text: `
            DELETE FROM "user_has_role"
            WHERE "user_id" = $1
            AND "role_id" = 1
          `,
          values: [id],
        };

        promises.push(client.query(queryUserRole));
      }
    } else {
      // 1bis) Sinon (role petsitter est absent de role_names)
      // et si role_petsitter est true
      const queryUserRole = {
        text: `
          INSERT INTO "user_has_role"("user_id", "role_id")
          VALUES ($1, 1)
          RETURNING *;
        `,
        values: [id],
      };

      promises.push(client.query(queryUserRole));
    }

    // 2) Tester si le role petowner existe déjà
    if (userBeforeSave.role_names.includes('petowner')) {
      // debug('userBeforeChangeRole.includes("petowner")');

      // Si oui, et que le nouveau role est false, on le supprime
      if (role_petowner === 'false') {
        // debug('role_petowner === "false"');
        const queryUserRole = {
          text: `
            DELETE FROM "user_has_role"
            WHERE "user_id" = $1
            AND "role_id" = 2
          `,
          values: [id],
        };

        promises.push(client.query(queryUserRole));
      }
    } else {
      // 2bis) Sinon (role petowner est absent de role_names)
      // et si role_petowner est true
      const queryUserRole = {
        text: `
          INSERT INTO "user_has_role"("user_id", "role_id")
          VALUES ($1, 2)
          RETURNING *;
        `,
        values: [id],
      };

      promises.push(client.query(queryUserRole));
    }

    await Promise.all(promises);

    // ---------
    // ---------
    // ---------

    // we update pet_types in user_has_pet_type (2 cases):
    // pet_types is an array of string, so first we cast to numbers:
    let petTypesToNb = [];
    if (pet_type) { // Si pet_type est vide, on ne fait rien
      petTypesToNb = pet_type.map(Number);
    }
    debug('tableau 1 :', userBeforeSave.pet_types_ids);
    debug('tableau 2: ', petTypesToNb);

    // 1) pour les pet_types cochés à la modif, on ajoute les lignes à ce user dans user_has_pet_type
    const addedPetTypes = petTypesToNb.filter((type) => !userBeforeSave.pet_types_ids.includes(type));
    // console.log(valeursNouvelles); >> insert
    debug('valeurs ajoutées :', addedPetTypes);
    // we add the pet-types for this user in the table "user_has_pet_type":


    const queryUserAddedPetTypes = {
      text: `
        SELECT * FROM new_user_has_pet_type($1, $2);
      `,
      values: [id, addedPetTypes],
    };

    const resultsAddedPetType = await client.query(queryUserAddedPetTypes);
    debug('resultsAddedPetType :', resultsAddedPetType.rows);

    // 2) pour les pet_types décochés à la modif on delete les lignes à ce user dans user_has_pet_type
    const removedPetTypes = userBeforeSave.pet_types_ids.filter((type) => !petTypesToNb.includes(type));
    debug('valeurs supprimées :', removedPetTypes);

    const queryUserRemovedPetTypes = {
      text: `
        SELECT * FROM delete_user_has_pet_type($1, $2);
      `,
      values: [id, removedPetTypes],
    };

    const resultsRemovedPetType = await client.query(queryUserRemovedPetTypes);
    debug('resultsRemovedPetType :', resultsRemovedPetType.rows);

    const userAfterSave = await userDataMapper.findUserById(id);
    // debug('userAfterSave', userAfterSave);

    return userAfterSave;
  },
};

module.exports = userDataMapper;
