const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const memory = require('./memory');
const User = require('../models/User');
const Event = require('../models/Event');
const Order = require('../models/Order');
const WalletTransaction = require('../models/WalletTransaction');
let VerificationLog;
try { VerificationLog = require('../models/VerificationLog'); } catch (_) { VerificationLog = null; }

const connected = () => mongoose.connection && mongoose.connection.readyState === 1;
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// ---------- User ----------
async function createUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  if (connected()) {
    return User.create({ name, email, passwordHash, role, creditBalanceCents: 0 });
  }
  const exists = memory.users.find((u) => u.email === email);
  if (exists) throw new Error('Email already used');
  const user = { _id: String(Date.now()), name, email, passwordHash, role, creditBalanceCents: 0 };
  memory.users.push(user);
  return user;
}

async function findUserByEmail(email) {
  if (connected()) return User.findOne({ email });
  return memory.users.find((u) => u.email === email) || null;
}

async function getUserById(id) {
  if (connected() && isValidObjectId(id)) return User.findById(id);
  return memory.users.find((u) => u._id === id) || null;
}

async function updateUser(id, fields) {
  if (connected() && isValidObjectId(id)) return User.findByIdAndUpdate(id, fields, { new: true });
  const idx = memory.users.findIndex((u) => u._id === id);
  if (idx === -1) return null;
  memory.users[idx] = { ...memory.users[idx], ...fields };
  return memory.users[idx];
}

// ---------- Wallet / Credit ----------
async function getCreditBalanceCents(userId) {
  if (connected() && isValidObjectId(userId)) {
    const u = await User.findById(userId).select('creditBalanceCents');
    return u ? Number(u.creditBalanceCents || 0) : 0;
  }
  const u = memory.users.find((x) => x._id === userId);
  return u ? Number(u.creditBalanceCents || 0) : 0;
}

async function listWalletTransactionsByUser(userId, limit = 50) {
  if (connected() && isValidObjectId(userId)) {
    return WalletTransaction.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  }
  const txs = memory.walletTransactions.filter((t) => t.userId === userId);
  return txs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit);
}

async function depositCredit({ userId, amountCents, note }) {
  const amt = Math.max(0, Number(amountCents || 0));
  if (!amt) throw new Error('Invalid amount');
  if (connected() && isValidObjectId(userId)) {
    const updated = await User.findByIdAndUpdate(
      userId,
      { $inc: { creditBalanceCents: amt } },
      { new: true, select: 'creditBalanceCents' }
    );
    if (!updated) throw new Error('User not found');
    await WalletTransaction.create({
      userId,
      type: 'deposit',
      amountCents: amt,
      balanceAfterCents: Number(updated.creditBalanceCents || 0),
      note,
    });
    return updated.creditBalanceCents;
  }
  const u = memory.users.find((x) => x._id === userId);
  if (!u) throw new Error('User not found');
  u.creditBalanceCents = Number(u.creditBalanceCents || 0) + amt;
  memory.walletTransactions.push({
    _id: 'tx' + Date.now(),
    userId,
    type: 'deposit',
    amountCents: amt,
    balanceAfterCents: Number(u.creditBalanceCents || 0),
    note,
    createdAt: new Date(),
  });
  return u.creditBalanceCents;
}

async function chargeCredit({ userId, amountCents, note, orderId }) {
  const amt = Math.max(0, Number(amountCents || 0));
  if (!amt) throw new Error('Invalid amount');
  if (connected() && isValidObjectId(userId)) {
    const res = await User.updateOne(
      { _id: userId, creditBalanceCents: { $gte: amt } },
      { $inc: { creditBalanceCents: -amt } }
    );
    if (!res || res.modifiedCount === 0) {
      const bal = await getCreditBalanceCents(userId);
      const err = new Error('INSUFFICIENT_FUNDS');
      err.code = 'INSUFFICIENT_FUNDS';
      err.balanceCents = bal;
      throw err;
    }
    const updated = await User.findById(userId).select('creditBalanceCents');
    await WalletTransaction.create({
      userId,
      type: 'charge',
      amountCents: amt,
      balanceAfterCents: Number(updated.creditBalanceCents || 0),
      note,
      orderId: isValidObjectId(orderId) ? orderId : undefined,
    });
    return updated.creditBalanceCents;
  }
  const u = memory.users.find((x) => x._id === userId);
  if (!u) throw new Error('User not found');
  const bal = Number(u.creditBalanceCents || 0);
  if (bal < amt) {
    const err = new Error('INSUFFICIENT_FUNDS');
    err.code = 'INSUFFICIENT_FUNDS';
    err.balanceCents = bal;
    throw err;
  }
  u.creditBalanceCents = bal - amt;
  memory.walletTransactions.push({
    _id: 'tx' + Date.now(),
    userId,
    type: 'charge',
    amountCents: amt,
    balanceAfterCents: Number(u.creditBalanceCents || 0),
    note,
    orderId,
    createdAt: new Date(),
  });
  return u.creditBalanceCents;
}

