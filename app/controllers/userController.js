const debug = require('debug')('opet:userController');

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
    // const { body } = request;
    const body = JSON.stringify(request.body);
    debug('req.body après Json.stringify: ', body);
    const user = await userDataMapper.createUser(body);
    debug(user);
    response.status(201).json(user);
  },

};

module.exports = userController;
