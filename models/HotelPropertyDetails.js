// models/HotelPropertyDetails.js
import mongoose from 'mongoose';

const hotelPropertyDetailsSchema = new mongoose.Schema({
    // Basic Property Information
    propertyType: { type: String, required: true },
    propertyFor: { type: String, enum: ['residential', 'commercial'] },
    propertyName: { type: String, required: true },
    propertyNameSlug: { type: String, unique: true, sparse: true },
    locationType: { type: String, required: true },
    subLocationType: { type: String },
    galiType: { type: String },
    contactAddress: { type: String },
    landMarkDetails: { type: String },
    googleLocation: { type: String },
    propertyForRentLocatedOn: { type: String },
    propertyFacingDirection: { type: String },

    // Media Files
    mainImage: {
        url: { type: String, required: true },
        key: { type: String, required: true }
    },
    galleryImages: [{
        url: { type: String },
        key: { type: String }
    }],
    video: {
        type: { type: String, enum: ['upload', 'youtube'] },
        url: { type: String },
        key: { type: String },
        youtubeLink: { type: String }
    },

    // Owner/Broker Information
    brokerName: { type: String },
    ownerName: { type: String },
    sonDaughterWifeOf: { type: String },
    aadharCardNumber: { type: String },
    aadharImage: {
        url: { type: String },
        key: { type: String }
    },
    panCardNumber: { type: String },
    panImage: {
        url: { type: String },
        key: { type: String }
    },
    electricityBillImage: {
        url: { type: String },
        key: { type: String }
    },
    contactNumbers: [{ type: String }],
    emailAddresses: [{ type: String }],

    // Pricing & Charges
    rentPrice: { type: Number, required: true },
    maxRentPrice: { type: Number },
    electricityCharges: {
        include: { type: Boolean },
        amount: { type: String },
        type: { type: String }
    },
    waterCharges: {
        include: { type: Boolean },
        amount: { type: String },
        type: { type: String }
    },
    securityDeposit: {
        required: { type: Boolean },
        amount: { type: String },
        months: { type: String }
    },
    maintenanceCharges: {
        required: { type: Boolean },
        amount: { type: String },
        basis: { type: String }
    },

    // Property Highlights
    highlights: [{ type: String }],

    // Tenant Preferences
    familyMembers: { type: String },
    tenantTypeAllowed: [{ type: String }],
    customTenantTypes: [{ type: String }],
    stayAllowOnlyFor: { type: String },

    // Property Dimensions
    detailFor: { type: String },
    sizeUnit: { type: String },
    sizeLength: { type: String },
    sizeWidth: { type: String },
    sizeInFeet: { type: String },
    sizeInMeter: { type: String },

    // Power Backup
    powerBackupAvailable: { type: Boolean },
    powerBackupSources: {
        inverter: { type: Boolean, default: false },
        generator: { type: Boolean, default: false }
    },
    powerBackupCharge: { type: Boolean },

    // Room Details
    numberOfRooms: { type: Number, default: 0 },
    numberOfBedrooms: { type: String },
    roomAmenities: [{ type: String }],
    furnishingStatus: { type: String },
    furnishedAmenities: [{ type: String }],
    customFurnishedAmenitiesLabels: { type: mongoose.Schema.Types.Mixed },

    // Bathroom Details
    numberOfBathrooms: { type: Number, default: 0 },
    bathroomType: { type: String },
    bathroomStyle: { type: String },
    bathroomFeatures: [{ type: String }],
    customBathroomAmenities: [{ type: String }],

    // Parking Details
    parkingAvailable: { type: String },
    parkingType: { type: String },
    parkingStyle: { type: String },
    parkingAmenities: [{ type: String }],
    customParkingAmenities: [{ type: String }],
    parkingStyleOptions: [{ type: String }],
    customParkingStyles: [{ type: String }],

    // Security & Facilities
    lift: { type: String },
    cctv: { type: String },
    cctvLocation: { type: String },
    cctvFeatures: [{ type: String }],

    // Property Policies
    petAllowed: { type: String }, // Changed from Boolean to String (values: "allowed", "not_allowed", etc.)
    petShelter: { type: String },
    smokingAllowed: { type: String }, // Changed from Boolean to String
    muslimFamilyAllowed: { type: String },
    nonVegAllowed: { type: String },
    alcoholAllowed: { type: String }, // Changed from Boolean to String
    inRoomPartyAllowed: { type: String },
    outsideVisitorAllowed: { type: String },
    prohibitedGoods: { type: String },
    visitorEntry: { type: String },
    photographsVideos: { type: String },
    priorNotice: { type: String },
    priorNoticeTime: { type: String },

    // Availability & Stay
    propertyAvailableFrom: { type: String },
    minimumStayAllow: { type: String },
    checkIn: { type: String },
    checkOut: { type: String },
    lateNightTimeIn: { type: String },
    lateNightTimeOut: { type: String },
    lateNightEntryTime: { type: String },
    availableFrom: { type: String },
    minimumStay: { type: String },

    // Room Styles
    roomStyle: { type: String },
    roomStyleOptions: [{ type: String }],

    // Additional Fields
    floor: { type: String },
    balcony: { type: Boolean, default: false },
    rooftop: { type: Boolean, default: false },
    wheelchair: { type: Boolean, default: false },
    housekeeping: { type: Boolean, default: false },
    amenities: [{ type: String }],
    tenantType: { type: String },
    familyAllowed: { type: Boolean, default: false },
    vegetarianOnly: { type: Boolean, default: false },
    nonVegetarianAllowed: { type: Boolean, default: false },
    powerBackup: { type: String },
    powerBackupType: { type: String },

    // Status Fields
    isAvailable: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Declaration & Verification
    signatureUrl: { type: String },
    verificationDate: { type: String }, // Changed from Date to String to accept DD/MM/YYYY format
    declarationAccepted: { type: Boolean, default: false },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Pre-save middleware to update the updatedAt field
hotelPropertyDetailsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create indexes for better query performance
hotelPropertyDetailsSchema.index({ propertyType: 1 });
hotelPropertyDetailsSchema.index({ locationType: 1 });
hotelPropertyDetailsSchema.index({ propertyFor: 1 });
hotelPropertyDetailsSchema.index({ rentPrice: 1 });
hotelPropertyDetailsSchema.index({ isAvailable: 1 });
hotelPropertyDetailsSchema.index({ isTrending: 1 });
hotelPropertyDetailsSchema.index({ propertyNameSlug: 1 });

// Compound indexes for common queries
hotelPropertyDetailsSchema.index({ propertyType: 1, locationType: 1 });
hotelPropertyDetailsSchema.index({ propertyFor: 1, rentPrice: 1 });
hotelPropertyDetailsSchema.index({ locationType: 1, propertyType: 1, rentPrice: 1 });

// Text index for full-text search
hotelPropertyDetailsSchema.index({
    propertyName: 'text',
    locationType: 'text',
    contactAddress: 'text',
    landMarkDetails: 'text'
}, {
    weights: {
        propertyName: 5,
        locationType: 3,
        contactAddress: 2,
        landMarkDetails: 1
    },
    name: 'hotel_property_search_index'
});

const HotelPropertyDetails = mongoose.models.HotelPropertyDetails || mongoose.model('HotelPropertyDetails', hotelPropertyDetailsSchema);

export default HotelPropertyDetails;