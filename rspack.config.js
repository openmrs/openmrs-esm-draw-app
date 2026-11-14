const config = require('openmrs/default-rspack-config');
const path = require('path');

// The 244 KiB asset-size budget rspack warns about isn't meaningful for O3
// modules: framework + Carbon design system push every bundle past it, so the
// hint just adds noise on every build. Disable it.
config.overrides.performance = { hints: false };

const reconcilerDir = path.dirname(require.resolve('react-reconciler/package.json'));

config.additionalConfig.resolve = {
  alias: {
    'react-reconciler$': path.join(reconcilerDir, 'cjs/react-reconciler.production.min.js'),
    'react-reconciler/constants.js': path.join(reconcilerDir, 'cjs/react-reconciler-constants.production.min.js'),
  },
};

module.exports = config;
