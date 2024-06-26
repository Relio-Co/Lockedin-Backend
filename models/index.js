const sequelize = require('../config/db');
const User = require('./userModel');
const Group = require('./groupModel');

const db = {
  sequelize,
  User,
  Group,
};

module.exports = db;
