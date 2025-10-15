import * as ticketService from '../services/ticketService.js';

/**
 * Get all tickets for the authenticated user with pagination
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User's unique identifier
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.page - Page number (default: 1)
 * @param {number} req.query.limit - Items per page (default: 10)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function listTickets(req, res, next) {
  try {
    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const result = await ticketService.getTickets(req.user.userId, pagination);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new ticket
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing ticket data
 * @param {string} req.body.title - Ticket title
 * @param {string} req.body.description - Ticket description
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User's unique identifier
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function createTicket(req, res, next) {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title and description are required'
      });
    }

    if(title.length < 3){
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title must contain 3 - 100 characters'
      });
    }

    const ticket = await ticketService.createTicket(
      { title, description },
      req.user.userId
    );

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get a specific ticket by ID
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Ticket ID
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User's unique identifier
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getTicket(req, res, next) {
  try {
    const ticket = await ticketService.getTicket(req.params.id, req.user.userId);
    res.status(200).json({ ticket });
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('access denied')) {
      return res.status(404).json({
        error: 'Ticket not found',
        message: 'Ticket not found or you do not have permission to view it'
      });
    }
    next(err);
  }
}

/**
 * Update a ticket
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Ticket ID
 * @param {Object} req.body - Request body containing update data
 * @param {string} req.body.title - Updated ticket title
 * @param {string} req.body.description - Updated ticket description
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User's unique identifier
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function updateTicket(req, res, next) {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title and description are required'
      });
    }

    if(title.length < 3){
      return res.status(400).json({
        error: 'Validation error',
        message: 'Title must contain 3 - 100 characters'
      });
    }

    const ticket = await ticketService.updateTicket(
      req.params.id,
      { title, description },
      req.user.userId
    );

    res.status(200).json({
      message: 'Ticket updated successfully',
      ticket
    });
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('access denied')) {
      return res.status(404).json({
        error: 'Ticket not found',
        message: 'Ticket not found or you do not have permission to update it'
      });
    }
    next(err);
  }
}

/**
 * Delete a ticket
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Ticket ID
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User's unique identifier
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function deleteTicket(req, res, next) {
  try {
    await ticketService.deleteTicket(req.params.id, req.user.userId);
    res.status(204).send();
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('access denied')) {
      return res.status(404).json({
        error: 'Ticket not found',
        message: 'Ticket not found or you do not have permission to delete it'
      });
    }
    next(err);
  }
}

/**
 * Update ticket status
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Ticket ID
 * @param {Object} req.body - Request body containing status data
 * @param {string} req.body.status - New status
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User's unique identifier
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;

    //validation
    const validStatuses = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const ticket = await ticketService.updateTicketStatus(
      req.params.id,
      status,
      req.user.userId
    );

    res.status(200).json({
      message: 'Ticket status updated successfully',
      ticket
    });
  } catch (err) {
    if (err.message.includes('Invalid status')) {
      return res.status(400).json({
        error: 'Invalid status',
        message: err.message
      });
    }
    if (err.message.includes('not found') || err.message.includes('access denied')) {
      return res.status(404).json({
        error: 'Ticket not found',
        message: 'Ticket not found or you do not have permission to update it'
      });
    }
    next(err);
  }
}

/**
 * Get ticket status history
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Ticket ID
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User's unique identifier
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function getHistory(req, res, next) {
  try {
    const history = await ticketService.getTicketHistory(req.params.id, req.user.userId);
    res.status(200).json(history);
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('access denied')) {
      return res.status(404).json({
        error: 'Ticket not found',
        message: 'Ticket not found or you do not have permission to view it'
      });
    }
    next(err);
  }
}

/**
 * Internal function for bulk status updates
 * @param {string[]} ticketIds - Array of ticket IDs
 * @param {string} status - New status for all tickets
 * @param {string} ownerId - User ID for ownership check (null for cron jobs)
 * @returns {Object} Update result
 */
export async function bulkUpdateStatusInternal(ticketIds, status, ownerId = null) {
  try {
    if (ownerId) {
      // User request: use service with ownership check
      const result = await ticketService.bulkUpdateStatus(ticketIds, status, ownerId);
      return {
        ...result,
        source: 'user'
      };
    } else {
      // Cron job: direct database update (no ownership check)
      const validStatuses = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];
      if (!status || !validStatuses.includes(status)) {
        throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
      }

      const Ticket = (await import('../models/Tickets.js')).default;
      const result = await Ticket.updateMany(
        { _id: { $in: ticketIds } },
        { 
          $set: { 
            status, 
            updatedAt: new Date() 
          },
          $push: { 
            statusHistory: { 
              status, 
              timestamp: new Date() 
            } 
          }
        }
      );

      return {
        updatedCount: result.modifiedCount,
        requestedCount: ticketIds.length,
        source: 'cron'
      };
    }
  } catch (error) {
    throw new Error(`Bulk update failed: ${error.message}`);
  }
}

/**
 * Bulk update status for multiple tickets (HTTP endpoint)
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing bulk update data
 * @param {string[]} req.body.ticketIds - Array of ticket IDs
 * @param {string} req.body.status - New status for all tickets
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.user.userId - User's unique identifier
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function bulkUpdateStatus(req, res, next) {
  try {
    const { ticketIds, status } = req.body;

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'ticketIds must be a non-empty array'
      });
    }

    // Call internal function with user's ID for ownership check
    const result = await bulkUpdateStatusInternal(ticketIds, status, req.user.userId);

    res.status(200).json({
      message: 'Bulk status update completed',
      ...result
    });
  } catch (err) {
    if (err.message.includes('Status must be one of') || err.message.includes('Invalid status')) {
      return res.status(400).json({
        error: 'Invalid status',
        message: err.message
      });
    }
    next(err);
  }
}


