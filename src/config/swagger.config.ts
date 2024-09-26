import swaggerJsdoc from "swagger-jsdoc";

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Cloud Storage API",
    version: "1.0.0",
    description: "API Documentation for Cloud Storage Backend",
  },
  servers: [
    {
      url: "http://localhost:8000/", // Adjust to your server's URL
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Optional, specify the token format
      },
    },
  },
};

// Swagger options
export const swaggerOptions = {
  swaggerDefinition,
  apis: ["./routes/*.route.ts", "./**/*.ts"], // to include all ts files in the src folder
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
