const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "🐝 BeeSmart API Documentation",
    version: "1.0.0",
    description: "Повна документація RESTful API для системи управління промисловою пасікою. Включає модулі авторизації, управління вуликами, IoT-телеметрію та офлайн-синхронізацію.",
    contact: {
      name: "BeeSmart Support",
      url: "https://github.com/zrumyk/BeeSmartApp"
    }
  },
  servers: [
    {
      url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
      description: "Local Development Server"
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
