const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { buildUserDashboard } = require('../services/catalogService');
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

router.put('/me/solved/:questionId', requireAuth, async (request, response) => {
  const { questionId } = request.params;
  const solvedIds = new Set(request.user.solvedQuestionIds);
  solvedIds.add(questionId);
  request.user.solvedQuestionIds = Array.from(solvedIds);
  request.user.solvedActivity = [
    { questionId, solvedAt: new Date() },
    ...request.user.solvedActivity.filter((activity) => activity.questionId !== questionId),
  ].slice(0, 100);
  await request.user.save();

  return response.json({
    questionId,
    solved: true,
    solvedQuestionIds: request.user.solvedQuestionIds,
    dashboard: buildUserDashboard(request.user),
  });
});

router.delete('/me/solved/:questionId', requireAuth, async (request, response) => {
  const { questionId } = request.params;
  request.user.solvedQuestionIds = request.user.solvedQuestionIds.filter((id) => id !== questionId);
  request.user.solvedActivity = request.user.solvedActivity.filter(
    (activity) => activity.questionId !== questionId
  );
  await request.user.save();

  return response.json({
    questionId,
    solved: false,
    solvedQuestionIds: request.user.solvedQuestionIds,
    dashboard: buildUserDashboard(request.user),
  });
});

module.exports = router;
