const mongoose = require('mongoose');

const VerificationLogSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deviceInfo: { type: String },
    result: { type: String, enum: ['used', 'already_used', 'not_found', 'error'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.VerificationLog || mongoose.model('VerificationLog', VerificationLogSchema);