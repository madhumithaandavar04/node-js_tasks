import chalk from 'chalk';
import lodash from 'lodash';
import http from "http";
import fs from "fs";
import dotenv from "dotenv"
dotenv.config()
//using chalk package
console.log(chalk.green.bold('Success! ') + chalk.white('The local package is working.'));
console.log(chalk.yellow('Nodemon is watching this file for changes.'));
//get PORT from env variables
const PORT = process.env.PORT;
//create server using http
const server = http.createServer((req, res) => {
        //read file
        try{
        fs.readFile("./data/color_ palette.json", 'utf8', (err, data) => {
            if(err){
              console.log("Something went wrong");
              return;
            }
            const colors = JSON.parse(data);
            //using lodash to get random array with sample size
            const randomColors = lodash.sampleSize(colors, 5);
            console.log(JSON.stringify(randomColors));
            res.writeHead(200, {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify(randomColors));
        })
    }catch(error){
        console.log("Something went wrong");
    }
})
//listening the port
server.listen(process.env.PORT, () => {
    console.log("Server is listening to the port ", PORT);
})