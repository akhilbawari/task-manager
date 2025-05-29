/**
 * TaskEnhancerService
 * 
 * This service enhances tasks with AI-generated titles and descriptions
 * It uses the task content, assignee, and due date to generate meaningful titles and descriptions
 * It integrates with the GeminiService for AI-powered enhancements
 */

import { ParsedTask } from './TaskParserService';
import GeminiService from './GeminiService';

class TaskEnhancerService {
  /**
   * Enhances a task with AI-generated title and description
   */
  public async enhanceTask(task: ParsedTask): Promise<ParsedTask> {
    try {
      // Use GeminiService to enhance the task with AI-generated title and description
      const enhancedTask = await GeminiService.enhanceTask(task);
      return enhancedTask;
    } catch (error) {
      // Error enhancing task with GeminiService
      
      // Fallback to local enhancement if GeminiService fails
      const enhancedTitle = this.generateEnhancedTitle(task);
      const description = this.generateDescription(task);
      
      return {
        ...task,
        name: enhancedTitle,
        description,
        isAI: true
      };
    }
  }
  
  /**
   * Enhances multiple tasks with AI-generated titles and descriptions
   */
  public async enhanceManyTasks(tasks: ParsedTask[]): Promise<ParsedTask[]> {
    try {
      // Use GeminiService to enhance multiple tasks with AI-generated titles and descriptions
      const enhancedTasks = await GeminiService.enhanceManyTasks(tasks);
      return enhancedTasks;
    } catch (error) {
      // Error enhancing multiple tasks with GeminiService
      
      // Fallback to local enhancement if GeminiService fails
      const enhancedTasks = [];
      for (const task of tasks) {
        const enhancedTitle = this.generateEnhancedTitle(task);
        const description = this.generateDescription(task);
        
        enhancedTasks.push({
          ...task,
          name: enhancedTitle,
          description,
          isAI: true
        });
      }
      
      return enhancedTasks;
    }
  }
  
  /**
   * Generates an enhanced title for a task
   * This is a simple implementation that could be replaced with a more sophisticated AI model
   */
  private generateEnhancedTitle(task: ParsedTask): string {
    // If the task already has a good title, keep it
    if (task.name.length > 15) {
      return task.name;
    }
    
    // Generate a more descriptive title
    const actions = ['Complete', 'Finalize', 'Prepare', 'Review', 'Develop', 'Create', 'Update'];
    const subjects = ['document', 'report', 'presentation', 'project', 'design', 'code', 'content'];
    
    // Extract key terms from the original task name
    const words = task.name.split(' ');
    const keyTerms = words.filter(word => word.length > 3);
    
    // If we have key terms, use them to create a better title
    if (keyTerms.length > 0) {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      return `${randomAction} ${task.name}`;
    }
    
    // If no good key terms, generate a generic but meaningful title
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    
    return `${randomAction} ${randomSubject} ${task.assignee ? `for ${task.assignee}` : ''}`;
  }
  
  /**
   * Generates a description for a task
   * This is a simple implementation that could be replaced with a more sophisticated AI model
   */
  private generateDescription(task: ParsedTask): string {
    // Generate a description based on the task details
    let description = `This task involves ${task.name.toLowerCase()}`;
    
    if (task.assignee) {
      description += ` and is assigned to ${task.assignee}`;
    }
    
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const formattedDate = dueDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      description += `. It should be completed by ${formattedDate}`;
    }
    
    description += `. This task has a priority of ${task.priority}.`;
    
    // Add a random helpful tip based on the priority
    if (task.priority === 'P1') {
      description += ' This is a critical task that requires immediate attention.';
    } else if (task.priority === 'P2') {
      description += ' This is an important task that should be completed soon.';
    } else if (task.priority === 'P3') {
      description += ' This is a standard task with normal priority.';
    } else if (task.priority === 'P4') {
      description += ' This is a low-priority task that can be completed when time permits.';
    }
    
    return description;
  }
}

export default new TaskEnhancerService();
