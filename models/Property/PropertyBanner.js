import { Schema, models, model } from "mongoose";

const PropertyBannerSchema = new Schema({
    image: { url: { type: String }, key: { type: String } },
}, { timestamps: true });

export default models.PropertyBanner || model("PropertyBanner", PropertyBannerSchema);