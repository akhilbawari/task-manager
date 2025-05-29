import express from 'express';
import TaskController from '../controllers/TaskController';
import { validateTaskCreation, validateTaskUpdate, validateTranscript } from '../middleware/validation';

const router = express.Router();

import meetingMinutesService from '../services/MeetingMinutesService';

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
    const extractedTasks = await meetingMinutesService.analyzeMeetingMinutes(minutes);
    
    // const TaskParserService = require('../services/TaskParserService').default;
    // const parsedTask = TaskParserService.parseTask(taskString);
    
    res.status(200).json({
      success: true,
      data: extractedTasks
    });
  } catch (error) {
    console.error('Error parsing task:', error);
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
    console.error('Error parsing transcript:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Parse meeting minutes without saving (for frontend preview)
router.post('/minutes/parse', validateTranscript, async (req, res) => {
  try {
    const { minutes } = req.body;
    const extractedTasks = await meetingMinutesService.analyzeMeetingMinutes(minutes);

    res.status(200).json({
      success: true,
      count: extractedTasks.length,
      data: extractedTasks
    });
  } catch (error) {
    console.error('Error parsing meeting minutes:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

export default router;
