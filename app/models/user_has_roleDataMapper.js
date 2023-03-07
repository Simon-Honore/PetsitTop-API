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

    await client.query(queryUserRole);
  },

  /**
   * deletes an entry from user_has_role
   *
   * @param {number} userId - the user's id
   * @param {number} roleId - the role id
   */
  deleteUserHasRolesForUser: async (userId, roleId) => {
    debug('deleteUserHasRolesForUser');
    debug('userId :', userId);
    debug('roleId :', roleId);
    const queryUserRole = {
      text: `
        DELETE FROM "user_has_role"
        WHERE "user_id" = $1
        AND "role_id" = $2
      `,
      values: [userId, roleId],
    };

    await client.query(queryUserRole);
  },
};

module.exports = user_has_roleDataMapper;
