const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const memory = require('./memory');
const User = require('../models/User');
const Event = require('../models/Event');
const Order = require('../models/Order');

const connected = () => mongoose.connection && mongoose.connection.readyState === 1;
const isValidObjectId = (id) => mongoose.isValidObjectId(id);

// ---------- User ----------
async function createUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  if (connected()) {
    return User.create({ name, email, passwordHash, role });
  }
  const exists = memory.users.find((u) => u.email === email);
  if (exists) throw new Error('Email already used');
  const user = { _id: String(Date.now()), name, email, passwordHash, role };
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
  const order = { _id: 'ord' + Date.now(), userId, eventId, quantity, amount, paidAt: new Date() };
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

module.exports = {
  // users
  createUser,
  findUserByEmail,
  getUserById,
  updateUser,
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
};