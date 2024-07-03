const userService = require('../services/userService');

async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function createUser(req, res, next) {
  try {
    const { email, uid, username } = req.body;
    const newUser = await userService.createUser({ email, uid, username });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const userData = req.body;
    const updatedUser = await userService.updateUser(userId, userData);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

async function updateUserSettings(req, res, next) {
  try {
    const userId = req.user.uid; // Assuming user ID is available in req.user.uid
    const userSettings = req.body;
    const updatedUser = await userService.updateUser(userId, userSettings);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function validateAndCreateUser(req, res) {
  try {
    const { uid, email, username } = req.user; // Get from the decoded token
    let user = await userService.getUserByUid(uid);

    if (!user) {
      user = await userService.createUser({ email, username: email.split('@')[0], uid }); // Use email prefix as username
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error validating/creating user:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserSettings,
  deleteUser,
  validateAndCreateUser, // Ensure this is exported
};
