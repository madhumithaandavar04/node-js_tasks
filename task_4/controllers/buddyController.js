import * as buddyService from "../services/buddyService.js";

/**
 * get all buddies
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns return buddies list
 */
export const getBuddies = (req, res, next) => {
    try {
        const buddies = buddyService.getAll();
        return res.status(200).json({
         buddies
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
 * @returns 
 */
export const getBuddy = (req, res, next) => {
    const query = req.params.query;
    try {
        const buddy = buddyService.getOne(query);
        return res.status(200).json({
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
export const createBuddy = (req, res, next) => {
    const buddy = req.body;
    try {
        buddyService.create(buddy);
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
export const updateBuddy = (req, res, next) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const updatedBuddy = buddyService.update(id, body);
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
export const deleteBuddy = (req, res, next) => {
    try {
        buddyService.remove(req.params.id);
        res.status(200).json({
            status: "success",
            message: "Buddy deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}
