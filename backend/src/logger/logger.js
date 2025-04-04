require('dotenv').config();
const winston = require('winston');

const { format, transports } = winston;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
	format.timestamp(),
	format.json()
  ),
  transports: [
	new transports.File({
	  filename: 'error.log',
	  level: 'error',
	  format: format.combine(
		format.timestamp(),
		format.json()
	  )
	}),
	new transports.File({
	  filename: 'combined.log',
	  format: format.combine(
		format.timestamp(),
		format.json()
	  )
	})
  ]
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
	format: format.combine(
	  format.colorize(),
	  format.simple()
	)
  }));
}

module.exports = logger;
