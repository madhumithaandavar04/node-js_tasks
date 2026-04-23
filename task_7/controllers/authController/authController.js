
import { login, logout } from "../../services/authServices/authServices.js";
import { createBuddy } from "../buddyController/buddyController.js";

/**
 * login user 
 * @param {*} req 
 * @param {*} res 
 */
export const loginUser = async (req, res) => {
    const credentials = req.body;
    try {
        const token = await login(credentials);
        res.header('authorization', token).json({
            status: "success", message: "User logged in successfully"
        });
        logger.debug("login the user");
    } catch (error) {
        throw error;
    }
}

/**
 * logout the user
 * @param {*} req 
 * @param {*} res 
 */
export const logoutUser = async (req, res) => {
    const { email } = req.user;
    try {
        await logout(email);
        logger.debug("logged out the user")
        res.status(200).json({
            status: "success",
            message: "Logged out successfully"
        })
    } catch (error) {
        throw error;
    }
}

/**
 * get the user profile
 * @param {*} req 
 * @param {*} res 
 * @returns user
 */
export const userProfile = async (req, res) => {
    try {
        logger.debug("get the user details");
        return res.status(200).json(req.user);
    } catch (error) {
        throw error;
    }
}
