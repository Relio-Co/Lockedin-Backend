const Group = require('../models/groupModel');

const getAllGroups = async () => {
  return Group.findAll();
};

module.exports = {
  getAllGroups,
};
