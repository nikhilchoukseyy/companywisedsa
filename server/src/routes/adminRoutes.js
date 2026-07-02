const express = require('express');
const { requireAdmin } = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/dashboard', requireAdmin, (_request, response) => {
  return response.json({
    success: true,
    message: 'Admin access granted',
  });
});

module.exports = router;
