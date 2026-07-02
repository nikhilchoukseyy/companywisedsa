const HttpError = require('./httpError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIFFICULTIES = new Set(['ALL', 'EASY', 'MEDIUM', 'HARD']);
const LANGUAGES = new Set(['python', 'javascript', 'cpp', 'java']);

function cleanString(value) {
  return String(value || '').trim();
}

function validateRegister(body) {
  const name = cleanString(body.name);
  const email = cleanString(body.email).toLowerCase();
  const password = String(body.password || '');

  if (name.length < 2 || name.length > 80) {
    throw new HttpError(400, 'Name must be between 2 and 80 characters');
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new HttpError(400, 'Enter a valid email address');
  }

  if (password.length < 6 || password.length > 128) {
    throw new HttpError(400, 'Password must be between 6 and 128 characters');
  }

  return { name, email, password };
}

function validateLogin(body) {
  const email = cleanString(body.email).toLowerCase();
  const password = String(body.password || '');

  if (!EMAIL_REGEX.test(email) || !password) {
    throw new HttpError(400, 'Email and password are required');
  }

  return { email, password };
}

function validatePreferences(body) {
  const preferences = {};

  if (body.lastCompany !== undefined) {
    preferences.lastCompany = cleanString(body.lastCompany).slice(0, 120);
  }

  if (body.lastFile !== undefined) {
    preferences.lastFile = cleanString(body.lastFile).slice(0, 120) || '5. All.csv';
  }

  if (body.difficultyFilter !== undefined) {
    const difficulty = cleanString(body.difficultyFilter).toUpperCase();
    if (!DIFFICULTIES.has(difficulty)) {
      throw new HttpError(400, 'Invalid difficulty filter');
    }
    preferences.difficultyFilter = difficulty;
  }

  if (body.searchText !== undefined) {
    preferences.searchText = cleanString(body.searchText).slice(0, 120);
  }

  if (body.currentPage !== undefined) {
    const currentPage = Number(body.currentPage);
    if (!Number.isInteger(currentPage) || currentPage < 1) {
      throw new HttpError(400, 'Current page must be a positive number');
    }
    preferences.currentPage = currentPage;
  }

  if (body.pageSize !== undefined) {
    const pageSize = Number(body.pageSize);
    if (!Number.isInteger(pageSize) || pageSize < 10 || pageSize > 100) {
      throw new HttpError(400, 'Page size must be between 10 and 100');
    }
    preferences.pageSize = pageSize;
  }

  if (body.preferredLanguage !== undefined) {
    const language = cleanString(body.preferredLanguage);
    if (!LANGUAGES.has(language)) {
      throw new HttpError(400, 'Invalid preferred language');
    }
    preferences.preferredLanguage = language;
  }

  return preferences;
}

module.exports = {
  validateLogin,
  validatePreferences,
  validateRegister,
};
