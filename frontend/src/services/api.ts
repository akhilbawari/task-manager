import axios from 'axios';
import { ApiResponse, ParsedTask, Task, TasksResponse, TranscriptResponse } from '../types/Task';

const API_URL = process.env.REACT_APP_API_URL + '/tasks';

const api = {
  // Parse a task string without saving
  parseTask: async (taskString: string): Promise<ApiResponse<ParsedTask>> => {
    try {
      const response = await axios.post<ApiResponse<ParsedTask>>(`${API_URL}/parse`, { taskString });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to parse task');
    }
  },

  // Create a new task
  createTask: async (taskString: string): Promise<ApiResponse<Task>> => {
    try {
      const response = await axios.post<ApiResponse<Task>>(API_URL, { taskString });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  },

  // Get all tasks
  getTasks: async (): Promise<TasksResponse> => {
    try {
      const response = await axios.get<TasksResponse>(API_URL);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  },

  // Get a single task
  getTask: async (id: string): Promise<ApiResponse<Task>> => {
    try {
      const response = await axios.get<ApiResponse<Task>>(`${API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch task');
    }
  },

  // Update a task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
    try {
      const response = await axios.put<ApiResponse<Task>>(`${API_URL}/${id}`, taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update task');
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<ApiResponse<{}>> => {
    try {
      const response = await axios.delete<ApiResponse<{}>>(`${API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete task');
    }
  },
  
  // Parse a meeting transcript without saving tasks
  parseTranscript: async (transcript: string): Promise<TranscriptResponse> => {
    try {
      const response = await axios.post<TranscriptResponse>(`${API_URL}/transcript/parse`, { transcript });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to parse transcript');
    }
  },
  
  // Process a meeting transcript and create tasks
  processTranscript: async (transcript: string): Promise<TranscriptResponse> => {
    try {
      const response = await axios.post<TranscriptResponse>(`${API_URL}/transcript`, { transcript });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to process transcript');
    }
  },
  
  // Delete multiple tasks
  deleteMultipleTasks: async (ids: string[]): Promise<ApiResponse<{}>> => {
    try {
      const response = await axios.delete<ApiResponse<{}>>(`${API_URL}/multiple`, {
        data: { ids }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete tasks');
    }
  },
  // Parse meeting minutes without saving tasks
  parseMeetingMinutes: async (minutes: string): Promise<TranscriptResponse> => {
    try {
      const response = await axios.post<TranscriptResponse>(`${API_URL}/minutes/parse`, { minutes });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to parse meeting minutes');
    }
  },
  
  // Process meeting minutes and create tasks
  processMeetingMinutes: async (minutes: string): Promise<TranscriptResponse> => {
    try {
      const response = await axios.post<TranscriptResponse>(`${API_URL}/minutes`, { minutes });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to process meeting minutes');
    }
  },
  
  // Parse multiple tasks from a single prompt without saving
  parseMultipleTasks: async (prompt: string): Promise<TranscriptResponse> => {
    try {
      const response = await axios.post<TranscriptResponse>(`${API_URL}/multiple/parse`, { prompt });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to parse multiple tasks');
    }
  },
  
  // Process multiple tasks from a single prompt and create them
  processMultipleTasks: async (prompt: string): Promise<TranscriptResponse> => {
    try {
      const response = await axios.post<TranscriptResponse>(`${API_URL}/multiple`, { prompt });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to process multiple tasks');
    }
  }
};

export default api;
