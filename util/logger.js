'use strict';

var winston = require( 'winston' ),
	fs = require( 'fs' ),
	logDir = 'log', // Or read from a configuration
	env = process.env.NODE_ENV || 'development',
  logger;
  
const { format } = require('winston');
const { combine, timestamp, printf } = format;
 
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} : ${message}`;
});


logger = winston.createLogger({
  level: env === 'production' ? 'warn' 
                : 'development' ? 'silly'
                : 'stage' ? 'info'
                : 'debug',
  format: combine(
      // label({ label: 'right meow!' }),
      format.splat(),
      format.simple(),
      timestamp(),
      format.colorize(),
      myFormat
    ),
  // defaultMeta: { service: 'user-service' },
  // colorize: true,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({  
      handleExceptions: true,
      'json': false,
      'colorize': true,
      'humanReadableUnhandledException': true
    })
  ]
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
