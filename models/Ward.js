import { Schema, models, model } from "mongoose";

const WardSchema = new Schema({
    locationType: { type: String},
    subLocationType: { type: String},
    wardName:{type:String},
    order: { type: Number, required: true },
}, { timestamps: true });

export default models.Ward || model("Ward", WardSchema);