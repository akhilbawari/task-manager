import { Request, Response } from 'express';
import Task from '../models/Task';
import TaskParserService from '../services/TaskParserService';
import MultiTaskParserService from '../services/MultiTaskParserService';
import TranscriptParserService from '../services/TranscriptParserService';
import TaskEnhancerService from '../services/TaskEnhancerService';
import MeetingMinutesService from '../services/MeetingMinutesService';
import inMemoryStore from '../utils/inMemoryStore';

// Flag to determine if we're using MongoDB or in-memory store
let useMongoDb = true;

// Function to set the database mode
export const setDatabaseMode = (useMongo: boolean) => {
  useMongoDb = useMongo;
  console.log(`Using ${useMongoDb ? 'MongoDB' : 'in-memory store'} for data storage`);
};

class TaskController {
  /**
   * Create a new task from natural language input or manual input
   * Supports both AI-parsed tasks and manually created tasks
   * Also supports multiple tasks in a single prompt for AI mode
   */
  public async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { taskString } = req.body;

      if (!taskString) {
        res.status(400).json({ success: false, error: 'Task string is required' });
        return;
      }

      let tasks = [];
      
      // Check if this is a JSON string (manual task creation)
      try {
        // Try to parse as JSON first (for manual task creation)
        const taskData = JSON.parse(taskString);
        
        // If we get here, it's a valid JSON object
        // This is a manually created task (non-AI)
        let task;
        if (useMongoDb) {
          task = await Task.create({
            name: taskData.name,
            assignee: taskData.assignee || 'Unassigned',
            dueDate: taskData.dueDate || new Date(),
            priority: taskData.priority || 'P3',
            isAI: false,
            description: taskData.description || ''
          });
        } else {
          task = await inMemoryStore.create({
            name: taskData.name,
            assignee: taskData.assignee || 'Unassigned',
            dueDate: taskData.dueDate || new Date(),
            priority: taskData.priority || 'P3',
            isAI: false,
            description: taskData.description || ''
          });
        }
        tasks.push(task);
        
        res.status(201).json({
          success: true,
          count: 1,
          data: task
        });
        return;
      } catch (e) {
        // Not a JSON string, continue with AI parsing
      }
      
      // If we get here, it's a natural language input (AI mode)
      // Check if the input contains multiple tasks
      const containsMultipleTasks = MultiTaskParserService.containsMultipleTasks(taskString);
      
