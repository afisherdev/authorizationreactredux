const passport = require('passport');

module.exports = app => {
  // ============ Google Login Routes
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));
  // ============ END GOOGLE LOGIN ROUTES
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
