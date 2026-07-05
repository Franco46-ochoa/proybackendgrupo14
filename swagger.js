const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API de mi Backend (PostgreSQL + Sequelize)',
    description: 'Documentación automática de la API',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Ingresá el token con el formato: Bearer <TU_TOKEN>'
    }
  }
};

// Archivo de salida de la documentación
const outputFile = './swagger_output.json'; 

// Archivo raíz que levanta Express y mapea las rutas
const endpointsFiles = ['./server.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);