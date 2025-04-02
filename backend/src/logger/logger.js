require('dotenv').config();
const winston = require('winston');

const { format, transports } = winston;

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	defaultMeta: { service: 'wishlist'},
	transports: [

	//write to all logs with level info and below to quick-start-combined.log
	//write all logs error (and below) to quick-start-error.log
	new transports.File({ filename: 'quick-start-error.log', level: 'error'}),
	new transports.File({ filename: 'quick-start-combined.log'})
]
});

//If we're not in production them log to the console
	if (process.env.NODE_ENV != 'production'){
	    logger.add(new transports.Console({
		format: format.combine(
		    format.colorize(),
		    format.simple()
)
}))
};
