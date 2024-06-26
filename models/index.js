// models/index.js
const sequelize = require('../config/db');
const User = require('./userModel');

const db = {
  sequelize,
  User,
};

module.exports = db;
