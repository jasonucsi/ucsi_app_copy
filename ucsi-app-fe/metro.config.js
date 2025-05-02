// metro.config.js
const exclusionList = require("metro-config/src/defaults/exclusionList");

module.exports = {
  resolver: {
    blacklistRE: exclusionList([
      /node_modules[/\\]react[/\\]dist[/\\].*/,
      /node_modules[/\\]react-native[/\\]dist[/\\].*/,
      /node_modules[/\\]@react-native-community[/\\]netinfo[/\\].*/,
    ]),
  },
};
