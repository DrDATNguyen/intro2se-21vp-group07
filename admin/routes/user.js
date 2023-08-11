const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

router.get('/pending-users', adminController.getPendingUsers);
router.post('/approve-user/:id', adminController.approveUser);

module.exports = router;
