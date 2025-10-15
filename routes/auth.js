const express = require('express');
const bcrypt = require('bcrypt');
const repo = require('../lib/repo');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!['attendee', 'organizer'].includes(role)) throw new Error('Invalid role');
    const user = await repo.createUser({ name, email, password, role });
    req.session.userId = user._id;
    req.session.flash = { type: 'success', message: 'สมัครสมาชิกสำเร็จ' };
    res.redirect('/');
  } catch (err) {
    req.session.flash = { type: 'error', message: 'สมัครสมาชิกไม่สำเร็จ: ' + err.message };
    res.redirect('/register');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await repo.findUserByEmail(email);
    if (!user) {
      req.session.flash = { type: 'error', message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      return res.redirect('/login');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      req.session.flash = { type: 'error', message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      return res.redirect('/login');
    }
    req.session.userId = user._id;
    req.session.flash = { type: 'success', message: 'เข้าสู่ระบบสำเร็จ' };
    res.redirect('/');
  } catch (err) {
    req.session.flash = { type: 'error', message: 'เข้าสู่ระบบไม่สำเร็จ: ' + err.message };
    res.redirect('/login');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;