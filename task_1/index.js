const fs = require('fs')
const data = fs.readFileSync('./data/color_ palette.json', 'utf8');
const colorPalette = JSON.parse(data);
const colors = colorPalette.map((colorObject) => colorObject["color"]);
//random color generator
const randomColors = colors.sort((a, b) => Math.random() - 0.5).slice(0, 5);
console.log(randomColors);
//write file random color palette
const colorsJson = JSON.stringify(randomColors);
fs.writeFileSync('./data/randomized_color_palette.json', colorsJson);
console.log("file created successfully");
//read file random color palette
const randomColorsFileData = fs.readFileSync('./data/randomized_color_palette.json', 'utf8');
console.log("newly created file data", randomColorsFileData);
