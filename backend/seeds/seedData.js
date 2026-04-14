const mongoose = require('mongoose');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Seed database with sample users
 * Run with: node scripts/seed.js
 */
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    logger.info('Cleared existing users');

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'Admin@123456789', // Change in production!
      role: 'admin',
      status: 'active',
    });
    await adminUser.save();
    logger.info(`Created admin user: ${adminUser.email}`);

    // Create manager user
    const managerUser = new User({
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@test.com',
      password: 'Manager@123456789', // Change in production!
      role: 'manager',
      status: 'active',
      createdBy: adminUser._id,
    });
    await managerUser.save();
    logger.info(`Created manager user: ${managerUser.email}`);

    // Create regular user
    const regularUser = new User({
      firstName: 'Ankit',
      lastName: 'Mishra',
      email: 'ankit@test.com',
      password: 'Ankit@12345678', // Change in production!
      role: 'user',
      status: 'active',
      createdBy: adminUser._id,
    });
    await regularUser.save();
    logger.info(`Created regular user: ${regularUser.email}`);

    // Create additional test users
    const testUsers = [
      {
        firstName: 'Keshav',
        lastName: 'Karn',
        email: 'keshav@test.com',
        password: 'Keshav@12345678',
        role: 'user',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        firstName: 'Kailash',
        lastName: 'Kumar',
        email: 'kailash@test.com',
        password: 'Kailash@123456789',
        role: 'manager',
        status: 'active',
        createdBy: adminUser._id,
      },
      {
        firstName: 'Yash',
        lastName: 'Patidar',
        email: 'yash@test.com',
        password: 'Yash@12345678',
        role: 'user',
        status: 'inactive',
        createdBy: adminUser._id,
      },
    ];

    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      logger.info(`Created user: ${user.email}`);
    }

    logger.info('Database seeding completed successfully');
    return true;
  } catch (error) {
    logger.error('Database seeding failed:', error.message);
    throw error;
  }
};

module.exports = { seedUsers };
