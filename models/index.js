const sequelize = require('../config/db');
const User = require('./userModel');
const Group = require('./groupModel');

User.hasMany(Group, { foreignKey: 'user_id', sourceKey: 'user_id' });
Group.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id' });

const db = {
  sequelize,
  User,
  Group,
};

module.exports = db;
