const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['attendee', 'organizer'], required: true },
    // กระเป๋าเครดิต (หน่วย: สตางค์ เพื่อความแม่นยำ)
    creditBalanceCents: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);