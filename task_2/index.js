const http = require('http');
const fs = require('fs');
//port 
const PORT = 3000;
//creating server using http
const server = http.createServer((req, res) => {
    try {
        //read color palette file
        fs.readFile("./data/color_ palette.json", 'utf8', (err, data) => {
            //parse data
            const colors = JSON.parse(data);
            //radom colors array
            const randomColors = colors.sort(() => Math.random() - 0.5).slice(0, 5);
            //send request
            res.writeHead(200, {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify(randomColors));
            if(err){
                console.log("Error while reading color palette file");
            }
        })
    }
    catch (error) {
        console.log("Error:", error);
    }
})
//server listening to the port
server.listen(PORT, () => {
    console.log("Server is listening to the port ", PORT);
})