import { Schema, models, model } from "mongoose";

const LocationTypeSchema = new Schema({
    locationType: { type: String},
    order: { type: Number, required: true },
}, { timestamps: true });

export default models.LocationType || model("LocationType", LocationTypeSchema);