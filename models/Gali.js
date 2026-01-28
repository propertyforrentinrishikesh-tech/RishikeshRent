import { Schema, models, model } from "mongoose";

const GaliSchema = new Schema({
    locationType: { type: String},
    subLocationType: { type: String},
    galiName: { type: String},
    order: { type: Number, required: true },
}, { timestamps: true });

export default models.Gali || model("Gali", GaliSchema);