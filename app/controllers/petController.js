const debug = require('debug')('opet:petController');
const petDataMapper = require('../models/petDataMapper');

const petController = {
  async addPet(request, response) {
    debug('addPets');
    const { id } = request.params;
    const pet = await petDataMapper.createPetForUser(id, request.body);
    response.status(201).json(pet);
  },
};

module.exports = petController;
