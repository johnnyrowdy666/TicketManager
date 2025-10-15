const express = require('express');
const { ensureRole } = require('../middleware/auth');
const repo = require('../lib/repo');
const realtime = require('../lib/realtime');
const router = express.Router();

// JSON API: mark ticket as used by ID
router.post('/api/tickets/:id/use', ensureRole('organizer'), async (req, res) => {
  try {
    const order = await repo.getOrderById(req.params.id);
    if (!order) {
      await repo.logVerificationAttempt({
        orderId: req.params.id,
        eventId: undefined,
        verifiedBy: req.user?._id,
        deviceInfo: req.get('User-Agent') || '',
        result: 'not_found',
      });
      return res.status(404).json({ ok: false, error: 'ORDER_NOT_FOUND' });
    }
    const event = order.event || order.eventId;
    if (order.status === 'used') {
      await repo.logVerificationAttempt({
        orderId: req.params.id,
        eventId: (event && event._id) ? event._id : event,
        verifiedBy: req.user?._id,
        deviceInfo: req.get('User-Agent') || '',
        result: 'already_used',
      });
      return res.json({ ok: true, status: 'already_used', usedAt: order.usedAt || null });
    }
    const now = new Date();
    const updated = await repo.updateOrder(req.params.id, { status: 'used', usedAt: now });
    await repo.logVerificationAttempt({
      orderId: req.params.id,
      eventId: (event && event._id) ? event._id : event,
      verifiedBy: req.user?._id,
      deviceInfo: req.get('User-Agent') || '',
      result: 'used',
    });
    try {
      realtime.broadcast('ticket_used', {
        orderId: req.params.id,
        eventId: (event && event._id) ? event._id : event,
        usedAt: now,
      });
    } catch (_) {}
    return res.json({ ok: true, status: 'used', usedAt: updated.usedAt });
  } catch (err) {
    await repo.logVerificationAttempt({
      orderId: req.params.id,
      eventId: undefined,
      verifiedBy: req.user?._id,
      deviceInfo: req.get('User-Agent') || '',
      result: 'error',
    });
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR' });
  }
});

module.exports = router;