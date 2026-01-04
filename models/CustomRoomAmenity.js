import mongoose from 'mongoose'

const CustomRoomAmenitySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['bathroom', 'general', 'outdoor', 'fooddrink']
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

// Create compound index for category and name
CustomRoomAmenitySchema.index({ category: 1, name: 1 }, { unique: true })

export default mongoose.models.CustomRoomAmenity || mongoose.model('CustomRoomAmenity', CustomRoomAmenitySchema)
