const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    quantity: { type: Number, default: 1, min: 1 },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['unused', 'used'], default: 'unused' },
    usedAt: { type: Date },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);