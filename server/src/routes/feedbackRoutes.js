const express = require('express');
const rateLimit = require('express-rate-limit');
const { sendFeedbackEmail } = require('../services/email.service');
const { validateFeedback } = require('../utils/validation');

const router = express.Router();

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many feedback submissions. Please try again later.' },
});

router.post('/', feedbackLimiter, async (request, response) => {
  const feedback = validateFeedback(request.body);

  await sendFeedbackEmail(feedback);

  return response.status(201).json({
    message: 'Feedback sent successfully',
  });
});

module.exports = router;
