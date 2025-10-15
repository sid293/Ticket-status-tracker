import Ticket from '../models/Tickets.js';
import AppError from '../utils/AppError.js';

/**
 * Create a new ticket
 * @param {Object} ticketData - Ticket data
 * @param {string} ticketData.title - Ticket title
 * @param {string} ticketData.description - Ticket description
 * @param {string} ownerId - Owner's user ID
 * @returns {Promise<Object>} - Created ticket
 */
export const createTicket = async (ticketData, ownerId) => {
  try {
    const { title, description } = ticketData;

    if (!title || !description) {
      throw new Error('Title and description are required');
    }

    const ticket = new Ticket({
      title,
      description,
      owner: ownerId,
      statusHistory: [{ status: 'Open', timestamp: new Date() }]
    });

    await ticket.save();
    return ticket;
  } catch (error) {
    throw new Error(`Failed to create ticket: ${error.message}`);
  }
};

/**
 * Get all tickets for a specific owner with pagination
 * @param {string} ownerId - Owner's user ID
 * @param {Object} pagination - Pagination options
 * @param {number} pagination.page - Page number (default: 1)
 * @param {number} pagination.limit - Items per page (default: 10)
 * @returns {Promise<Object>} - Tickets with pagination info
 */
export const getTickets = async (ownerId, pagination = {}) => {
  try {
    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.limit) || 10;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments({ owner: ownerId });

    return {
      items: tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch tickets: ${error.message}`);
  }
};

/**
 * Get all tickets (for admin/cron purposes)
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} - All tickets with pagination info
 */
export const getAllTickets = async (pagination = {}) => {
  try {
    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.limit) || 10;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ticket.countDocuments();

    return {
      items: tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch all tickets: ${error.message}`);
  }
};

/**
 * Get a specific ticket by ID
 * @param {string} ticketId - Ticket ID
 * @param {string} ownerId - Owner's user ID (for ownership check)
 * @returns {Promise<Object>} - Ticket object
 */
export const getTicket = async (ticketId, ownerId) => {
  try {
    const ticket = await Ticket.findOne({ 
      _id: ticketId, 
      owner: ownerId 
    });

    if (!ticket) {
      throw new Error('Ticket not found or access denied');
    }

    return ticket;
  } catch (error) {
    // Check if the error is already a known AppError (e.g., the 404 from above)
    if (error instanceof AppError) {
      throw error;
    }
    
    // CASE 2: Catch Mongoose Validation/Casting Errors -> Throw 400
    // The 'CastError' for the bad ID format is caught here.
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      throw new AppError(`Invalid data provided: ${error.message}`, 400);
    }

    throw new Error(`Failed to fetch ticket: ${error.message}`);
  }
};

/**
 * Update a ticket's details
 * @param {string} ticketId - Ticket ID
 * @param {Object} updateData - Update data
 * @param {string} updateData.title - Updated title
 * @param {string} updateData.description - Updated description
 * @param {string} ownerId - Owner's user ID (for ownership check)
 * @returns {Promise<Object>} - Updated ticket
 */
export const updateTicket = async (ticketId, updateData, ownerId) => {
  try {
    const { title, description } = updateData;

    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, owner: ownerId },
      { 
        title, 
        description, 
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      throw new Error('Ticket not found or access denied');
    }

    return ticket;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      throw new AppError(`Invalid data provided: ${error.message}`, 400);
    }

    throw new Error(`Failed to update ticket: ${error.message}`);
  }
};

/**
 * Delete a ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} ownerId - Owner's user ID (for ownership check)
 * @returns {Promise<Object>} - Deleted ticket
 */
export const deleteTicket = async (ticketId, ownerId) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ 
      _id: ticketId, 
      owner: ownerId 
    });

    if (!ticket) {
      throw new Error('Ticket not found or access denied');
    }

    return ticket;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      throw new AppError(`Invalid data provided: ${error.message}`, 400);
    }

    throw new Error(`Failed to delete ticket: ${error.message}`);
  }
};

