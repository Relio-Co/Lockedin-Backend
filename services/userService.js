const { User } = require('../models');

async function getAllUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findOne({
      where: { user_id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ['user_id', 'email', 'email_notifications', 'name', 'private_account', 'profile_picture', 'push_notifications', 'username', 'uuid'],
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
      username: userData.username,
      uuid: userData.uid,
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

async function getUserByUid(uid) {
  try {
    const user = await User.findOne({ uid: uid });
    return user;
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    throw error;
  }
}

async function isUsernameTaken(username) {
  try {
    const user = await User.findOne({ where: { username } });
    return !!user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUid,
  createUser,
  updateUser,
  deleteUser,
  isUsernameTaken,
};
