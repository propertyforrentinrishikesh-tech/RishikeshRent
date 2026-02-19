import { Schema, models, model } from "mongoose";

const HotelLocationTypeSchema = new Schema({
    locationType: { type: String},
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default models.HotelLocationType || model("HotelLocationType", HotelLocationTypeSchema);