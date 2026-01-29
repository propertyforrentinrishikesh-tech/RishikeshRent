import mongoose from 'mongoose';

const RatePlanSchema = new mongoose.Schema({
    // Reference to Property
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration',
        required: true,
        index: true
    },

    // Plan Information
    planName: {
        type: String,
        required: true,
        trim: true
    },

    // Plan Type (which meal plans are included)
    planTypes: {
        ep: { type: Boolean, default: false },
        cp: { type: Boolean, default: false },
        map: { type: Boolean, default: false },
        ap: { type: Boolean, default: false }
    },

    // Number of days for this rate plan
    numberOfDays: {
        type: Number,
        required: true,
        min: 0,
        default: 0
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

// Compound index for efficient queries
RatePlanSchema.index({ propertyId: 1, planName: 1 }, { unique: true });
RatePlanSchema.index({ propertyId: 1, isActive: 1 });

// Virtual to get selected plan types as array
RatePlanSchema.virtual('selectedPlanTypes').get(function () {
    const types = [];
    if (this.planTypes.ep) types.push('EP');
    if (this.planTypes.cp) types.push('CP');
    if (this.planTypes.map) types.push('MAP');
    if (this.planTypes.ap) types.push('AP');
    return types;
});

// Static method to get all rate plans for a property
RatePlanSchema.statics.getPropertyRatePlans = async function (propertyId, activeOnly = false) {
    const query = { propertyId };
    if (activeOnly) {
        query.isActive = true;
    }
    return this.find(query).sort({ createdAt: -1 });
};

// Create or use existing model
const RatePlan = mongoose.models.RatePlan || mongoose.model('RatePlan', RatePlanSchema);

export default RatePlan;
