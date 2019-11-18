module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: { sourceType: 'module' },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  extends: 'eslint:recommended',
  plugins: ['html'],
  rules: {
    /* 'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
        semi: true
      }
    ], */
    'no-console': 'off'
  }
};
