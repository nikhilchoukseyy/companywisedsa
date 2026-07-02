const { OAuth2Client } = require('google-auth-library');
const config = require('../config');
const HttpError = require('../utils/httpError');

let client;

function getGoogleClient() {
  if (!config.googleClientId) {
    throw new HttpError(500, 'Google sign-in is not configured');
  }

  if (!client) {
    client = new OAuth2Client(config.googleClientId);
  }

  return client;
}

async function verifyGoogleToken(idToken) {
  if (!idToken) {
    throw new HttpError(400, 'Google ID token is required');
  }

  const oauthClient = getGoogleClient();
  const ticket = await oauthClient.verifyIdToken({
    idToken,
    audience: config.googleClientId,
  });

  return ticket.getPayload();
}

module.exports = {
  verifyGoogleToken,
};
