module.exports = {
  contextSeparator: '_',
  keySeparator: false,
  namespaceSeparator: false,
  pluralSeparator: false,
  defaultNamespace: 'translation',
  useKeysAsDefaultValue: true,
  lexers: {
    js: ['JsxLexer'],
    ts: ['JavascriptLexer'],
    jsx: ['JsxLexer'],
    tsx: ['JsxLexer'],
  },
  locales: ['en', 'ru'],
  output: './src/shared/config/locales/$LOCALE/$NAMESPACE.json',
  input: ['./src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
  sort: true,
  verbose: true,
};
