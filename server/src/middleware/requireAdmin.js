const { requireAuth } = require('./auth');

function requireAdmin(request, response, next) {
  return requireAuth(request, response, () => {
    if ((request.user?.role || 'user') !== 'admin') {
      return response.status(403).json({ message: 'Admin access required' });
    }

    return next();
  });
}

module.exports = {
  requireAdmin,
};
