# Ticket Status Tracker - Frontend

A modern React frontend for the Ticket Status Tracker application, built with Vite and Tailwind CSS.

## Features

- **Authentication**: Simple login/register flow with JWT token management
- **Kanban Dashboard**: 5-column board showing tickets by status (Open, In Progress, Review, Testing, Done)
- **Real-time Updates**: Auto-refresh every 30 seconds to show cron-updated statuses
- **Ticket Management**: Create new tickets with title and description
- **Responsive Design**: Clean, modern UI built with Tailwind CSS
- **Status-based Styling**: Color-coded columns and cards for different ticket statuses

## Tech Stack

- React 18 with Vite
- Tailwind CSS for styling
- Axios for API calls
- Local Storage for token persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Login/Register**: Create an account or login with existing credentials
2. **Dashboard**: View all tickets organized by status in a Kanban board
3. **Create Tickets**: Click "New Ticket" to create tickets with title and description
4. **Auto-refresh**: The dashboard automatically updates every 30 seconds to reflect status changes from the backend cron jobs
5. **Logout**: Click the logout button to end your session

## API Integration

The frontend connects to the following backend endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/tickets` - Fetch all tickets
- `POST /api/tickets` - Create new ticket

## Project Structure

```
src/
├── api/
│   └── tickets.js          # API service layer
├── components/
│   ├── TicketCard.jsx      # Individual ticket display
│   ├── TicketColumn.jsx    # Status column container
│   └── CreateTicketForm.jsx # Ticket creation modal
├── pages/
│   ├── Login.jsx           # Authentication page
│   └── Dashboard.jsx       # Main Kanban dashboard
├── utils/
│   └── auth.js             # Token management utilities
├── App.jsx                 # Main application component
└── main.jsx                # Entry point
```

## Status Flow

Tickets automatically progress through these statuses via backend cron jobs:

- **Open** (2 minutes) → **In Progress** (4 minutes) → **Review** (3 minutes) → **Testing** (2 minutes) → **Done**

The frontend reflects these changes automatically through the 30-second refresh cycle.

## Development

- The app uses Tailwind CSS for styling
- All API calls are handled through Axios with automatic token injection
- Authentication state is managed via localStorage
- Error handling includes user-friendly messages and automatic token cleanup