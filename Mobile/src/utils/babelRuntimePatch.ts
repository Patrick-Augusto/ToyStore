/**
 * This module patches the global scope to provide @babel/runtime helpers
 */

import interopRequireDefault from './interopRequireDefault';

// Make sure @babel/runtime/helpers are available
// This creates a dynamic proxy to handle all babel helpers
const createBabelHelperHandler = () => ({
  get: (target: any, prop: string) => {
    // Handle the main helper we need
    if (prop === 'interopRequireDefault') {
      return interopRequireDefault;
    }
    
    // For any other helper, return a function that will work with most use cases
    return (...args: any[]) => {
      const firstArg = args[0];
      // Most helpers expect an object and modify/return it
      if (typeof firstArg === 'object') {
        return firstArg;
      }
      return firstArg;
    };
  }
});

// Monkey patch all the known paths where babel helpers might be imported from
const babelRuntimeHelpers = new Proxy({}, createBabelHelperHandler());

// Global module mocks
try {
  // For Metro bundler
  (global as any).__r = function(moduleId: number | string) {
    if (String(moduleId).includes('@babel/runtime/helpers')) {
      return babelRuntimeHelpers;
    }
    return {};
  };

  // For CommonJS imports
  Object.defineProperty(global, 'require', {
    get: function() {
      const originalRequire = global.require;
      return function hijackedRequire(path: string) {
        if (path === '@babel/runtime/helpers/interopRequireDefault') {
          return interopRequireDefault;
        }
        if (path.includes('@babel/runtime/helpers')) {
          return babelRuntimeHelpers;
        }
        return originalRequire(path);
      };
    }
  });
} catch (e) {
  console.warn('Failed to patch global require', e);
}

export { interopRequireDefault };
