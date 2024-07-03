const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();

router.get('/', groupController.getAllGroups);
router.get('/subscribed', groupController.getSubscribedGroups);
router.get('/:groupId', groupController.getGroupById);
router.post('/join/:groupId', groupController.joinGroup);

module.exports = router;
