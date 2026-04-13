// Re-export the package `mock` entry so Jest resolves the package's require
// mock (mock-jest) via package exports. This avoids importing the ESM
// `import` mock file directly.
module.exports = require('@openmrs/esm-framework/mock');
