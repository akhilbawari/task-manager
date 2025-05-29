/**
 * In-memory data store for tasks when MongoDB is not available
 */

import { ITask } from '../models/Task';

// Define a type that matches the Mongoose document structure more closely
type InMemoryTask = {
  _id: string;
  name: string;
  assignee: string;
  dueDate: Date;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Add minimal mongoose-like methods to satisfy TypeScript
  deleteOne: () => Promise<void>;
};

class InMemoryStore {
  private tasks: InMemoryTask[] = [];
  private nextId = 1;

  /**
   * Create a new task
   */
  public async create(taskData: Partial<ITask>): Promise<InMemoryTask> {
    const now = new Date();
    const task: InMemoryTask = {
      _id: this.nextId.toString(),
      name: taskData.name || '',
      assignee: taskData.assignee || 'Unassigned',
      dueDate: taskData.dueDate || now,
      priority: taskData.priority || 'P3',
      completed: taskData.completed || false,
      createdAt: now,
      updatedAt: now,
      deleteOne: async () => {
        await this.findByIdAndDelete(task._id);
      }
    };

    this.tasks.push(task);
    this.nextId++;

    return task;
  }

  /**
   * Find all tasks
   */
  public async find(): Promise<InMemoryTask[]> {
    return [...this.tasks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Find a task by ID
   */
  public async findById(id: string): Promise<InMemoryTask | null> {
    const task = this.tasks.find(t => t._id === id);
    return task || null;
  }

  /**
   * Update a task by ID
   */
  public async findByIdAndUpdate(
    id: string, 
    update: Partial<ITask>
  ): Promise<InMemoryTask | null> {
    const index = this.tasks.findIndex(t => t._id === id);
    
    if (index === -1) {
      return null;
    }

    const task = this.tasks[index];
    const updatedTask: InMemoryTask = {
      ...task,
      ...(update as any),
      updatedAt: new Date()
    };

    this.tasks[index] = updatedTask;
    return updatedTask;
  }

  /**
   * Delete a task by ID
   */
  public async findByIdAndDelete(id: string): Promise<boolean> {
    const index = this.tasks.findIndex(t => t._id === id);
    
    if (index === -1) {
      return false;
    }

    this.tasks.splice(index, 1);
    return true;
  }
}

export default new InMemoryStore();
