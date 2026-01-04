import mongoose from 'mongoose'

const CustomFacilitySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

export default mongoose.models.CustomFacility || mongoose.model('CustomFacility', CustomFacilitySchema)
