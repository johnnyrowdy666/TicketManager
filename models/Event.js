const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    ticketsSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);