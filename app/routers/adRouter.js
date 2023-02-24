const debug = require('debug')('opet:adRouter');

const adRouter = require('express').Router();
const adController = require('../controllers/adController');
const controllerHandler = require('../controllers/controllerHandler');

const authenticateToken = require('../middlewares/authenticateToken');

adRouter.get('/user/:id([0-9]+)/ads', authenticateToken, controllerHandler(adController.getAdsByUserId));
adRouter.post('/user/:id([0-9]+)/ads', authenticateToken, controllerHandler(adController.createAdByUserId));

module.exports = adRouter;
