const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  email_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  name: {
    type: DataTypes.STRING(255),
  },
  private_account: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  profile_picture: {
    type: DataTypes.STRING(255),
  },
  push_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  username: {
    type: DataTypes.STRING(128), // Ensure the length accommodates Firebase UID
    allowNull: false,
    unique: true,
  },
  uuid: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: true,
  },
}, {
  indexes: [
    {
      name: 'idx_username',
      unique: false,
      fields: ['username']
    }
  ],
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
