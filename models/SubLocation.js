import { Schema, models, model } from "mongoose";

const SubLocationSchema = new Schema({
    locationType: { type: String},
    subLocationType: { type: String},
    order: { type: Number, required: true },
}, { timestamps: true });

export default models.SubLocation || model("SubLocation", SubLocationSchema);