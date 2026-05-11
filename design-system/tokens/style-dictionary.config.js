module.exports = {
  source: ['source/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: true,
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/esm',
        },
      ],
    },
  },
};
