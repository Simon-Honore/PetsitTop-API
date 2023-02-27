const debug = require('debug')('opet:adController');

const adDataMapper = require('../models/adDataMapper');
const userDataMapper = require('../models/userDataMapper');

const adController = {
  async getAllAds(request, response) {
    debug('getAllAds');
    const ads = await adDataMapper.findAllAds();
    response.status(200).json(ads);
  },
  async getAdsByUserId(request, response, next) {
    debug('getAdsByUserId');
    const { id } = request.params;

    // Test if the user exists
    const isExistingUser = await userDataMapper.findUserById(id);

    // If the user does not exist, we return an error 404
    if (!isExistingUser) {
      debug(`Ad ${id} does not exists`);
      const error = { statusCode: 404, message: 'User does not exists' };
      return next(error);
    }
    const ads = await adDataMapper.findAdsByUserId(id);
    return response.status(200).json(ads);
  },
  async createAdByUserId(request, response, next) {
    debug('createAd');
    const { body } = request; // données de l'annonce
    const { id } = request.params; // id de l'utilisateur

    // Test if the user has the right to access this route
    const loggedInUser = request.user;
    if (Number(id) !== loggedInUser.id) {
      const error = { statusCode: 401, message: 'Unauthorized' };
      return next(error);
    }

    // Test if the user exists
    const isExistingUser = await userDataMapper.findUserById(id);

    // If the user does not exist, we return an error 404
    if (!isExistingUser) {
      debug(`User ${id} does not exists`);
      const error = { statusCode: 404, message: 'User does not exists' };
      return next(error);
    }

    // If the user exists, we create the ad
    const ad = await adDataMapper.createAdByUserId(body, id);

    // Réponse
    return response.status(201).json(ad);
  },
  async updateAdById(request, response, next) {
    debug('updateAdById');
    const { id } = request.params; // id of the ad
    const { body } = request; // data of the ad

    // Test if the user has the right to access this route
    const loggedInUser = request.user;
    if (Number(id) !== loggedInUser.id) {
      const error = { statusCode: 401, message: 'Unauthorized' };
      return next(error);
    }

    // Test if the ad exists
    const isExistingAd = await adDataMapper.findAdById(id);
    if (!isExistingAd) {
      debug(`Ad ${id} does not exists`);
      const error = { statusCode: 404, message: 'Ad does not exists' };
      return next(error);
    }

    // If the ad exists and the user has the right to access, we update it with the new data
    const ad = await adDataMapper.updateAdById(id, body);

    // Response
    return response.status(200).json(ad);
  },
  async deleteAdById(request, response, next) {
    debug('deleteAdById');
    const { id } = request.params; // id of the ad

    // Test if the user has the right to access this route
    const loggedInUser = request.user;
    if (Number(id) !== loggedInUser.id) {
      const error = { statusCode: 401, message: 'Unauthorized' };
      return next(error);
    }

    // If the ad does not exist, we return an error 404
    const isExistingAd = await adDataMapper.findAdById(id);
    if (!isExistingAd) {
      debug(`Ad ${id} does not exists`);
      return next();
    }

    // Delete the ad
    await adDataMapper.deleteAdById(id);

    // Response
    return response.status(204).send();
  },
};

module.exports = adController;
