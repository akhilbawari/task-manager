/**
 * MeetingMinutesService
 * 
 * This service provides AI-powered analysis of meeting minutes
 * to extract meaningful tasks and assign them to appropriate team members
 * Uses Gemini API to act as a system administrator for task creation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ParsedTask } from './TaskParserService';
import dotenv from 'dotenv';
import axios from 'axios';
import GeminiService from './GeminiService';

dotenv.config();

class MeetingMinutesService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // GEMINI_API_KEY is not defined in environment variables
      // We'll handle this gracefully in the methods
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    }
  }

  /**
   * Analyzes meeting minutes and extracts meaningful tasks with proper assignments
   * @param minutes The meeting minutes text
   * @returns Array of parsed tasks
   * @throws Error if AI generation fails and fallback also fails
   */
  public async analyzeMeetingMinutes(minutes: string): Promise<ParsedTask[]> {
    let aiGenerationAttempted = false;
    let aiGenerationError: Error | null = null;
    
    try {
      // Try using the Google Generative AI SDK first
      if (this.model) {
        try {
          aiGenerationAttempted = true;
          const prompt = this.createPromptForMeetingAnalysis(minutes);
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          console.log('Full text to parse:', text);
          // Parse and return the full text response
          return this.parseTextResponse(text);
        } catch (parseError) {
          // Error parsing JSON from SDK response
          aiGenerationError = new Error('Failed to parse AI response');
        }
      }
      
      // If SDK approach failed or model isn't available, try using GeminiService
      try {
        aiGenerationAttempted = true;
        const prompt = this.createPromptForMeetingAnalysis(minutes);
        const response = await GeminiService.generateContent(prompt);
        
        if (response) {
          // Extract JSON from the response
          const jsonMatch = response.match(/\[\s\S]*\]/);
          if (jsonMatch) {
            try {
              const extractedTasks = JSON.parse(jsonMatch[0]);
              
              // Validate that we have at least one task
              if (extractedTasks && Array.isArray(extractedTasks) && extractedTasks.length > 0) {
                // Convert to ParsedTask format
                return extractedTasks.map((task: any) => ({
                  name: task.name || task.title || 'Untitled Task', // Handle both formats and provide default
                  assignee: task.assignee || null,
                  dueDate: task.dueDate ? new Date(task.dueDate) : (task.deadline ? new Date(task.deadline) : null),
                  priority: task.priority || 'P3',
                  description: task.description || '',
                  isAI: true, // Explicitly set isAI flag
                  completed: task.completed === undefined ? false : task.completed
                }));
              }
            } catch (parseError) {
              // Error parsing JSON from GeminiService response
              aiGenerationError = new Error('Failed to parse AI response');
            }
          }
        }
        
        aiGenerationError = new Error('Failed to extract tasks from Gemini response');
      } catch (geminiServiceError) {
        // Error using GeminiService
        aiGenerationError = geminiServiceError instanceof Error ? geminiServiceError : new Error('GeminiService error');
        // Fall through to fallback analysis
      }
      
      // If all AI methods fail, return fallback analysis
      const fallbackResults = this.fallbackAnalysis(minutes);
      
      // If fallback found some tasks, return them
      if (fallbackResults && fallbackResults.length > 0) {
        return fallbackResults;
      }
      
      // If we attempted AI generation but it failed, and fallback found no tasks, throw a specific error
      if (aiGenerationAttempted && aiGenerationError) {
        throw new Error(`AI task generation failed. Please try again later. Details: ${aiGenerationError.message}`);
      }
      
      // If no tasks were found at all
      throw new Error('No tasks could be extracted from the meeting minutes');
    } catch (error) {
      // Error analyzing meeting minutes
      
      // If it's already our custom error, rethrow it
      if (error instanceof Error && error.message.includes('AI task generation failed')) {
        throw error;
      }
      
      // Try fallback one more time
      const fallbackResults = this.fallbackAnalysis(minutes);
      if (fallbackResults && fallbackResults.length > 0) {
        return fallbackResults;
      }
      
      // If all else fails, throw a user-friendly error
      throw new Error('Unable to process meeting minutes. AI service may be temporarily unavailable. Please try again later.');
    }
  }

  /**
   * Creates a prompt for the AI to analyze meeting minutes
   */
  private createPromptForMeetingAnalysis(minutes: string): string {
    // Get current date in ISO format
    const currentDate = new Date().toISOString();
    
    return `
      You are an AI system administrator whose task is to analyze meeting minutes and create multiple meaningful tasks with small descriptions (max 250 characters) and short titles assigned to people mentioned in the input.
      
      Guidelines:
      1. Act as a professional system administrator who is organizing tasks for a team
      2. Create clear, concise, and specific task titles (maximum 5-7 words)
      3. Add detailed but concise descriptions (max 250 characters) that provide context and specific actions needed
      4. Only assign tasks to people explicitly mentioned in the input
      5. Assign appropriate priorities (P1 for critical/urgent, P2 for important, P3 for normal, P4 for low)
      6. Today's date is ${currentDate}. Extract or estimate deadlines based on the context in ISO format (YYYY-MM-DDThh:mm:ssZ) relative to today's date
      7. Make sure each task is actionable and meaningful
      8. Break down complex responsibilities into multiple smaller tasks
      9. For each task, you MUST set isAI to true as these are AI-generated tasks
      
      Meeting Minutes:
      """
      ${minutes}
      """
      
      Format your response as a JSON array of task objects with these properties:
      [
        {
          "name": "Clear, specific task title (5-7 words max)",
          "description": "Detailed but concise description with specific actions needed (max 250 characters)",
          "assignee": "Person's name",
          "priority": "P1|P2|P3|P4",
          "dueDate": "YYYY-MM-DDThh:mm:ssZ" or null if not specified,
          "completed": false,
          "isAI": true
        }
      ]
      
      Only include tasks that are clearly actionable and assigned to specific people. Quality is more important than quantity.
      Your response should be ONLY the JSON array, nothing else before or after.
    `;
  }

  /**
   * Parse the text response from the Gemini API
   * @param text The text response from the Gemini API
   * @returns Array of parsed tasks
   */
  private parseTextResponse(text: string): ParsedTask[] {
    try {
      // Try to extract JSON from the response
      
      // First try to find a JSON array with a more precise regex
      let jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
      
      // If that fails, try a more lenient approach
      if (!jsonMatch) {
        jsonMatch = text.match(/\[[\s\S]*?\]/);
      }
      
      if (jsonMatch) {
        const extractedTasks = JSON.parse(jsonMatch[0]);
        
        // Validate that we have at least one task
        if (extractedTasks && Array.isArray(extractedTasks) && extractedTasks.length > 0) {
          // Convert to ParsedTask format
          return extractedTasks.map((task: any) => ({
            name: task.name || task.title || 'Untitled Task', // Handle both formats and provide default
            assignee: task.assignee || null,
            dueDate: task.dueDate ? new Date(task.dueDate) : (task.deadline ? new Date(task.deadline) : null),
            priority: task.priority || 'P3',
            description: task.description || '',
            isAI: true, // Explicitly set isAI flag
            completed: task.completed === undefined ? false : task.completed
          }));
        }
      }
      
      // If we couldn't extract valid tasks, return an empty array
      return [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Fallback method when AI analysis fails
   */
  private fallbackAnalysis(minutes: string): ParsedTask[] {
    const tasks: ParsedTask[] = [];
    const lines = minutes.split('\n');
    
    // Simple rule-based extraction for common task patterns
    const taskPatterns = [
      // Pattern: "Name will/should/needs to do something"
      /([A-Z][a-z]+)\s+(will|should|needs to|has to|must|is going to)\s+([^.]+)/i,
      // Pattern: "Name to do something"
      /([A-Z][a-z]+)\s+to\s+([^.]+)/i,
      // Pattern: "Assigned to Name: task"
      /Assigned to\s+([A-Z][a-z]+):\s+([^.]+)/i,
      // Pattern: "Action item: task - Name"
      /Action item:\s+([^-]+)-\s*([A-Z][a-z]+)/i
    ];
    
    for (const line of lines) {
      for (const pattern of taskPatterns) {
        const match = line.match(pattern);
        if (match) {
          let name, assignee;
          
          if (pattern.toString().includes('Action item')) {
            name = match[1].trim();
            assignee = match[2].trim();
          } else if (pattern.toString().includes('Assigned to')) {
            assignee = match[1].trim();
            name = match[2].trim();
          } else {
            assignee = match[1].trim();
            name = match[3] ? match[3].trim() : match[2].trim();
          }
          
          tasks.push({
            name,
            assignee,
            dueDate: null,
            priority: 'P3',
            description: `Extracted from meeting minutes: "${line.trim()}"`,
            isAI: true,
            completed: false
          });
          
          break; // Found a match, no need to check other patterns
        }
      }
    }
    
    return tasks;
  }
}

export default new MeetingMinutesService();
