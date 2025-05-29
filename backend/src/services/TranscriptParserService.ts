import TaskParserService, { ParsedTask } from './TaskParserService';

interface ExtractedTask {
  taskDescription: string;
  assignee: string;
  deadline: string;
  priority: string;
}

class TranscriptParserService {
  constructor() {
    // No initialization needed for manual algorithm
  }

  /**
   * Extracts tasks from a meeting transcript using a manual rule-based algorithm
   * @param transcript The meeting transcript to parse
   * @returns Array of parsed tasks
   */
  public async extractTasksFromTranscript(transcript: string): Promise<ParsedTask[]> {
    // Using only the rule-based extraction method
    return this.extractTasksWithRules(transcript);
  }
  
  /**
   * Extract tasks using rule-based approach
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
        
        // Set isAI to false for manually extracted tasks
        parsedTask.isAI = false;
        
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
        // Error parsing line as task
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
      
      // Set isAI to false for manually extracted tasks
      parsedTask.isAI = false;
      
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