// ---------- Event ----------
async function createEvent(fields) {
  if (connected()) return Event.create(fields);
  const event = { _id: 'evt' + Date.now(), ticketsSold: 0, ...fields };
  memory.events.push(event);
  return event;
}

async function updateEvent(id, fields) {
  if (connected() && isValidObjectId(id)) return Event.findByIdAndUpdate(id, fields, { new: true });
  const idx = memory.events.findIndex((e) => e._id === id);
  if (idx === -1) return null;
  memory.events[idx] = { ...memory.events[idx], ...fields };
  return memory.events[idx];
}

async function deleteEvent(id) {
  if (connected() && isValidObjectId(id)) return Event.findByIdAndDelete(id);
  const idx = memory.events.findIndex((e) => e._id === id);
  if (idx === -1) return null;
  const [removed] = memory.events.splice(idx, 1);
  return removed;
}

async function getEventById(id) {
  if (connected() && isValidObjectId(id)) {
    const doc = await Event.findById(id);
    if (doc) return doc;
  }
  return memory.events.find((e) => e._id === id) || null;
}

async function listEvents({ q, ownerId } = {}) {
  if (connected()) {
    const query = {};
    if (ownerId) {
      if (isValidObjectId(ownerId)) {
        query.ownerId = ownerId;
      } else {
        // ownerId invalid under Mongo mode -> no results to avoid CastError
        return [];
      }
    }
    if (q) query.title = new RegExp(q, 'i');
    return Event.find(query).sort({ date: 1 });
  }
  let events = memory.events.slice();
  if (ownerId) events = events.filter((e) => e.ownerId === ownerId);
  if (q) {
    const key = q.toLowerCase();
    events = events.filter(
      (e) => e.title.toLowerCase().includes(key) || e.location.toLowerCase().includes(key)
    );
  }
  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// ---------- Order ----------
async function createOrder({ userId, eventId, quantity, amount }) {
  if (connected() && isValidObjectId(eventId)) {
    const order = await Order.create({ userId, eventId, quantity, amount });
    await Event.findByIdAndUpdate(eventId, { $inc: { ticketsSold: quantity } });
    return order;
  }
  const order = { _id: 'ord' + Date.now(), userId, eventId, quantity, amount, status: 'unused', paidAt: new Date() };
  memory.orders.push(order);
  const evt = memory.events.find((e) => e._id === eventId);
  if (evt) evt.ticketsSold = (evt.ticketsSold || 0) + quantity;
  return order;
}

async function listOrdersByUser(userId) {
  if (connected() && isValidObjectId(userId)) return Order.find({ userId }).populate('eventId');
  return memory.orders.filter((o) => o.userId === userId);
}

async function listOrdersByEvent(eventId) {
  if (connected() && isValidObjectId(eventId)) return Order.find({ eventId }).populate('userId');
  return memory.orders.filter((o) => o.eventId === eventId);
}

async function getOrderById(id) {
  if (connected() && isValidObjectId(id)) {
    const order = await Order.findById(id).populate('eventId').populate('userId');
    if (order) return order;
    return null;
  }
  const order = memory.orders.find((o) => o._id === id);
  if (!order) return null;
  const ev = await getEventById(order.eventId);
  const user = await getUserById(order.userId);
  return { ...order, event: ev, userId: user };
}

async function updateOrder(id, fields) {
  if (connected() && isValidObjectId(id)) {
    return Order.findByIdAndUpdate(id, fields, { new: true });
  }
  const idx = memory.orders.findIndex((o) => o._id === id);
  if (idx === -1) return null;
  memory.orders[idx] = { ...memory.orders[idx], ...fields };
  return memory.orders[idx];
}

module.exports = {
  // users
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
  // wallet
  getCreditBalanceCents,
  listWalletTransactionsByUser,
  depositCredit,
  chargeCredit,
  // events
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  listEvents,
  // orders
  createOrder,
  listOrdersByUser,
  listOrdersByEvent,
  getOrderById,
  updateOrder,
  // verification logs
  logVerificationAttempt,
};

// ---------- Verification Logs ----------
async function logVerificationAttempt({ orderId, eventId, verifiedBy, deviceInfo, result }) {
  const entry = { orderId, eventId, verifiedBy, deviceInfo, result, createdAt: new Date() };
  if (connected() && VerificationLog) {
    try { await VerificationLog.create(entry); } catch (_) {}
    return entry;
  }
  entry._id = 'vlog' + Date.now();
  memory.verificationLogs.push(entry);
  return entry;
}