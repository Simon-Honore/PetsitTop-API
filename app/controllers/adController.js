const debug = require('debug')('opet:adController');

const adDataMapper = require('../models/adDataMapper');
const userDataMapper = require('../models/userDataMapper');

const adController = {
  async getAdsByUserId(request, response) {
    debug('getAdsByUserId');
    const { id } = request.params;
    const ads = await adDataMapper.findAdsByUserId(id);
    response.status(200).json(ads);
  },
  async createAdByUserId(request, response, next) {
    debug('createAd');
    const { body } = request; // données de l'annonce
    const { id } = request.params; // id de l'utilisateur

    // Test si l'utilisateur existe
    const isExistingUser = await userDataMapper.findUserById(id);

    // Si l'utilisateur n'existe pas, on renvoie une erreur
    if (!isExistingUser) {
      return next(new Error('User does not exist'));
    }

    // Si l'utilisateur existe, on crée l'annonce
    const ad = await adDataMapper.createAdByUserId(body, id);

    // Réponse
    return response.status(201).json(ad);
  },
};

module.exports = adController;
