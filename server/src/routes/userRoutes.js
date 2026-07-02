const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { buildUserDashboard } = require('../services/catalogService');
const { getQuestionProgress, markSolved, markUnsolved } = require('../controllers/question.controller');
const { validatePreferences } = require('../utils/validation');

const router = express.Router();

function buildUserPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    preferences: user.preferences,
    solvedQuestionIds: user.solvedQuestionIds,
    createdAt: user.createdAt,
  };
}

router.get('/me/dashboard', requireAuth, async (request, response) => {
  return response.json({
    user: buildUserPayload(request.user),
    dashboard: buildUserDashboard(request.user),
  });
});

router.get('/progress', requireAuth, getQuestionProgress);

router.patch('/me/preferences', requireAuth, async (request, response) => {
  const preferences = validatePreferences(request.body);

  Object.entries(preferences).forEach(([key, value]) => {
    request.user.preferences[key] = value;
  });

  await request.user.save();

  return response.json({
    preferences: request.user.preferences,
  });
});

router.put('/me/solved/:questionId', requireAuth, markSolved);

router.delete('/me/solved/:questionId', requireAuth, markUnsolved);

module.exports = router;
