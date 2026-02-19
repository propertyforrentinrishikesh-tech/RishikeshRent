import { Schema, models, model } from "mongoose";

const HotelSubLocationSchema = new Schema({
    locationType: { type: String},
    subLocationType: { type: String},
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.HotelSubLocation || model("HotelSubLocation", HotelSubLocationSchema);