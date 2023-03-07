/* eslint-disable camelcase */
const debug = require('debug')('opet:user_has_roleDataMapper');
const client = require('./database');

/**
 * a User_has_role type
 *
 * @typedef {object} User_has_role
 * @property {number} user_id - user id
 * @property {number} role_id - role id
 */

const user_has_roleDataMapper = {

  /**
   * adds (creates) an entry for user_has_role
  *
  * @param {User_has_role} userRoleObj - a user_has_role obj with user_id and role_id
  */
  createUserHasRolesForUser: async (userRoleObj) => {
    debug('createUserHasRolesForUser');
    debug('userRoleObj :', userRoleObj);

    const queryUserRole = {
      text: `
      SELECT * FROM new_user_has_role($1);
    `,
      values: [userRoleObj],
    };

    const results = await client.query(queryUserRole);
    return results;
  },

  /**
   * deletes an entry from user_has_role
   *
   * @param {User_has_role} userRoleObj - a user_has_role obj with user_id and role_id
   */
  deleteUserHasRolesForUser: async (userRoleObj) => {
    debug('deleteUserHasRolesForUser');
    debug('userRoleObj :', userRoleObj);
    const queryUserRole = {
      text: `
        SELECT * FROM delete_user_has_role($1);
      `,
      values: [userRoleObj],
    };
    const results = await client.query(queryUserRole);
    return results;
  },
};

module.exports = user_has_roleDataMapper;
