// This file ensures that @babel/runtime helpers are available
try {
    // Create the helper function directly in node_modules
    const fs = require('fs');
    const path = require('path');
    
    const helperPath = path.resolve(
        __dirname,
        '../node_modules/@babel/runtime/helpers/interopRequireDefault.js'
    );
    
    const helperContent = `function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
module.exports = _interopRequireDefault;
module.exports.__esModule = true;
module.exports.default = module.exports;`;
    
    if (!fs.existsSync(helperPath)) {
        fs.writeFileSync(helperPath, helperContent);
    }
} catch (e) {
    console.warn('Failed to create babel runtime helper:', e);
}
