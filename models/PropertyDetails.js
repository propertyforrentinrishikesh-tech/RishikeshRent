// models/PropertyDetails.js
import mongoose from 'mongoose';

const propertyDetailsSchema = new mongoose.Schema({
    // Property Basic Info
    propertyType: { type: String, required: true },     
    // Media
    mainImage: {
        url: { type: String, required: true },
        key: { type: String, required: true }
    },
    galleryImages: [{
        url: { type: String, required: true },
        key: { type: String, required: true }
    }],
    video: {
        type: { type: String, enum: ['upload', 'youtube'] },
        url: { type: String },
        key: { type: String },
        youtubeLink: { type: String }
    },
    locationType: { type: String, required: true },
    contactAddress: { type: String },    
    brokerName: { type: String },
    contactNumbers: [{ type: String }],
    rentPrice: { type: Number, required: true },
    propertyName: { type: String, required: true },
    propertyNameSlug: { type: String, unique: true, sparse: true },
    highlights: [{ type: String }],
    propertyFor: { type: String, enum: ['residential', 'commercial'] },
    isTrending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create a compound index for better query performance
propertyDetailsSchema.index({ city: 1, propertyType: 1, propertyFor: 1, price: 1 });
// Create a text index for search
propertyDetailsSchema.index({
    propertyName: 'text',
    propertyDescription: 'text',
    locationType: 'text',
    address: 'text'
});
propertyDetailsSchema.index({ propertyType: 1 });
propertyDetailsSchema.index({ locationType: 1 });
propertyDetailsSchema.index({ status: 1 });
propertyDetailsSchema.index({ price: 1 });
propertyDetailsSchema.index({ propertyType: 1, locationType: 1 }); // Compound index for common queries

// Text index for full-text search
propertyDetailsSchema.index({
    propertyName: 'text',
    description: 'text',
    location: 'text',
    address: 'text'
}, {
    weights: {
        propertyName: 5,
        location: 3,
        address: 2,
        description: 1
    },
    name: 'property_search_index'
});


const PropertyDetails = mongoose.models.PropertyDetails || mongoose.model('PropertyDetails', propertyDetailsSchema);

export default PropertyDetails;