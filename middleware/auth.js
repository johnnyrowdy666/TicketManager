const repo = require('../lib/repo');

async function attachUser(req, res, next) {
  if (!req.session.userId) {
    res.locals.currentUser = null;
    return next();
  }
  const user = await repo.getUserById(req.session.userId);
  req.user = user || null;
  res.locals.currentUser = user || null;
  next();
}

function ensureAuth(req, res, next) {
  if (!req.session.userId) {
    req.session.flash = { type: 'warning', message: 'กรุณาเข้าสู่ระบบก่อน' };
    return res.redirect('/login');
  }
  next();
}

function ensureRole(role) {
  return (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    if (!req.user || req.user.role !== role) return res.status(403).send('Forbidden');
    next();
  };
}

module.exports = { attachUser, ensureAuth, ensureRole };