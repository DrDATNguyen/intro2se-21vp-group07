const express = require('express');
const adminController = require('../controllers/admin.controller');
const router = express.Router();

router.get('/tablespending', adminController.gettablespendingUser);
router.post('/tablespending/:id', adminController.approvetablespendingUser);

module.exports = router;
