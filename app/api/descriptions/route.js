import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import PropertyDescription from '@/models/PropertyDescription';

export async function POST(request) {
    try {
        await connectDB();

        const data = await request.json();
        const { propertyId, rooms, propertyProfile, highlights, specialNote, howToConnect } = data;

        if (!propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Property ID is required'
            }, { status: 400 });
        }

        // Find existing description or create new one
        let descriptionDoc = await PropertyDescription.findOne({ propertyId });

        if (descriptionDoc) {
            // Update existing
            descriptionDoc.rooms = rooms || [];
            descriptionDoc.propertyProfile = propertyProfile || {};
            descriptionDoc.highlights = highlights || {};
            descriptionDoc.specialNote = specialNote || {};
            descriptionDoc.howToConnect = howToConnect || {};

            await descriptionDoc.save();
        } else {
            // Create new
            descriptionDoc = await PropertyDescription.create({
                propertyId,
                rooms: rooms || [],
                propertyProfile: propertyProfile || {},
                highlights: highlights || {},
                specialNote: specialNote || {},
                howToConnect: howToConnect || {}
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Descriptions saved successfully',
            data: descriptionDoc
        });

    } catch (error) {
        console.error('Error saving descriptions:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error.message
        }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');

        if (!propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Property ID is required'
            }, { status: 400 });
        }

        const descriptionDoc = await PropertyDescription.findOne({ propertyId });

        return NextResponse.json({
            success: true,
            data: descriptionDoc || null
        });

    } catch (error) {
        console.error('Error fetching descriptions:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error.message
        }, { status: 500 });
    }
}
