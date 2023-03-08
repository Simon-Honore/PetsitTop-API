const debug = require('debug')('opet:adController');

const adDataMapper = require('../models/adDataMapper');
const userDataMapper = require('../models/userDataMapper');

const adController = {

  /**
   * responds with all entries from "ad" relation
   *
   * @param {Object} _
   * @param {Object} response
   */
  async getAllAds(request, response) {
    debug('getAllAds');
    // const { limit, start } = request.query;

    // default paging (if we get no value in parameters)
    let limit = 100;
    let start = 0;
    // if we get paging values from client:
    if (request.query.limit && request.query.start) {
      limit = Number(request.query.limit);
      start = Number(request.query.start);
    }

    const ads = await adDataMapper.findAllAds(limit, start);

    response.status(200).json({
      results: ads,
      size: ads.length, // number of results shown
      limit, // max number of results per page
      start, // Offset
    });
  },

  /**
   * responds with one entry from "ad" relation
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next
   */
  async getAdsByUserId(request, response, next) {
    debug('getAdsByUserId');
    const { id } = request.params;

    // Test if the user exists
    const isExistingUser = await userDataMapper.findUserById(id);

    // If the user does not exist, we return an error 404
    if (!isExistingUser) {
      debug(`User ${id} does not exists`);
      const error = { statusCode: 404, message: 'User does not exists' };
      return next(error);
    }
    const ads = await adDataMapper.findAdsByUserId(id);
    return response.status(200).json(ads);
  },

  /**
   * create one entry in "ad" relation
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next
   */
  async createAdByUserId(request, response, next) {
    debug('createAd');
    const { body } = request; // ad data from the form
    const { id } = request.params; // user id

    // Test if the user exists
    const isExistingUser = await userDataMapper.findUserById(id);

    // If the user does not exist, we return an error 404
    if (!isExistingUser) {
      debug(`User ${id} does not exists`);
      const error = { statusCode: 404, message: 'User does not exists' };
      return next(error);
    }

    // If user id different from "loggedInUser"."id" => error 403 (doesn't have the rights)
    const loggedInUser = request.user;
    if (Number(id) !== loggedInUser.id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // If the user exists and has the rights, we create the ad
    const ad = await adDataMapper.createAdByUserId(body, id);

    return response.status(201).json(ad);
  },

  /**
   * modify one entry in "ad" relation
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next
   */
  async updateAdById(request, response, next) {
    debug('updateAdById');
    const { id } = request.params; // id of the ad
    const { body } = request; // data of the ad

    // Test if the user has the right to access this route
    const loggedInUser = request.user;

    // Test if the ad exists
    const isExistingAd = await adDataMapper.findAdById(id);
    if (!isExistingAd) {
      debug(`Ad ${id} does not exists`);
      return next();
    }

    // If "ad"."user_id" different from "loggedInUser"."id" => error 403 (doesn't have the rights)
    if (loggedInUser.id !== isExistingAd.user_id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // If the ad exists and the user has the right to access, we update it with the new data
    const ad = await adDataMapper.updateAdById(id, body);

    return response.status(200).json(ad);
  },

  /**
   * remove one entry in "ad" relation
   *
   * @param {Object} request
   * @param {Object} response
   * @param {function} next
   */
  async deleteAdById(request, response, next) {
    debug('deleteAdById');
    const { id } = request.params; // id of the ad

    // Test if the user has the right to access this route
    const loggedInUser = request.user;

    // If the ad does not exist, we return an error 404
    const isExistingAd = await adDataMapper.findAdById(id);
    if (!isExistingAd) {
      debug(`Ad ${id} does not exists`);
      return next();
    }

    // If "ad"."user_id" different from "loggedInUser"."id" => error 403 (doesn't have the rights)
    if (loggedInUser.id !== isExistingAd.user_id) {
      const error = { statusCode: 403, message: 'Forbidden' };
      return next(error);
    }

    // Delete the ad
    await adDataMapper.deleteAdById(id);

    return response.status(204).send();
  },
};

module.exports = adController;
