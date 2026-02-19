import { Schema, models, model } from "mongoose";

const HotelGaliSchema = new Schema({
    locationType: { type: String },
    subLocationType: { type: String },
    galiName: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.HotelGali || model("HotelGali", HotelGaliSchema);
