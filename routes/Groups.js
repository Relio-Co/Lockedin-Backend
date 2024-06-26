const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.get('/', groupController.getAllGroups);
router.get('/user-groups', groupController.getGroupsByUserId); // New route to get groups by user
router.post('/join/:groupId', groupController.joinGroup);

module.exports = router;
