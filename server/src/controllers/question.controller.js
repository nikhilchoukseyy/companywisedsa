const {
  getProgress,
  solveQuestion,
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

module.exports = {
  getQuestionProgress,
  markSolved,
  markUnsolved,
};
