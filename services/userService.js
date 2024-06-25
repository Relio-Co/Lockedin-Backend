const { User } = require('../models');

async function getAllUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllUsers,
};
