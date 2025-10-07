// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: false,
};

module.exports = config;