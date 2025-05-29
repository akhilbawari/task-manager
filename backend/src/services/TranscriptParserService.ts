import { GoogleGenerativeAI } from '@google/generative-ai';
import TaskParserService, { ParsedTask } from './TaskParserService';
import dotenv from 'dotenv';

dotenv.config();

interface ExtractedTask {
  taskDescription: string;
  assignee: string;
  deadline: string;
  priority: string;
}

class TranscriptParserService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not defined in environment variables');
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use the latest model version available
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  /**
   * Extracts tasks from a meeting transcript using Gemini AI
   * @param transcript The meeting transcript to parse
   * @returns Array of parsed tasks
   */
  public async extractTasksFromTranscript(transcript: string): Promise<ParsedTask[]> {
    try {
      const prompt = `
        Extract all tasks from the following meeting transcript. 
        For each task, identify:
        1. Task description
        2. Assignee (the person responsible)
        3. Deadline (date and/or time)
        4. Priority (if mentioned, otherwise assume P3)

        Format the output as a JSON array of objects with these properties:
        [
          {
            "taskDescription": "...",
            "assignee": "...",
            "deadline": "...",
            "priority": "P1|P2|P3|P4"
          }
        ]

        Meeting Transcript:
        """
        ${transcript}
        """
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      const extractedTasks: ExtractedTask[] = JSON.parse(jsonMatch[0]);
      
      // Convert extracted tasks to ParsedTask format
      return this.convertToTaskFormat(extractedTasks);
    } catch (error) {
      console.error('Error extracting tasks from transcript:', error);
      console.log('Falling back to rule-based task extraction...');
      
      // Fallback to rule-based extraction if Gemini API fails
      return this.extractTasksWithRules(transcript);
    }
  }
  
  /**
   * Fallback method to extract tasks using rule-based approach when Gemini AI is unavailable
   * @param transcript The meeting transcript to parse
   * @returns Array of parsed tasks
   */
  private extractTasksWithRules(transcript: string): ParsedTask[] {
    const tasks: ParsedTask[] = [];
    
    // Split transcript into lines and process each line as a potential task
    const lines = transcript.split('\n').filter(line => line.trim().length > 0);
    
    // Common names that might appear in the transcript
    const knownNames = ['Aman', 'Rajeev', 'Shreya', 'John', 'Jane', 'Alex', 'Sarah', 'Mike'];
    
    for (const line of lines) {
      // Skip lines that are too short or don't look like task assignments
      if (line.length < 5) continue;
      
      try {
        // Check for common patterns in meeting task assignments
        let taskLine = line.trim();
        let assignee: string | null = null;
        
        // Extract assignee from the beginning of the line (e.g., "Aman you take...")
        for (const name of knownNames) {
          if (taskLine.startsWith(name)) {
            const pattern = new RegExp(`^${name}\\s+(you|please|can you|will|should|needs to)`, 'i');
            const match = taskLine.match(pattern);
            if (match) {
              assignee = name;
              // Remove the assignee and the connecting word from the task description
              taskLine = taskLine.substring(match[0].length).trim();
              break;
            }
          }
        }
        
        // If no name was found at the beginning, look for names in the line
        if (!assignee) {
          for (const name of knownNames) {
            if (taskLine.includes(` ${name} `) || taskLine.includes(` ${name},`)) {
              assignee = name;
              // Don't remove the name from the task as it might be part of the context
              break;
            }
          }
        }
        
        // Use the existing TaskParserService to parse the task
        const parsedTask = TaskParserService.parseTask(taskLine);
        
        // If we found an assignee but the parser didn't, use our extracted assignee
        if (assignee && (!parsedTask.assignee || parsedTask.assignee === '.')) {
          parsedTask.assignee = assignee;
        }
        
        // Clean up the task name
        if (parsedTask.name.startsWith('you ') || 
            parsedTask.name.startsWith('please ') || 
            parsedTask.name.startsWith('can you ')) {
          parsedTask.name = parsedTask.name.replace(/^(you|please|can you)\s+/, '');
        }
        
        // Remove trailing periods
        parsedTask.name = parsedTask.name.replace(/\.\s*$/, '');
        
        // Add the task to our list
        tasks.push(parsedTask);
      } catch (error) {
        console.error('Error parsing line as task:', line, error);
        // Continue with the next line even if this one fails
      }
    }
    
    return tasks;
  }

  /**
   * Converts the AI extracted tasks to the application's ParsedTask format
   */
  private convertToTaskFormat(extractedTasks: ExtractedTask[]): ParsedTask[] {
    return extractedTasks.map(task => {
      // Create a task string in the format that TaskParserService can parse
      const taskString = `${task.taskDescription} ${task.assignee} by ${task.deadline} ${task.priority}`;
      
      // Use the existing TaskParserService to parse the task string
      const parsedTask = TaskParserService.parseTask(taskString);
      
      // Ensure the assignee is set correctly
      if (!parsedTask.assignee && task.assignee) {
        parsedTask.assignee = task.assignee;
      }
      
      // Ensure priority is set correctly
      if (task.priority && ['P1', 'P2', 'P3', 'P4'].includes(task.priority)) {
        parsedTask.priority = task.priority as 'P1' | 'P2' | 'P3' | 'P4';
      }
      
      return parsedTask;
    });
  }
}

export default new TranscriptParserService();
