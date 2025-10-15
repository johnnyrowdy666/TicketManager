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
      return { ...o, event: ev };
    })
  );
  res.render('profile', { orders: enriched });
});

// อนุญาตให้ Attendee แก้ไขชื่อเท่านั้น
router.post('/profile', ensureAuth, async (req, res) => {
  if (req.user.role !== 'attendee') return res.status(403).send('Forbidden');
  const { name } = req.body;
  await repo.updateUser(req.user._id, { name });
  res.redirect('/profile');
});

module.exports = router;