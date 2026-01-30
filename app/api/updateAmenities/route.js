import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import PropertyRegistration from '@/models/PropertyRegistration';

export async function POST(request) {
    try {
        await connectDB();

        const data = await request.json();
        const { propertyId, facilities, rooms } = data;

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

        // Update Property Global Facilities
        if (facilities) {
            property.facilities = facilities;
        }

        // Update Room Amenities
        // We iterate through the provided rooms and update the corresponding rooms in the DB
        if (rooms && Array.isArray(rooms)) {
            // Create a map of existing rooms for easier access
            // Assuming we are updating existing rooms based on roomIndex or ID. 
            // Since property.rooms is an array of subdocuments, we match by _id if available or index.
            // propertyData.rooms usually has _id.

            rooms.forEach(updatedRoom => {
                const dbRoom = property.rooms.find(r => r._id.toString() === updatedRoom._id);
                if (dbRoom) {
                    dbRoom.bathroomItems = updatedRoom.bathroomItems;
                    dbRoom.roomFacilities = updatedRoom.roomFacilities;
                    dbRoom.outdoorViews = updatedRoom.outdoorViews;
                    dbRoom.foodDrink = updatedRoom.foodDrink;
                }
            });
        }

        await property.save();

        return NextResponse.json({
            success: true,
            message: 'Amenities updated successfully',
            data: property
        });

    } catch (error) {
        console.error('Error updating amenities:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error',
            error: error.message
        }, { status: 500 });
    }
}
