import mongoose from "mongoose";

const PropertyBookingSchema = new mongoose.Schema(
  {
    bookingRef: { type: String, unique: true, sparse: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyDetails" },
    propertyName: { type: String, required: true },
    propertyNameSlug: { type: String },
    propertyImage: { type: String },
    propertyAddress: { type: String },
    locationType: { type: String },
    subLocationType: { type: String },
    guestTitle: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String},
    phone: { type: String, required: true },
    email: { type: String, required: true },
    totalPersons: { type: Number, default: 1 },
    checkInDate: { type: Date },
    idProofType: { type: String },
    idImage: {
      url: { type: String },
      key: { type: String },
    },
    totalAmount: { type: Number, default: 0 },
    propertyPrice: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    message: { type: String },
    sourcePage: { type: String },
    adminNote: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.PropertyBooking || mongoose.model("PropertyBooking", PropertyBookingSchema);