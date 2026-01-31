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
            'accountNumber bankName accountHolderName ifscCode bankAddress cancelledCheque secondaryAccountNumber secondaryBankName secondaryAccountHolderName secondaryIfscCode secondaryBankAddress secondaryCancelledCheque gstNumber gstDocument'
        );

        if (!property) {
            return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: property
        });

    } catch (error) {
        console.error('Error fetching bank information:', error);
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
        ).select('accountNumber bankName accountHolderName ifscCode bankAddress cancelledCheque secondaryAccountNumber secondaryBankName secondaryAccountHolderName secondaryIfscCode secondaryBankAddress secondaryCancelledCheque gstNumber gstDocument');

        if (!updatedProperty) {
            return NextResponse.json({ success: false, message: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Bank information updated successfully',
            data: updatedProperty
        });

    } catch (error) {
        console.error('Error updating bank information:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}
