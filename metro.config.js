const { getDefaultConfig } = require('expo/metro-config');
const { addLiveStoreDevtoolsMiddleware } = require('@livestore/devtools-expo');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

addLiveStoreDevtoolsMiddleware(config, { schemaPath: './lib/livestore.ts' });

module.exports = config; 