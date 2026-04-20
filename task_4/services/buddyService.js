import validateSignup from "../validator/validate.js";
import { readFile, writeFile } from "./fileService.js"
/**
 * get the all buddies and sent
 * @returns all buddies
 */
export const getAll = () => {
    return readFile();
}

/**
 * get buddy id or name as params and find the buddy and return
 * @param {*} query 
 * @returns buddy
 */
export const getOne = (query) => {
    const buddy = getBuddyByIdOrName(query);
    return buddy;
}

/**
 * get the new buddy details and add it to the buddy list
 * @param {*} buddy 
 * @returns new buddy
 */
export const create = (buddy) => {
    const{error,value}=validateSignup(buddy);
    if(error){
     const newError= new Error(error.details[0].message);
     newError.status=400;
     throw newError;
    }
    if (isBuddyExist(value.employeeId)) {
        const error = new Error("Buddy already exist.");
        error.status = 400;
        throw error;
    }
    const buddies = readFile();
    buddies.push(value);
    writeFile(buddies);
    return value;
}

/**
 * get the buddy id and updated details and update the buddy
 * @param {*} id 
 * @param {*} buddy 
 * @returns updated buddy
 */
export const update = (id, buddy) => {
    let buddies = readFile();
    const index = buddies.findIndex(buddy => buddy.employeeId === id);
    if (index === -1) {
        const error = new Error("Buddy doesn't exist");
        error.status=404;
        throw error;
    }
    buddies[index] = { ...buddies[index], ...buddy };
    writeFile(buddies);
    return buddies[index];
}

/**
 * get the buddy id and remove from the buddy list
 * @param {*} id 
 */
export const remove = (id) => {
    if (!isBuddyExist(id)) {
        const error = new Error("Buddy doesn't exist");
        error.status = 404;
        throw error;
    }
    const buddies = readFile();
    const filteredBuddies = buddies.filter((buddy) => buddy.employeeId != id);
    writeFile(filteredBuddies);
}

/**
 * check whether the buddy with id exist
 * @param {*} id 
 * @returns 
 */
export const isBuddyExist = (id) => {
    const buddies = getAll();
    return buddies.findIndex(buddy => buddy.employeeId === id) != -1;
}

/**
 * get the buddy id or name and return the buddy
 * @param {*} id 
 * @returns buddy
 */
export const getBuddyByIdOrName = (query) => {
    const buddies = getAll();
    const buddy = buddies.find(buddy => {
      const isIdMatch = buddy.employeeId.toString() === query;
      const isNameMatch = typeof query === 'string' && 
                           buddy.realName.toLowerCase() === query.toLowerCase();
       return isIdMatch || isNameMatch;                    
});
    if (!buddy) {
        const error = new Error(`Buddy doesn't exist`);
        error.status = 404;
        throw error;
    }
    return buddy;
}
