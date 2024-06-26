const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.get('/', groupController.getAllGroups);
router.post('/join/:groupId', groupController.joinGroup);

module.exports = router;
