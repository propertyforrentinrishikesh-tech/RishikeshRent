import mongoose from 'mongoose';

const TempBookingOtpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '10m' }, // Automatically delete after 10 minutes
});

const TempBookingOtp = mongoose.models.TempBookingOtp || mongoose.model('TempBookingOtp', TempBookingOtpSchema);

export default TempBookingOtp;
