const express = require('express');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/requireAdmin');
const { loadCatalog } = require('../services/catalogService');

const router = express.Router();

router.get('/dashboard', requireAdmin, async (_request, response) => {
  const catalog = loadCatalog();
  const users = await User.find({}, { solvedQuestionIds: 1, bookmarkedQuestionIds: 1 }).lean();
  const [totalUsers, totalAdmins] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'admin' }),
  ]);

  const solvedQuestions = users.reduce(
    (total, currentUser) => total + (currentUser.solvedQuestionIds?.length || 0),
    0
  );
  const bookmarkedQuestions = users.reduce(
    (total, currentUser) => total + (currentUser.bookmarkedQuestionIds?.length || 0),
    0
  );

  return response.json({
    success: true,
    message: 'Admin access granted',
    stats: {
      users: totalUsers,
      admins: totalAdmins,
      companies: catalog.companies.length,
      questions: catalog.totalUniqueQuestions,
      reviews: 0,
      feedback: 0,
      bookmarks: bookmarkedQuestions,
      solvedQuestions,
      compilerRuns: 0,
    },
  });
});

module.exports = router;
