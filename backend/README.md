# Natural Language Task Manager - Backend

This is the backend API for the Natural Language Task Manager, an enterprise-grade to-do list application that parses natural language task inputs and extracts tasks from meeting transcripts.

## Features

- Parse natural language task inputs like "Finish landing page Aman by 11pm 20th June"
- Extract task name, assignee, due date/time, priority, and description
- Support for both AI-parsed and manually created tasks
- RESTful API for comprehensive task management
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
| POST | /api/tasks | Create a new task (supports both natural language and manual input) |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get a specific task by ID |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |
| POST | /api/tasks/parse | Parse a task string without saving it |

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (optional - the app will use an in-memory store if MongoDB is unavailable)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   ```

2. Navigate to the backend directory
   ```bash
   cd task-manager/backend
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the backend directory
   ```bash
   touch .env
   ```

5. Add the following environment variables to the `.env` file
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/task-manager
   NODE_ENV=development
   ```

6. Start the development server
   ```bash
   npm run dev
   ```
   
7. For production deployment
   ```bash
   npm run build
   npm start
   ```

## API Usage Examples

### Create a Task using Natural Language (AI Mode)

```bash
curl -X POST http://localhost:5001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"taskString": "Finish landing page Aman by 11pm 20th June", "isAI": true}'
```

### Create a Task Manually

```bash
curl -X POST http://localhost:5001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Finish landing page",
    "assignee": "Aman",
    "dueDate": "2025-06-20T23:00:00.000Z",
    "priority": "P3",
    "description": "Complete the new website landing page with all required sections",
    "isAI": false
  }'
```

### Parse a Task (without saving)

```bash
curl -X POST http://localhost:5001/api/tasks/parse \
  -H "Content-Type: application/json" \
  -d '{"taskString": "Call client Rajeev tomorrow 5pm"}'
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

Run the tests to verify that all components are working correctly:

```bash
npm test
```

You can also run specific test files:

```bash
# Test API endpoints
npx jest src/tests/api.test.ts

# Test task parser functionality
npx jest src/tests/taskParser.test.ts
```

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   │   └── db.ts     # Database connection setup
│   ├── controllers/  # Request handlers
│   │   └── TaskController.ts # Task-related request handlers
│   ├── middleware/   # Express middleware
│   │   └── errorHandler.ts  # Error handling middleware
│   ├── models/       # Mongoose models
│   │   └── Task.ts   # Task schema and model
│   ├── routes/       # API routes
│   │   └── taskRoutes.ts # Task-related routes
│   ├── services/     # Business logic
│   │   └── TaskParserService.ts # Natural language parsing
│   ├── utils/        # Utility functions
│   │   └── dateUtils.ts # Date handling utilities
│   └── index.ts      # Entry point
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```
