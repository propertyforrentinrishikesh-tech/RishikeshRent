import { Schema, models, model } from "mongoose";

const PromotinalBannerSchema = new Schema({
    buttonLink: { type: String},
    image: { url: { type: String }, key: { type: String } },
    section: { type: String, default: "frontend", index: true },
}, { timestamps: true });

export default models.PromotinalBanner || model("PromotinalBanner", PromotinalBannerSchema);