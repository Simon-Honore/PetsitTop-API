const debug = require('debug')('opet:userController');
const bcrypt = require('bcrypt');

const userDataMapper = require('../models/userDataMapper');

const userController = {

  getAllUsers: async (request, response) => {
    debug('getAllUsers');
    const users = await userDataMapper.findAllUsers();
    response.status(200).json(users);
  },
  getSearchResults: async (request, response) => {
    debug('getSearchResults');
    const { department, pet_type: petType } = request.query;
    const users = await userDataMapper.findAllAvailablePetsittersFilter(department, petType);
    response.status(200).json(users);
  },

  async createUser(request, response) {
    debug('createUser');
    const { body } = request;

    // Crypte le password de l'user avec Bcrypt
    // doc: https://www.npmjs.com/package/bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    // on remplace le password en clair par le 'hashé' pour le stockage en DB:
    body.password = hashedPassword;

    const user = await userDataMapper.createUser(body);
    debug(user);
    response.status(201).json(user);
  },

};

module.exports = userController;
