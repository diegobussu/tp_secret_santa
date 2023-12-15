const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API N°1',
      version: '1.0.0',
      description: 'API USING EXPRESS LIBRARY AND MONGODB DATABASE WITH A MIDDLEWARE',
    },
  },

  apis: ['./swaggerDoc/*.js'],
};

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  serveSwaggerUI: swaggerUi.serve,
  setupSwaggerUI: swaggerUi.setup(swaggerSpec),
};
