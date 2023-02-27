const debug = require('debug')('opet:petRouter');

const petRouter = require('express').Router();
const authenticateToken = require('../middlewares/authenticateToken');
const petController = require('../controllers/petController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: petPostSchema } = require('../validations/schemas/pet.schema');

petRouter.post('/user/:id([0-9]+)/pets', authenticateToken, validate(petPostSchema, 'body'), controllerHandler(petController.addPet));

module.exports = petRouter;
