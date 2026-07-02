const express = require('express');
const { requireAuth } = require('../middleware/auth');
const {
  markBookmarked,
  markUnbookmarked,
  markSolved,
  markUnsolved,
} = require('../controllers/question.controller');

const router = express.Router();

router.post('/:questionId/solve', requireAuth, markSolved);
router.delete('/:questionId/solve', requireAuth, markUnsolved);
router.post('/:questionId/bookmark', requireAuth, markBookmarked);
router.delete('/:questionId/bookmark', requireAuth, markUnbookmarked);

module.exports = router;
