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
  },
  public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
}, {
  tableName: 'groups',
  timestamps: false,
});

module.exports = Group;
