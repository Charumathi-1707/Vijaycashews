import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['assigned', 'in-transit', 'delivered', 'failed'],
      default: 'assigned',
    },
    pickupLocation: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    deliveryLocation: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    currentLocation: {
      latitude: Number,
      longitude: Number,
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Delivery', deliverySchema);
