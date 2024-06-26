// models/groupModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Group = sequelize.define('Group', {
  group_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  picture_url: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'groups',
  timestamps: false,
});

module.exports = Group;
