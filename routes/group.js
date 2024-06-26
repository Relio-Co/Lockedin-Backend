// routes/Group.js
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.get('/', groupController.getAllGroups);
router.post('/join/:groupId', authenticateToken, groupController.joinGroup);
router.get('/user-groups', authenticateToken, groupController.getUserGroups);

module.exports = router;
