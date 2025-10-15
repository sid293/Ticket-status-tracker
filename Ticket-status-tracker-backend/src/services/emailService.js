import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send ticket completion email to the ticket owner
 * @param {string} ownerEmail - Email address of the ticket owner
 * @param {Object} ticketDetails - Ticket information
 * @returns {Promise<boolean>} - Success status
 */
export const sendTicketCompletionEmail = async (ownerEmail, ticketDetails) => {
  try {
    // Validate email configuration
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn(' Email configuration missing. Skipping email send.');
      return false;
    }

    // Validate recipient email
    if (!ownerEmail || !ownerEmail.trim()) {
      console.warn(' No recipient email provided. Skipping email send.');
      return false;
    }

    const transporter = createTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    console.log('SMTP server connection verified');

    // Email content
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: ownerEmail,
      subject: ticketDetails.subject,
      html: ticketDetails.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${ownerEmail}:`, info.messageId);
    return true;

  } catch (error) {
    console.error('Failed to send email:', error.message);
    return false;
  }
};

export default {
  sendTicketCompletionEmail
};
