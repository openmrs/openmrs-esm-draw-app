// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  transform: {
    "^.+\\.m?[jt]sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2022",
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  // Transform ESM deps we rely on (framework and some ESM packages).
  transformIgnorePatterns: ["/node_modules/(?!(@openmrs|lodash-es|any-date-parser|.+\\.pnp\.[^\\/]+$))/"],
  moduleNameMapper: {
    "\\.(s?css)$": "identity-obj-proxy",
    // Explicitly map @openmrs mock subpaths to their Jest-specific files
    // so Jest loads the CommonJS-friendly mocks (mock-jest files).
    "^@openmrs/esm-framework/mock$": "<rootDir>/node_modules/@openmrs/esm-framework/mock-jest.tsx",
    "^@openmrs/esm-api/mock$": "<rootDir>/node_modules/@openmrs/esm-api/mock-jest.ts",
    "^@openmrs/esm-state/mock$": "<rootDir>/node_modules/@openmrs/esm-state/mock-jest.ts",
    "^@openmrs/esm-util/mock$": "<rootDir>/node_modules/@openmrs/esm-util/mock-jest.ts",
    "^lodash-es/(.*)$": "lodash/$1",
    "^dexie$": require.resolve("dexie"),
  },
  setupFilesAfterEnv: [path.resolve(__dirname, "tools", "setup-tests.ts")],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};
