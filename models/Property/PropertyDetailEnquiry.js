import mongoose from "mongoose";

const PropertyEnquirySchema = new mongoose.Schema(
    {
        guestName: { type: String },
        phone: { type: String, required: true },
        email: { type: String },
        checkInDate: { type: Date },
        totalPersons: { type: Number },
        specialRequests: { type: String },
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

export default mongoose.models.PropertyDetailEnquiry ||
    mongoose.model("PropertyDetailEnquiry", PropertyEnquirySchema);
