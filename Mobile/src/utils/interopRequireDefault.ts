/**
 * This file provides a direct implementation of the interopRequireDefault helper
 * that is normally provided by @babel/runtime
 */

function interopRequireDefault(obj: any): { default: any; [key: string]: any } {
  return obj && obj.__esModule ? obj : { default: obj };
}

export default interopRequireDefault;
