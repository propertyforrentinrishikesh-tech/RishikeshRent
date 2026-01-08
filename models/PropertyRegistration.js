import mongoose from 'mongoose';

const PropertyRegistrationSchema = new mongoose.Schema({
    // Step 1: Property Category
    category: {
        type: String,
        required: true,
        enum: ['apartment', 'homes', 'hotel', 'alternative']
    },

    // Step 2: Property Type
    propertyType: {
        type: String,
    },
    customPropertyType: String,

    // Furnishing Status (for apartments)
    furnishingStatus: {
        type: String,
        enum: ['semi-furnished', 'fully-furnished', null],
        default: null
    },

    // Apartment-specific: Where else is the property listed
    listedWebsites: {
        type: [String],
        default: []
    },
    customWebsite: String,
    airbnbImportLink: String,

    // Home-specific: How many apartments are you listing?
    homeListingType: {
        type: String,
        enum: ['one', 'multiple', '', null],
        default: null
    },

    // Alternative-specific fields
    alternativeSubtype: String,
    alternativeBookingType: {
        type: String,
        enum: ['entire-place', 'private-room', '', null],
        default: null
    },

    // Step 3: Property Size
    numberOfRooms: {
        type: Number,
    },
    numberOfFloors: {
        type: Number,
    },

    // Step 4: Property Confirmation
    propertyConfirmation: {
        type: String,
        enum: ['yes', 'no']
    },

    // Step 5: Property Location
    apartmentOrFloor: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    pinCode: String,
    googleLocationCode: String,
    googleBusinessProfileCode: String,

    // Step 6: Property Details & Facilities
    propertyName: {
        type: String,
    },
    starRating: {
        type: String,
    },
    isChainProperty: {
        type: String,
        default: 'false'
    },
    chainName: String,
    ownershipType: String,
    facilities: [String],

    // Step 7: Services (Breakfast & Parking)
    servesBreakfast: {
        type: Boolean,
        default: false
    },
    breakfastIncluded: Boolean,
    breakfastPrice: Number,
    breakfastTypes: [String],
    parkingAvailable: String,
    parkingCost: Number,
    parkingCostPeriod: String,
    parkingReservation: String,
    parkingLocation: String,
    parkingType: String,

    // Step 8: Languages Spoken
    languagesSpoken: [String],

    // Step 9: House Rules
    checkInFrom: String,
    checkInUntil: String,
    checkOutFrom: String,
    checkOutUntil: String,
    allowChildren: {
        type: Boolean,
        default: false
    },
    allowPets: {
        type: String,
        default: 'no',
        enum: ['yes', 'no', 'upon-request']
    },
    petCharges: Number,

    // Step 10: Rooms (Array of room objects)
    rooms: [{
        roomType: String,
        numberOfRooms: Number,
        bedTypes: [{
            id: String,
            quantity: Number
        }],
        maxGuests: Number,
        roomSize: Number,
        roomSizeUnit: String,
        smokingAllowed: Boolean,
        privateBathroom: Boolean,
        bathroomItems: [String],
        roomFacilities: [String],
        outdoorViews: [String],
        foodDrink: [String],
        pricePerNight: Number
    }],

    // Step 11: Room Images
    roomImages: [{
        roomIndex: Number,
        primaryImage: [{ url: String, key: String }],
        roomImage: [{ url: String, key: String }],
        bathroomImage: [{ url: String, key: String }]
    }],

    // Step 12: Property Images
    propertyImages: {
        primary: [{ url: String, key: String }],
        exterior: [{ url: String, key: String }],
        interior: [{ url: String, key: String }],
        reception: [{ url: String, key: String }],
        restaurant: [{ url: String, key: String }],
        parking: [{ url: String, key: String }],
        other: [{ url: String, key: String }]
    },

    // Step 13: Owner, Property & Bank Information
    ownerName: String,
    ownerEmail: String,
    ownerContact: String,
    aadhaarNumber: String,
    profilePhoto: { url: String, key: String },

    officialPropertyName: String,
    officialEmail: String,
    officialContact: String,
    alternativeContact: String,
    propertyPanNumber: String,
    propertyPanDocument: { url: String, key: String },
    gstNumber: String,
    gstDocument: { url: String, key: String },

    accountNumber: String,
    bankName: String,
    accountHolderName: String,
    ifscCode: String,
    bankAddress: String,
    cancelledCheque: { url: String, key: String },

    partnerUsername: { type: String },
    partnerPassword: { type: String },
    partnerPasswordPlain: { type: String },
    hotelCode: { type: String },
    isActive: {
        type: Boolean,
        default: true
    },

    // Metadata
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'rejected'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create or use existing model
const PropertyRegistration = mongoose.models.PropertyRegistration ||
    mongoose.model('PropertyRegistration', PropertyRegistrationSchema);

export default PropertyRegistration;