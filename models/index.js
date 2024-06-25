// models/index.js
const sequelize = require('../config/db');
const User = require('./UserModel');

const db = {
  sequelize,
  User,
};

module.exports = db;
