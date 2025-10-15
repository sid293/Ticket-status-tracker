# Ticket Status Tracker Backend

A basic Express.js backend API for ticket status tracking application.

## Features

- Basic Express server setup
- CORS enabled for cross-origin requests
- JSON body parsing middleware
- Health check endpoint
- Error handling middleware
- 404 route handler

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
PORT=3000
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## Development

The project uses nodemon for development, which automatically restarts the server when files change.

## License

ISC



