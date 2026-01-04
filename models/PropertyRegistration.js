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
        required: true
    },
    customPropertyType: String,

    // Step 3: Property Size
    numberOfRooms: {
        type: Number,
        required: true,
        min: 1
    },
    numberOfFloors: {
        type: Number,
        required: true,
        min: 1
    },

    // Step 4: Property Confirmation
    propertyConfirmation: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },

    // Step 5: Property Location
    apartmentOrFloor: String,
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: String,
    city: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    googleLocationCode: String,
    googleBusinessProfileCode: String,

    // Step 6: Property Details & Facilities
    propertyName: {
        type: String,
        required: true
    },
    starRating: {
        type: String,
        required: true
    },
    isChainProperty: {
        type: String,
        default: 'false'
    },
    chainName: String,
    ownershipType: {
        type: String,
        required: true
    },
    facilities: [{
        type: String
    }],

    // Step 7: Services (Breakfast & Parking)
    servesBreakfast: {
        type: Boolean,
        default: false
    },
    breakfastIncluded: Boolean,
    breakfastPrice: Number,
    breakfastTypes: [{
        type: String
    }],
    parkingAvailable: String,
    parkingCost: Number,
    parkingCostPeriod: String,
    parkingReservation: String,
    parkingLocation: String,
    parkingType: String,

    // Step 8: Languages Spoken
    languagesSpoken: [{
        type: String
    }],

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
        roomName: String,
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

    // Step 11: Room Images (to be implemented with file uploads)
    roomImages: [{
        roomIndex: Number,
        primaryImage: String,
        roomImage: String,
        bathroomImage: String
    }],

    // Step 12: Property Images
    propertyImages: {
        primary: [String],
        exterior: [String],
        interior: [String],
        reception: [String],
        restaurant: [String],
        parking: [String],
        other: [String]
    },

    // Step 13: Owner, Property & Bank Information
    ownerName: String,
    ownerEmail: String,
    ownerContact: String,
    panNumber: String,
    panDocument: String,
    aadhaarNumber: String,
    profilePhoto: String,

    officialPropertyName: String,
    officialEmail: String,
    officialContact: String,
    alternativeContact: String,
    propertyPanNumber: String,
    propertyPanDocument: String,
    gstNumber: String,
    gstDocument: String,

    accountNumber: String,
    accountHolderName: String,
    ifscCode: String,
    bankAddress: String,
    cancelledCheque: String,

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