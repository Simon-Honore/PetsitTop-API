const debug = require('debug')('opet:petRouter');

const petRouter = require('express').Router();
const authenticateToken = require('../middlewares/authenticateToken');
const petController = require('../controllers/petController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: petPostSchema } = require('../validations/schemas/pet.schema');
const { put: petPutSchema } = require('../validations/schemas/pet.schema');

petRouter.post('/user/:id([0-9]+)/pets', authenticateToken, validate(petPostSchema, 'body'), controllerHandler(petController.addPet));
petRouter.put('/pets/:id([0-9]+)', authenticateToken, validate(petPutSchema, 'body'), controllerHandler(petController.modifyPet));
petRouter.delete('/pets/:id([0-9]+)', authenticateToken, controllerHandler(petController.deletePet));

module.exports = petRouter;
