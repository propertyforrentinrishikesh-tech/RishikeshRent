// app/api/dashboard/counts/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PropertyDetails from '@/models/Property/PropertyDetails';
import PropertyRegistration from '@/models/PropertyRegistration';
// Import other models you want to count
// import PropertyType from '@/models/PropertyType'; // Adjust the import path as needed
// import Location from '@/models/Location'; // Adjust the import path as needed
// import User from '@/models/User'; // Example of another model

export async function GET() {
    try {
        await connectDB();
        
        // Fetch all counts in parallel
        const [properties, hostels, propertyRegistrations, locations, users] = await Promise.all([
            PropertyDetails.countDocuments({}),
            PropertyRegistration.countDocuments({}),
            // Location.countDocuments({}),         // Adjust model name as needed
            // User.countDocuments({})              // Example of another model count
        ]);

        return NextResponse.json({
            success: true,
            data: {
                properties,
                hostels,
                propertyRegistrations,
                // locations,
                // users
                // Add more counts as needed
            }
        });
    } catch (error) {
        console.error('Error fetching counts:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to fetch counts',
                details: error.message 
            },
            { status: 500 }
        );
    }
}