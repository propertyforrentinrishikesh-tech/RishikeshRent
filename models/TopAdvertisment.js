import { Schema, models, model } from "mongoose";

const TopAdvertismentBannerSchema = new Schema({
    title:{type:String},
    buttonLink: { type: String},
    isActive:{default:true,type:Boolean},
    section:{type:String,default:"frontend"},
}, { timestamps: true });

export default models.TopAdvertismentBanner || model("TopAdvertismentBanner", TopAdvertismentBannerSchema);