import mongoose from 'mongoose';

const CommissionRateSchema = new mongoose.Schema({
    // Reference to Property
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration',
        required: true,
        index: true
    },

    // Commission Rate (0-30%)
    rate: {
        type: Number,
        required: true,
        min: 0,
        max: 30
    },

    // Effective Date
    effectiveDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },

    // Notes
    notes: {
        type: String,
        default: ''
    },

    // Created/Updated tracking
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration'
    }
}, {
    timestamps: true
});

// Indexes
CommissionRateSchema.index({ propertyId: 1, effectiveDate: -1 });
CommissionRateSchema.index({ propertyId: 1, isActive: 1 });

// Virtual for percentage display
CommissionRateSchema.virtual('ratePercentage').get(function () {
    return `${this.rate}%`;
});

const CommissionRate = mongoose.models.CommissionRate || mongoose.model('CommissionRate', CommissionRateSchema);

export default CommissionRate;
