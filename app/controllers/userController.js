const debug = require('debug')('opet:userController');

const userDataMapper = require('../models/userDataMapper');

const userController = {

  getAllUsers: async (_, response) => {
    debug('getAllUsers');
    const users = await userDataMapper.findAllUsers();
    response.status(200).json(users);
  },

};

module.exports = userController;
