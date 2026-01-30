import mongoose from 'mongoose';

const PropertyDescriptionSchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRegistration',
        required: true,
        unique: true
    },
    // Array to store description for each room
    rooms: [{
        roomIndex: Number, // To map back to propertyData.rooms index
        roomType: String,
        heading: String,
        description: String
    }],
    // Global sections
    propertyProfile: {
        heading: String,
        description: String
    },
    highlights: {
        heading: String,
        description: String
    },
    specialNote: {
        heading: String,
        description: String
    },
    howToConnect: {
        heading: String,
        description: String
    }
}, {
    timestamps: true
});

// Create or use existing model
const PropertyDescription = mongoose.models.PropertyDescription ||
    mongoose.model('PropertyDescription', PropertyDescriptionSchema);

export default PropertyDescription;
