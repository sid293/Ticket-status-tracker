import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Status Tracker API',
      version: '1.0.0',
      description: 'API for managing tickets with automated status progression',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User MongoDB ID',
              example: '507f1f77bcf86cd799439011'
            },
            userId: {
              type: 'string',
              description: 'Unique user identifier',
              example: '1'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB ObjectId',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              example: 'Fix login button'
            },
            description: {
              type: 'string',
              example: 'The login button is not working properly'
            },
            status: {
              type: 'string',
              enum: ['Open', 'In Progress', 'Review', 'Testing', 'Done'],
              example: 'Open'
            },
            owner: {
              type: 'string',
              example: '1'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-15T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-15T10:30:00.000Z'
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation error'
            },
            message: {
              type: 'string',
              example: 'Email is required'
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export default specs;
