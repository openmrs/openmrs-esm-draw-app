// Re-export the package `mock` entry so Jest resolves the package's require
// mock (mock-jest) via package exports.
module.exports = require('@openmrs/esm-api/mock');
