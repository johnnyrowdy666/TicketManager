const express = require('express');
const { ensureRole } = require('../middleware/auth');
const repo = require('../lib/repo');
const router = express.Router();

router.get('/dashboard', ensureRole('organizer'), async (req, res) => {
  const events = await repo.listEvents({ ownerId: req.user._id });
  const rows = await Promise.all(
    events.map(async (e) => {
      const orders = await repo.listOrdersByEvent(e._id);
      return {
        event: e,
        orders,
        totalSold: orders.reduce((sum, o) => sum + Number(o.quantity || 0), 0),
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.amount || 0), 0),
      };
    })
  );
  res.render('dashboard', { rows });
});

module.exports = router;