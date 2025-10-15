const express = require('express');
const { ensureAuth } = require('../middleware/auth');
const repo = require('../lib/repo');
const router = express.Router();

router.get('/profile', ensureAuth, async (req, res) => {
  const orders = await repo.listOrdersByUser(req.user._id);
  // ในโหมดหน่วยความจำ ให้ map event ข้อมูลเข้ารายการ
  const enriched = await Promise.all(
    orders.map(async (o) => {
      const eventId = (o.eventId && o.eventId._id) ? o.eventId._id : o.eventId;
      const ev = await repo.getEventById(eventId);
      const base = (typeof o.toObject === 'function') ? o.toObject() : o;
      return { ...base, event: ev };
    })
  );
  res.render('profile', { orders: enriched });
});

// หน้าการตั้งค่าโปรไฟล์
router.get('/settings/profile', ensureAuth, (req, res) => {
  const formData = req.session.formData || null;
  delete req.session.formData;
  res.render('settings/profile', { formData });
});

router.post('/settings/profile', ensureAuth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      req.session.formData = { name };
      req.session.flash = { type: 'error', message: 'กรุณากรอกชื่อ' };
      return res.redirect('/settings/profile');
    }
    await repo.updateUser(req.user._id, { name });
    req.session.flash = { type: 'success', message: 'บันทึกข้อมูลส่วนตัวสำเร็จ' };
    res.redirect('/profile');
  } catch (err) {
    req.session.formData = { name: req.body.name };
    req.session.flash = { type: 'error', message: 'บันทึกไม่สำเร็จ: ' + err.message };
    res.redirect('/settings/profile');
  }
});

// หน้าการตั้งค่าความปลอดภัย (เปลี่ยนรหัสผ่าน)
router.get('/settings/security', ensureAuth, (req, res) => {
  res.render('settings/security');
});

router.post('/settings/security', ensureAuth, async (req, res) => {
  const bcrypt = require('bcrypt');
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const errs = [];
    if (!currentPassword) errs.push('กรุณากรอกรหัสผ่านปัจจุบัน');
    if (!newPassword) errs.push('กรุณากรอกรหัสผ่านใหม่');
    if (newPassword && newPassword.length < 6) errs.push('รหัสผ่านใหม่ต้องยาวอย่างน้อย 6 ตัวอักษร');
    if (newPassword !== confirmPassword) errs.push('รหัสผ่านใหม่และยืนยันไม่ตรงกัน');
    if (errs.length > 0) {
      req.session.flash = { type: 'error', message: errs.join(' • ') };
      return res.redirect('/settings/security');
    }
    const ok = await bcrypt.compare(currentPassword, req.user.passwordHash);
    if (!ok) {
      req.session.flash = { type: 'error', message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' };
      return res.redirect('/settings/security');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await repo.updateUser(req.user._id, { passwordHash });
    req.session.flash = { type: 'success', message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
    res.redirect('/profile');
  } catch (err) {
    req.session.flash = { type: 'error', message: 'เปลี่ยนรหัสผ่านไม่สำเร็จ: ' + err.message };
    res.redirect('/settings/security');
  }
});

// คงเส้นทางเดิมไว้เพื่อเข้ากันได้ย้อนหลัง (แก้ไขชื่อผู้ใช้เฉพาะ Attendee)
router.post('/profile', ensureAuth, async (req, res) => {
  if (req.user.role !== 'attendee') return res.status(403).send('Forbidden');
  const { name } = req.body;
  await repo.updateUser(req.user._id, { name });
  res.redirect('/profile');
});

module.exports = router;