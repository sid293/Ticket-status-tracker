# Postman Collection for Ticket Status Tracker API

## Import Instructions
1. Copy the JSON below
2. Open Postman
3. Click "Import" → "Raw text" → Paste JSON → Import

## Environment Variables to Set
Create a Postman environment with these variables:
- `base_url`: `http://localhost:3000`
- `token`: (will be set automatically after login)

---

## Postman Collection JSON

```json
{
  "info": {
    "name": "Ticket Status Tracker API",
    "description": "Complete API collection for testing auth and ticket endpoints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/register",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "register"]
            },
            "description": "Register a new user account"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('token', response.token);",
                  "    console.log('Token saved:', response.token);",
                  "}"
                ]
              }
            }
          ]
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/login",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "login"]
            },
            "description": "Login with email and password"
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('token', response.token);",
                  "    console.log('Token saved:', response.token);",
                  "}"
                ]
              }
            }
          ]
        },
        {
          "name": "Logout User",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/auth/logout",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "logout"]
            },
            "description": "Logout user (client-side token discard)"
          }
        }
      ]
    },
    {
      "name": "Tickets",
      "item": [
        {
          "name": "Get All Tickets",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/tickets?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["api", "tickets"],
              "query": [
                {
                  "key": "page",
                  "value": "1"
                },
                {
                  "key": "limit",
                  "value": "10"
                }
              ]
            },
            "description": "Get paginated list of user's tickets"
          }
        },
        {
          "name": "Create New Ticket",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Fix login bug\",\n  \"description\": \"Users are unable to login with special characters in password\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/tickets",
              "host": ["{{base_url}}"],
              "path": ["api", "tickets"]
            },
            "description": "Create a new ticket"
          }
        },
        {
          "name": "Get Specific Ticket",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/tickets/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "tickets", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "TICKET_ID_HERE",
                  "description": "Replace with actual ticket ID from create response"
                }
              ]
            },
            "description": "Get a specific ticket by ID"
          }
        },
        {
          "name": "Update Ticket",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Fix login bug - Updated\",\n  \"description\": \"Users are unable to login with special characters in password. Need to implement proper input validation.\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/tickets/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "tickets", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "TICKET_ID_HERE",
                  "description": "Replace with actual ticket ID"
                }
              ]
            },
            "description": "Update ticket details"
          }
        },
        {
          "name": "Update Ticket Status",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"In Progress\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/tickets/:id/status",
              "host": ["{{base_url}}"],
              "path": ["api", "tickets", ":id", "status"],
              "variable": [
                {
                  "key": "id",
                  "value": "TICKET_ID_HERE",
                  "description": "Replace with actual ticket ID"
                }
              ]
            },
            "description": "Update ticket status (Open, In Progress, Review, Testing, Done)"
          }
        },
        {
          "name": "Get Ticket History",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/tickets/:id/history",
              "host": ["{{base_url}}"],
              "path": ["api", "tickets", ":id", "history"],
              "variable": [
                {
                  "key": "id",
                  "value": "TICKET_ID_HERE",
                  "description": "Replace with actual ticket ID"
                }
              ]
            },
            "description": "Get status history for a ticket"
          }
        },
        {
          "name": "Bulk Update Status",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"ticketIds\": [\"TICKET_ID_1\", \"TICKET_ID_2\"],\n  \"status\": \"Done\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/tickets/bulk-status",
              "host": ["{{base_url}}"],
              "path": ["api", "tickets", "bulk-status"]
            },
            "description": "Update status for multiple tickets (user's tickets only)"
          }
        },
        {
          "name": "Delete Ticket",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/tickets/:id",
              "host": ["{{base_url}}"],
              "path": ["api", "tickets", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "TICKET_ID_HERE",
                  "description": "Replace with actual ticket ID"
                }
              ]
            },
            "description": "Delete a ticket"
          }
        }
      ]
    },
    {
      "name": "Health Check",
      "item": [
        {
          "name": "API Health Check",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/health",
              "host": ["{{base_url}}"],
              "path": ["health"]
            },
            "description": "Check if API server is running"
          }
        },
        {
          "name": "API Info",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/api",
              "host": ["{{base_url}}"],
              "path": ["api"]
            },
            "description": "Get API information"
          }
        }
      ]
    }
  ]
}
```

## Testing Workflow

### 1. Setup Environment
1. Import the collection
2. Create environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: (leave empty, will be auto-set)

### 2. Test Authentication Flow
1. **Register User** → Token automatically saved
2. **Login User** → Token automatically saved (or use existing token)

### 3. Test Ticket Operations
1. **Create New Ticket** → Copy the ticket ID from response
2. **Get All Tickets** → Verify your ticket appears
3. **Get Specific Ticket** → Replace `:id` with actual ticket ID
4. **Update Ticket** → Modify title/description
5. **Update Ticket Status** → Change status (try different values)
6. **Get Ticket History** → See status changes
7. **Create another ticket** for bulk operations
8. **Bulk Update Status** → Update multiple tickets
9. **Delete Ticket** → Remove a ticket

### 4. Test Error Cases
- Try accessing tickets without token (should get 401)
- Try updating non-existent ticket (should get 404)
- Try invalid status values (should get 400)
- Try accessing other user's tickets (should get 404)

## Valid Status Values
- `Open` (default)
- `In Progress`
- `Review`
- `Testing`
- `Done`

## Notes
- The collection includes automatic token saving for login/register
- Replace `TICKET_ID_HERE` placeholders with actual IDs from responses
- All ticket endpoints require authentication (Bearer token)
- The API uses pagination for listing tickets (page, limit params)

## For Cron Jobs (Internal Usage)
Cron jobs should use the internal function directly:
```javascript
import { bulkUpdateStatusInternal } from './src/controllers/tickets.controller.js';

// For cron jobs (no ownership check)
await bulkUpdateStatusInternal(ticketIds, 'Done', null);

// For user operations (with ownership check)
await bulkUpdateStatusInternal(ticketIds, 'Done', userId);
```
