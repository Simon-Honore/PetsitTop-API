const bunyan = require('bunyan');
const path = require('path');

const logger = bunyan.createLogger({
  name: 'Opet API',
  streams: [
    {
      level: 'error',
      path: path.join(__dirname, '../../logs/errors.log'),
    },
    {
      path: path.join(__dirname, '../../logs/requests.log'),
    }],
});

module.exports = logger;
