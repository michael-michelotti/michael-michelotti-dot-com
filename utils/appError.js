/**
 * Error subclass which attaches project-specific data to errors
 * @constructor
 * @name AppError
 * @param {String} message error message
 * @param {Number} statusCode HTTP status code for the error
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
