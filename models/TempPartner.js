import mongoose from 'mongoose';

const TempPartnerSchema = new mongoose.Schema({
    propertyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '10m' }, // Automatically delete after 10 minutes
});

const TempPartner = mongoose.models.TempPartner || mongoose.model('TempPartner', TempPartnerSchema);

export default TempPartner;
