import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PropertyRegistration from '@/models/PropertyRegistration';

export async function POST(request) {
    try {
        await connectDB();

        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({
                success: false,
                message: 'Email is required'
            }, { status: 400 });
        }

        // Find property by owner email
        const property = await PropertyRegistration.findOne({
            ownerEmail: email.toLowerCase().trim(),
            status: 'approved'
        });

        if (!property) {
            return NextResponse.json({
                success: false,
                message: 'No approved property found for this email address'
            }, { status: 404 });
        }

        // Check if account is active
        if (!property.isActive) {
            return NextResponse.json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            }, { status: 403 });
        }

        // Successful login - return property details
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
        console.error('Hotel Partner Google Login Error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during login'
        }, { status: 500 });
    }
}
