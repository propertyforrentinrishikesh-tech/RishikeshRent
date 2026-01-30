import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import PropertyRegistration from "@/models/PropertyRegistration";

export async function POST(request) {
    try {
        await connectDB();

        const { propertyId, roomImages, propertyImages } = await request.json();

        if (!propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Property ID is required'
            }, { status: 400 });
        }

        const property = await PropertyRegistration.findById(propertyId);

        if (!property) {
            return NextResponse.json({
                success: false,
                message: 'Property not found'
            }, { status: 404 });
        }

        // Update property with new images
        property.roomImages = roomImages;
        property.propertyImages = propertyImages;

        await property.save();

        return NextResponse.json({
            success: true,
            message: 'Images updated successfully'
        });
    } catch (error) {
        console.error('Error updating images:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error.message
        }, { status: 500 });
    }
}
