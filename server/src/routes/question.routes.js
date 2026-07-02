const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  markSolved,
  markUnsolved,
} = require('../controllers/question.controller');

const router = express.Router();

router.post('/:questionId/solve', requireAuth, markSolved);
router.delete('/:questionId/solve', requireAuth, markUnsolved);

module.exports = router;
