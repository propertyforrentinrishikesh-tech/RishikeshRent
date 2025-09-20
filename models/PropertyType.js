import { Schema, models, model } from "mongoose";

const PropertyTypeSchema = new Schema({
    propertyType: { type: String},
    order: { type: Number, required: true },
}, { timestamps: true });

export default models.PropertyType || model("PropertyType", PropertyTypeSchema);