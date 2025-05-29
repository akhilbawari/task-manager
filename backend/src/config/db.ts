import mongoose from 'mongoose';

const connectDB = async (): Promise<boolean> => {
  try {


    
    const conn = await mongoose.connect('mongodb+srv://akhilbawari1708:aE2egjaJ9ayKTcCG@brucewane.ittmttw.mongodb.net/task-manager');
    
    // MongoDB Connected message removed
    return true;
  } catch (error) {
    // MongoDB connection warning removed
    // Memory-only mode warning removed
    return false;
  }
};

export default connectDB;
