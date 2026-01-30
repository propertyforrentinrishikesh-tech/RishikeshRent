import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyRegistration',
    required: true
  },
  couponCode: {
    type: String,
    required: true,
    uppercase: true
  },
  amount: {
    type: Number,
    default: null
  },
  percentage: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create or use existing model
const Discount = mongoose.models.Discount || mongoose.model('Discount', DiscountSchema);

export default Discount;
