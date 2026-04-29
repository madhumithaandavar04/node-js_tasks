import winston from 'winston';
import path from 'path';

// logs directory path
const LOG_DIR = 'logs';

// error filename based on the environment
let errorFilename = process.env.NODE_ENV !== 'development' ? 'prod-error.log' : 'error.log';

export const logger = winston.createLogger({
    // level 'verbose' to ensure info, debug, and verbose logs are captured
    level: process.env.LOGGER_LEVEL || 'verbose',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [

        // error log: Only captures 'error' level.
        new winston.transports.File({
            filename: path.join(LOG_DIR, errorFilename),
            level: 'error'
        }),

        // combined log : captures all logs 
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'combined.log')
        }),
    ],
});

// simple console output for development
logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));