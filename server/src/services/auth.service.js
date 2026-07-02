const User = require('../models/User');
const HttpError = require('../utils/httpError');
const { verifyGoogleToken } = require('./googleAuth.service');

async function findOrCreateGoogleUser(idToken) {
  const payload = await verifyGoogleToken(idToken);
  const { email, email_verified: emailVerified, name, picture, sub: googleId } = payload;

  if (!email) {
    throw new HttpError(401, 'Google account did not provide an email address');
  }

  if (!emailVerified) {
    throw new HttpError(401, 'Google email is not verified');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    user.googleId = user.googleId || googleId;
    user.avatar = picture || user.avatar;

    if (!user.name && name) {
      user.name = name;
    }

    if (!user.authProvider) {
      user.authProvider = 'google';
    }

    await user.save();
    return user;
  }

  user = await User.create({
    name: name || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    googleId,
    avatar: picture || '',
    authProvider: 'google',
  });

  return user;
}

module.exports = {
  findOrCreateGoogleUser,
};
