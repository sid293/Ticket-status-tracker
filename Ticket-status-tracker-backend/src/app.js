import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import connectDB from './utils/db.js';
import authRouter from './routes/auth.routes.js';
import ticketsRouter from './routes/tickets.routes.js';
import { initializeCronScheduler } from './jobs/cronScheduler.js';
import specs from './config/swagger.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Initialize cron scheduler after DB connection
initializeCronScheduler();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(specs));

// Routers
app.use('/api/auth', authRouter);
app.use('/api/tickets', ticketsRouter);

// Basic route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Ticket Status Tracker API',
    version: '1.0.0',
    status: 'Server is running',
    docs: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}/api-docs`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
