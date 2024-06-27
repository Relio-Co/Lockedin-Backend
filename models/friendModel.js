const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Friend = sequelize.define('Friend', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  friend_user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  friend_since: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'friends',
  timestamps: false,
});

module.exports = Friend;
