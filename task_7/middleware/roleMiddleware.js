import { logger } from "../logger/config.js";

/**
 * authorize the role to give access
 * @param  {...any} allowedRoles 
 * @returns permission
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user?.role)) {
            const error = new Error("Access denied");
            error.status = 403;
            throw error;
        }
        logger.debug("Checked the role");
        next();
    }
}