      if (containsMultipleTasks) {
        // Parse multiple tasks
        const parsedTasks = MultiTaskParserService.parseMultipleTasks(taskString);
        
        // Enhance tasks with AI-generated titles and descriptions
        const enhancedTasks = await TaskEnhancerService.enhanceManyTasks(parsedTasks);
        
        // Create all tasks
        for (const enhancedTask of enhancedTasks) {
          let task;
          if (useMongoDb) {
            task = await Task.create({
              name: enhancedTask.name,
              assignee: enhancedTask.assignee || 'Unassigned',
              dueDate: enhancedTask.dueDate || new Date(),
              priority: enhancedTask.priority,
              isAI: true,
              description: enhancedTask.description || ''
            });
          } else {
            task = await inMemoryStore.create({
              name: enhancedTask.name,
              assignee: enhancedTask.assignee || 'Unassigned',
              dueDate: enhancedTask.dueDate || new Date(),
              priority: enhancedTask.priority,
              isAI: true,
              description: enhancedTask.description || ''
            });
          }
          tasks.push(task);
        }
        
        res.status(201).json({
          success: true,
          count: tasks.length,
          data: tasks
        });
      } else {
        // Parse the single natural language task
        const parsedTask = TaskParserService.parseTask(taskString);
        
        // Enhance task with AI-generated title and description
        const enhancedTask = await TaskEnhancerService.enhanceTask(parsedTask);

        let task;
        if (useMongoDb) {
          // Create a new task with the parsed data using MongoDB
          task = await Task.create({
            name: enhancedTask.name,
            assignee: enhancedTask.assignee || 'Unassigned',
            dueDate: enhancedTask.dueDate || new Date(), // Provide default date if null
            priority: enhancedTask.priority,
            isAI: true,
            description: enhancedTask.description || ''
          });
        } else {
          // Create a new task with the parsed data using in-memory store
          task = await inMemoryStore.create({
            name: enhancedTask.name,
            assignee: enhancedTask.assignee || 'Unassigned',
            dueDate: enhancedTask.dueDate || new Date(), // Provide default date if null
            priority: enhancedTask.priority,
            isAI: true,
            description: enhancedTask.description || ''
          });
        }
        
        tasks.push(task);
        
        res.status(201).json({
          success: true,
          count: 1,
          data: task
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  /**
   * Get all tasks
   */
  public async getTasks(req: Request, res: Response): Promise<void> {
    try {
      let tasks;
      if (useMongoDb) {
        tasks = await Task.find().sort({ createdAt: -1 });
      } else {
        tasks = await inMemoryStore.find();
      }

      res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  /**
   * Get a single task by ID
   */
  public async getTask(req: Request, res: Response): Promise<void> {
    try {
      let task;
      if (useMongoDb) {
        task = await Task.findById(req.params.id);
      } else {
        task = await inMemoryStore.findById(req.params.id);
      }

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  /**
   * Update a task
   */
  public async updateTask(req: Request, res: Response): Promise<void> {
    try {
      let task;
      if (useMongoDb) {
        task = await Task.findById(req.params.id);
      } else {
        task = await inMemoryStore.findById(req.params.id);
      }

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      if (useMongoDb) {
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
        });
      } else {
        task = await inMemoryStore.findByIdAndUpdate(req.params.id, req.body);
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  /**
   * Delete a task
   */
  public async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      if (useMongoDb) {
        const task = await Task.findById(req.params.id);

        if (!task) {
          res.status(404).json({
            success: false,
            error: 'Task not found'
          });
          return;
        }

        await task.deleteOne();
      } else {
        const task = await inMemoryStore.findById(req.params.id);

        if (!task) {
          res.status(404).json({
            success: false,
            error: 'Task not found'
          });
          return;
        }

        await inMemoryStore.findByIdAndDelete(req.params.id);
      }

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  /**
   * Process meeting transcript and extract tasks
   */
  public async processTranscript(req: Request, res: Response): Promise<void> {
    try {
      const { transcript } = req.body;

      if (!transcript) {
        res.status(400).json({ success: false, error: 'Transcript is required' });
        return;
      }

      // Extract tasks from the transcript using Gemini AI
      const extractedTasks = await TranscriptParserService.extractTasksFromTranscript(transcript);
      
      // Enhance tasks with AI-generated titles and descriptions
      const enhancedTasks = await TaskEnhancerService.enhanceManyTasks(extractedTasks.map(task => ({
        ...task,
        description: 'Extracted from meeting transcript'
      })));
      
      // Save all extracted tasks to the database
      const savedTasks = [];
      
      for (const task of enhancedTasks) {
        let savedTask;
        if (useMongoDb) {
          savedTask = await Task.create({
            name: task.name,
            assignee: task.assignee || 'Unassigned',
            dueDate: task.dueDate || new Date(),
            priority: task.priority,
            isAI: true,
            description: task.description || 'Extracted from meeting transcript'
          });
        } else {
          savedTask = await inMemoryStore.create({
            name: task.name,
            assignee: task.assignee || 'Unassigned',
            dueDate: task.dueDate || new Date(),
            priority: task.priority,
            isAI: true,
            description: task.description || 'Extracted from meeting transcript'
          });
        }
        savedTasks.push(savedTask);
      }

      res.status(201).json({
        success: true,
        count: savedTasks.length,
        data: savedTasks
      });
    } catch (error) {
      console.error('Error processing transcript:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  /**
   * Process meeting minutes and extract meaningful tasks with proper assignments
   * This method uses Gemini AI to analyze meeting minutes and extract meaningful tasks
   */
  public async processMeetingMinutes(req: Request, res: Response): Promise<void> {
    try {
      const { minutes } = req.body;

      if (!minutes) {
        res.status(400).json({ success: false, error: 'Meeting minutes are required' });
        return;
      }

      // Analyze meeting minutes and extract meaningful tasks using Gemini AI
      const extractedTasks = await MeetingMinutesService.analyzeMeetingMinutes(minutes);
      
      // Save all extracted tasks to the database
      const savedTasks = [];
      
      for (const task of extractedTasks) {
        let savedTask;
        if (useMongoDb) {
          savedTask = await Task.create({
            name: task.name,
            assignee: task.assignee || 'Unassigned',
            dueDate: task.dueDate || new Date(),
            priority: task.priority || 'P3',
            isAI: true, // Always set isAI to true for Gemini-generated tasks
            description: task.description || 'Extracted from meeting minutes'
          });
        } else {
          savedTask = await inMemoryStore.create({
            name: task.name,
            assignee: task.assignee || 'Unassigned',
            dueDate: task.dueDate || new Date(),
            priority: task.priority || 'P3',
            isAI: true, // Always set isAI to true for Gemini-generated tasks
            description: task.description || 'Extracted from meeting minutes'
          });
        }
        savedTasks.push(savedTask);
      }

      res.status(201).json({
        success: true,
        count: savedTasks.length,
        data: savedTasks
      });
    } catch (error) {
      console.error('Error processing meeting minutes:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
  
  /**
   * Delete multiple tasks
   */
  public async deleteMultipleTasks(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ success: false, error: 'Task IDs are required' });
        return;
      }

      if (useMongoDb) {
        await Task.deleteMany({ _id: { $in: ids } });
      } else {
        for (const id of ids) {
          await inMemoryStore.findByIdAndDelete(id);
        }
      }

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      console.error('Error deleting multiple tasks:', error);
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}

export default new TaskController();
