import mongoose from "mongoose";

const PropertyEnquirySchema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        phone: { type: String, required: true },
        email: { type: String },
        contactMethod: { type: String, enum: ["call", "whatsapp", "email"], default: "call" },
        sourcePage: { type: String },
        message: { type: String },
        propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyDetails" },
        propertyName: { type: String },
        propertyNameSlug: { type: String },
        locationType: { type: String },
        subLocationType: { type: String },
        propertyPrice: { type: Number },
        propertyImage: { type: String },
        status: {
            type: String,
            enum: ["New", "Contacted", "Interested", "Not Interested", "Closed"],
            default: "New",
        },
        adminNote: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.PropertyEnquiry ||
    mongoose.model("PropertyEnquiry", PropertyEnquirySchema);
