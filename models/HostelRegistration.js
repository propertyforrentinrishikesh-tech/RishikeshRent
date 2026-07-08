import { Schema, models, model } from "mongoose";

const HostelRegistrationSchema = new Schema({
    // Step 1: Basic Detail
    propertyName: { type: String, required: true },
    contactNumber: { type: String },
    email: { type: String },
    locationType: { type: String, required: true },
    propertyFor: { type: String, required: true },
    propertyType: { type: String, required: true },
    address1: { type: String },
    address2: { type: String },
    address3: { type: String },
    address4: { type: String },
    landmark: { type: String },

    // Step 2: Gallery
    primaryImage: { url: String, key: String },
    outsideBuilding: { url: String, key: String },
    roomImage: { url: String, key: String },
    bathroomImage: { url: String, key: String },
    otherImage: { url: String, key: String },

    // Step 3: Monthly Rent
    monthlyRent: { type: String },
    securityDeposit: { type: String }, // e.g. '1', '2'
    totalSecurityDepositAmount: { type: String },
    availability: { type: String },
    specialNote: { type: String },
    commitment3to6Months: { type: Boolean, default: false },
    commitment11Months: { type: Boolean, default: false },

    // Step 4: Essential Amenities
    amenities: {
        water: Boolean,
        electricity: Boolean,
        internet: Boolean,
        stairs: Boolean,
        roomOnly: Boolean,
        preFixSingleBed: Boolean,
        sharingBathroom: Boolean,
        kitchen: Boolean,
        roomAlmirah: Boolean,
        rooftopTerraceAccess: Boolean,
        parking: Boolean,
        balcony: Boolean,
        lift: Boolean,
        guestsMax3: Boolean,
        preFixDoubleBed: Boolean,
        privateBathroom: Boolean,
        bathroomGeyser: Boolean,
        kitchenGeyser: Boolean,
        chair: Boolean,
        outdoorSeating: Boolean,
    },
    // Final terms
    couplesWelcome: { type: Boolean, default: false },
    petsWelcome: { type: Boolean, default: false },
    
    // System fields
    status: { type: String, default: 'Pending Review' },
    caseIdNumber: { type: String }
}, { timestamps: true });

// Pre-save hook to generate case ID if missing
HostelRegistrationSchema.pre('save', function (next) {
    if (!this.caseIdNumber) {
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.caseIdNumber = `CASE-${randomStr}-${Date.now().toString().slice(-4)}`;
    }
    next();
});

export default models.HostelRegistration || model("HostelRegistration", HostelRegistrationSchema);
