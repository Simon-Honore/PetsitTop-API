/* eslint-disable camelcase */
const debug = require('debug')('opet:userController');
const bcrypt = require('bcrypt');

const userDataMapper = require('../models/userDataMapper');

const userController = {

  // /**
  //  * responds with all entries from "user" relation
  //  *
  //  * @param {Object} _
  //  * @param {Object} response
  //  */
  // async getAllUsers(_, response) {
  //   debug('getAllUsers');
  //   const users = await userDataMapper.findAllUsers();
  //   response.status(200).json(users);
  // },

  /**
   * responds with all users who are available petsitters (filtered by department & pet_type)
   *
   * @param {Object} request
   * @param {Object} response
   */
  async getSearchResults(request, response) {
    debug('getSearchResults');
    const { department, pet_type: petType } = request.query;
    const users = await userDataMapper.findAllAvailablePetsittersFilter(department, petType);
    response.status(200).json(users);
  },

  /**
   * responds with one entry from relation "user"
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next - go to next mw function
   */
  async getOneUser(request, response, next) {
    debug('getOneUser');
    const searchedId = Number(request.params.id);

    const searchedUser = await userDataMapper.findUserById(searchedId);

    // if user does not exist : 404
    if (!searchedUser) {
      debug(`User ${searchedId} does not exists`);
      const error = { statusCode: 404, message: 'User does not exists' };
      return next(error);
    }

    // if the logged in user is the same as the searchedUser ,
    // we add a property to the searchedUser => isOwner: true
    // to grant access to the "Mon Profil" page
    const loggedInUser = request.user;
    debug('loggedInUser :', loggedInUser);
    if (Number(searchedId) === loggedInUser.id) {
      searchedUser.isOwner = true;
    }
    return response.status(200).json(searchedUser);
  },

  /**
   * creates one entry in "user" table
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next - go to next mw function
   */
  async createUser(request, response, next) {
    debug('createUser');
    const { body } = request;

    // Test RGPD & CGU : have to be both TRUE to create an account (active consent)
    if (body.rgpd_consent !== true || body.cgu_consent !== true) {
      const error = { statusCode: 400, message: 'To create an account, you must accept RGPD & CGU' };
      return next(error);
    }

    // Test if email already exists in DB
    const isExistingUser = await userDataMapper.findUserByEmail(body.email);
    if (isExistingUser) {
      const error = { statusCode: 400, message: 'Email is already exists' };
      return next(error);
    }

    // Hash user's password with Bcrypt
    // doc: https://www.npmjs.com/package/bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    // on replace the typed password with the hashed one to store in DB:
    body.password = hashedPassword;

    // Security: we remove the confirmPassword (not hashed) from request.body to prevent data leaks:
    const { confirmPassword, ...bodySafe } = body;

    const user = await userDataMapper.createUser(bodySafe);

    // On enlève le password de l'objet user
    const { password, ...userWithoutPwd } = user;

    debug('Created user : ', userWithoutPwd);

    return response.status(201).json(userWithoutPwd);
  },

  /**
   * updates an entry in "user" table
  *
  * @param {Object} request
  * @param {Object} response
  * @param {function} next - go to next mw function
  */
  async modifyUser(request, response, next) {
    debug('modifyUser');
    const { id } = request.params;

    // Test if the user exists. if not => 404
    // user details before modification :
    const userBeforeSave = await userDataMapper.findUserWithRoleAndPetTypeById(id);
    debug('userbeforeSave :', userBeforeSave);
    if (!userBeforeSave) {
      return next();
    }

    // Test if user is allowed to modify (can only modify its own profile)
    const loggedInUser = request.user;
    debug('loggedInUser :', loggedInUser);
    if (Number(id) !== loggedInUser.id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // if the modified user doesn't contain at least one role (required) => error
    const { role_petsitter, role_petowner } = request.body;

    if ((role_petsitter === false && role_petowner === false)
      && (userBeforeSave.role_names.includes('petowner') || userBeforeSave.role_names.includes('petsitter'))
    ) {
      const error = { statusCode: 400, message: 'At least one role is required' };
      return next(error);
    }

    // check if email already exists in DB (if email is changed)
    const { email } = request.body;
    debug(email);
    // if email is changed
    if (email !== userBeforeSave.email) {
      const emailAlreadyExists = await userDataMapper.findUserByEmail(email);
      if (emailAlreadyExists) {
        const error = { statusCode: 400, message: 'Email is already exists' };
        return next(error);
      }
    }

    // if all OK, we update the user:
    const user = await userDataMapper.modifyUser(id, request.body, userBeforeSave);

    debug('Updated user : ', user);

    return response.status(200).json(user);
  },

  /**
   * deletes an entry from "user" table
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next - go to next mw function
   */
  async deleteUser(request, response, next) {
    debug('deleteUserById');
    const { id } = request.params; // id of the user to delete

    // If the user does not exist, we return an error 404
    const isExistingUser = await userDataMapper.findUserById(id);
    if (!isExistingUser) {
      debug(`User ${id} does not exists`);
      return next();
    }

    // Test if the user has the right to access this route
    const loggedInUser = request.user;
    // If the "isExistingUser"."id" is different from "loggedInUser"."id", we return an error 403
    if (loggedInUser.id !== isExistingUser.id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // Delete the user
    await userDataMapper.deleteUserById(id);

    // Response
    return response.status(204).send();
  },
};

module.exports = userController;
