import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PropertyRegistration from '@/models/PropertyRegistration';
import bcrypt from 'bcryptjs';
import { encode } from 'next-auth/jwt';
export async function POST(request) {
    try {
        await connectDB();

        const { hotelCode, username, password } = await request.json();

        // Validate input
        if (!hotelCode || !username || !password) {
            return NextResponse.json({
                success: false,
                message: 'All fields are required'
            }, { status: 400 });
        }

        // Find property by hotel code and username
        const property = await PropertyRegistration.findOne({
            hotelCode: hotelCode.trim(),
            partnerUsername: username.trim(),
            status: 'approved' // Only approved properties can login
        });

        if (!property) {
            return NextResponse.json({
                success: false,
                message: 'Invalid hotel code or username'
            }, { status: 401 });
        }

        // Check if account is active
        if (!property.isActive) {
            return NextResponse.json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            }, { status: 403 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, property.partnerPassword);

        if (!isPasswordValid) {
            return NextResponse.json({
                success: false,
                message: 'Invalid password'
            }, { status: 401 });
        }

        // Successful login - return complete property details (excluding sensitive data)
        // Successful login - return complete property details (excluding sensitive data)
        const propertyData = property.toObject();
        delete propertyData.partnerPassword; // Remove password from response

        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            property: propertyData
        });

        // Create JWT Token
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await encode({
            token: {
                id: property._id,
                role: 'partner',
                hotelCode: property.hotelCode,
                username: property.partnerUsername
            },
            secret,
        });

        // Set HttpOnly Cookie
        response.cookies.set('partner_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Hotel Partner Login Error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during login'
        }, { status: 500 });
    }
}
