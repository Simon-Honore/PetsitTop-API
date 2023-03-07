/* eslint-disable camelcase */
const debug = require('debug')('opet:user_has_pet_typeDataMapper');
const { getSearchResults } = require('../controllers/userController');
const client = require('./database');

const user_has_pet_typeDataMapper = {

  /**
   * adds (creates) an entry for user_has_pet_type
   *
   * @param {number} userId - the user's id
   * @param {array<number>} addedPetTypes - an array of the added pet_types ids
   */
  createUserHasPetTypesForUser: async (userId, addedPetTypes) => {
    debug('createUserHasPetTypesForUser');
    debug('userId :', userId);
    debug('addedPetTypes :', addedPetTypes);
    const queryUserAddedPetTypes = {
      text: `
            SELECT * FROM new_user_has_pet_type($1, $2);
        `,
      values: [userId, addedPetTypes],
    };

    const results = await client.query(queryUserAddedPetTypes);
    return results;
  },

  /**
   * deletes an entry from user_has_pet_type
   *
   * @param {number} userId - the user's id
   * @param {array<number>} removedPetTypes - an array of the removed pet_types ids
   */
  deleteUserHasPetTypesForUser: async (userId, removedPetTypes) => {
    debug('deleteUserHasPetTypesForUser');
    debug('userId :', userId);
    debug('removedPetTypes :', removedPetTypes);
    const queryUserRemovedPetTypes = {
      text: `
            SELECT * FROM delete_user_has_pet_type($1, $2);
        `,
      values: [userId, removedPetTypes],
    };

    const results = await client.query(queryUserRemovedPetTypes);
    return results;
  },

};

module.exports = user_has_pet_typeDataMapper;
