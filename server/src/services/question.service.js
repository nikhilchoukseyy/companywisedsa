const HttpError = require('../utils/httpError');
const { loadCatalog } = require('./catalogService');

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

function buildBookmarkProgress(user) {
  const bookmarkedQuestionIds = Array.from(new Set(user.bookmarkedQuestionIds || []));

  return {
    bookmarkedQuestionIds,
    totalBookmarked: bookmarkedQuestionIds.length,
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

async function bookmarkQuestion(user, questionId) {
  const normalizedQuestionId = normalizeQuestionId(questionId);
  const bookmarkedIds = new Set(user.bookmarkedQuestionIds || []);

  if (!bookmarkedIds.has(normalizedQuestionId)) {
    bookmarkedIds.add(normalizedQuestionId);
    user.bookmarkedQuestionIds = Array.from(bookmarkedIds);
  }

  user.bookmarkedActivity = [
    { questionId: normalizedQuestionId, bookmarkedAt: new Date() },
    ...(user.bookmarkedActivity || []).filter((activity) => activity.questionId !== normalizedQuestionId),
  ].slice(0, 100);

  await user.save();

  return buildBookmarkProgress(user);
}

async function unbookmarkQuestion(user, questionId) {
  const normalizedQuestionId = normalizeQuestionId(questionId);

  user.bookmarkedQuestionIds = (user.bookmarkedQuestionIds || []).filter(
    (id) => id !== normalizedQuestionId
  );
  user.bookmarkedActivity = (user.bookmarkedActivity || []).filter(
    (activity) => activity.questionId !== normalizedQuestionId
  );

  await user.save();

  return buildBookmarkProgress(user);
}

function getBookmarkProgress(user) {
  return buildBookmarkProgress(user);
}

function getBookmarkedQuestions(user) {
  const catalog = loadCatalog();
  const bookmarkedIds = new Set(user.bookmarkedQuestionIds || []);
  const activityOrder = new Map(
    (user.bookmarkedActivity || []).map((activity, index) => [activity.questionId, index])
  );

  return Array.from(bookmarkedIds)
    .map((questionId) => {
      const question = catalog.questionsById.get(questionId);

      if (!question) {
        return null;
      }

      const bookmarkActivity = (user.bookmarkedActivity || []).find(
        (activity) => activity.questionId === questionId
      );

      return {
        questionId,
        title: question.title,
        difficulty: question.difficulty,
        link: question.link,
        companies: question.companies,
        bookmarkedAt: bookmarkActivity?.bookmarkedAt || null,
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftOrder = activityOrder.has(left.questionId)
        ? activityOrder.get(left.questionId)
        : Number.MAX_SAFE_INTEGER;
      const rightOrder = activityOrder.has(right.questionId)
        ? activityOrder.get(right.questionId)
        : Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.title.localeCompare(right.title);
    });
}

module.exports = {
  bookmarkQuestion,
  getBookmarkProgress,
  getBookmarkedQuestions,
  getProgress,
  solveQuestion,
  unbookmarkQuestion,
  unsolveQuestion,
};
