const debug = require('debug')('opet:adRouter');

const adRouter = require('express').Router();
const adController = require('../controllers/adController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: adPostSchema } = require('../validations/schemas/ad.schema');

const authenticateToken = require('../middlewares/authenticateToken');

adRouter.get('/user/:id([0-9]+)/ads', authenticateToken, controllerHandler(adController.getAdsByUserId));
adRouter.post('/user/:id([0-9]+)/ads', authenticateToken, validate(adPostSchema, 'body'), controllerHandler(adController.createAdByUserId));

module.exports = adRouter;
