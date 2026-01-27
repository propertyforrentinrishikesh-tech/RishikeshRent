import mongoose from 'mongoose';

const RoomPricingSchema = new mongoose.Schema({
    // Reference to Property
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration',
        required: true,
        index: true
    },

    // Room Information
    roomType: {
        type: String,
        required: true,
        index: true
    },

    // Date Information
    date: {
        type: Date,
        required: true,
        index: true
    },

    // Pricing Type (to differentiate between different pricing strategies)
    pricingType: {
        type: String,
        enum: ['b2c', 'weekend', 'special-offer', 'bulk', 'rate-plan'],
        default: 'b2c',
        index: true
    },

    // Rate Plan Information (if applicable)
    ratePlanName: {
        type: String,
        default: null
    },

    // Meal Plans Pricing
    epPlan: {
        person1: { type: Number, default: 0 },
        person2: { type: Number, default: 0 },
        extraPerson: { type: Number, default: 0 }
    },

    cpPlan: {
        person1: { type: Number, default: 0 },
        person2: { type: Number, default: 0 },
        extraPerson: { type: Number, default: 0 }
    },

    mapPlan: {
        person1: { type: Number, default: 0 },
        person2: { type: Number, default: 0 },
        extraPerson: { type: Number, default: 0 }
    },

    apPlan: {
        person1: { type: Number, default: 0 },
        person2: { type: Number, default: 0 },
        extraPerson: { type: Number, default: 0 }
    },

    // Availability
    totalRooms: {
        type: Number,
        required: true,
        default: 0
    },

    availableRooms: {
        type: Number,
        required: true,
        default: 0
    },

    // Room Status
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },

    // Restrictions (KRC - Keep Room Closed)
    restrictions: {
        minStay: {
            type: Number,
            default: 1
        },
        maxStay: {
            type: Number,
            default: null
        },
        closedToArrival: {
            type: Boolean,
            default: false
        },
        closedToDeparture: {
            type: Boolean,
            default: false
        },
        stopSell: {
            type: Boolean,
            default: false
        }
    },

    // Incremental Reduction (based on stay duration)
    incrementalReduction: {
        enabled: {
            type: Boolean,
            default: false
        },
        reductions: [{
            nights: Number,
            discountPercentage: Number
        }]
    },

    // Metadata
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration'
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration'
    },

    notes: {
        type: String,
        default: ''
    }

}, {
    timestamps: true
});

// Compound indexes for efficient queries
RoomPricingSchema.index({ propertyId: 1, roomType: 1, date: 1 }, { unique: true });
RoomPricingSchema.index({ propertyId: 1, date: 1 });
RoomPricingSchema.index({ propertyId: 1, pricingType: 1 });

// Virtual for checking if room is available
RoomPricingSchema.virtual('isAvailable').get(function () {
    return this.status === 'open' && this.availableRooms > 0 && !this.restrictions.stopSell;
});

// Method to check if date is in the past
RoomPricingSchema.methods.isPastDate = function () {
    return this.date < new Date();
};

// Static method to get pricing for a date range
RoomPricingSchema.statics.getPricingForDateRange = async function (propertyId, roomType, startDate, endDate) {
    return this.find({
        propertyId,
        roomType,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ date: 1 });
};

// Static method to bulk update pricing
RoomPricingSchema.statics.bulkUpdatePricing = async function (propertyId, roomType, startDate, endDate, pricingData) {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const bulkOps = dates.map(date => ({
        updateOne: {
            filter: { propertyId, roomType, date },
            update: { $set: { ...pricingData, updatedAt: new Date() } },
            upsert: true
        }
    }));

    return this.bulkWrite(bulkOps);
};

// Create or use existing model
const RoomPricing = mongoose.models.RoomPricing || mongoose.model('RoomPricing', RoomPricingSchema);

export default RoomPricing;
