import mongoose from 'mongoose';

const connectDB = async (): Promise<boolean> => {
  try {


    
    const conn = await mongoose.connect('mongodb+srv://akhilbawari1708:aE2egjaJ9ayKTcCG@brucewane.ittmttw.mongodb.net/task-manager');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`Warning: Could not connect to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.warn('The application will run in memory-only mode. Data will not be persisted.');
    return false;
  }
};

export default connectDB;
