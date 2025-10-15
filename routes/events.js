const express = require('express');
const repo = require('../lib/repo');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ'));
  }
});
const { isConfigured, uploadBuffer, deleteImage } = require('../lib/cloudinary');
const { ensureRole } = require('../middleware/auth');
const router = express.Router();

// รายละเอียดอีเวนต์ (สาธารณะ) — ย้ายไปท้ายไฟล์เพื่อหลีกเลี่ยงชนกับ /events/new และ /events/manage

// ซื้อบัตรสำหรับ Attendee
router.post('/events/:id/buy', ensureRole('attendee'), async (req, res) => {
  try {
    const event = await repo.getEventById(req.params.id);
    if (!event) return res.status(404).send('ไม่พบอีเวนต์');
    const quantity = Math.max(1, Number(req.body.quantity || 1));
    const sold = event.ticketsSold || 0;
    const remaining = Number(event.capacity) - Number(sold);
    if (quantity > remaining) {
      req.session.flash = { type: 'error', message: 'จำนวนคงเหลือไม่พอ' };
      return res.redirect(`/events/${req.params.id}`);
    }
    const priceNum = Number(event.price);
    const priceCents = Math.round(priceNum * 100);
    const amountCents = priceCents * quantity;
    const amountBaht = amountCents / 100;
    // ตัดเครดิตแบบอะตอม หากเครดิตไม่พอ จะแจ้งเตือน
    try {
      await repo.chargeCredit({ userId: req.user._id, amountCents, note: `ซื้อบัตรอีเวนต์ ${event.title} (${event._id})` });
    } catch (err) {
      if (err && err.code === 'INSUFFICIENT_FUNDS') {
        const balBaht = Number(err.balanceCents || 0) / 100;
        req.session.flash = { type: 'error', message: `เครดิตไม่พอ (ยอดคงเหลือ ${balBaht.toLocaleString('th-TH')} ฿)` };
        return res.redirect(`/events/${req.params.id}`);
      }
      req.session.flash = { type: 'error', message: 'เกิดข้อผิดพลาดระหว่างการชำระเงิน' };
      return res.redirect(`/events/${req.params.id}`);
    }
    await repo.createOrder({ userId: req.user._id, eventId: event._id, quantity, amount: amountBaht });
    req.session.flash = { type: 'success', message: 'ซื้อบัตรสำเร็จ' };
    res.redirect('/profile');
  } catch (err) {
    req.session.flash = { type: 'error', message: 'เกิดข้อผิดพลาด: ' + err.message };
    res.redirect(`/events/${req.params.id}`);
  }
});

// ----- ส่วนของ Organizer -----
router.get('/events/manage', ensureRole('organizer'), async (req, res) => {
  const events = await repo.listEvents({ ownerId: req.user._id });
  res.render('events/manage', { events });
});

router.get('/events/new', ensureRole('organizer'), (req, res) => {
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_KEY || '';
  const formData = req.session.formData || null;
  delete req.session.formData;
  res.render('events/form', { event: null, action: '/events', method: 'POST', mapsApiKey, formData });
});

router.post('/events', ensureRole('organizer'), upload.single('image'), async (req, res) => {
  try {
    const { title, description, imageUrl, date, startTime, location, capacity, price } = req.body;
    // validate เบื้องต้น
    const errs = [];
    if (!title) errs.push('กรุณากรอกชื่ออีเวนต์');
    if (!date) errs.push('กรุณากรอกวันที่จัดอีเวนต์');
    if (!location) errs.push('กรุณากรอกสถานที่');
    const capNum = Number(capacity);
    const priceNum = Number(price);
    if (Number.isNaN(capNum) || capNum < 0) errs.push('จำนวนบัตรต้องเป็นเลข 0 ขึ้นไป');
    if (Number.isNaN(priceNum) || priceNum < 0) errs.push('ราคาต้องเป็นเลข 0 ขึ้นไป');
    if (errs.length) {
      req.session.flash = { type: 'error', message: errs.join(' · ') };
      req.session.formData = { title, description, date, startTime, location, capacity, price, lat: req.body.lat, lng: req.body.lng };
      return res.redirect('/events/new');
    }
    let finalImageUrl = imageUrl || '';
    let imagePublicId = '';
    if (req.file && isConfigured) {
      try {
        const result = await uploadBuffer(req.file.buffer, { folder: 'events', filename: req.file.originalname });
        finalImageUrl = result.secure_url;
        imagePublicId = result.public_id;
      } catch (err) {
        req.session.flash = { type: 'error', message: 'อัปโหลดรูปไม่สำเร็จ: ' + err.message };
        req.session.formData = { title, description, date, startTime, location, capacity, price, lat: req.body.lat, lng: req.body.lng };
        return res.redirect('/events/new');
      }
    } else if (req.file && !isConfigured) {
      req.session.flash = { type: 'error', message: 'ยังไม่ได้ตั้งค่า Cloudinary (กรุณาตั้งค่า ENV)' };
      req.session.formData = { title, description, date, startTime, location, capacity, price, lat: req.body.lat, lng: req.body.lng };
      return res.redirect('/events/new');
    }
    const latNum = req.body.lat !== undefined && req.body.lat !== '' ? Number(req.body.lat) : undefined;
    const lngNum = req.body.lng !== undefined && req.body.lng !== '' ? Number(req.body.lng) : undefined;
    const createFields = { ownerId: req.user._id, title, description, imageUrl: finalImageUrl, imagePublicId, date, startTime, location, capacity: capNum, price: priceNum };
    if (!Number.isNaN(latNum)) createFields.lat = latNum;
    if (!Number.isNaN(lngNum)) createFields.lng = lngNum;
    await repo.createEvent(createFields);
    req.session.flash = { type: 'success', message: 'สร้างอีเวนต์สำเร็จ' };
    res.redirect('/events/manage');
  } catch (err) {
    req.session.flash = { type: 'error', message: 'เกิดข้อผิดพลาด: ' + err.message };
    req.session.formData = { title: req.body.title, description: req.body.description, date: req.body.date, startTime: req.body.startTime, location: req.body.location, capacity: req.body.capacity, price: req.body.price, lat: req.body.lat, lng: req.body.lng };
    res.redirect('/events/new');
  }
});

