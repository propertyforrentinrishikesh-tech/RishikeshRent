import { Schema, models, model } from "mongoose";

const ContactSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        guests: { type: String, required: false },
        plan: { type: String, required: false },
        date: { type: String, required: false },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

export default models.Contact || model("Contact", ContactSchema);