import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import TempPartner from '@/models/TempPartner';
import { encode } from 'next-auth/jwt';

export async function POST(request) {
    try {
        await connectDB();

        const { email, otp } = await request.json();

        // Validate input
        if (!email || !otp) {
            return NextResponse.json(
                { message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const emailKey = email.toLowerCase().trim();

        // Find the temporary partner
        const tempPartner = await TempPartner.findOne({ email: emailKey });
        if (!tempPartner) {
            return NextResponse.json(
                { message: 'OTP not found or expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Verify the OTP
        if (tempPartner.otp !== otp.trim()) {
            return NextResponse.json(
                { message: 'Invalid OTP. Please check and try again.' },
                { status: 400 }
            );
        }

        // OTP is valid - Call registration API to create partner account
        try {
            const registerResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/partner/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        propertyName: tempPartner.propertyName,
                        contactNumber: tempPartner.contactNumber,
                        email: emailKey,
                    }),
                }
            );

            const registerData = await registerResponse.json();

            if (registerData.success) {
                // Delete the temporary partner after successful registration
                await TempPartner.deleteOne({ email: emailKey });

                // Create a JWT token for the registration session
                const secret = process.env.NEXTAUTH_SECRET;
                const token = await encode({
                    token: {
                        email: emailKey,
                        propertyName: tempPartner.propertyName,
                        contactNumber: tempPartner.contactNumber,
                        isRegistrationTemp: true
                    },
                    secret,
                });

                const response = NextResponse.json(
                    {
                        success: true,
                        message: registerData.message,
                        partner: registerData.partner,
                    },
                    { status: 200 }
                );

                // Set HttpOnly Cookie
                response.cookies.set('partner_registration_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24, // 24 hours
                    path: '/',
                });

                return response;
            } else {
                return NextResponse.json(
                    {
                        success: false,
                        message: registerData.message || 'Failed to create account',
                    },
                    { status: 500 }
                );
            }
        } catch (registerError) {
            console.error('Registration error:', registerError);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to create partner account',
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
