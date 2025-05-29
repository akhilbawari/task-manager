# Natural Language Task Manager - Frontend

This is the frontend application for the Natural Language Task Manager, an enterprise-grade to-do list application that parses natural language task inputs.

## Features

- Beautiful, responsive UI built with React and Tailwind CSS
- Dual task creation modes:
  - Natural Language (AI) mode with intelligent parsing
  - Manual mode with form-based interface
- Task management (create, view, edit, delete)
- Expandable task cards with description sections
- Visual distinction between AI-created and manually created tasks
- Task completion tracking
- Integration with the backend API

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- React Hot Toast for notifications

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Backend API running (see the backend README for setup instructions)

### Installation

1. Clone the repository (if not already done)
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   ```

2. Navigate to the frontend directory
   ```bash
   cd task-manager/frontend
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   npm start
   ```
   This will start the React development server on port 3000 and open the application in your browser.

5. For production build
   ```bash
   npm run build
   ```
   This creates an optimized production build in the `build` folder that can be deployed to a web server.

## Usage

### Adding Tasks

#### Natural Language (AI) Mode
1. Select the "AI Mode" tab in the task creation interface
2. Enter a task in natural language format in the input field
3. Examples:
   - "Finish landing page Aman by 11pm 20th June"
   - "Call client Rajeev tomorrow 5pm"
   - "Submit report P1 by Friday with quarterly results"
4. Click "Preview" to see how the task will be parsed
5. Click "Add Task" to create the task

#### Manual Mode
1. Select the "Manual Mode" tab in the task creation interface
2. Fill in the form fields:
   - Task name
   - Assignee
   - Due date & time
   - Priority (P1, P2, P3, P4)
   - Description
3. Click "Add Task" to create the task

### Managing Tasks

- View all your tasks on the dashboard
- Expand task cards to view detailed descriptions
- Check the checkbox to mark a task as completed
- Click the edit icon to modify task details
- Click the delete icon to remove a task

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── assets/      # Images, icons, etc.
│   ├── components/  # Reusable UI components
│   │   ├── TaskCard.tsx        # Task display component
│   │   ├── TaskCreationForm.tsx # Manual task creation form
│   │   ├── TaskList.tsx        # List of tasks
│   │   └── ... (other components)
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Main application pages
│   │   ├── Dashboard.tsx       # Main dashboard page
│   │   ├── TaskCreation.tsx    # Task creation page with dual modes
│   │   └── ... (other pages)
│   ├── services/    # API integration
│   │   └── api.ts             # API client for backend communication
│   ├── types/       # TypeScript type definitions
│   │   └── Task.ts            # Task interface definition
│   ├── utils/       # Helper functions
│   │   └── dateUtils.ts       # Date formatting utilities
│   ├── App.tsx      # Main application component
│   └── index.tsx    # Application entry point
├── package.json     # Dependencies and scripts
└── tailwind.config.js # Tailwind CSS configuration
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5001/api/tasks`. If you need to change this URL, update the `API_URL` constant in `/src/services/api.ts`.

Key API endpoints used by the frontend:

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task (both AI and manual modes)
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/parse` - Preview task parsing without saving

## Development

### Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm test` - Run the test suite
- `npm run eject` - Eject from Create React App (not recommended)

### Adding New Components

When adding new components:

1. Create the component in the `components/` directory
2. Define TypeScript interfaces for props in the component file or in `types/`
3. Import and use the component where needed

## Troubleshooting

- **Backend connection issues**: Ensure the backend server is running on port 5001
- **API URL configuration**: Check the API_URL in `src/services/api.ts`
- **Build errors**: Check for TypeScript errors with `npm run build`

## Learn More

Visit the About page in the application to learn more about how the natural language parsing works and see examples of supported formats.
