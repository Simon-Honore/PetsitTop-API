const client = require('./database');

/* eslint-disable camelcase */
const debug = require('debug')('opet:petDataMapper');

const petDataMapper = {
  async createPetForUser(userId, petObj) {
    debug('createPetForUser');
    debug('userId :', userId);

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

};

module.exports = petDataMapper;
