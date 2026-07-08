import { Schema, models, model } from "mongoose";

const PropertyTypeSchema = new Schema({
    propertyType: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.PropertyTypes || model("PropertyTypes", PropertyTypeSchema);