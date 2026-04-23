import { logger } from "../logger/config.js";
import jwt from "jsonwebtoken";
/**
 * verify the token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        if (!token) {
            logger.error("token not found");
            const error = new Error("No token , authorization denied");
            error.status = 401;
            throw error;
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            logger.info("decoded the token");
            req.user = decode;
            next();
        } catch (error) {
            throw error;
        }
    } else {
        logger.error("Authorization header not found");
        const error = new Error("No Authorization header , authorization denied");
        error.status = 401;
        throw error;
    }
}