const fs = require('fs')
const data = fs.readFileSync('./data/color_ palette.json', 'utf8');
const colorPalette = JSON.parse(data);
const count=5;
const length=colorPalette.length;
const limit=Math.min(length,count)
const randomColors=[]
const selectedIndices=new Set();
while (selectedIndices.size < limit) {
   let randomIndex=Math.floor(Math.random()*length)
   //if the random index not in set we can add the random index to the set
   if (!selectedIndices.has(randomIndex)) {
      selectedIndices.add(randomIndex);
      //add the color to the random array
      randomColors.push(colorPalette[randomIndex].color); 
    }
}
console.log(randomColors);
//write file random color palette
const colorsJson = JSON.stringify(randomColors);
fs.writeFileSync('./data/randomized_color_palette.json', colorsJson);
console.log("file created successfully");
//read file random color palette
const randomColorsFileData = fs.readFileSync('./data/randomized_color_palette.json', 'utf8');
console.log("newly created file data", randomColorsFileData);
