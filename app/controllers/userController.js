const debug = require('debug')('opet:userController');
const bcrypt = require('bcrypt');

const userDataMapper = require('../models/userDataMapper');

const userController = {

  async getAllUsers(request, response) {
    debug('getAllUsers');
    const users = await userDataMapper.findAllUsers();
    response.status(200).json(users);
  },
  async getSearchResults(request, response) {
    debug('getSearchResults');
    const { department, pet_type: petType } = request.query;
    const users = await userDataMapper.findAllAvailablePetsittersFilter(department, petType);
    response.status(200).json(users);
  },

  async getOneUser(request, response) {
    debug('getOneUser');
    const searchedId = Number(request.params.id);

    const user = await userDataMapper.findUserById(searchedId);
    response.status(200).json(user);
  },

  async createUser(request, response, next) {
    debug('createUser');
    const { body } = request;

    // Test si email existe déjà
    const isExistingUser = await userDataMapper.findUserByEmail(body.email);
    if (isExistingUser) {
      return next(new Error('Email already exists'));
    }

    // Hash le password de l'user avec Bcrypt
    // doc: https://www.npmjs.com/package/bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    // on remplace le password en clair par le 'hashé' pour le stockage en DB:
    body.password = hashedPassword;

    // Security: we remove the confirmPassword (not hashed) from request.body to prevent data leaks:
    const { confirmPassword, ...bodySafe } = body;

    const user = await userDataMapper.createUser(bodySafe);

    // debug(user);
    return response.status(201).json(user);
  },

};

module.exports = userController;
