const sequelize = require('../config/db');
const User = require('./userModel');
const Group = require('./groupModel');
const GroupMember = require('./groupMemberModel');
const FriendRequest = require('./friendRequestModel');
const Friend = require('./friendModel'); // Import the Friend model

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

// Add the Friend model association
User.belongsToMany(User, { through: Friend, as: 'Friends', foreignKey: 'user_id', otherKey: 'friend_user_id' });

const db = {
  sequelize,
  User,
  Group,
  GroupMember,
  FriendRequest,
  Friend, // Add Friend model to the db object
};

module.exports = db;
