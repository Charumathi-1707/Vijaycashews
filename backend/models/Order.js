const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  variant: { type: String, default: '' },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
  },
  pricing: {
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  coupon: {
    code: String,
    discount: Number,
  },
  payment: {
    method: { type: String, enum: ['cod', 'online', 'upi', 'razorpay'], default: 'cod' },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
  },
  // Courier / self-delivery tracking
  shipping: {
    type: { type: String, enum: ['self', 'courier'], default: 'self' }, // self = our delivery man
    courierName: { type: String, default: '' },     // e.g. "DTDC", "BlueDart", "Delhivery"
    trackingId: { type: String, default: '' },       // tracking number from courier
    trackingUrl: { type: String, default: '' },      // optional tracking link
    courierUpdatedAt: { type: Date },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
  },
  statusHistory: [statusHistorySchema],
  deliveryman: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deliveryNotes: { type: String, default: '' },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String, default: '' },
  notes: { type: String, default: '' },
  isReviewed: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-generate orderId
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