/**
 * Update ticket status (with ownership check)
 * @param {string} ticketId - Ticket ID
 * @param {string} newStatus - New status
 * @param {string} ownerId - Owner's user ID (for ownership check)
 * @returns {Promise<Object>} - Updated ticket
 */
export const updateTicketStatus = async (ticketId, newStatus, ownerId) => {
  try {
    const validStatuses = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const ticket = await Ticket.findOne({ 
      _id: ticketId, 
      owner: ownerId 
    });

    if (!ticket) {
      throw new Error('Ticket not found or access denied');
    }

    // Add to status history
    ticket.statusHistory.push({
      status: newStatus,
      timestamp: new Date()
    });

    ticket.status = newStatus;
    ticket.updatedAt = new Date();
    await ticket.save();

    return ticket;
  } catch (error) {
    // Check if the error is already a known AppError (e.g., the 404 from above)
    if (error instanceof AppError) {
      throw error;
    }
    
    // CASE 2: Catch Mongoose Validation/Casting Errors -> Throw 400
    // The 'CastError' for the bad ID format is caught here.
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      throw new AppError(`Invalid data provided: ${error.message}`, 400);
    }

    throw new Error(`Failed to update ticket status: ${error.message}`);
  }
};

/**
 * Get ticket status history
 * @param {string} ticketId - Ticket ID
 * @param {string} ownerId - Owner's user ID (for ownership check)
 * @returns {Promise<Object>} - Ticket history
 */
export const getTicketHistory = async (ticketId, ownerId) => {
  try {
    const ticket = await Ticket.findOne({ 
      _id: ticketId, 
      owner: ownerId 
    }).select('statusHistory title');

    if (!ticket) {
      throw new Error('Ticket not found or access denied');
    }

    return {
      ticketId: ticket._id,
      title: ticket.title,
      history: ticket.statusHistory
    };
  } catch (error) {
    // Check if the error is already a known AppError (e.g., the 404 from above)
    if (error instanceof AppError) {
      throw error;
    }
    
    // CASE 2: Catch Mongoose Validation/Casting Errors -> Throw 400
    // The 'CastError' for the bad ID format is caught here.
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      throw new AppError(`Invalid data provided: ${error.message}`, 400);
    }

    throw new Error(`Failed to fetch ticket history: ${error.message}`);
  }
};

/**
 * Bulk update status for multiple tickets
 * @param {string[]} ticketIds - Array of ticket IDs
 * @param {string} status - New status
 * @param {string} ownerId - Owner's user ID (for ownership check)
 * @returns {Promise<Object>} - Update result
 */
export const bulkUpdateStatus = async (ticketIds, status, ownerId) => {
  try {
    const validStatuses = ['Open', 'In Progress', 'Review', 'Testing', 'Done'];
    if (!status || !validStatuses.includes(status)) {
      throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      throw new Error('ticketIds must be a non-empty array');
    }

    const result = await Ticket.updateMany(
      { _id: { $in: ticketIds }, owner: ownerId },
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
      source: 'user'
    };
  } catch (error) {
    // Check if the error is already a known AppError (e.g., the 404 from above)
    if (error instanceof AppError) {
      throw error;
    }
    
    // CASE 2: Catch Mongoose Validation/Casting Errors -> Throw 400
    // The 'CastError' for the bad ID format is caught here.
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      throw new AppError(`Validation failed: ${error.message}`, 400);
    }

    throw new Error(`Failed to bulk update status: ${error.message}`);
  }
};

/**
 * Get tickets by status
 * @param {string} status - Ticket status
 * @param {string} ownerId - Owner's user ID (optional)
 * @returns {Promise<Array>} - Array of tickets
 */
export const getTicketsByStatus = async (status, ownerId = null) => {
  try {
    const filter = { status };
    if (ownerId) {
      filter.owner = ownerId;
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    return tickets;
  } catch (error) {
    throw new Error(`Failed to fetch tickets by status: ${error.message}`);
  }
};

export default {
  createTicket,
  getTickets,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  updateTicketStatus,
  getTicketHistory,
  bulkUpdateStatus,
  getTicketsByStatus
};
