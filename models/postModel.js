const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
  post_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  group_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'groups',
      key: 'group_id',
    },
  },
  caption: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_by: {
    type: DataTypes.STRING,
  },
  created_by_username: {
    type: DataTypes.STRING(255),
  },
  image_url: {
    type: DataTypes.STRING(255),
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'group_posts',
  timestamps: false,
});

module.exports = Post;
