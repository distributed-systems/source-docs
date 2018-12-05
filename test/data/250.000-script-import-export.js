const n = 250;

require('./250.000-script-import-export-dependency.js');

const x = require('./250.000-script-import-export-dependency.js');
const {a, b} = require('./250.000-script-import-export-dependency.js');

const mod = require(`./${n}.000-script-import-export-dependency.js`);