router.get('/events/:id/edit', ensureRole('organizer'), async (req, res) => {
  const event = await repo.getEventById(req.params.id);
  if (!event || String(event.ownerId) !== String(req.user._id)) return res.status(403).send('Forbidden');
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_KEY || '';
  res.render('events/form', { event, action: `/events/${event._id}?_method=PUT`, method: 'POST', mapsApiKey });
});

router.put('/events/:id', ensureRole('organizer'), upload.single('image'), async (req, res) => {
  const event = await repo.getEventById(req.params.id);
  if (!event || String(event.ownerId) !== String(req.user._id)) return res.status(403).send('Forbidden');
  const { title, description, date, startTime, location, capacity, price } = req.body;
  const updateFields = { title, description, date, startTime, location, capacity: Number(capacity), price: Number(price) };
  const latNum = req.body.lat !== undefined && req.body.lat !== '' ? Number(req.body.lat) : undefined;
  const lngNum = req.body.lng !== undefined && req.body.lng !== '' ? Number(req.body.lng) : undefined;
  if (!Number.isNaN(latNum)) updateFields.lat = latNum;
  if (!Number.isNaN(lngNum)) updateFields.lng = lngNum;
  const removeImage = ['1', 'on', 'true'].includes(String(req.body.removeImage || '').toLowerCase());
  // ลบรูปเดิมหากเลือก และไม่มีการอัปโหลดรูปใหม่
  if (!req.file && removeImage) {
    if (event.imagePublicId && isConfigured) {
      try { await deleteImage(event.imagePublicId); } catch (e) {}
    }
    updateFields.imageUrl = '';
    updateFields.imagePublicId = '';
  }
  if (req.file) {
    if (!isConfigured) {
      req.session.flash = { type: 'error', message: 'ยังไม่ได้ตั้งค่า Cloudinary (กรุณาตั้งค่า ENV)' };
      return res.redirect(`/events/${event._id}/edit`);
    }
    try {
      const result = await uploadBuffer(req.file.buffer, { folder: 'events', filename: req.file.originalname });
      updateFields.imageUrl = result.secure_url;
      updateFields.imagePublicId = result.public_id;
      if (event.imagePublicId) {
        // ลบรูปเดิม
        try { await deleteImage(event.imagePublicId); } catch (e) {}
      }
    } catch (err) {
      req.session.flash = { type: 'error', message: 'อัปโหลดรูปไม่สำเร็จ: ' + err.message };
      return res.redirect(`/events/${event._id}/edit`);
    }
  }
  await repo.updateEvent(event._id, updateFields);
  req.session.flash = { type: 'success', message: 'บันทึกการแก้ไขอีเวนต์สำเร็จ' };
  res.redirect('/events/manage');
});

router.post('/events/:id/delete', ensureRole('organizer'), async (req, res) => {
  const event = await repo.getEventById(req.params.id);
  if (!event || String(event.ownerId) !== String(req.user._id)) return res.status(403).send('Forbidden');
  if (event.imagePublicId && isConfigured) {
    try { await deleteImage(event.imagePublicId); } catch (e) {}
  }
  await repo.deleteEvent(event._id);
  req.session.flash = { type: 'success', message: 'ลบอีเวนต์สำเร็จ' };
  res.redirect('/events/manage');
});

// รายละเอียดอีเวนต์ (สาธารณะ)
router.get('/events/:id', async (req, res) => {
  const event = await repo.getEventById(req.params.id);
  if (!event) return res.status(404).send('ไม่พบอีเวนต์');
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_KEY || '';
  res.render('events/detail', { event, mapsApiKey });
});

module.exports = router;