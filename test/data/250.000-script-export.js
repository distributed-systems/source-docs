
const x = class ClassWithANameTwo {}

module.exports = x;


module.exports = class {};
module.exports = class ClassWithAName {};


const g = module.exports = 1;


module.exports = {};

module.exports.d = true;


module.exports = require('./250.000-script-import-dependency.js');

const dep = require('./250.000-script-import-dependency.js');

module.exports = dep;