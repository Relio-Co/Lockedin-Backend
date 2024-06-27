const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();

router.get('/', groupController.getAllGroups);
router.post('/join/:groupId', groupController.joinGroup);

module.exports = router;
