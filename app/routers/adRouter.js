const debug = require('debug')('opet:adRouter');

const adRouter = require('express').Router();
const adController = require('../controllers/adController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: adPostSchema } = require('../validations/schemas/ad.schema');
const { put: adPutSchema } = require('../validations/schemas/ad.schema');

const authenticateToken = require('../middlewares/authenticateToken');

/** a general Ad type
 * @typedef {object} Ad
 * @property {number} id - ad id
 * @property {string} title - ad title
 * @property {string} content - ad content
 * @property {string} city - ad city
 * @property {string} postal_code - ad postal code
 * @property {number} user_id - user id
 * @property {string} created_at - ad creation date
 * @property {string} updated_at - ad update date
 */

/** a get Ad type
 * @typedef {object} AdGet
 * @property {number} id - ad id
 * @property {string} title - ad title
 * @property {string} content - ad content
 * @property {string} city - ad city
 * @property {string} postal_code - ad postal code
 * @property {number} user_id - user id
 * @property {array<User>} user - ad user with id first_name and last_name
 * @property {string} created_at - ad creation date
 * @property {string} updated_at - ad update date
 */

/** a create/modify Ad (for body) type
 * @typedef {object} AdCreateModify
 * @property {string} title - ad title
 * @property {string} content - ad content
 * @property {string} city - ad city
 * @property {string} postal_code - ad postal code
*/

/** a User type
 * @typedef {object} User
 * @property {number} id - user id
 * @property {string} first_name - user first_name
 * @property {string} last_name - user last_name
 * /

/**
 * GET /user/{id}/ads
 *
 * @summary get all ads by user id
 * @tags Ads
 *
 * @param {number} id.path - user id
 *
 * @return {array<Ad>} 200 - success response
 * @return {object} 500 - internal server error
 * @return {object} 401 - unauthorized
 *
 * @security BearerAuth
 */
adRouter.get('/user/:id([0-9]+)/ads', authenticateToken, controllerHandler(adController.getAdsByUserId));

/**
 * POST /user/{id}/ads
 *
 * @summary create a new ad for one user
 * @tags Ads
 *
 * @param {number} id.path - user id
 * @param {AdCreateModify} request.body - ad
 *
 * @return {Ad} 201 - success response
 * @return {object} 500 - internal server error
 * @return {object} 401 - unauthorized
 * @return {object} 403 - forbidden
 *
 * @security BearerAuth
 */
adRouter.post('/user/:id([0-9]+)/ads', authenticateToken, validate(adPostSchema, 'body'), controllerHandler(adController.createAdByUserId));

/**
 * GET /ads
 *
 * @summary get all ads
 * @tags Ads
 *
 * @return {array<AdGet>} 200 - success response
 * @return {object} 500 - internal server error
 * @return {object} 401 - unauthorized
 *
 * @security BearerAuth
 */
adRouter.get('/ads', authenticateToken, controllerHandler(adController.getAllAds));

/**
 * PUT /ads/{id}
 *
 * @summary modify an ad
 * @tags Ads
 *
 * @param {number} id.path - ad id
 * @param {AdCreateModify} request.body - post
 *
 * @return {Ad} 200 - success response
 * @return {object} 500 - internal server error
 * @return {object} 401 - unauthorized
 * @return {object} 403 - forbidden
 *
 * @security BearerAuth
 */
adRouter.put('/ads/:id([0-9]+)', authenticateToken, validate(adPutSchema, 'body'), controllerHandler(adController.updateAdById));

/**
 * DELETE /ads/{id}
 *
 * @summary delete an ad
 * @tags Ads
 *
 * @param {number} id.path - ad id
 *
 * @return {object} 204 - success response
 * @return {object} 500 - internal server error
 * @return {object} 401 - unauthorized
 * @return {object} 403 - forbidden
 *
 * @security BearerAuth
 */
adRouter.delete('/ads/:id([0-9]+)', authenticateToken, controllerHandler(adController.deleteAdById));

module.exports = adRouter;
