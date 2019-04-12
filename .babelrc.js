const isTest = process.env.NODE_ENV === 'test';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: isTest ? 'commonjs' : false,
        loose: true,
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
