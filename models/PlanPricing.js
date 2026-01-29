import mongoose from 'mongoose';

const PlanPricingSchema = new mongoose.Schema({
    // Reference to Property
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration',
        required: true,
        index: true
    },

    // Reference to Rate Plan
    ratePlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatePlan',
        required: true,
        index: true
    },

    // Room Information
    roomType: {
        type: String,
        required: true,
        index: true
    },

    // Image
    image: {
        url: { type: String, default: '' },
        key: { type: String, default: '' }
    },

    // Side Tag Line (promotional text)
    sideTagLine: {
        type: String,
        default: ''
    },

    // Description
    description: {
        type: String,
        default: ''
    },

    // Requirements/Notes (deprecated, use description)
    requirement: {
        type: String,
        default: ''
    },

    // Meal Plans Pricing
    epPlan: {
        person1: { type: Number, default: 0 },
        person2: { type: Number, default: 0 }
    },

    cpPlan: {
        person1: { type: Number, default: 0 },
        person2: { type: Number, default: 0 }
    },

    mapPlan: {
        person1: { type: Number, default: 0 },
        person2: { type: Number, default: 0 }
    },

    apPlan: {
        person1: { type: Number, default: 0 },
        person2: { type: Number, default: 0 }
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
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
PlanPricingSchema.index({ propertyId: 1, ratePlanId: 1, roomType: 1 }, { unique: true });
PlanPricingSchema.index({ propertyId: 1, isActive: 1 });
PlanPricingSchema.index({ ratePlanId: 1 });

// Virtual to check if any pricing is set
PlanPricingSchema.virtual('hasPricing').get(function () {
    return (
        this.epPlan.person1 > 0 || this.epPlan.person2 > 0 ||
        this.cpPlan.person1 > 0 || this.cpPlan.person2 > 0 ||
        this.mapPlan.person1 > 0 || this.mapPlan.person2 > 0 ||
        this.apPlan.person1 > 0 || this.apPlan.person2 > 0
    );
});

// Static method to get all plan pricing for a property
PlanPricingSchema.statics.getPropertyPlanPricing = async function (propertyId) {
    return this.find({ propertyId })
        .populate('ratePlanId')
        .sort({ createdAt: -1 });
};

// Static method to get pricing for a specific rate plan
PlanPricingSchema.statics.getRatePlanPricing = async function (ratePlanId) {
    return this.find({ ratePlanId })
        .populate('ratePlanId')
        .sort({ roomType: 1 });
};

// Create or use existing model
const PlanPricing = mongoose.models.PlanPricing || mongoose.model('PlanPricing', PlanPricingSchema);

export default PlanPricing;
