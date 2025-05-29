export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export interface Task {
  _id: string;
  name: string;
  assignee: string;
  dueDate: string | null;
  priority: Priority;
  completed: boolean;
  isAI: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedTask {
  name: string;
  assignee: string | null;
  dueDate: string | null;
  priority: Priority;
  isAI: boolean;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface TasksResponse extends ApiResponse<Task[]> {
  count: number;
}

export interface TranscriptResponse extends ApiResponse<ParsedTask[] | Task[]> {
  count: number;
}
