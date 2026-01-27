import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import RoomPricing from '@/models/RoomPricing';
import PropertyRegistration from '@/models/PropertyRegistration';

// GET - Fetch room pricing
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');
        const roomType = searchParams.get('roomType');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const pricingType = searchParams.get('pricingType');
        const date = searchParams.get('date');

        if (!propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Property ID is required'
            }, { status: 400 });
        }

        // Build query
        const query = { propertyId };

        if (roomType) query.roomType = roomType;
        if (pricingType) query.pricingType = pricingType;

        // Single date query
        if (date) {
            query.date = new Date(date);
        }
        // Date range query
        else if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const pricing = await RoomPricing.find(query)
            .sort({ date: 1, roomType: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            count: pricing.length,
            data: pricing
        });

    } catch (error) {
        console.error('Room Pricing GET Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch room pricing',
            error: error.message
        }, { status: 500 });
    }
}

// POST - Create or update room pricing
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            propertyId,
            roomType,
            date,
            startDate,
            endDate,
            pricingType,
            ratePlanName,
            epPlan,
            cpPlan,
            mapPlan,
            apPlan,
            totalRooms,
            availableRooms,
            status,
            restrictions,
            incrementalReduction,
            notes,
            createdBy
        } = body;

        // Validation
        if (!propertyId || !roomType) {
            return NextResponse.json({
                success: false,
                message: 'Property ID and Room Type are required'
            }, { status: 400 });
        }

        // Verify property exists
        const property = await PropertyRegistration.findById(propertyId);
        if (!property) {
            return NextResponse.json({
                success: false,
                message: 'Property not found'
            }, { status: 404 });
        }

        // Verify room type exists in property
        const roomExists = property.rooms.some(room => room.roomType === roomType);
        if (!roomExists) {
            return NextResponse.json({
                success: false,
                message: 'Room type not found in property'
            }, { status: 404 });
        }

        // Get total rooms for this room type from property
        const roomData = property.rooms.find(room => room.roomType === roomType);
        const maxRooms = roomData.numberOfRooms;

        // Prepare pricing data
        const pricingData = {
            propertyId,
            roomType,
            pricingType: pricingType || 'b2c',
            ratePlanName,
            epPlan: epPlan || { person1: 0, person2: 0, extraPerson: 0 },
            cpPlan: cpPlan || { person1: 0, person2: 0, extraPerson: 0 },
            mapPlan: mapPlan || { person1: 0, person2: 0, extraPerson: 0 },
            apPlan: apPlan || { person1: 0, person2: 0, extraPerson: 0 },
            totalRooms: totalRooms !== undefined ? totalRooms : maxRooms,
            availableRooms: availableRooms !== undefined ? availableRooms : maxRooms,
            status: status || 'open',
            restrictions: restrictions || {
                minStay: 1,
                maxStay: null,
                closedToArrival: false,
                closedToDeparture: false,
                stopSell: false
            },
            incrementalReduction: incrementalReduction || {
                enabled: false,
                reductions: []
            },
            notes: notes || '',
            createdBy: createdBy || propertyId,
            updatedBy: createdBy || propertyId
        };

        // Single date update
        if (date) {
            const pricing = await RoomPricing.findOneAndUpdate(
                { propertyId, roomType, date: new Date(date) },
                { $set: pricingData },
                { upsert: true, new: true }
            );

            return NextResponse.json({
                success: true,
                message: 'Pricing updated successfully',
                data: pricing
            });
        }

        // Bulk date range update
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start > end) {
                return NextResponse.json({
                    success: false,
                    message: 'Start date must be before end date'
                }, { status: 400 });
            }

            // Generate all dates in range
            const dates = [];
            const currentDate = new Date(start);
            while (currentDate <= end) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Bulk upsert
            const bulkOps = dates.map(dateItem => ({
                updateOne: {
                    filter: { propertyId, roomType, date: dateItem },
                    update: { $set: { ...pricingData, date: dateItem } },
                    upsert: true
                }
            }));

            const result = await RoomPricing.bulkWrite(bulkOps);

            return NextResponse.json({
                success: true,
                message: `Pricing updated for ${dates.length} dates`,
                data: {
                    datesUpdated: dates.length,
                    startDate: start,
                    endDate: end,
                    modifiedCount: result.modifiedCount,
                    upsertedCount: result.upsertedCount
                }
            });
        }

        return NextResponse.json({
            success: false,
            message: 'Either date or startDate/endDate is required'
        }, { status: 400 });

    } catch (error) {
        console.error('Room Pricing POST Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create/update room pricing',
            error: error.message
        }, { status: 500 });
    }
}

// PATCH - Update specific pricing entry
export async function PATCH(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { pricingId, updates } = body;

        if (!pricingId) {
            return NextResponse.json({
                success: false,
                message: 'Pricing ID is required'
            }, { status: 400 });
        }

        const pricing = await RoomPricing.findByIdAndUpdate(
            pricingId,
            { $set: { ...updates, updatedAt: new Date() } },
            { new: true }
        );

        if (!pricing) {
            return NextResponse.json({
                success: false,
                message: 'Pricing entry not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Pricing updated successfully',
            data: pricing
        });

    } catch (error) {
        console.error('Room Pricing PATCH Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update pricing',
            error: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete pricing entries
export async function DELETE(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const pricingId = searchParams.get('pricingId');
        const propertyId = searchParams.get('propertyId');
        const roomType = searchParams.get('roomType');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Delete single entry by ID
        if (pricingId) {
            const pricing = await RoomPricing.findByIdAndDelete(pricingId);

            if (!pricing) {
                return NextResponse.json({
                    success: false,
                    message: 'Pricing entry not found'
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: 'Pricing deleted successfully'
            });
        }

        // Delete multiple entries by date range
        if (propertyId && roomType && startDate && endDate) {
            const result = await RoomPricing.deleteMany({
                propertyId,
                roomType,
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });

            return NextResponse.json({
                success: true,
                message: `${result.deletedCount} pricing entries deleted`,
                deletedCount: result.deletedCount
            });
        }

        return NextResponse.json({
            success: false,
            message: 'Either pricingId or propertyId/roomType/dateRange is required'
        }, { status: 400 });

    } catch (error) {
        console.error('Room Pricing DELETE Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete pricing',
            error: error.message
        }, { status: 500 });
    }
}
