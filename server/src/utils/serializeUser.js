function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    picture: user.avatar || '',
    avatar: user.avatar || '',
    role: user.role || 'user',
  };
}

module.exports = {
  serializeUser,
};
