const HttpError = require('../utils/httpError');

function normalizeQuestionId(questionId) {
  const normalized = String(questionId || '').trim();

  if (!normalized) {
    throw new HttpError(400, 'Question ID is required');
  }

  return normalized;
}

function buildProgress(user) {
  const solvedQuestionIds = Array.from(new Set(user.solvedQuestionIds || []));

  return {
    solvedQuestionIds,
    totalSolved: solvedQuestionIds.length,
  };
}

async function solveQuestion(user, questionId) {
  const normalizedQuestionId = normalizeQuestionId(questionId);
  const solvedIds = new Set(user.solvedQuestionIds || []);

  if (!solvedIds.has(normalizedQuestionId)) {
    solvedIds.add(normalizedQuestionId);
    user.solvedQuestionIds = Array.from(solvedIds);
  }

  user.solvedActivity = [
    { questionId: normalizedQuestionId, solvedAt: new Date() },
    ...(user.solvedActivity || []).filter((activity) => activity.questionId !== normalizedQuestionId),
  ].slice(0, 100);

  await user.save();

  return buildProgress(user);
}

async function unsolveQuestion(user, questionId) {
  const normalizedQuestionId = normalizeQuestionId(questionId);

  user.solvedQuestionIds = (user.solvedQuestionIds || []).filter(
    (id) => id !== normalizedQuestionId
  );
  user.solvedActivity = (user.solvedActivity || []).filter(
    (activity) => activity.questionId !== normalizedQuestionId
  );

  await user.save();

  return buildProgress(user);
}

function getProgress(user) {
  return buildProgress(user);
}

module.exports = {
  getProgress,
  solveQuestion,
  unsolveQuestion,
};
