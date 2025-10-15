/**
 * @fileoverview Custom error class for handling operational errors in the application.
 * This class extends the native Error class and adds properties for HTTP status code 
 * and operational status, allowing the global error handler to send proper responses.
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code (e.g., 404, 400, 500).
   */
  constructor(message, statusCode) {
    // Call the parent constructor (Error)
    super(message); 

    // Set the HTTP status code
    this.statusCode = statusCode;
    
    // Set the status string based on the status code (e.g., 'fail' for 4xx, 'error' for 5xx)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // Set the isOperational flag to true. This indicates that the error is expected
    // (e.g., validation failure, resource not found) and can be sent to the client.
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call from the trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
