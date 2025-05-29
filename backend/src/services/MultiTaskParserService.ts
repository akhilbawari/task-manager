import TaskParserService, { ParsedTask } from './TaskParserService';

class MultiTaskParserService {
  /**
   * Parses multiple tasks from a single string
   * @param taskString String containing multiple tasks
   * @returns Array of parsed tasks
   */
  public parseMultipleTasks(taskString: string): ParsedTask[] {
    const taskStrings = this.splitByDelimiters(taskString);
    return taskStrings.map((task: string) => {
      const parsedTask = TaskParserService.parseTask(task);
      return {
        ...parsedTask,
        isAI: true,
        description: ''
      };
    });
  }

  /**
   * Splits a string into multiple task strings based on common delimiters
   */
  private splitByDelimiters(input: string): string[] {
    // Common delimiters for tasks
    const delimiters = [
      ';', // Semicolon
      '\n', // New line
      '\\. ', // Period followed by space
      '\\d+\\) ', // Numbered list (e.g., "1) ", "2) ")
      '- ', // Dash list
      '• ' // Bullet point list
    ];

    // Create a regex pattern that matches any of the delimiters
    const delimiterPattern = new RegExp(`(${delimiters.join('|')})`, 'g');
    
    // Split the input by delimiters
    let taskStrings = input.split(delimiterPattern).filter(Boolean);
    
    // Clean up the task strings
    taskStrings = taskStrings
      .map(str => str.trim())
      .filter(str => str && !delimiters.some(d => new RegExp(`^${d}$`).test(str)));
    
    // If no delimiters were found, treat the entire input as a single task
    if (taskStrings.length === 0) {
      return [input.trim()];
    }
    
    // Handle special case for period delimiter
    // If we have strings that look like they were split by periods but don't make sense as tasks,
    // we might need to rejoin them
    const result: string[] = [];
    let currentTask = '';
    
    for (const str of taskStrings) {
      // If the string starts with a lowercase letter, it's probably a continuation
      if (/^[a-z]/.test(str) && currentTask) {
        currentTask += '. ' + str;
      } else {
        if (currentTask) {
          result.push(currentTask);
        }
        currentTask = str;
      }
    }
    
    if (currentTask) {
      result.push(currentTask);
    }
    
    return result.length > 0 ? result : [input.trim()];
  }

  /**
   * Detects if input likely contains multiple tasks
   */
  public containsMultipleTasks(input: string): boolean {
    // Check for common task separators
    const separators = [';', '\n', '1)', '2)', '- ', '• '];
    return separators.some(sep => input.includes(sep));
  }
}

export default new MultiTaskParserService();
