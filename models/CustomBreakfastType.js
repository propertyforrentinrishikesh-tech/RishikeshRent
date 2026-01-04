import mongoose from 'mongoose'

const CustomBreakfastTypeSchema = new mongoose.Schema({
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

export default mongoose.models.CustomBreakfastType || mongoose.model('CustomBreakfastType', CustomBreakfastTypeSchema)
