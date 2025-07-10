/**
 * This is a shim for @babel/runtime/helpers/interopRequireDefault
 * It directly implements the helper function needed by Metro
 */

function interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// For CommonJS
if (typeof module !== 'undefined') {
  module.exports = interopRequireDefault;
  module.exports.__esModule = true;
  module.exports.default = interopRequireDefault;
}

// For ESM
export default interopRequireDefault;
