/**
 * Babel plugin to add interopRequireDefault import to every file that might need it
 */
module.exports = function() {
  return {
    visitor: {
      Program(path, state) {
        // Skip files that are already importing our polyfill
        if (path.node.body.some(node => 
          node.type === 'ImportDeclaration' && 
          (node.source.value === './src/utils/babelRuntimePatch' || 
           node.source.value === './src/utils/interopRequireDefault')
        )) {
          return;
        }

        // Add import for interopRequireDefault where needed
        const needsPolyfill = path.node.body.some(node =>
          node.type === 'ImportDeclaration' && 
          node.source.value.startsWith('@babel/runtime')
        );

        if (needsPolyfill) {
          path.unshiftContainer('body', {
            type: 'ImportDeclaration',
            specifiers: [],
            source: {
              type: 'StringLiteral',
              value: '../utils/babelRuntimePatch',
            },
          });
        }
      }
    }
  };
};
