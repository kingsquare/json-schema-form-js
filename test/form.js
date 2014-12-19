var fs = require('fs');
var generator = require('../index.js');
console.log(generator.render(JSON.parse(fs.readFileSync('./assets/schema.json'))));