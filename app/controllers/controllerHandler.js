const debug = require('debug')('opet:controllers');
/**
 * Factory returning a controller with error handling
 *
 * @param {function} controller - a middleware controller
 * @returns {function} a middleware controller with error management
 */
function controllerHandler(controller) {
  debug(`create new controller with error handling for ${controller.name}`);
  return async (request, response, next) => {
    try {
      await controller(request, response, next);
    } catch (err) {
      next(err);
    }
  };
}
module.exports = controllerHandler;
