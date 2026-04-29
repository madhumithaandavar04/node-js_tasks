import { logger } from "../logger/config.js";
import User from "../models/userModel.js";

/**
 * get the all buddies and sent
 * @returns all buddies
 */
export const fetchAllBuddies = async () => {
    // debug message 
    logger.debug("Fetching all buddies from database");
    const buddies = await User.find();
    return buddies;
}

/**
 * get buddy id or name as params and find the buddy and return
 * @param {*} idOrName 
 * @returns buddy
 */
export const fetchBuddyByCriteria = async (idOrName) => {
    // log specific input param
    logger.debug(`Fetching buddy with query : ${idOrName}`);
    const buddy = await searchBuddyByAttribute(idOrName);
    return buddy;
}

/**
 * get the new buddy details and add it to the buddy list
 * @param {*} buddyData 
 * @returns new buddy
 */
export const saveNewBuddy = async (buddyData) => {
    try {
        logger.verbose(`Starting save process for employeeId: ${buddyData.employeeId}`);
        const isExist = await checkBuddyExistence(buddyData.employeeId);
        if (isExist) {
            // warning log 
            logger.warn(`Buddy already exist : ${buddyData.employeeId}`);
            const error = new Error("Buddy already exist.");
            error.status = 400;
            throw error;
        }
        const date = new Date(buddyData.dob);
        const newUser = new User({ ...buddyData, dob: date });
        await newUser.save();
        // success message
        logger.info(`Successfully created buddy: ${buddyData.employeeId}`);
        return newUser;
    } catch (error) {
        throw error;
    }
}

/**
 * get the buddy id and updated details and update the buddy
 * @param {*} employeeId 
 * @param {*} updatedDetails 
 * @returns updated buddy
 */
export const modifyBuddyDetails = async (employeeId, updatedDetails) => {
    try {
        const exists = await checkBuddyExistence(employeeId);
        if (!exists) {
            // error
            logger.error(`Buddy with ${employeeId} doesn't not found`);
            const error = new Error("Buddy doesn't exist");
            error.status = 400;
            throw error;
        }
        const newDate = new Date(updatedDetails?.dob);
        if (updatedDetails?.dob)
            updatedDetails.dob = newDate;
        const buddy = await User.findOneAndUpdate({ employeeId: employeeId }, { $set: updatedDetails }, { new: true });
        // info success message
        logger.info(`Buddy id : ${employeeId}. Updated successfully.`);
        return buddy;
    } catch (error) {
        throw error;
    }
}

/**
 * get the buddy id and remove from the buddy list
 * @param {*} employeeId 
 */
export const removeBuddyRecord = async (employeeId) => {
    try {
        const exists = await checkBuddyExistence(employeeId);
        if (!exists) {
            // error 
            logger.error(`Buddy with ${employeeId} doesn't not found`);
            const error = new Error("Buddy doesn't exist");
            error.status = 400;
            throw error;
        }
        await User.deleteOne({ employeeId: employeeId });
        // info : success delete
        logger.info(`Deleted buddy with ID: ${employeeId}`);
    } catch (error) {
        throw error;
    }
}

/**
 * check whether the buddy with id exist
 * @param {*} employeeId 
 * @returns 
 */
export const checkBuddyExistence = async (employeeId) => {
    try {
        //verbose to track logic
        logger.verbose(`Checking existence for ID: ${employeeId}`);
        const isExist = await User.exists({ employeeId: employeeId });
        return isExist;
    } catch (error) {
        throw error;
    }
}

/**
 * get the buddy id or name and return the buddy
 * @param {*} identifier 
 * @returns buddy
 */
export const searchBuddyByAttribute = async (identifier) => {
    try {
        let searchQuery = {};
        if (!isNaN(identifier)) {
            searchQuery = {
                $or: [
                    { employeeId: identifier },
                    { realName: identifier }
                ]
            }
        } else {
            searchQuery = {
                realName: identifier
            }
        }
        const buddy = await User.findOne(searchQuery);
        if (!buddy) {
            // warning for failed searches
            logger.warn(`Buddy with ${identifier} doesn't exist `);
            const error = new Error(`Buddy doesn't exist`);
            error.status = 404;
            throw error;
        }
        //success find
        logger.info(`Buddy found:${buddy.realName} (${buddy.employeeId})`);
        return buddy;
    } catch (error) {
        throw error;
    }
}