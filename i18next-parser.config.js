// i18next-parser configuration
// See: https://github.com/i18next/i18next-parser#options

module.exports = {
    createOldCatalogs: false,
    defaultNamespace: 'translation',
    defaultValue: '',
    indentation: 2,
    keepRemoved: false,
    keySeparator: false,
    lexers: {
        ts: ['JavascriptLexer'],
        tsx: ['JsxLexer'],
    },
    lineEnding: 'auto',
    locales: ['en'],
    namespaceSeparator: false,
    output: 'translations/$LOCALE.json',
    pluralSeparator: '_',
    input: ['src/**/*.component.tsx'],
    sort: true,
    verbose: false,
    failOnWarnings: false,
    failOnUpdate: false,
    customValueTemplate: null,
    resetDefaultValueLocale: null,
    i18nextOptions: null,
};
