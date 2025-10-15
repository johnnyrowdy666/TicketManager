require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const { attachUser, ensureRole } = require('./middleware/auth');
const realtime = require('./lib/realtime');

const app = express();
const PORT = process.env.PORT || 3000;
const repo = require('./lib/repo');
const { cloudinary, isConfigured } = require('./lib/cloudinary');
// View engine & static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = path.join(__dirname, 'views');
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(attachUser);

// Flash messages helper
app.use((req, res, next) => {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// Helper: thumbnail URL for images (Cloudinary if available)
app.locals.thumbUrl = function (e, w = 400, h = 240) {
  try {
    if (isConfigured && e && e.imagePublicId) {
      return cloudinary.url(e.imagePublicId, {
        width: w,
        height: h,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true,
      });
    }
    if (e && e.imageUrl) return e.imageUrl;
    return `/placeholder.svg`;
  } catch (err) {
    return `/placeholder.svg`;
  }
};

// Helper: cover URL for detail page hero image
app.locals.coverUrl = function (e, w = 1200, h = 600) {
  try {
    if (isConfigured && e && e.imagePublicId) {
      return cloudinary.url(e.imagePublicId, {
        width: w,
        height: h,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        secure: true,
      });
    }
    if (e && e.imageUrl) return e.imageUrl;
    return `/placeholder.svg`;
  } catch (err) {
    return `/placeholder.svg`;
  }
};

// Helper: ตรวจสอบว่าเป็นรูปจาก Cloudinary
app.locals.isCloudinaryImage = function (e) {
  try {
    return Boolean(isConfigured && e && e.imagePublicId);
  } catch (_) {
    return false;
  }
};

// Helper: สร้าง srcset สำหรับภาพฮีโร่รายละเอียด (ratio 1200x600 = 0.5)
app.locals.coverSrcset = function (e) {
  try {
    if (isConfigured && e && e.imagePublicId) {
      const ratio = 600 / 1200;
      const widths = [640, 768, 1024, 1200];
      return widths
        .map((w) => {
          const h = Math.round(w * ratio);
          const url = cloudinary.url(e.imagePublicId, {
            width: w,
            height: h,
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
            secure: true,
          });
          return `${url} ${w}w`;
        })
        .join(', ');
    }
    return '';
  } catch (err) {
    return '';
  }
};

// Helper: สร้าง srcset สำหรับภาพการ์ด (ratio 400x240 = 0.6)
app.locals.thumbSrcset = function (e) {
  try {
    if (isConfigured && e && e.imagePublicId) {
      const ratio = 240 / 400;
      const widths = [320, 400, 480, 640, 768];
      return widths
        .map((w) => {
          const h = Math.round(w * ratio);
          const url = cloudinary.url(e.imagePublicId, {
            width: w,
            height: h,
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
            secure: true,
          });
          return `${url} ${w}w`;
        })
        .join(', ');
    }
    return '';
  } catch (err) {
    return '';
  }
};

// ---------- Database connection (graceful fallback) ----------
let dbConnected = false;
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => {
      dbConnected = true;
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.warn('MongoDB connection failed. Using in-memory store.', err.message);
    });
} else {
  console.warn('MONGODB_URI not set. Using in-memory store.');
}

// ---------- Simple in-memory store for preview ----------
const memory = require('./lib/memory');

// ใช้ attachUser เพื่อส่ง currentUser ไปยัง views แล้ว ไม่ต้อง override ซ้ำ

// ---------- Routes (home lists events from repo with fallback) ----------
app.get('/', async (req, res) => {
  if (!res.locals.currentUser) return res.redirect('/welcome');
  const q = (req.query.q || '').trim();
  const events = await repo.listEvents({ q });
  res.render('home', { events, q, dbConnected });
});

// Welcome page for guests
app.get('/welcome', (req, res) => {
  if (res.locals.currentUser) return res.redirect('/');
  res.render('welcome');
});

app.get('/login', (req, res) => {
  res.render('auth/login');
});

app.get('/register', (req, res) => {
  res.render('auth/register');
});

// auth actions
app.use('/', require('./routes/auth'));
// event routes
app.use('/', require('./routes/events'));
// profile & dashboard
app.use('/', require('./routes/profile'));
app.use('/', require('./routes/dashboard'));
// wallet
app.use('/', require('./routes/wallet'));
// orders (ticket details & verify)
app.use('/', require('./routes/orders'));
// api for scanning devices
app.use('/', require('./routes/api'));
// organizer scan page
app.use('/', require('./routes/scan'));

// --- Realtime SSE endpoint for organizers ---
app.get('/realtime/orders', ensureRole('organizer'), (req, res) => {
  realtime.addClient(res);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});