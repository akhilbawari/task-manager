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

dotenv.config();

class MeetingMinutesService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in environment variables');
      // We'll handle this gracefully in the methods
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    }
  }

  /**
   * Analyzes meeting minutes and extracts meaningful tasks with proper assignments
   * @param minutes The meeting minutes text
   * @returns Array of parsed tasks
   */
  public async analyzeMeetingMinutes(minutes: string): Promise<ParsedTask[]> {
    try {
      // Try using the Google Generative AI SDK first
      if (this.model) {
        try {
          const prompt = this.createPromptForMeetingAnalysis(minutes);
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          
          // Extract JSON from the response
          const jsonMatch = text.match(/\[\s\S]*\]/);
          if (jsonMatch) {
            const extractedTasks = JSON.parse(jsonMatch[0]);
            
            // Convert to ParsedTask format
            return extractedTasks.map((task: any) => ({
              name: task.name || task.title, // Handle both formats
              assignee: task.assignee || null,
              dueDate: task.dueDate ? new Date(task.dueDate) : (task.deadline ? new Date(task.deadline) : null),
              priority: task.priority || 'P3',
              description: task.description || '',
              isAI: true, // Explicitly set isAI flag
              completed: task.completed === undefined ? false : task.completed
            }));
          }
        } catch (sdkError) {
          console.error('Error using Google Generative AI SDK:', sdkError);
          // Fall through to the direct API call approach
        }
      }
      
      // If SDK approach failed or model isn't available, try direct API call
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }
      
      const prompt = this.createPromptForMeetingAnalysis(minutes);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
      
      const response = await axios.post(url, {
        contents: [{
          parts: [{
            text: minutes
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      });
      console.log(apiKey,response.data);
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0] && 
          response.data.candidates[0].content.parts[0].text) {
        
        const text = response.data.candidates[0].content.parts[0].text;
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('Failed to extract JSON from AI response');
        }

        const extractedTasks = JSON.parse(jsonMatch[0]);
        
        // Convert to ParsedTask format
        return extractedTasks.map((task: any) => ({
          name: task.name || task.title, // Handle both formats
          assignee: task.assignee || null,
          dueDate: task.dueDate ? new Date(task.dueDate) : (task.deadline ? new Date(task.deadline) : null),
          priority: task.priority || 'P3',
          description: task.description || '',
          isAI: true, // Explicitly set isAI flag
          completed: task.completed === undefined ? false : task.completed
        }));
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error analyzing meeting minutes:', error);
      return this.fallbackAnalysis(minutes);
    }
  }

  /**
   * Creates a prompt for the AI to analyze meeting minutes
   */
  private createPromptForMeetingAnalysis(minutes: string): string {
    return `
      You are an AI system administrator whose task is to analyze meeting minutes and create multiple meaningful tasks with small descriptions (max 250 characters) and short titles assigned to people mentioned in the input.
      
      Guidelines:
      1. Act as a professional system administrator who is organizing tasks for a team
      2. Create clear, concise, and specific task titles (maximum 5-7 words)
      3. Add detailed but concise descriptions (max 250 characters) that provide context and specific actions needed
      4. Only assign tasks to people explicitly mentioned in the input
      5. Assign appropriate priorities (P1 for critical/urgent, P2 for important, P3 for normal, P4 for low)
      6. Extract or estimate deadlines based on the context in ISO format (YYYY-MM-DDThh:mm:ssZ)
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
