import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import taskRoutes from './routes/taskRoutes';
import { setDatabaseMode } from './controllers/TaskController';

// Load environment variables
dotenv.config();

// Connect to database and set database mode based on connection result
// connectDB().then(isConnected => {
//   setDatabaseMode(isConnected);
// });


const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/tasks', taskRoutes);

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Task Manager API' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Error stack trace removed
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

// Start server
app.listen(PORT, () => {

  // Server running message removed
  connectDB()
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  // Error message logging removed
  // Close server & exit process
  process.exit(1);
});
