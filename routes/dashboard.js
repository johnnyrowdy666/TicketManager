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

  // สรุปรวมทั้งหมด
  const totalSoldTickets = rows.reduce((sum, r) => sum + Number(r.totalSold || 0), 0);
  const totalRevenue = rows.reduce((sum, r) => sum + Number(r.totalRevenue || 0), 0);
  const allOrders = rows.flatMap((r) => r.orders);
  const activeUsersCount = (() => {
    const ids = new Set();
    for (const o of allOrders) {
      const id = o.userId && (o.userId._id || o.userId);
      if (id) ids.add(String(id));
    }
    return ids.size;
  })();

  // สถิติตามประเภทตั๋ว (ตีความเป็นรายอีเวนต์)
  const typeStats = rows.map((r) => ({
    name: r.event.title,
    sold: Number(r.totalSold || 0),
    revenue: Number(r.totalRevenue || 0),
    capacity: Number(r.event.capacity || 0),
  }));

  // ซีรีส์รายวัน (ย้อนหลัง 7 วัน)
  function dayKey(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.getTime());
  }
  const daily = days.map((ts) => ({ ts, tickets: 0, revenue: 0 }));
  for (const o of allOrders) {
    const paid = o.paidAt || o.createdAt || new Date();
    const key = dayKey(paid);
    const idx = daily.findIndex((d) => d.ts === key);
    if (idx !== -1) {
      daily[idx].tickets += Number(o.quantity || 0);
      daily[idx].revenue += Number(o.amount || 0);
    }
  }

  // ซีรีส์รายสัปดาห์ (ย้อนหลัง 8 สัปดาห์)
  function weekStartTs(d) {
    const x = new Date(d);
    const day = x.getDay(); // 0=Sun .. 6=Sat
    const diff = (day + 6) % 7; // ทำให้จันทร์เป็นเริ่มสัปดาห์
    x.setDate(x.getDate() - diff);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  }
  const currWeek = weekStartTs(now);
  const weeks = [];
  for (let i = 7; i >= 0; i--) {
    const t = new Date(currWeek);
    t.setDate(t.getDate() - i * 7);
    weeks.push(t.getTime());
  }
  const weekly = weeks.map((ts) => ({ ts, tickets: 0, revenue: 0 }));
  for (const o of allOrders) {
    const paid = o.paidAt || o.createdAt || new Date();
    const wk = weekStartTs(paid);
    const idx = weekly.findIndex((w) => w.ts === wk);
    if (idx !== -1) {
      weekly[idx].tickets += Number(o.quantity || 0);
      weekly[idx].revenue += Number(o.amount || 0);
    }
  }

  // Top Selling (สูงสุด 5 อันดับ)
  const topSelling = rows
    .slice()
    .sort((a, b) => Number(b.totalSold || 0) - Number(a.totalSold || 0))
    .slice(0, 5)
    .map((r) => ({
      eventId: r.event._id,
      title: r.event.title,
      sold: Number(r.totalSold || 0),
      revenue: Number(r.totalRevenue || 0),
      capacity: Number(r.event.capacity || 0),
    }));

  // ข้อมูลการชำระเงินที่รอดำเนินการ (ระบบนี้ตัดเครดิตทันที จึงไม่มีรายการค้าง)
  const pendingPayments = [];

  res.render('dashboard', {
    rows,
    summary: { totalSoldTickets, totalRevenue, activeUsersCount },
    typeStats,
    daily,
    weekly,
    topSelling,
    pendingPayments,
  });
});

module.exports = router;