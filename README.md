# Natural Language Task Manager

A modern, enterprise-grade to-do list application that offers dual task creation modes - natural language parsing and manual form entry - to provide flexibility and intelligence in task management.

## Project Overview

This project consists of two main parts:
1. **Backend**: A Node.js API with natural language parsing capabilities
2. **Frontend**: A React application with a beautiful UI for task management

## Features

### Dual Task Creation Modes
- **Natural Language (AI) Mode**:
  - Parse natural language task inputs to extract:
    - Task name
    - Assignee
    - Due date/time
    - Priority (default P3 unless specified as P1, P2, or P4)
    - Description (extracted from context)
  - Intelligent parsing with AI assistance
  - Visual indicator for AI-created tasks

- **Manual Mode**:
  - Form-based interface for direct task entry
  - Full control over all task fields
  - Perfect for structured task creation

### Task Management
- Beautiful UI task board/list with expandable task cards
- Comprehensive task management (create, view, edit, delete)
- Detailed task descriptions with rich formatting
- Visual distinction between AI-created and manually created tasks
- Flexible data storage with MongoDB or in-memory store
- Automatic fallback to in-memory storage if MongoDB is unavailable

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (optional)
- **Natural Language Processing**: chrono-node for date parsing and custom parsing logic

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (optional - the app will use an in-memory store if MongoDB is unavailable)

### Running the Application

1. **Start the Backend**
   ```
   ./start-backend.sh
   ```
   This will start the backend server on port 5001.

2. **Start the Frontend**
   ```
   ./start-frontend.sh
   ```
   This will start the React development server and open the application in your browser.

## Project Structure

```
task-manager/
├── backend/           # Node.js API with Express
│   ├── src/
│   │   ├── config/    # Configuration files
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/  # Includes natural language parsing
│   │   └── utils/     # Utility functions
│   └── README.md      # Backend-specific documentation
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── README.md      # Frontend-specific documentation
├── start-backend.sh   # Script to start the backend
└── start-frontend.sh  # Script to start the frontend
```

## Usage Examples

### Adding a Task

#### Natural Language (AI) Mode
Enter a task in natural language format in the input field, for example:
- "Finish landing page Aman by 11pm 20th June"
- "Call client Rajeev tomorrow 5pm to discuss new requirements"
- "Submit report P1 by Friday with quarterly results"

The application will automatically extract:
- Task name (e.g., "Finish landing page")
- Assignee (e.g., "Aman")
- Due date & time (e.g., "11pm 20th June")
- Priority (default P3 unless specified as P1, P2, or P4)
- Description (e.g., "with quarterly results")

#### Manual Mode
Alternatively, use the manual form to directly input:
- Task name
- Assignee
- Due date & time
- Priority
- Detailed description

This mode gives you complete control over all task fields and is perfect for structured task creation.

## Documentation

For more detailed information, see the README files in the backend and frontend directories:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
