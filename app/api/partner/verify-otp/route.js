import { NextResponse } from 'next/server';

// This should match the otpStore from send-otp route
// In production, use Redis or database
const otpStore = new Map();

export async function POST(request) {
    try {
        const { email, otp } = await request.json();

        // Validate input
        if (!email || !otp) {
            return NextResponse.json(
                { message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Get stored OTP data
        const storedData = otpStore.get(email);

        if (!storedData) {
            return NextResponse.json(
                { message: 'OTP not found or expired' },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email);
            return NextResponse.json(
                { message: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (storedData.otp !== otp) {
            return NextResponse.json(
                { message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // OTP is valid - remove from store
        otpStore.delete(email);

        // Here you would typically:
        // 1. Create the partner account in database
        // 2. Send welcome email
        // 3. Generate session token

        return NextResponse.json(
            {
                message: 'Email verified successfully',
                verified: true,
                email: email,
                propertyName: storedData.propertyName,
                contactNumber: storedData.contactNumber
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
