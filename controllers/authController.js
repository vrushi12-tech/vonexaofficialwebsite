const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: "Admin Login",
    errorMessage: req.session.loginError || null
  });
  req.session.loginError = null;
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.log('ADMIN_EMAIL or ADMIN_PASSWORD_HASH missing from .env');
    req.session.loginError = 'Server is not configured for login yet.';
    return res.redirect('/login');
  }

  if (email !== adminEmail) {
    req.session.loginError = 'Invalid email or password.';
    return res.redirect('/login');
  }

  bcrypt.compare(password, adminPasswordHash)
    .then((match) => {
      if (!match) {
        req.session.loginError = 'Invalid email or password.';
        return res.redirect('/login');
      }

      req.session.isLoggedIn = true;
      req.session.save((err) => {
        if (err) console.log(err);
        res.redirect('/services');
      });
    })
    .catch((err) => {
      console.log(err);
      req.session.loginError = 'Something went wrong. Try again.';
      res.redirect('/login');
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/login');
  });
};
