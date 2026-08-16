import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Finance Tracker API",
      version: "1.0.0",
      description: "API documentation for the Finance Tracker application",
    },
    servers: [
      {
        url: "https://finance-tracker-backend-rece.onrender.com",
      },
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;