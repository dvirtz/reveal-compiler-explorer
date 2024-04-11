const fs = require('fs');

/** @type {import('jest').Config} */
const config = {
  projects: fs.readdirSync('packages').map(dir => ({
    displayName: dir,
    rootDir: `<rootDir>/packages/${dir}`,
    testMatch: ["<rootDir>/test/*.test.?(c|m)js"],    
    testTimeout: process.env.DEBUG_MODE ? 999999 : 5000,
    transform: {},
    testEnvironmentOptions: {
      rootDir: `<rootDir>/packages/${dir}`
    },
  })),
};

module.exports = config;

