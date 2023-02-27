const debug = require('debug')('opet:petController');
const petDataMapper = require('../models/petDataMapper');
const userDataMapper = require('../models/userDataMapper');

const petController = {
  async addPet(request, response, next) {
    debug('addPets');
    const { id } = request.params;

    // check if the :id in params for the route matches the logged in user's id:
    const loggedInUser = request.user;
    debug('loggedInUser :', loggedInUser);
    if (Number(id) !== loggedInUser.id) {
      const error = { statusCode: 401, message: 'Unauthorized' };
      return next(error);
    }

    // check if user exists in DB
    const userExists = await userDataMapper.findUserById(id);
    // if not => error
    if (!userExists) {
      const error = { statusCode: 404, message: 'User does not exist' };
      return next(error);
    }

    // if user exists then we can add a pet to the profile :
    const pet = await petDataMapper.createPetForUser(id, request.body);
    return response.status(201).json(pet);
  },

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

    // if pet exists then we can modify it :
    const pet = await petDataMapper.modifyPetFromId(id, request.body);
    return response.status(200).json(pet);
  },
};

module.exports = petController;
