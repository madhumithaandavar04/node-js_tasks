import { logger } from "../logger/config.js";
import User from "../models/userModel.js";
/**
 * get the all buddies and sent
 * @returns all buddies
 */
export const getAll = async () => {
    logger.debug("Fetching all buddies from database");
    const buddies = await User.find();
    return buddies;
}

/**
 * get buddy id or name as params and find the buddy and return
 * @param {*} query 
 * @returns buddy
 */
export const getOne = async (query) => {
    logger.debug(`Fetching buddy with query : ${query}`);
    const buddy = await getBuddyByIdOrName(query);
    return buddy;
}

/**
 * get the new buddy details and add it to the buddy list
 * @param {*} buddy 
 * @returns new buddy
 */
export const create = async (buddy) => {
    try {
        const isExist = await isBuddyExist(buddy.employeeId, buddy.email);
        if (isExist) {
            logger.warn(`Buddy already exist : ${buddy.employeeId}`);
            const error = new Error("Buddy already exist.");
            error.status = 400;
            throw error;
        }
        const date = new Date(buddy.dob);
        const newUser = new User({ ...buddy, dob: date });
        await newUser.save();
        logger.info(`Successfully created buddy: ${buddy.employeeId}`);
        return newUser;
    } catch (error) {
        throw error;
    }
}

/**
 * get the buddy id and updated details and update the buddy
 * @param {*} id 
 * @param {*} buddy 
 * @returns updated buddy
 */
export const update = async (id, body) => {
    try {
        const exists = await isBuddyExist(id);
        if (!exists) {
            logger.error(`Buddy with ${id} doesn't not found`);
            const error = new Error("Buddy doesn't exist");
            error.status = 400;
            throw error;
        }
        const newDate = new Date(body?.dob);
        if (body?.dob)
            body.dob = newDate;
        const buddy = await User.findOneAndUpdate({ employeeId: id }, { $set: body }, { new: true });
        logger.debug(`Buddy id : ${id}.Updated successfully.`)
        return buddy;
    } catch (error) {
        throw error;
    }
}

/**
 * get the buddy id and remove from the buddy list
 * @param {*} id 
 */
export const remove = async (id) => {
    try {
        const exists = await isBuddyExist(id);
        if (!exists) {
            logger.error(`Buddy with ${id} doesn't not found`);
            const error = new Error("Buddy doesn't exist");
            error.status = 400;
            throw error;
        }
        await User.deleteOne({ employeeId: id });
        logger.info(`Deleted buddy with ID: ${id}`);
    } catch (error) {
        throw error;
    }
}

/**
 * check whether the buddy with id exist
 * @param {*} id 
 * @returns 
 */
export const isBuddyExist = async (id, email) => {
    try {
        const isExist = await User.exists({ $or: [{ employeeId: id }, { email: email }] });
        return isExist;
    } catch (error) {
        throw error;
    }
}

/**
 * get the buddy id or name and return the buddy
 * @param {*} id 
 * @returns buddy
 */
export const getBuddyByIdOrName = async (query) => {
    try {
        let searchQuery = {};
        if (!isNaN(query)) {
            searchQuery = {
                $or: [
                    { employeeId: query },
                    { realName: query }
                ]
            }
        } else {
            searchQuery = {
                realName: query
            }
        }
        const buddy = await User.findOne(searchQuery);
        if (!buddy) {
            logger.warn(`Buddy with ${id} doesn't exist `);
            const error = new Error(`Buddy doesn't exist`);
            error.status = 404;
            throw error;
        }
        logger.info(`Buddy found:${buddy.realName} (${buddy.employeeId})`);
        return buddy;
    } catch (error) {
        throw error;
    }
}
