/**
 * GeminiService
 * 
 * This service provides integration with the Google Gemini API
 * for generating AI-enhanced task titles and descriptions
 * and parsing multiple tasks from a single prompt
 */

import axios from 'axios';
import { ParsedTask } from './TaskParserService';

class GeminiService {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    // In a real application, this would be loaded from environment variables
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  /**
   * Enhances a task with AI-generated title and description using Gemini API
   */
  public async enhanceTask(task: ParsedTask): Promise<ParsedTask> {
    try {
      if (!this.apiKey) {
        console.warn('Gemini API key not configured. Using fallback enhancement.');
        return this.fallbackEnhanceTask(task);
      }

      const prompt = this.createPromptForTask(task);
      const response = await this.callGeminiAPI(prompt);
      
      if (!response) {
        return this.fallbackEnhanceTask(task);
      }

      const { enhancedTitle, description } = this.parseGeminiResponse(response, task);
      
      return {
        ...task,
        name: enhancedTitle || task.name,
        description: description || '',
        isAI: true
      };
    } catch (error) {
      console.error('Error enhancing task with Gemini API:', error);
      return this.fallbackEnhanceTask(task);
    }
  }

  /**
   * Enhances multiple tasks with AI-generated titles and descriptions
   */
  public async enhanceManyTasks(tasks: ParsedTask[]): Promise<ParsedTask[]> {
    const enhancedTasks = [];
    
    for (const task of tasks) {
      const enhancedTask = await this.enhanceTask(task);
      enhancedTasks.push(enhancedTask);
    }
    
    return enhancedTasks;
  }

  /**
   * Creates a prompt for the Gemini API based on the task details
   */
  private createPromptForTask(task: ParsedTask): string {
    let prompt = `Generate a meaningful title and description for the following task:\n\n`;
    prompt += `Task: ${task.name}\n`;
    
    if (task.assignee) {
      prompt += `Assignee: ${task.assignee}\n`;
    }
    
    if (task.dueDate) {
      prompt += `Due Date: ${new Date(task.dueDate).toLocaleString()}\n`;
    }
    
    prompt += `Priority: ${task.priority}\n\n`;
    prompt += `Please respond in JSON format with the following structure:\n`;
    prompt += `{\n  "enhancedTitle": "A clear, concise and specific title for the task",\n  "description": "A helpful description that explains what needs to be done"\n}`;
    
    return prompt;
  }

  /**
   * Calls the Gemini API with the given prompt
   */
  private async callGeminiAPI(prompt: string): Promise<string | null> {
    try {
      const url = `${this.apiEndpoint}?key=${this.apiKey}`;
      
      const response = await axios.post(url, {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200
        }
      });
      
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0] && 
          response.data.candidates[0].content.parts[0].text) {
        return response.data.candidates[0].content.parts[0].text;
      }
      
      return null;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return null;
    }
  }

  /**
   * Parses the Gemini API response to extract the enhanced title and description
   */
  private parseGeminiResponse(response: string, originalTask: ParsedTask): { enhancedTitle: string, description: string } {
    try {
      const parsedResponse = JSON.parse(response);
      
      return {
        enhancedTitle: parsedResponse.enhancedTitle || originalTask.name,
        description: parsedResponse.description || ''
      };
    } catch (error) {
      console.error('Error parsing Gemini API response:', error);
      
      // Try to extract data using regex if JSON parsing fails
      const titleMatch = response.match(/enhancedTitle["\s:]+([^"]+)/);
      const descriptionMatch = response.match(/description["\s:]+([^"]+)/);
      
      return {
        enhancedTitle: titleMatch && titleMatch[1] ? titleMatch[1].trim() : originalTask.name,
        description: descriptionMatch && descriptionMatch[1] ? descriptionMatch[1].trim() : ''
      };
    }
  }

  /**
   * Fallback method to enhance a task when the API is not available
   */
  private fallbackEnhanceTask(task: ParsedTask): ParsedTask {
    // Generate a more meaningful title based on the task content
    const enhancedTitle = this.generateFallbackTitle(task);
    
    // Generate a description based on the task content
    const description = this.generateFallbackDescription(task);
    
    return {
      ...task,
      name: enhancedTitle,
      description,
      isAI: true
    };
  }

  /**
   * Generates a fallback title for a task when the API is not available
   */
  private generateFallbackTitle(task: ParsedTask): string {
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
   * Generates a fallback description for a task when the API is not available
   */
  private generateFallbackDescription(task: ParsedTask): string {
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
  
  /**
   * Parses multiple tasks from a single prompt using Gemini API
   * @param prompt The user prompt containing multiple task descriptions
   */
  public async parseMultipleTasks(prompt: string): Promise<ParsedTask[]> {
    try {
      if (!this.apiKey) {
        console.warn('Gemini API key not configured. Cannot parse multiple tasks.');
        return [];
      }

      const geminiPrompt = `Extract multiple tasks from the following text. For each task, identify:

1. Task name
2. Assignee (if mentioned)
3. Due date and time (if mentioned)
4. Priority (P1 for highest, P4 for lowest, default to P3 if not specified)

Text: "${prompt}"

Respond with a JSON array of tasks, each with the following structure:
{
  "name": "Task name",
  "assignee": "Person name or null if not specified",
  "dueDate": "ISO date string or null if not specified",
  "priority": "P1, P2, P3, or P4",
  "description": "A brief description of what the task entails"
}

Ensure each task has all fields, using null for missing values except priority which defaults to P3.`;

      const response = await this.callGeminiAPI(geminiPrompt);
      
      if (!response) {
        console.error('Failed to get response from Gemini API for multiple tasks');
        return [];
      }

      return this.parseMultipleTasksResponse(response);
    } catch (error) {
      console.error('Error parsing multiple tasks with Gemini API:', error);
      return [];
    }
  }

  /**
   * Parses the Gemini API response for multiple tasks
   */
  private parseMultipleTasksResponse(response: string): ParsedTask[] {
    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(response);
      
      if (Array.isArray(parsedResponse)) {
        // Ensure each task has the required fields
        return parsedResponse.map(task => ({
          name: task.name || 'Untitled Task',
          assignee: task.assignee || null,
          dueDate: task.dueDate || null,
          priority: task.priority || 'P3',
          description: task.description || '',
          isAI: true
        }));
      }
      
      console.error('Gemini API response is not an array:', parsedResponse);
      return [];
    } catch (error) {
      console.error('Error parsing Gemini API response for multiple tasks:', error);
      
      // Attempt to extract JSON from a text response that might have additional content
      try {
        const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          const extractedJson = jsonMatch[0];
          const parsedJson = JSON.parse(extractedJson);
          
          if (Array.isArray(parsedJson)) {
            return parsedJson.map(task => ({
              name: task.name || 'Untitled Task',
              assignee: task.assignee || null,
              dueDate: task.dueDate || null,
              priority: task.priority || 'P3',
              description: task.description || '',
              isAI: true
            }));
          }
        }
      } catch (e) {
        console.error('Failed to extract JSON from response:', e);
      }
      
      return [];
    }
  }
}

export default new GeminiService();
