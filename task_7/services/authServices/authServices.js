import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import bcrypt from "bcryptjs"
import { logger } from "../../logger/config.js";

/**
 * login the user
 * @param {*} credentials 
 * @returns token
 */
export const login = async (credentials) => {
    const { email, password, role } = credentials;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            logger.error("user not exist");
            const error = new Error("User not exist");
            error.status = 400;
            throw error;
        }
        logger.debug("validate the password");
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            logger.error("incorrect password");
            const error = new Error("Incorrect password");
            error.status = 400;
            throw error;
        }
        logger.debug("create the jwt token");
        const token = jwt.sign({ realName: user.realName, email, role: user.role }, process.env.JWT_SECRET);
        logger.debug("adding the token in db");
        await User.updateOne({ email: email }, { token: `Bearer ${token}` });
        return token;
    } catch (error) {
        throw error;
    }
}

/**
 * logout the user
 * @param {*} email 
 */
export const logout = async (email) => {
    try {
        logger.debug("clearing the token from db");
        await User.updateOne({ email: email }, { $set: { token: '' } });
    } catch (error) {
        throw error;
    }
}