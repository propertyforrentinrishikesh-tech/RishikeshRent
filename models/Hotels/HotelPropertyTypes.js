import { Schema, models, model } from "mongoose";

const HotelPropertyTypeSchema = new Schema({
    propertyType: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.HotelPropertyTypes || model("HotelPropertyTypes", HotelPropertyTypeSchema);