import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import PropertyRegistration from '@/models/PropertyRegistration';

// GET endpoint to retrieve only approved property registrations
export async function GET(request) {
    try {
        await connectDB();

        // Get only approved properties
        const approvedProperties = await PropertyRegistration.find({ status: 'approved' })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            count: approvedProperties.length,
            data: approvedProperties
        });

    } catch (error) {
        console.error('Get Approved Properties Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to retrieve approved properties',
            message: error.message
        }, { status: 500 });
    }
}