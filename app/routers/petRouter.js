const debug = require('debug')('opet:petRouter');

const petRouter = require('express').Router();
const authenticateToken = require('../middlewares/authenticateToken');
const petController = require('../controllers/petController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: petPostSchema } = require('../validations/schemas/pet.schema');

petRouter.post('/user/:id([0-9]+)/pets', validate(petPostSchema, 'body'), authenticateToken, controllerHandler(petController.addPet));

// Route sans authent pour tests insomnia plus simples :
// petRouter.post('/user/:id([0-9]+)/pets', validate(petPostSchema, 'body'), controllerHandler(petController.addPet));

module.exports = petRouter;
