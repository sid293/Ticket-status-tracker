# Ticket Status Tracker

A full-stack ticket management system with automated status progression and email notifications. The application provides a 5-stage ticket workflow: Open → In Progress → Review → Testing → Done.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Ticket Management**: Create, read, update, and delete tickets
- **Automated Status Progression**: Cron jobs automatically advance ticket statuses based on configurable time intervals
- **Status History Tracking**: Complete audit trail of status changes
- **Email Notifications**: Automated emails sent when tickets reach completion
- **API-First Design**: RESTful API with comprehensive documentation

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled task automation
- **nodemailer** - Email service

### Frontend
- **React** 19.1.1 - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sid293/Ticket-status-tracker.git 
   cd Ticket-status-tracker
   ```

2. **Set up the backend**
   ```bash
   cd Ticket-status-tracker-backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration (see Environment Variables section below)
   ```

4. **Set up the frontend**
   ```bash
   cd ../Ticket-status-tracker-fe
   npm install
   ```

### Database Setup


Ensure MongoDB is running locally on `mongodb://localhost:27017/ticket-tracker` or update the `MONGODB_URI` in your `.env` file for a different database connection.

### Running the Application

1. **Start the backend server**
   ```bash
   cd Ticket-status-tracker-backend
   npm start          # Production mode
   npm run dev        # Development mode (with nodemon)
   ```
   Server will start on `http://localhost:3000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd Ticket-status-tracker-fe
   npm run dev        # Development server with hot reload
   ```
   Frontend will start on `http://localhost:5173`

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Environment Variables

Create a `.env` file in the `Ticket-status-tracker-backend` directory based on `env.example`:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ticket-tracker

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_chars
JWT_EXPIRE=7d

# Status Progression Timing (in minutes)
OPEN_TO_INPROGRESS_MINUTES=2
INPROGRESS_TO_REVIEW_MINUTES=4
REVIEW_TO_TESTING_MINUTES=3
TESTING_TO_DONE_MINUTES=2

# Email Configuration (Nodemailer)
# For Gmail: Use your Gmail address and App Password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=your_email@gmail.com

```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Authenticate and receive JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/logout
Client-side logout (token invalidation handled on client).

### Ticket Endpoints

All ticket endpoints require authentication (`Authorization: Bearer <token>`).

#### GET /api/tickets?page=1&limit=10
Get paginated list of user's tickets.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

#### POST /api/tickets
Create a new ticket.
```json
{
  "title": "Fix login bug",
  "description": "Users unable to login with special characters"
}
```

#### GET /api/tickets/:id
Get a specific ticket by ID.

#### PUT /api/tickets/:id
Update ticket details.
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

#### PATCH /api/tickets/:id/status
Update ticket status.
```json
{
  "status": "In Progress"
}
```
**Valid Status Values:** `Open`, `In Progress`, `Review`, `Testing`, `Done`

#### GET /api/tickets/:id/history
Get status history for a ticket.

#### POST /api/tickets/bulk-status
Update status for multiple tickets.
```json
{
  "ticketIds": ["id1", "id2"],
  "status": "Done"
}
```

#### DELETE /api/tickets/:id
Delete a ticket.

### Health Check Endpoints

#### GET /health
Simple health check endpoint.

#### GET /api
API information endpoint.

## Database Schema

### Users Collection
```javascript
{
  name: String (required, trimmed, min: 2 chars),
  email: String (required, unique, lowercase, trimmed, valid email),
  userId: String (auto-generated, unique, incremental),
  password: String (required, hashed with bcryptjs, min: 6 chars),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Tickets Collection
```javascript
{
  title: String (required),
  description: String (required),
  status: String (enum: ["Open", "In Progress", "Review", "Testing", "Done"], default: "Open"),
  statusHistory: [{
    status: String,
    timestamp: Date (default: Date.now)
  }],
  owner: String (required, references user.userId),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Email Templates

The system sends automated email notifications when tickets reach the "Done" status.

### Ticket Completion Email Template

**Subject:** `Ticket Completed: [Ticket Title]`

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ticket Status Tracker</h1>
            <h2>Ticket Completed Successfully</h2>
        </div>
        <div class="content">
            <p>Dear [Owner Name],</p>

            <p>Your ticket has been completed successfully!</p>

            <h3>Ticket Details:</h3>
            <ul>
                <li><strong>Title:</strong> [Ticket Title]</li>
                <li><strong>Description:</strong> [Ticket Description]</li>
                <li><strong>Status:</strong> Done</li>
                <li><strong>Completed At:</strong> [Completion Date/Time]</li>
            </ul>

            <p>Thank you for using our ticket tracking system. If you need further assistance or have additional tasks, please feel free to create new tickets.</p>
        </div>
        <div class="footer">
            <p>This is an automated message from the Ticket Status Tracker system.</p>
        </div>
    </div>
</body>
</html>
```

### Email Configuration in Code

The email service is configurable and will skip sending if SMTP credentials are not provided. Emails are sent asynchronously and failures are logged without affecting ticket operations.

## Automated Status Progression

The system includes cron jobs that automatically progress ticket statuses based on configurable time intervals:

- **Open → In Progress**: After 2 minutes (configurable)
- **In Progress → Review**: After 4 minutes
- **Review → Testing**: After 3 minutes
- **Testing → Done**: After 2 minutes

When tickets reach "Done" status, an automated email notification is sent to the ticket owner.

### Cron Scheduler

The scheduler runs continuously and can be tested using:
```bash
cd Ticket-status-tracker-backend
node src/utils/testCron.js
```

## Development

### Project Structure
```
Ticket-status-tracker/
├── Ticket-status-tracker-backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routing
│   │   ├── middlewares/    # Express middlewares
│   │   ├── jobs/          # Cron job definitions
│   │   ├── utils/         # Utilities
│   │   ├── tests/         # Unit tests
│   │   └── app.js         # Express app setup
│   ├── env.example        # Environment template
│   ├── package.json       # Node dependencies
│   └── README.md
└── Ticket-status-tracker-fe/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── api/           # API calls
    │   ├── utils/         # Utilities
    │   ├── assets/        # Static assets
    │   └── App.jsx        # Main app component
    ├── package.json       # Node dependencies
    └── README.md
```

### API Testing

Import the provided Postman collection (`Ticket-status-tracker-backend/postman-collection.md`) to test all API endpoints. The collection includes:
- Authentication workflows
- Complete CRUD operations for tickets
- Error case testing
- Automated token management
