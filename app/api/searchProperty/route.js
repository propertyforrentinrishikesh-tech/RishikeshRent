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
        const fetchAll = searchParams.get('fetchAll');

        // If no search parameters, return available filters
        if (!location && !propertyFor && !propertyType && !fetchAll) {
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
            // or "home-with-owner" vs "Home With Owner"
            const flexibleType = propertyType.replace(/-/g, '[\\s&-]*');
            query.propertyType = { $regex: new RegExp(flexibleType, 'i') };
        }

        // Pagination
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 15;
        const skip = (page - 1) * limit;

        // Search for properties with the given filters
        const [properties, total] = await Promise.all([
            PropertyDetails.find(query)
                .select('propertyName propertyType locationType subLocationType galiType contactAddress mainImage galleryImages maxRentPrice propertyFor rentPrice isActive isTrending propertyNameSlug')
                .sort({ isTrending: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            PropertyDetails.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: {
                properties,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
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