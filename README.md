# Natural Language Task Manager

A modern, enterprise-grade to-do list application that offers dual task creation modes - natural language parsing and manual form entry - to provide flexibility and intelligence in task management.

![Smart Task Manager Screenshot](./assets/Screenshot%202025-05-29%20at%207.38.49%20PM.png)

*Smart Task Manager - AI-powered task management solution that understands natural language and converts meeting minutes into actionable tasks*

## Application Screenshots

<div align="center">
  <img src="./assets/Screenshot 2025-05-29 at 7.38.49 PM.png" alt="Smart Task Manager Home" width="800"/>
  <p><em>Home Page - Smart Task Manager with AI-powered task management</em></p>
  
  <img src="./assets/Screenshot 2025-05-29 at 7.39.16 PM.png" alt="Natural Language Task Manager" width="800"/>
  <p><em>Natural Language Task Manager - Transform casual language into organized tasks</em></p>
  
  <img src="./assets/Screenshot 2025-05-29 at 7.39.30 PM.png" alt="Task Creation Interface" width="800"/>
  <p><em>Task Creation Interface - Dual mode task creation</em></p>
  
  <img src="./assets/Screenshot 2025-05-29 at 7.39.40 PM.png" alt="Task Dashboard" width="800"/>
  <p><em>Task Dashboard - View and manage all your tasks</em></p>
  
  <img src="./assets/Screenshot 2025-05-29 at 7.39.53 PM.png" alt="Task Details View" width="800"/>
  <p><em>Task Details View - Expanded view with task description and metadata</em></p>
  
  <img src="./assets/Screenshot 2025-05-29 at 7.40.04 PM.png" alt="Task Analytics" width="800"/>
  <p><em>Task Analytics - Visual representation of task status and progress</em></p>
  
  <img src="./assets/Screenshot 2025-05-29 at 7.40.16 PM.png" alt="AI Task Creation" width="800"/>
  <p><em>AI Task Creation - Natural language parsing in action</em></p>
  
  <img src="./assets/Screenshot 2025-05-29 at 7.40.30 PM.png" alt="Task Management Interface" width="800"/>
  <p><em>Task Management Interface - Complete task management capabilities</em></p>
</div>

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
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the backend directory with the following variables:
     ```
     PORT=5001
     MONGODB_URI=mongodb://localhost:27017/task-manager
     NODE_ENV=development
     ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   This will start the backend server on port 5001.

2. **Start the Frontend**
   ```bash
   cd frontend
   npm start
   ```
   This will start the React development server on port 3000 and open the application in your browser.

3. **Alternative: Use the provided scripts**
   If available in your project:
   ```bash
   # From the project root
   ./start-backend.sh
   ./start-frontend.sh
   ```

## Project Structure

```
task-manager/
├── backend/           # Node.js API with Express
│   ├── src/
│   │   ├── config/    # Configuration files
│   │   ├── controllers/# Request handlers
│   │   ├── middleware/# Express middleware
│   │   ├── models/    # MongoDB schemas
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic including natural language parsing
│   │   ├── utils/     # Utility functions
│   │   └── index.ts   # Entry point
│   ├── .env           # Environment variables (create this)
│   ├── package.json   # Dependencies and scripts
│   └── README.md      # Backend-specific documentation
├── frontend/          # React application
│   ├── src/
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # Main application pages
│   │   ├── services/  # API integration
│   │   ├── types/     # TypeScript type definitions
│   │   ├── utils/     # Helper functions
│   │   └── App.tsx    # Main application component
│   ├── package.json   # Dependencies and scripts
│   └── README.md      # Frontend-specific documentation
├── start-backend.sh   # Script to start the backend (if available)
└── start-frontend.sh  # Script to start the frontend (if available)
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

## Troubleshooting

- **Backend connection issues**: Ensure MongoDB is running if you're using it, or check that the backend server is running on port 5001
- **Frontend not connecting to backend**: Verify the API URL in `frontend/src/services/api.ts` is correctly pointing to your backend
- **MongoDB connection errors**: Check your MongoDB connection string in the backend `.env` file

## Documentation

For more detailed information, see the README files in the backend and frontend directories:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
