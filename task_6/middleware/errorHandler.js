import { logger } from "../logger/config.js";

/**
 * error handler middleware
 * @param {*} error 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const errorhandler = (error, req, res, next) => {
    logger.error(`${error.status || 500}-${error.message}`);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server error"
    });
}