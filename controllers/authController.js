exports.showLogin = function(req, res) {
  res.render('auth/login', { title: 'Sign in' });
};

exports.login = function(req, res) {
  const { name, role } = req.body;
  const safeName = name && name.trim() ? name.trim() : 'Guest';
  const user = { name: safeName, role: role || 'user' };
  res.cookie('user', JSON.stringify(user), { httpOnly: false, sameSite: true });
  res.redirect('/');
};

exports.logout = function(req, res) {
  res.clearCookie('user');
  res.redirect('/');
};
