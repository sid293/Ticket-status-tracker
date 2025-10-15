import Ticket from '../models/Tickets.js';

// Status progression configuration
const STATUS_TRANSITIONS = {
  'Open': 'In Progress',
  'In Progress': 'Review',
  'Review': 'Testing',
  'Testing': 'Done'
};

// Get transition time in minutes for each status
const getTransitionTime = (status) => {
  const config = {
    'Open': parseInt(process.env.OPEN_TO_INPROGRESS_MINUTES) || 2,
    'In Progress': parseInt(process.env.INPROGRESS_TO_REVIEW_MINUTES) || 1,
    'Review': parseInt(process.env.REVIEW_TO_TESTING_MINUTES) || 3,
    'Testing': parseInt(process.env.TESTING_TO_DONE_MINUTES) || 2
  };
  return config[status] || 0;
};

/**
 * Get all tickets that need status updates
 * @returns {Promise<Array>} - Array of tickets eligible for status update
 */
export const getTicketsForStatusUpdate = async () => {
  try {
    const now = new Date();
    
    // Get all tickets that are not "Done"
    const tickets = await Ticket.find({ 
      status: { $ne: 'Done' } 
    });

    const eligibleTickets = [];

    for (const ticket of tickets) {
      const timeSinceUpdate = (now - ticket.updatedAt) / (1000 * 60); // minutes
      // const timeSinceUpdate = (now - ticket.updatedAt); 
      const requiredTime = getTransitionTime(ticket.status);
      
      if (timeSinceUpdate >= requiredTime) {
        eligibleTickets.push(ticket);
      }
    }

    console.log(`🔍 Found ${eligibleTickets.length} tickets eligible for status update`);
    return eligibleTickets;

  } catch (error) {
    console.error('❌ Error fetching tickets for status update:', error.message);
    return [];
  }
};

/**
 * Update ticket status for cron jobs (no ownership check)
 * @param {string} ticketId - ID of the ticket to update
 * @param {string} newStatus - New status to set
 * @returns {Promise<Object|null>} - Updated ticket or null if failed
 */
export const updateTicketStatusForCron = async (ticketId, newStatus) => {
  try {
    const updateData = {
      status: newStatus,
      updatedAt: new Date()
    };

    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      console.error(`Ticket with ID ${ticketId} not found`);
      return null;
    }

    // Add to status history
    updatedTicket.statusHistory.push({
      status: newStatus,
      timestamp: new Date()
    });
    
    await updatedTicket.save();

    return updatedTicket;

  } catch (error) {
    console.error(`Error updating ticket ${ticketId}:`, error.message);
    return null;
  }
};

/**
 * Get the next status for a given current status
 * @param {string} currentStatus - Current status of the ticket
 * @returns {string|null} - Next status or null if no transition available
 */
export const getNextStatus = (currentStatus) => {
  return STATUS_TRANSITIONS[currentStatus] || null;
};

/**
 * Check if a ticket should be updated based on time elapsed
 * @param {Object} ticket - Ticket object
 * @returns {boolean} - Whether ticket should be updated
 */
export const shouldUpdateTicket = (ticket) => {
  const now = new Date();
  const timeSinceUpdate = (now - ticket.updatedAt) / (1000 * 60); // minutes
  const requiredTime = getTransitionTime(ticket.status);
  
  return timeSinceUpdate >= requiredTime;
};

export default {
  getTicketsForStatusUpdate,
  updateTicketStatusForCron,
  getNextStatus,
  shouldUpdateTicket
};
