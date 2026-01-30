import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyRegistration',
    required: true
  },
  guestName: {
    type: String,
    required: true
  },
  dateOfReview: {
    type: Date,
    required: true
  },
  travelType: {
    type: String,
    required: true,
    enum: ['soloTraveler', 'couple', 'family', 'business', 'group', 'friends', 'other']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    key: String
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export default Review;