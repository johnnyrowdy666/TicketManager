const express = require('express');
const { ensureAuth } = require('../middleware/auth');
const repo = require('../lib/repo');
const router = express.Router();

// แสดงยอดเครดิตและประวัติธุรกรรม
router.get('/wallet', ensureAuth, async (req, res) => {
  const balanceCents = await repo.getCreditBalanceCents(req.user._id);
  const txs = await repo.listWalletTransactionsByUser(req.user._id, 50);
  const formData = req.session.formData || null;
  delete req.session.formData;
  res.render('wallet', { balanceCents, txs, formData });
});

// ฝากเครดิต (จำลอง)
router.post('/wallet/deposit', ensureAuth, async (req, res) => {
  try {
    const raw = (req.body.amount || '').toString().trim();
    const amtNum = Number(raw);
    if (!raw || Number.isNaN(amtNum) || amtNum <= 0) {
      req.session.formData = { amount: raw };
      req.session.flash = { type: 'error', message: 'กรุณาระบุจำนวนเงินที่ถูกต้อง' };
      return res.redirect('/wallet');
    }
    const amountCents = Math.round(amtNum * 100);
    const newBal = await repo.depositCredit({ userId: req.user._id, amountCents, note: 'ฝากเครดิต' });
    const balBaht = Number(newBal || 0) / 100;
    req.session.flash = { type: 'success', message: `ฝากเครดิตสำเร็จ · ยอดคงเหลือ ${balBaht.toLocaleString('th-TH')} ฿` };
    res.redirect('/wallet');
  } catch (err) {
    req.session.flash = { type: 'error', message: 'เกิดข้อผิดพลาด: ' + err.message };
    res.redirect('/wallet');
  }
});

module.exports = router;