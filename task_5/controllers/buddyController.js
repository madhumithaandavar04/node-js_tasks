import * as buddyService from "../services/buddyService.js";
import { logger } from "../logger/config.js";

/**
 * get all buddies
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns return buddies list
 */
export const getBuddies = async (req, res, next) => {
    try {
        // track which endpoint hit
        logger.verbose(`Controller: getBuddies - GET /api/v1/buddies`);
        const buddies = await buddyService.fetchAllBuddies();
        res.status(200).json({
            status: "success",
            data: buddies
        });
    } catch (error) {
        next(error);
    }
}

/**
 * get a budding using id or name
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns buddy
 */
export const getBuddy = async (req, res, next) => {
    const query = req.params.query;
    try {
        // debug: log the param
        logger.debug(`Controller: getBuddy - Query: ${query}`);
        const buddy = await buddyService.fetchBuddyByCriteria(query);
        res.status(200).json({
            status: "success",
            data: buddy
        });
    } catch (error) {
        next(error);
    }
}

/**
 * create buddy
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns created buddy
 */
export const createBuddy = async (req, res, next) => {
    const buddy = req.body;
    try {
        // verbose :track the start create buddy
        logger.verbose(`Controller: createBuddy - Request received for ${buddy.realName}`);
        await buddyService.saveNewBuddy(buddy);
        return res.status(201).json({
            status: "success",
            message: "Buddy created successfully"
        })
    } catch (error) {
        next(error);
    }
}

/**
 * update the buddy using id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns updated buddy
 */
export const updateBuddy = async (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    try {
        // debug:log the id param
        logger.debug(`Controller: updateBuddy - ID: ${id}`);
        const updatedBuddy = await buddyService.modifyBuddyDetails(id, body);
        return res.status(200).json({
            status: "success",
            message: "Buddy updated",
            data: updatedBuddy
        });
    } catch (error) {
        next(error);
    }
}

/**
 * delete the buddy using id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const deleteBuddy = async (req, res, next) => {
    try {
        //verbose :track the delete buddy
        logger.verbose(`Controller: deleteBuddy - Attempting to remove ID: ${req.params.id}`);
        await buddyService.removeBuddyRecord(req.params.id);
        res.status(201).json({
            status: "success",
            message: "Buddy deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}