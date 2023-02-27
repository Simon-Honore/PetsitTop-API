const debug = require('debug')('opet:adRouter');

const adRouter = require('express').Router();
const adController = require('../controllers/adController');
const controllerHandler = require('../controllers/controllerHandler');

const validate = require('../validations/validator');
const { post: adPostSchema } = require('../validations/schemas/ad.schema');
const { put: adPutSchema } = require('../validations/schemas/ad.schema');

const authenticateToken = require('../middlewares/authenticateToken');

adRouter.get('/user/:id([0-9]+)/ads', authenticateToken, controllerHandler(adController.getAdsByUserId));
adRouter.post('/user/:id([0-9]+)/ads', authenticateToken, validate(adPostSchema, 'body'), controllerHandler(adController.createAdByUserId));
adRouter.get('/ads', authenticateToken, controllerHandler(adController.getAllAds));
adRouter.put('/ads/:id([0-9]+)', authenticateToken, validate(adPutSchema, 'body'), controllerHandler(adController.updateAdById));
adRouter.delete('/ads/:id([0-9]+)', authenticateToken, controllerHandler(adController.deleteAdById));

module.exports = adRouter;
