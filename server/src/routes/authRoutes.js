const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { findOrCreateGoogleUser } = require('../services/auth.service');
const { buildUserDashboard } = require('../services/catalogService');
const config = require('../config');
const HttpError = require('../utils/httpError');
const { validateLogin, validateRegister } = require('../utils/validation');

const router = express.Router();

function setAuthCookie(response, userId) {
  const token = jwt.sign({ userId }, config.jwtSecret, { expiresIn: '30d' });

  response.cookie('token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: config.nodeEnv === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
}

function clearAuthCookie(response) {
  [
    { path: '/' },
    { path: '/api/auth' },
  ].forEach((cookieOptions) => {
    response.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.nodeEnv === 'production',
      ...cookieOptions,
    });
  });
}

function buildAuthResponse(user) {
  const dashboard = buildUserDashboard(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
      createdAt: user.createdAt,
      solvedQuestionIds: user.solvedQuestionIds,
      bookmarkedQuestionIds: user.bookmarkedQuestionIds,
    },
    dashboard,
  };
}

router.post('/register', async (request, response) => {
  const { name, email, password } = validateRegister(request.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  setAuthCookie(response, user._id.toString());
  return response.status(201).json(buildAuthResponse(user));
});

router.post('/login', async (request, response) => {
  const { email, password } = validateLogin(request.body);

  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new HttpError(401, 'Invalid email or password');
  }

  setAuthCookie(response, user._id.toString());
  return response.json(buildAuthResponse(user));
});

router.post('/google', async (request, response) => {
  const idToken = request.body.idToken || request.body.credential;
  const user = await findOrCreateGoogleUser(idToken);

  setAuthCookie(response, user._id.toString());
  return response.json(buildAuthResponse(user));
});

router.post('/logout', (_request, response) => {
  clearAuthCookie(response);
  return response.status(204).send();
});

router.get('/me', requireAuth, async (request, response) => {
  return response.json(buildAuthResponse(request.user));
});

module.exports = router;
