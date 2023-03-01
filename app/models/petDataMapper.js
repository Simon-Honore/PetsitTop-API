const client = require('./database');

/* eslint-disable camelcase */
const debug = require('debug')('opet:petDataMapper');

/**
 * a pet type
 *
 * @typedef {object} Pet
 * @property {number} id - pet id
 * @property {string} name - pet name
 * @property {string} presentation - pet presentation
 * @property {number} user_id - pet user_id
 * @property {number} pet_type_id - pet pet_type_id
 * @property {string} created_at - date of creation
 * @property {string} updated_at - date of last update
 */

/**
 * a pet type for creation/modification
 *
 * @typedef {object} PetCreateModify
 * @property {string} name - pet name
 * @property {string} presentation - pet presentation
 * @property {number} pet_type_id - pet pet_type_id
 */

/**
 * a created pet with its pet_type_name
 *
 * @typedef {object} PetCreated
 * @property {string} name - pet name
 * @property {string} presentation - pet presentation
 * @property {number} pet_type_id - pet pet_type_id
 * @property {string} pet_type_name - pet's pet_type_name
 */

const petDataMapper = {

  /**
   * fetches a pet entry according to its id
   *
   * @param {number} id - pet id
   * @returns {Pet} a pet
   */
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

  /**
   * fetches all pets according to their user's id
   *
   * @param {number} userId - user id
   * @returns {array<Pet>} array of pets
   */
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

  /**
   * adds (creates) a pet for a user
   *
   * @param {number} userId - the petowner's id (user id)
   * @param {PetCreateModify} petObj - the pet to create
   * @returns {PetCreated} the created pet
   */
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

  /**
   * modifies a pet
   *
   * @param {number} petId - the pet's id
   * @param {PetCreateModify} petObj - the pet to update
   * @returns {Pet} the updated pet
   */
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

  /**
   * deletes a pet
   *
   * @param {number} petId - the pet's id
   */
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
