import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PropertyRegistration from '@/models/PropertyRegistration';
import bcrypt from 'bcryptjs';

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

        // Successful login - return property details (excluding sensitive data)
        return NextResponse.json({
            success: true,
            message: 'Login successful',
            property: {
                _id: property._id,
                propertyName: property.propertyName,
                hotelCode: property.hotelCode,
                partnerUsername: property.partnerUsername,
                ownerName: property.ownerName,
                ownerEmail: property.ownerEmail,
                category: property.category,
                propertyType: property.propertyType,
                isActive: property.isActive
            }
        });

    } catch (error) {
        console.error('Hotel Partner Login Error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during login'
        }, { status: 500 });
    }
}
