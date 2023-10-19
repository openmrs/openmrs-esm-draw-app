// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!@openmrs)"],
  moduleNameMapper: {
    "\\.(s?css)$": "identity-obj-proxy",
    "@openmrs/esm-framework": "@openmrs/esm-framework/mock",
    "^lodash-es/(.*)$": "lodash/$1",
    "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
    "^dexie$": require.resolve("dexie"),
  },
  setupFilesAfterEnv: [path.resolve(__dirname, "tools", "setup-tests.ts")],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
