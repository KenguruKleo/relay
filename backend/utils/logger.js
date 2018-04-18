const winston = require('winston');
const config = require('../config');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: true,
      handleExceptions: true,
      colorize: true,
      level: config.logLevel,
      prettyPrint: true,
    }),
  ],
});

/**
 * Basic logging function. Logs the message with specified level
 * @param level
 * @param message
 * @param additional
 */
const log = (level, message, additional) => {
  if (additional !== undefined) {
    logger.log(level, message, additional);
  } else {
    logger.log(level, message);
  }
};

/**
 * Logs the message with DEBUG level
 * @param message
 * @param additional
 */
const debug = (message, additional) => {
  if (additional !== undefined) {
    log('debug', message, additional);
  } else {
    log('debug', message);
  }
};

/**
 * Logs the message with INFO level
 * @param message
 * @param additional
 */
const info = (message, additional) => {
  if (additional !== undefined) {
    log('info', message, additional);
  } else {
    log('info', message);
  }
};

/**
 * Logs the message with WARNING level
 * @param message
 * @param additional
 */
const warn = (message, additional) => {
  if (additional !== undefined) {
    log('warn', message, additional);
  } else {
    log('warn', message);
  }
};

/**
 * Logs the message with ERROR level
 * @param message
 * @param additional
 */
const error = (message, additional) => {
  if (additional !== undefined) {
    log('error', message, additional);
  } else {
    log('error', message);
  }
};

/**
 * Logs the message with INFO level
 * @param message
 */
const write = message => {
  info(message);
};

module.exports = {
  logger,
  info,
  warn,
  debug,
  error,
  write,
};
