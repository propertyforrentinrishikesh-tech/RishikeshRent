import { Schema, models, model } from "mongoose";

const PiligrimageBannerSchema = new Schema({
    image: { url: { type: String }, key: { type: String } },
}, { timestamps: true });

export default models.PiligrimageBanner || model("PiligrimageBanner", PiligrimageBannerSchema);