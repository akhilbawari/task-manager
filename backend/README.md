# Natural Language Task Manager - Backend

This is the backend API for the Natural Language Task Manager, an enterprise-grade to-do list application that parses natural language task inputs and extracts tasks from meeting transcripts.

## Features

- Parse natural language task inputs like "Finish landing page Aman by 11pm 20th June"
- Extract task name, assignee, due date/time, and priority
- AI-powered meeting transcript analysis to extract multiple tasks
- RESTful API for task management
- Flexible data storage with MongoDB or in-memory store
- Automatic fallback to in-memory storage if MongoDB is unavailable

## Tech Stack

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Custom natural language parsing
- Google's Gemini AI for meeting transcript analysis

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Create a new task from natural language input |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get a specific task by ID |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| POST | /api/tasks/parse | Parse a task string without saving it |
| POST | /api/tasks/transcript | Process a meeting transcript and save extracted tasks |
| POST | /api/tasks/transcript/parse | Parse a meeting transcript without saving tasks |

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (optional - the app will use an in-memory store if MongoDB is unavailable)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/task-manager
   NODE_ENV=development
   GEMINI_API_KEY=your-gemini-api-key
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## API Usage Examples

### Create a Task

```bash
curl -X POST http://localhost:5001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"taskString": "Finish landing page Aman by 11pm 20th June"}'
```

### Parse a Task (without saving)

```bash
curl -X POST http://localhost:5001/api/tasks/parse \
  -H "Content-Type: application/json" \
  -d '{"taskString": "Call client Rajeev tomorrow 5pm"}'
```

### Process a Meeting Transcript

```bash
curl -X POST http://localhost:5001/api/tasks/transcript \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight."}'
```

### Parse a Meeting Transcript (without saving)

```bash
curl -X POST http://localhost:5001/api/tasks/transcript/parse \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight."}'
```

### Get All Tasks

```bash
curl -X GET http://localhost:5001/api/tasks
```

### Update a Task

```bash
curl -X PUT http://localhost:5001/api/tasks/:id \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated task name", "priority": "P1"}'
```

### Delete a Task

```bash
curl -X DELETE http://localhost:5001/api/tasks/:id
```

## Testing

Run the API test script to verify that all endpoints are working correctly:

```bash
npx ts-node src/tests/api.test.ts
```

Run the task parser test to verify that natural language parsing is working correctly:

```bash
npx ts-node src/tests/taskParser.test.ts
```

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Express middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── tests/        # Test scripts
│   └── index.ts      # Entry point
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```
