const userModel = require('../models/userModel');

exports.showLogin = function(req, res) {
  res.render('auth/login', { title: 'Sign in', error: null });
};

exports.login = async function(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render('auth/login', { title: 'Sign in', error: 'Email and password are required.' });
    }

    const user = await userModel.verifyUser(email.trim().toLowerCase(), password);
    if (!user) {
      return res.status(401).render('auth/login', { title: 'Sign in', error: 'Invalid credentials.' });
    }

    res.cookie('user', JSON.stringify(user), { httpOnly: false, sameSite: true });
    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

exports.showRegister = function(req, res) {
  res.render('auth/register', { title: 'Create account', error: null });
};

exports.register = async function(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).render('auth/register', { title: 'Create account', error: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).render('auth/register', { title: 'Create account', error: 'Password must be at least 6 characters.' });
    }

    const validRoles = ['buyer', 'dealer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).render('auth/register', { title: 'Create account', error: 'Invalid role selected.' });
    }

    const existing = await userModel.findByEmail(email.trim().toLowerCase());
    if (existing) {
      return res.status(409).render('auth/register', { title: 'Create account', error: 'An account with that email already exists.' });
    }

    const user = await userModel.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role
    });

    res.cookie('user', JSON.stringify(user), { httpOnly: false, sameSite: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

exports.logout = function(req, res) {
  res.clearCookie('user');
  res.redirect('/');
};
