import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import TempBookingOtp from '@/models/Property/TempBookingOtp';

export async function POST(request) {
    try {
        await connectDB();

        const { email, otp } = await request.json();

        // Validate input
        if (!email || !otp) {
            return NextResponse.json(
                { success: false, message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Find the temporary OTP record
        const tempOtp = await TempBookingOtp.findOne({
            email: email.toLowerCase().trim()
        });

        if (!tempOtp) {
            return NextResponse.json(
                { success: false, message: 'OTP expired or not found. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (tempOtp.otp !== otp) {
            return NextResponse.json(
                { success: false, message: 'Invalid OTP. Please try again.' },
                { status: 400 }
            );
        }

        // OTP verified successfully, delete the temporary record
        await TempBookingOtp.deleteOne({ _id: tempOtp._id });

        return NextResponse.json(
            { success: true, message: 'Email verified successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify Booking OTP error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
