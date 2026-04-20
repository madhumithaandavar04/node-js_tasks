import fs from "fs"
// load dotenv
const db = "/Users/madhumithaa/Desktop/node_projects/task_4/data/"+process.env.DB;
/**
 * create the database file if doesn't exist 
 */
export const initializeFile = () => {
    if(fs.existsSync(db)){
        return;
    }
    try {
    fs.writeFileSync(db,JSON.stringify([]));
    }catch (error) {
throw error;
    }
}
/**
 * read the database file and return the data
 * @returns data in the file
 */
export const readFile = () => {
    try{
const data=fs.readFileSync(db,'utf8');
return JSON.parse(data);
    }catch(error){
throw error;
    }
}

/**
 * get the data from the user and write it into the db file
 * @param {*} data 
 */
export const writeFile = (data) => {
    try{
        fs.writeFileSync(db,JSON.stringify(data));
    }catch(error){
        throw error;
    }
}
