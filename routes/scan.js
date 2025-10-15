const express = require('express');
const { ensureRole } = require('../middleware/auth');
const router = express.Router();

router.get('/scan', ensureRole('organizer'), (req, res) => {
  res.render('scan');
});

module.exports = router;