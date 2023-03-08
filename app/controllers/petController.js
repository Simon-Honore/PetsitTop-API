const debug = require('debug')('opet:petController');
const petDataMapper = require('../models/petDataMapper');
const userDataMapper = require('../models/userDataMapper');

const petController = {

  /**
   * responds with one entry from "pet" relation
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next
   */
  async getPetsByUserId(request, response, next) {
    debug('getPetsByUserId');
    const { id } = request.params;

    // Test if the user exists
    const isExistingUser = await userDataMapper.findUserById(id);

    // If the user does not exist, we return an error 404
    if (!isExistingUser) {
      debug(`User ${id} does not exists`);
      const error = { statusCode: 404, message: 'User does not exists' };
      return next(error);
    }
    const pets = await petDataMapper.findAllPetsByUserId(id);
    return response.status(200).json(pets);
  },

  /**
   * creates one entry in "pet" table
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next - go to next mw function
   */
  async addPet(request, response, next) {
    debug('addPets');
    const { id } = request.params;

    // check if user exists in DB
    const userExists = await userDataMapper.findUserById(id);
    // if not => error
    if (!userExists) {
      const error = { statusCode: 404, message: 'User does not exist' };
      return next(error);
    }

    // check if the :id in params for the route matches the logged in user's id:
    // if not : 403 (doesn't have rights)
    const loggedInUser = request.user;
    debug('loggedInUser :', loggedInUser);
    if (Number(id) !== loggedInUser.id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // if user exists then we can add a pet to the profile :
    const pet = await petDataMapper.createPetForUser(id, request.body);
    return response.status(201).json(pet);
  },

  /**
   * updates an entry in "pet" table
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next - go to next mw function
   */
  async modifyPet(request, response, next) {
    debug('modifyPet');

    const { id } = request.params;

    // check if Pet exists in DB
    const petExists = await petDataMapper.findPetById(id);
    // if not => error
    if (!petExists) {
      const error = { statusCode: 404, message: 'Pet does not exist' };
      return next(error);
    }

    // Test if the pet exists
    const isExistingPet = await petDataMapper.findPetById(id);
    if (!isExistingPet) {
      debug(`Pet ${id} does not exists`);
      return next();
    }

    // check if the :id in params for the route matches the logged in user's id:
    // if not : 403 (doesn't have rights)
    const loggedInUser = request.user;
    if (loggedInUser.id !== isExistingPet.user_id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // if pet exists and logged in user owns the pet then we can modify it:
    const pet = await petDataMapper.modifyPetFromId(id, request.body);
    return response.status(200).json(pet);
  },

  /**
   * deletes an entry from "pet" table
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next - go to next mw function
   */
  async deletePet(request, response, next) {
    debug('deletePet');

    const { id } = request.params;

    // Test if the pet exists (or 404)
    const isExistingPet = await petDataMapper.findPetById(id);
    if (!isExistingPet) {
      debug(`Pet ${id} does not exists`);
      return next();
    }

    // check if the :id in params for the route matches the logged in user's id:
    // if not : 403 (doesn't have rights)
    const loggedInUser = request.user;
    if (loggedInUser.id !== isExistingPet.user_id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // if pet exists and loggedin user owns it then we can delete it :
    await petDataMapper.deletePetFromId(id);
    return response.status(204).send();
  },
};

module.exports = petController;
