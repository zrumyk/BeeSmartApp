const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "BeeSmart API",
    version: "1.0.0",
    description: "RESTful API for industrial apiary management"
  },
  servers: [
    {
      url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/docs/swaggerPaths.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
