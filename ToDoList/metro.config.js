const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList'); 

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
      blacklistRE: exclusionList([/node_modules\/.*\/node_modules\/.*/]), // Ignore nested `node_modules`
    },
    watchFolders: [
      __dirname, // Watch project root
    ],
    transformer: {
      // Enable lazy dependency loading to reduce file watching load
        enableBabelRCLookup: false,
        enableBabelRuntime: false,
    },
    server: {
        port: 8081,
    },
    maxWorkers: Math.max(1, require('os').cpus().length - 1), // Optimize worker threads
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
