# Cron-Based Automated Status Progression System

## Overview

This system automatically progresses tickets through status stages based on configurable time intervals. Tickets move from "Open" → "In Progress" → "Review" → "Testing" → "Done" automatically.

## Features

- **Automated Status Progression**: Tickets automatically advance through statuses based on time elapsed
- **Configurable Timing**: Set custom time intervals for each status transition via environment variables
- **Email Notifications**: Automatic email notifications when tickets reach "Done" status
- **Comprehensive Logging**: Detailed logs for all status transitions and email sends
- **Error Handling**: Robust error handling that prevents cron job crashes

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# Status Progression Timing (in minutes)
OPEN_TO_INPROGRESS_MINUTES=2
INPROGRESS_TO_REVIEW_MINUTES=4
REVIEW_TO_TESTING_MINUTES=3
TESTING_TO_DONE_MINUTES=2

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=your_email@gmail.com
```

### Email Setup

   - Enable 2-factor authentication
   - Generate an App Password
   - Use your Gmail address and App Password in SMTP_USER and SMTP_PASS

## How It Works

### Status Progression Logic

1. **Cron Job**: Runs every minute (`* * * * *`)
2. **Ticket Query**: Finds all tickets that are not "Done"
3. **Time Check**: Compares current time with `updatedAt` field
4. **Status Update**: Moves ticket to next status if enough time has passed
5. **Email Trigger**: Sends email when ticket reaches "Done" status

### Status Flow

```
Open → In Progress → Review → Testing → Done
  ↓         ↓         ↓         ↓       ↓
  2min     4min      3min      2min    Email
```

### Database Fields Used

- `status`: Current ticket status
- `updatedAt`: Timestamp of last update (used for time calculations)
- `owner`: Email address for notifications
- `mailSent`: Boolean flag to prevent duplicate emails (added dynamically)

## File Structure

```
src/
├── jobs/
│   ├── cronScheduler.js          # Cron job initialization and management
│   └── statusProgressionCron.js  # Main status progression logic
├── services/
│   ├── emailService.js           # Email sending functionality
│   └── ticketStatusService.js    # Ticket status management
└── app.js                        # Main application (cron integration)
```
