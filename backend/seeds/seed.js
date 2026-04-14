#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const { seedUsers } = require('./seedData');
const logger = require('../utils/logger');

const runSeed = async () => {
  try {
    // Connect to MongoDB
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('Connected successfully');

    // Run seed
    await seedUsers();

    // Disconnect
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    logger.error('Seed script failed:', error.message);
    process.exit(1);
  }
};

runSeed();
