const debug = require('debug')('opet:petRouter');

const petRouter = require('express').Router();
const authenticateToken = require('../middlewares/authenticateToken');
const petController = require('../controllers/petController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: petPostSchema } = require('../validations/schemas/pet.schema');
const { put: petPutSchema } = require('../validations/schemas/pet.schema');

/**
 * a pet type
 *
 * @typedef {object} Pet
 * @property {number} id - pet id
 * @property {string} name - pet name
 * @property {string} presentation - pet presentation
 * @property {number} user_id - pet user_id
 * @property {number} pet_type_id - pet pet_type_id
 * @property {string} created_at - date of creation
 * @property {string} updated_at - date of last update
 */

/**
 * a pet type for creation/modification
 *
 * @typedef {object} createOrUpdatePet
 * @property {string} name - pet name
 * @property {string} presentation - pet presentation
 * @property {number} pet_type_id - pet pet_type_id
 */

/**
 * POST /user/{userId}/pets
 *
 * @summary add a new pet to a user
 * @tags Pets
 *
 * @param {number} userId.path - user id
 * @param {createOrUpdatePet} request.body - pet
 *
 * @return {Pet} 200 - success response
 * @return {object} 500 - internal server error
 *
 * @security BearerAuth
 */
petRouter.post('/user/:id([0-9]+)/pets', authenticateToken, validate(petPostSchema, 'body'), controllerHandler(petController.addPet));

/**
 * PUT /pets/{petId}
 *
 * @summary modify a pet
 * @tags Pets
 *
 * @param {number} petId.path - pet id
 * @param {createOrUpdatePet} request.body - pet
 *
 * @return {Pet} 200 - success response
 * @return {object} 500 - internal server error
 *
 * @security BearerAuth
 */
petRouter.put('/pets/:id([0-9]+)', authenticateToken, validate(petPutSchema, 'body'), controllerHandler(petController.modifyPet));

/**
 * DELETE /pets/{petId}
 *
 * @summary delete a pet
 * @tags Pets
 *
 * @param {number} petId.path - pet id
 *
 * @return {object} 204 - success response
 * @return {object} 500 - internal server error
 *
 * @security BearerAuth
 */
petRouter.delete('/pets/:id([0-9]+)', authenticateToken, controllerHandler(petController.deletePet));

module.exports = petRouter;
