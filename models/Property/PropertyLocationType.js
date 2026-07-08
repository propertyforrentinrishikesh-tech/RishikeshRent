import { Schema, models, model } from "mongoose";

const PropertyLocationTypeSchema = new Schema({
    locationType: { type: String},
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.PropertyLocationType || model("PropertyLocationType", PropertyLocationTypeSchema);