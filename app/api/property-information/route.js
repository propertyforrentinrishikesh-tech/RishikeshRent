import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import PropertyRegistration from '@/models/PropertyRegistration';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Property ID is required' }, { status: 400 });
        }

        const property = await PropertyRegistration.findById(id).select(
            'officialPropertyName officialEmail officialContact alternativeContact propertyPanNumber propertyPanDocument gstNumber gstDocument RegistrationDocument hotelRegistrationDocument otherDocument'
        );

        if (!property) {
            return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: property
        });

    } catch (error) {
        console.error('Error fetching property information:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { propertyId, ...updateData } = data;

        if (!propertyId) {
            return NextResponse.json({ success: false, message: 'Property ID is required' }, { status: 400 });
        }

        const updatedProperty = await PropertyRegistration.findByIdAndUpdate(
            propertyId,
            { $set: updateData },
            { new: true }
        ).select('officialPropertyName officialEmail officialContact alternativeContact propertyPanNumber propertyPanDocument gstNumber gstDocument RegistrationDocument hotelRegistrationDocument otherDocument');

        if (!updatedProperty) {
            return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Property information updated successfully',
            data: updatedProperty
        });

    } catch (error) {
        console.error('Error updating property information:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}
