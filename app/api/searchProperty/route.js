import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PropertyDetails from '@/models/PropertyDetails';

export async function GET(request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location');
        const propertyFor = searchParams.get('propertyFor');
        const propertyType = searchParams.get('propertyType');

        // If no search parameters, return available filters
        if (!location && !propertyFor && !propertyType) {
            const [locations, propertyTypes] = await Promise.all([
                PropertyDetails.distinct('locationType'),
                PropertyDetails.distinct('propertyType')
            ]);

            return NextResponse.json({
                success: true,
                data: {
                    filters: {
                        locations: locations.filter(Boolean).sort(),
                        propertyTypes: propertyTypes.filter(Boolean).sort()
                    }
                }
            });
        }

        // Build the query for property search
        const query = {};
        
        if (location) {
            query.locationType = { $regex: new RegExp(location, 'i') };
        }
        
        if (propertyFor) {
            query.propertyFor = propertyFor.toLowerCase();
        }
        
        if (propertyType) {
            query.propertyType = { $regex: new RegExp(propertyType, 'i') };
        }

        // Search for properties with the given filters
        const properties = await PropertyDetails.find(query)
            .select('propertyName propertyType locationType mainImage rentPrice isActive isTrending')
            .sort({ isTrending: -1, createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: {
                properties,
                count: properties.length
            }
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