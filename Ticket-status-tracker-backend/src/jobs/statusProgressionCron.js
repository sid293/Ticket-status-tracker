import { 
  getTicketsForStatusUpdate, 
  updateTicketStatusForCron, 
  getNextStatus 
} from '../services/ticketStatusProgressionService.js';
import { sendTicketCompletionEmail } from '../services/emailService.js';

/**
 * Main cron job handler for status progression
 * This function runs every minute and processes ticket status updates
 */
export const statusProgressionHandler = async () => {
  try {
    console.log('Starting status progression check...');

    // Get all tickets that need status updates
    const eligibleTickets = await getTicketsForStatusUpdate();

    if (eligibleTickets.length === 0) {
      console.log('No tickets eligible for status update');
      return;
    }

    let processedCount = 0;

    // Group tickets reaching "Done" by their owner's userId
    const userTicketMap = {}; // userId -> [tickets]
    const userEmailMap = {};  // userId -> email

    // Process each eligible ticket
    for (const ticket of eligibleTickets) {
      try {
        const currentStatus = ticket.status;
        const nextStatus = getNextStatus(currentStatus);

        if (!nextStatus) {
          console.log(`No next status available for ticket #${ticket._id} (current: ${currentStatus})`);
          continue;
        }

        // Update ticket status
        const updatedTicket = await updateTicketStatusForCron(ticket._id, nextStatus);

        if (updatedTicket) {
          console.log(`Ticket #${ticket._id} moved from ${currentStatus} → ${nextStatus}`);
          processedCount++;

          // If just reached "Done" and mail not sent
          if (nextStatus === 'Done') {
            if (!userTicketMap[ticket.owner]) userTicketMap[ticket.owner] = [];
            userTicketMap[ticket.owner].push(updatedTicket);
          }
        }
      } catch (ticketError) {
        console.error(`Error processing ticket #${ticket._id}:`, ticketError.message);
      }
    }

    // For each user, resolve their email and send a SINGLE email with all "Done" tickets in one template
    const userIds = Object.keys(userTicketMap);
    for (const userId of userIds) {
      let ownerEmail = null;
      try {
        // Only resolve if not already found
        if (!userEmailMap[userId]) {
          const { default: User } = await import('../models/User.js');
          const userDoc = await User.findOne({ userId }).lean();
          if (userDoc && userDoc.email) {
            ownerEmail = userDoc.email;
            userEmailMap[userId] = ownerEmail;
            console.log(`Resolved owner email for userId "${userId}": "${ownerEmail}"`);
          } else {
            console.warn(`No user found for userId: ${userId}`);
            continue;
          }
        } else {
          ownerEmail = userEmailMap[userId];
        }
      } catch (userErr) {
        console.error(`Failed to find owner for userId "${userId}":`, userErr.message);
        continue;
      }

      // Filter out any null/undefined tickets just for safety
      const ticketList = userTicketMap[userId].filter(Boolean);
      if (!ticketList.length) continue;

      const batchCount = ticketList.length;

      // Compose dynamic subject line
      const subject =
        batchCount === 1
          ? `Ticket Completed: ${ticketList[0].title || ""}`
          : `${batchCount} Tickets Completed in Your Account`;

      // Build HTML template for all tickets
      let ticketsHtml = "";
      ticketList.forEach((ticket, idx) => {
        // Defensive: use ticket fields or fallback to ""
        const title = ticket.title || "";
        const description = ticket.description || "";
        const id = ticket._id || "";
        const completedAt = ticket.updatedAt
          ? new Date(ticket.updatedAt).toLocaleString()
          : new Date().toLocaleString();
        ticketsHtml += `
          <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Ticket ${idx + 1}</h3>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Done</span></p>
            <p><strong>Ticket ID:</strong> ${id}</p>
            <p><strong>Completed At:</strong> ${completedAt}</p>
          </div>
        `;
      });
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">
            ${batchCount} Ticket${batchCount === 1 ? '' : 's'} Completed!
          </h2>
          ${ticketsHtml}
          <p style="color: #6c757d;">
            Thank you for using our ticket tracking system. The above ticket${batchCount === 1 ? ' has' : 's have'} been successfully completed!
          </p>
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
          <p style="color: #6c757d; font-size: 12px;">
            This is an automated notification from the Ticket Status Tracker system.
          </p>
        </div>
      `;

      // Call sendTicketCompletionEmail with proper subject and HTML
      const emailSent = await sendTicketCompletionEmail(ownerEmail, {
        tickets: ticketList,
        subject,
        status: "Done",
        html: emailHtml,
      });
    }


  } catch (error) {
    console.error('Error in status progression handler:', error.message);
  }
};

/**
 * Get status progression statistics
 * @returns {Promise<Object>} - Statistics about the status progression system
 */
export const getStatusProgressionStats = async () => {
  try {
    const eligibleTickets = await getTicketsForStatusUpdate();
    
    const stats = {
      totalEligible: eligibleTickets.length,
      byStatus: {},
      nextTransitions: []
    };

    // Group by current status
    eligibleTickets.forEach(ticket => {
      const status = ticket.status;
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      
      const nextStatus = getNextStatus(status);
      if (nextStatus) {
        stats.nextTransitions.push({
          ticketId: ticket._id,
          from: status,
          to: nextStatus
        });
      }
    });

    return stats;

  } catch (error) {
    console.error('❌ Error getting status progression stats:', error.message);
    return { error: error.message };
  }
};

export default {
  statusProgressionHandler,
  getStatusProgressionStats
};
