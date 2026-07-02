const {
  bookmarkQuestion,
  getBookmarkProgress,
  getBookmarkedQuestions,
  getProgress,
  solveQuestion,
  unbookmarkQuestion,
  unsolveQuestion,
} = require('../services/question.service');

async function markSolved(request, response) {
  const progress = await solveQuestion(request.user, request.params.questionId);

  return response.json({
    success: true,
    progress,
  });
}

async function markUnsolved(request, response) {
  const progress = await unsolveQuestion(request.user, request.params.questionId);

  return response.json({
    success: true,
    progress,
  });
}

async function getQuestionProgress(request, response) {
  return response.json(getProgress(request.user));
}

async function markBookmarked(request, response) {
  const progress = await bookmarkQuestion(request.user, request.params.questionId);

  return response.json({
    success: true,
    progress,
  });
}

async function markUnbookmarked(request, response) {
  const progress = await unbookmarkQuestion(request.user, request.params.questionId);

  return response.json({
    success: true,
    progress,
  });
}

async function getQuestionBookmarks(request, response) {
  return response.json({
    ...getBookmarkProgress(request.user),
    bookmarkedQuestions: getBookmarkedQuestions(request.user),
  });
}

module.exports = {
  getQuestionBookmarks,
  getQuestionProgress,
  markBookmarked,
  markUnbookmarked,
  markSolved,
  markUnsolved,
};
