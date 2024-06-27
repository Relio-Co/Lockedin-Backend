const { User, Group } = require('../models');

async function getAllUsers() {
  try {
    const users = await User.findAll({
      include: [{ model: Group }]
    });
    return users;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findOne({
      where: { user_id: userId },
      include: [{ model: Group }]
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
}

async function createUser(userData) {
  try {
    const newUser = await User.create({
      ...userData,
      username: userData.uid, // Use the Firebase UID as the username
    });
    return newUser;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, userData) {
  try {
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(userData);
    return user;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId) {
  try {
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
