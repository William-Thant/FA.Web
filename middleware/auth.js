function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  if (req.user.role !== 'admin') {
    return res.status(403).render('error', { message: 'Admins only', error: { status: 403 } });
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin
};
