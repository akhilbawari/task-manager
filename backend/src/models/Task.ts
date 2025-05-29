import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  name: string;
  assignee: string;
  dueDate: Date;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  completed: boolean;
  isAI: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true,
    },
    assignee: {
      type: String,
      required: [true, 'Assignee is required'],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    priority: {
      type: String,
      enum: ['P1', 'P2', 'P3', 'P4'],
      default: 'P3',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isAI: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITask>('Task', TaskSchema);
