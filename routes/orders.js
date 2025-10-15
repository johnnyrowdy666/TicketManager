const express = require('express');
let QRCode = null;
try { QRCode = require('qrcode'); } catch (e) { QRCode = null; }
const { ensureAuth, ensureRole } = require('../middleware/auth');
const repo = require('../lib/repo');
const realtime = require('../lib/realtime');
const router = express.Router();

// เส้นทางสำรองเมื่อไม่ได้ระบุ Order ID
router.get(['/orders', '/orders/'], ensureAuth, (req, res) => {
  req.session.flash = { type: 'info', message: 'กรุณาเลือกตั๋วจากโปรไฟล์ของคุณ' };
  res.redirect('/profile#orders');
});

// รายละเอียดตั๋ว (เฉพาะเจ้าของ)
router.get('/orders/:id', ensureAuth, async (req, res) => {
  const order = await repo.getOrderById(req.params.id);
  if (!order) return res.status(404).send('ไม่พบตั๋ว');
  const orderUserId = (order.userId && order.userId._id) ? String(order.userId._id) : String(order.userId);
  if (String(orderUserId) !== String(req.user._id)) return res.status(403).send('Forbidden');
  const event = order.event || order.eventId;
  const payloadUrl = `${req.protocol}://${req.get('host')}/tickets/${order._id}/verify`;
  let qrDataUrl;
  if (QRCode && QRCode.toDataURL) {
    qrDataUrl = await QRCode.toDataURL(payloadUrl, { width: 256, margin: 1 });
  } else {
    const encoded = encodeURIComponent(payloadUrl);
    qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encoded}`;
  }
  res.render('orders/detail', { order, event, qrDataUrl, payloadUrl });
});

// หน้ายืนยันตั๋ว (สาธารณะ แบบจำลอง) — ไม่แสดงข้อมูลส่วนตัว
router.get('/tickets/:id/verify', async (req, res) => {
  const order = await repo.getOrderById(req.params.id);
  if (!order) return res.status(404).send('ไม่พบตั๋ว');
  const event = order.event || order.eventId;
  res.render('orders/verify', { order, event });
});

// ทำเครื่องหมายว่าตั๋วถูกใช้ (สำหรับ Organizer เท่านั้น)
router.post('/tickets/:id/use', ensureRole('organizer'), async (req, res) => {
  const order = await repo.getOrderById(req.params.id);
  if (!order) return res.status(404).send('ไม่พบตั๋ว');
  if (order.status === 'used') {
    await repo.logVerificationAttempt({
      orderId: req.params.id,
      eventId: (order.eventId && order.eventId._id) ? order.eventId._id : order.eventId,
      verifiedBy: req.user?._id,
      deviceInfo: req.get('User-Agent') || '',
      result: 'already_used',
    });
    req.session.flash = { type: 'warning', message: 'ตั๋วใบนี้ถูกใช้แล้ว' };
    return res.redirect(`/tickets/${req.params.id}/verify`);
  }
  await repo.updateOrder(req.params.id, { status: 'used', usedAt: new Date() });
  await repo.logVerificationAttempt({
    orderId: req.params.id,
    eventId: (order.eventId && order.eventId._id) ? order.eventId._id : order.eventId,
    verifiedBy: req.user?._id,
    deviceInfo: req.get('User-Agent') || '',
    result: 'used',
  });
  // broadcast to SSE clients
  try {
    const event = order.event || order.eventId;
    realtime.broadcast('ticket_used', {
      orderId: req.params.id,
      eventId: (event && event._id) ? event._id : event,
      usedAt: new Date(),
    });
  } catch (_) {}
  req.session.flash = { type: 'success', message: 'ทำเครื่องหมายว่าใช้แล้วเรียบร้อย' };
  res.redirect(`/tickets/${req.params.id}/verify`);
});

module.exports = router;