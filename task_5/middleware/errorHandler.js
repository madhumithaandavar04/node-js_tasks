import { logger } from "../logger/config.js";

/**
 * error handler middleware
 * @param {*} error 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const errorhandler = (error, req, res, next) => {
    const statusCode = error.status || 500;
    const message = error.message || "Internal Server error";
    // error: logging status code message url
    logger.error(`${statusCode} - ${message} - ${req.method} ${req.originalUrl}`);
    // verbose : show the middleware successfully caught the error
    logger.verbose(`Error Handler caught exception: ${message}`);
    res.status(statusCode).json({
        success: false,
        message: message
    });
}