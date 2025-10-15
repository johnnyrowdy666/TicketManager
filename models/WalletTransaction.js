const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['deposit', 'charge', 'refund'], required: true },
    amountCents: { type: Number, required: true, min: 1 },
    balanceAfterCents: { type: Number, required: true, min: 0 },
    note: { type: String },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', WalletTransactionSchema);