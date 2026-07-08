import { Schema, models, model } from "mongoose";

const PropertySubLocationSchema = new Schema({
    locationType: { type: String},
    subLocationType: { type: String},
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.PropertySubLocation || model("PropertySubLocation", PropertySubLocationSchema);