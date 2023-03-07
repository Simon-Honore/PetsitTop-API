const path = require('path');

const swaggerOptions = {
  info: {
    version: '1.0.0',
    title: 'PetsitTop',
    description: 'This is an API for an app to find and contact petsitters, or to find pets to petsit.',
  },
  baseDir: path.join(__dirname, 'app'),
  filesPattern: './**/*.js',
  swaggerUIPath: '/api-docs', // API documentation route
  security: {
    BearerAuth: { // authentification with JWT
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

module.exports = swaggerOptions;
