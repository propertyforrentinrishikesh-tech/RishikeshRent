import mongoose from 'mongoose';

const PartnerUserSchema = new mongoose.Schema({
    // Basic Information
    propertyName: {
        type: String,
        required: [true, 'Property name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number']
    },

    // Auto-generated credentials
    hotelCode: {
        type: String,
        unique: true,
        sparse: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },
    passwordPlain: {
        type: String // Store temporarily for welcome email
    },

    // Email verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifiedAt: {
        type: Date
    },

    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['pending-verification', 'verified', 'active', 'suspended'],
        default: 'pending-verification'
    },

    // Link to full property registration (if completed)
    propertyRegistrationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration'
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
PartnerUserSchema.index({ email: 1 });
PartnerUserSchema.index({ hotelCode: 1 });
PartnerUserSchema.index({ username: 1 });

// Create or use existing model
const PartnerUser = mongoose.models.PartnerUser ||
    mongoose.model('PartnerUser', PartnerUserSchema);

export default PartnerUser;
