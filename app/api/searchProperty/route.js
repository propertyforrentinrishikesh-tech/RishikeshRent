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
            // Replace hyphens with space to handle slugs, allow flexible matching
            const flexibleLocation = location.replace(/-/g, '[\\s-]*');
            query.locationType = { $regex: new RegExp(flexibleLocation, 'i') };
        }

        if (propertyFor) {
            query.propertyFor = propertyFor.toLowerCase();
        }

        if (propertyType) {
            // Replace hyphens with wildcard/space to match db values like "Home & Villa" vs slug "home-villa"
            // or "home-with-owner" vs "Home With Owner"
            const flexibleType = propertyType.replace(/-/g, '[\\s&-]*');
            query.propertyType = { $regex: new RegExp(flexibleType, 'i') };
        }

        // Search for properties with the given filters
        const properties = await PropertyDetails.find(query)
            .select('propertyName propertyType locationType subLocationType galiType contactAddress mainImage galleryImages maxRentPrice propertyFor rentPrice isActive isTrending propertyNameSlug')
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