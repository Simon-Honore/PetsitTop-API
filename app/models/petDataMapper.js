const client = require('./database');

/* eslint-disable camelcase */
const debug = require('debug')('opet:petDataMapper');

const petDataMapper = {
  async findPetById(id) {
    debug('findPetById');

    const query = {
      text: `
        SELECT * FROM "pet" WHERE "id"=$1
        `,
      values: [id],
    };

    const results = await client.query(query);
    return results.rows[0];
  },

  async findAllPetsByUserId(userId) {
    debug('findAllPetsByUserId');
    debug('userId :', userId);

    const query = {
      text: `
        SELECT * FROM "pet" WHERE "user_id"=$1;
        `,
      values: [userId],
    };

    const results = await client.query(query);
    return results.rows;
  },

  async createPetForUser(userId, petObj) {
    debug('createPetForUser');
    debug('userId :', userId);
    debug('petObj :', petObj);

    const createObj = { ...petObj, user_id: userId };

    const query = {
      text: `
        SELECT * FROM "new_pet"($1);
            `,
      values: [createObj],
    };

    const results = await client.query(query);
    const addedPet = results.rows[0];

    // Before returning the pet object we add a "pet_type_name" property matching "pet_type_id":
    const petTypeQuery = {
      text: `
          SELECT * FROM "pet_type" WHERE "id"=$1;
              `,
      values: [addedPet.pet_type_id],
    };

    const petTypeNameResult = await client.query(petTypeQuery);
    const petTypeName = petTypeNameResult.rows[0];

    const addedPetWithPetTypeName = { ...addedPet, pet_type_name: petTypeName.name };

    return addedPetWithPetTypeName;
  },

  async modifyPetFromId(petId, petObj) {
    debug('modifyPetForUser');
    debug('petId :', petId);
    debug('petObj :', petObj);

    const query = {
      text: `
        SELECT * FROM update_pet($1, $2);
        `,
      values: [petId, petObj],
    };

    const results = await client.query(query);
    debug('updated pet :', results.rows[0]);

    return results.rows[0];
  },

  async deletePetFromId(petId) {
    debug('deletePetFromId');
    debug('petId :', petId);

    const query = {
      text: `
        DELETE FROM "pet" WHERE "id"=$1;
        `,
      values: [petId],
    };

    await client.query(query);
  },

};

module.exports = petDataMapper;
