const sequelize = require('../config/db');
const User = require('./userModel');
const Group = require('./groupModel');
const GroupMember = require('./groupMemberModel');
const FriendRequest = require('./friendRequestModel');
const Friend = require('./friendModel');
const Post = require('./postModel');
const Like = require('./likeModel');
const Comment = require('./commentModel');

// Define associations
User.hasMany(Group, { foreignKey: 'user_id', sourceKey: 'user_id' });
Group.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id' });

Group.hasMany(GroupMember, { foreignKey: 'group_id', sourceKey: 'group_id', as: 'GroupMembers' });
GroupMember.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'group_id' });

User.hasMany(GroupMember, { foreignKey: 'user_id', sourceKey: 'user_id' });
GroupMember.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id' });

User.hasMany(FriendRequest, { foreignKey: 'sender_id', as: 'SentRequests' });
User.hasMany(FriendRequest, { foreignKey: 'receiver_id', as: 'ReceivedRequests' });
FriendRequest.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' });
FriendRequest.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });

User.hasMany(Post, { foreignKey: 'created_by', sourceKey: 'uuid' });
Post.belongsTo(User, { foreignKey: 'created_by', targetKey: 'uuid' });

Group.hasMany(Post, { foreignKey: 'group_id', as: 'Posts' });
Post.belongsTo(Group, { foreignKey: 'group_id' });

User.belongsToMany(User, { through: Friend, as: 'Friends', foreignKey: 'user_id', otherKey: 'friend_user_id' });
Friend.belongsTo(User, { as: 'UserFriend', foreignKey: 'friend_user_id' });

User.hasMany(Like, { foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Like, { foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

const db = {
  sequelize,
  User,
  Group,
  GroupMember,
  FriendRequest,
  Friend,
  Post,
  Like,
  Comment,
};

module.exports = db;
