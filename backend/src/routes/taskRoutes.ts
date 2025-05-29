import express from 'express';
import TaskController from '../controllers/TaskController';
import { validateTaskCreation, validateTaskUpdate, validateTranscript } from '../middleware/validation';

const router = express.Router();

import meetingMinutesService from '../services/MeetingMinutesService';


// const meetingMinutesService = new MeetingMinutesService();

// Task routes
router.post('/', validateTaskCreation, TaskController.createTask);
router.get('/', TaskController.getTasks);
router.get('/:id', TaskController.getTask);
router.put('/:id', validateTaskUpdate, TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

// Meeting transcript processing route
router.post('/transcript', validateTranscript, TaskController.processTranscript);

// Meeting minutes processing route
router.post('/minutes', validateTranscript, TaskController.processMeetingMinutes);

// Delete multiple tasks
router.delete('/multiple', TaskController.deleteMultipleTasks);

// Parse task without saving (for frontend preview)
router.post('/parse', validateTaskCreation, async(req, res) => {
  try {
    const { minutes } = req.body;
    const extractedTasks = await  meetingMinutesService.analyzeMeetingMinutes(minutes);
    
    // const TaskParserService = require('../services/TaskParserService').default;
    // const parsedTask = TaskParserService.parseTask(taskString);
    
    res.status(200).json({
      success: true,
      data: extractedTasks
    });
  } catch (error) {
    // Error parsing task
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Parse transcript without saving (for frontend preview)
router.post('/transcript/parse', validateTranscript, async (req, res) => {
  try {
    const { transcript } = req.body;
    const TranscriptParserService = require('../services/TranscriptParserService').default;
    const extractedTasks = await TranscriptParserService.extractTasksFromTranscript(transcript);
    
    res.status(200).json({
      success: true,
      count: extractedTasks.length,
      data: extractedTasks
    });
  } catch (error) {
    // Error parsing transcript
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Parse meeting minutes without saving (for frontend preview)
router.post('/minutes/parse', async (req, res) => {
  try {
    const { minutes } = req.body;
    
    if (!minutes || minutes.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Meeting minutes text is too short or empty. Please provide more content.'
      });
    }
    
    try {
      const extractedTasks = await meetingMinutesService.analyzeMeetingMinutes(minutes);
            
      if (!extractedTasks || extractedTasks.length === 0) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
          message: 'No tasks could be identified in the meeting minutes. Try providing more detailed minutes.'
        });
      }
      
      return res.status(200).json({
        success: true,
        count: extractedTasks.length,
        data: extractedTasks
      });
    } catch (aiError) {
      // Check if it's our custom AI error
      if (aiError instanceof Error && 
          (aiError.message.includes('AI task generation failed') || 
           aiError.message.includes('Unable to process meeting minutes'))) {
        return res.status(503).json({
          success: false,
          error: aiError.message,
          retryAfter: 60, // Suggest retry after 60 seconds
          aiOnly: true // Flag to indicate this is an AI-specific error
        });
      }
      
      // Re-throw for general error handling
      throw aiError;
    }
  } catch (error) {
    // Error parsing meeting minutes
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server Error',
      message: 'There was a problem processing your meeting minutes. Please try again later.'
    });
  }
});

export default router;
