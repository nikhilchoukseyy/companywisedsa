const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

async function requireAuth(request, response, next) {
  const token = request.cookies?.token;

  if (!token) {
    return response.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.userId);

    if (!user) {
      return response.status(401).json({ message: 'User session is no longer valid' });
    }

    request.user = user;
    return next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid session token' });
  }
}

module.exports = {
  requireAuth,
};
