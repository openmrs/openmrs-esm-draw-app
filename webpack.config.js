const config = require("openmrs/default-webpack-config");
const webpack = require("webpack");

config.additionalConfig.resolve = {
  fallback: {
    path: require.resolve("path-browserify"),
  },
};

config.additionalConfig.ignoreWarnings = [
  /export .* was not found in/,
  /Critical dependency: the request of a dependency is an expression/,
];

module.exports = config;
