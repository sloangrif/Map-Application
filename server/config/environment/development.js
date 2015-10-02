'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: process.env.PROD_MONGODB || 'mongodb://localhost/mapn-dev'
  },

  seedDB: true
};
