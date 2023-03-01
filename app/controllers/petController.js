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
      const error = { statusCode: 403, message: 'Forbidden' };
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

    // if pet exists then check if logged in user owns the pet:
    const loggedInUser = request.user;
    const petsOfLoggedInUser = await petDataMapper.findAllPetsByUserId(loggedInUser.id);
    debug('user pets list :', petsOfLoggedInUser);
    // check if id (from the route) matches the id of the pets from the user's list
    const foundPet = petsOfLoggedInUser.find((pet) => pet.id === Number(id));
    debug('foundPet', foundPet);
    if (!foundPet) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // if pet exists and logged in user owns the pet then we can modify it:
    const pet = await petDataMapper.modifyPetFromId(id, request.body);
    return response.status(200).json(pet);
  },

  async deletePet(request, response, next) {
    debug('deletePet');

    const { id } = request.params;

    // check if Pet exists in DB
    const petExists = await petDataMapper.findPetById(id);
    // if not => error
    if (!petExists) {
      const error = { statusCode: 404, message: 'Pet does not exist' };
      return next(error);
    }

    // if pet exists then check if logged in user owns the pet:
    const loggedInUser = request.user;
    const petsOfLoggedInUser = await petDataMapper.findAllPetsByUserId(loggedInUser.id);
    debug('user pets list :', petsOfLoggedInUser);
    // check if id (from the route) matches the id of the pets from the user's list
    const foundPet = petsOfLoggedInUser.find((pet) => pet.id === Number(id));
    debug('foundPet', foundPet);
    if (!foundPet) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // if pet exists and loggedin user owns it then we can delete it :
    await petDataMapper.deletePetFromId(id);
    return response.status(204).send();
  },
};

module.exports = petController;
