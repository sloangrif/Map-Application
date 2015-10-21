'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: process.env.TEST_MONGODB || 'mongodb://localhost/mapn-test'
  }
};
