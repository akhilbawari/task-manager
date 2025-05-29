import { Request, Response, NextFunction } from 'express';

/**
 * Validates that the request body contains the required taskString field
 */
export const validateTaskCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { taskString } = req.body;

  if (!taskString || typeof taskString !== 'string' || taskString.trim() === '') {
    res.status(400).json({
      success: false,
      error: 'Please provide a valid task string'
    });
    return;
  }

  next();
};

/**
 * Validates that the request body contains the required transcript field
 */
export const validateTranscript = (req: Request, res: Response, next: NextFunction): void => {
  const { transcript, minutes } = req.body;
  const content = transcript || minutes;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    res.status(400).json({
      success: false,
      error: 'Please provide a valid meeting transcript or minutes'
    });
    return;
  }

  next();
};

/**
 * Validates task update data
 */
export const validateTaskUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { name, assignee, dueDate, priority, completed } = req.body;
  
  // Check if at least one field is provided
  if (!name && !assignee && dueDate === undefined && priority === undefined && completed === undefined) {
    res.status(400).json({
      success: false,
      error: 'Please provide at least one field to update'
    });
    return;
  }

  // Validate priority if provided
  if (priority !== undefined && !['P1', 'P2', 'P3', 'P4'].includes(priority)) {
    res.status(400).json({
      success: false,
      error: 'Priority must be one of: P1, P2, P3, P4'
    });
    return;
  }

  // Validate completed if provided
  if (completed !== undefined && typeof completed !== 'boolean') {
    res.status(400).json({
      success: false,
      error: 'Completed must be a boolean value'
    });
    return;
  }

  next();
};
