import * as buddyService from "../services/buddyService.js";
/**
 * get all buddies
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns return buddies list
 */
export const getBuddies = async (req, res, next) => {
    try {
        const buddies = await buddyService.getAll();
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
        const buddy = await buddyService.getOne(query);
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
        await buddyService.create(buddy);
        return res.status(201).json({
            status: "success",
            message: "Buddy created successfully"
        }
        )
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
        const updatedBuddy = await buddyService.update(id, body);
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
        await buddyService.remove(req.params.id);
        res.status(201).json({
            status: "success",
            message: "Buddy deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}