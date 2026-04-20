import winston from 'winston';
let config = {
    filename: `error.log`,
    level: 'error'
}
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV != 'development') {
    config.filename = 'prod-error.log'
}
export const logger = winston.createLogger({
    level: process.env.LOGGER_LEVEL || 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },

    transports: [
        new winston.transports.File(config),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}));

