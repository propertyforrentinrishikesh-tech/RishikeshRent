// app/api/searchPropertyDetails/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PropertyDetails from '@/models/PropertyDetails';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const propertyType = searchParams.get('propertyType');
        const locationType = searchParams.get('locationType');
        const propertyFor = searchParams.get('propertyFor');



        // Build the query
        const query = {};
        if (propertyType) query.propertyType = propertyType;
        if (locationType) query.locationType = locationType;
        if (propertyFor) query.propertyFor = propertyFor;

        // Search for properties
        const properties = await PropertyDetails.find(query)
            .select('propertyName propertyType locationType mainImage galleryImages video contactAddress brokerName contactNumbers rentPrice highlights isActive isTrending propertyFor propertyNameSlug')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: properties,
            count: properties.length
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to search properties',
                details: error.message
            },
            { status: 500 }
        );
    }
}