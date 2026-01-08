import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import PropertyRegistration from '@/models/PropertyRegistration';

export async function POST(request) {
    try {
        // Connect to database
        await connectDB();

        // Parse request body
        const data = await request.json();

        // Validate required fields
        if (!data.category) {
            return NextResponse.json(
                { success: false, error: 'Property category is required' },
                { status: 400 }
            );
        }

        if (!data.propertyType && !data.customPropertyType) {
            return NextResponse.json(
                { success: false, error: 'Property type is required' },
                { status: 400 }
            );
        }

        if (!data.propertyName) {
            return NextResponse.json(
                { success: false, error: 'Property name is required' },
                { status: 400 }
            );
        }

        // Sanitize data - convert empty strings to null for enum fields
        const sanitizedData = {
            ...data,
            alternativeBookingType: data.alternativeBookingType === '' ? null : data.alternativeBookingType,
        };

        // Create new property registration
        const propertyRegistration = new PropertyRegistration({
            // Step 1: Property Category
            category: sanitizedData.category,

            // Step 2: Property Type
            propertyType: sanitizedData.propertyType,
            customPropertyType: sanitizedData.customPropertyType,
            furnishingStatus: sanitizedData.furnishingStatus,

            // Apartment-specific: Where else is the property listed
            listedWebsites: sanitizedData.listedWebsites || [],
            customWebsite: sanitizedData.customWebsite,
            airbnbImportLink: sanitizedData.airbnbImportLink,

            // Home-specific: How many apartments are you listing?
            homeListingType: sanitizedData.homeListingType,

            // Alternative-specific fields
            alternativeSubtype: sanitizedData.alternativeSubtype,
            alternativeBookingType: sanitizedData.alternativeBookingType,

            // Step 3: Property Size
            numberOfRooms: data.numberOfRooms || 1,
            numberOfFloors: data.numberOfFloors || 1,

            // Step 4: Property Confirmation
            propertyConfirmation: data.propertyConfirmation,

            // Step 5: Property Location
            apartmentOrFloor: data.apartmentOrFloor,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            city: data.city,
            pinCode: data.pinCode,
            googleLocationCode: data.googleLocationCode,
            googleBusinessProfileCode: data.googleBusinessProfileCode,

            // Step 6: Property Details & Facilities
            propertyName: data.propertyName,
            starRating: data.starRating,
            isChainProperty: data.isChainProperty,
            chainName: data.chainName,
            ownershipType: data.ownershipType,
            facilities: data.facilities || [],

            // Step 7: Services
            servesBreakfast: data.servesBreakfast,
            breakfastIncluded: data.breakfastIncluded,
            breakfastPrice: data.breakfastPrice,
            breakfastTypes: data.breakfastTypes || [],
            parkingAvailable: data.parkingAvailable,
            parkingCost: data.parkingCost,
            parkingCostPeriod: data.parkingCostPeriod,
            parkingReservation: data.parkingReservation,
            parkingLocation: data.parkingLocation,
            parkingType: data.parkingType,

            // Step 8: Languages
            languagesSpoken: data.languagesSpoken || [],

            // Step 9: House Rules
            checkInFrom: data.checkInFrom,
            checkInUntil: data.checkInUntil,
            checkOutFrom: data.checkOutFrom,
            checkOutUntil: data.checkOutUntil,
            allowChildren: data.allowChildren,
            allowPets: data.allowPets,
            petCharges: data.petCharges,

            // Step 10: Rooms
            rooms: data.rooms || [],

            // Step 11: Room Images (placeholder for file uploads)
            roomImages: data.roomImages || [],

            // Step 12: Property Images (placeholder for file uploads)
            propertyImages: {
                primary: data.propertyImages?.primary || [],
                exterior: data.propertyImages?.exterior || [],
                interior: data.propertyImages?.interior || [],
                reception: data.propertyImages?.reception || [],
                restaurant: data.propertyImages?.restaurant || [],
                parking: data.propertyImages?.parking || [],
                other: data.propertyImages?.other || []
            },

            // Step 13: Owner, Property & Bank Information
            ownerName: data.ownerName,
            ownerEmail: data.ownerEmail,
            ownerContact: data.ownerContact,
            panNumber: data.panNumber,
            panDocument: data.panDocument,
            aadhaarNumber: data.aadhaarNumber,
            profilePhoto: data.profilePhoto,

            officialPropertyName: data.officialPropertyName,
            officialEmail: data.officialEmail,
            officialContact: data.officialContact,
            alternativeContact: data.alternativeContact,
            propertyPanNumber: data.propertyPanNumber,
            propertyPanDocument: data.propertyPanDocument,
            gstNumber: data.gstNumber,
            gstDocument: data.gstDocument,

            accountNumber: data.accountNumber,
            bankName: data.bankName,
            accountHolderName: data.accountHolderName,
            ifscCode: data.ifscCode,
            bankAddress: data.bankAddress,
            cancelledCheque: data.cancelledCheque,

            // Set status
            status: 'pending'
        });

        // Save to database
        const savedProperty = await propertyRegistration.save();

        return NextResponse.json({
            success: true,
            message: 'Property registration submitted successfully!',
            data: {
                id: savedProperty._id,
                propertyName: savedProperty.propertyName,
                status: savedProperty.status
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Property Registration Error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));

            return NextResponse.json({
                success: false,
                error: 'Validation failed',
                details: errors
            }, { status: 400 });
        }

        // Handle other errors
        return NextResponse.json({
            success: false,
            error: 'Failed to submit property registration',
            message: error.message
        }, { status: 500 });
    }
}

// GET endpoint to retrieve property registrations
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // Get single property
            const property = await PropertyRegistration.findById(id);

            if (!property) {
                return NextResponse.json({
                    success: false,
                    error: 'Property not found'
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: property
            });
        } else {
            // Get all properties
            const properties = await PropertyRegistration.find()
                .sort({ createdAt: -1 });

            return NextResponse.json({
                success: true,
                count: properties.length,
                data: properties
            });
        }

    } catch (error) {
        console.error('Get Property Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to retrieve properties',
            message: error.message
        }, { status: 500 });
    }
}

// PATCH endpoint to update property status and credentials
export async function PATCH(request) {
    try {
        await connectDB();

        const data = await request.json();
        const { id, status, partnerUsername, partnerPassword, partnerPasswordPlain, hotelCode, isActive } = data;

        if (!id) {
            return NextResponse.json({
                success: false,
                error: 'Property ID is required'
            }, { status: 400 });
        }

        // Find the property
        const property = await PropertyRegistration.findById(id);

        if (!property) {
            return NextResponse.json({
                success: false,
                error: 'Property not found'
            }, { status: 404 });
        }

        // Update fields
        const updateData = {};

        if (status !== undefined) {
            updateData.status = status;
        }

        if (partnerUsername !== undefined) {
            updateData.partnerUsername = partnerUsername;
        }

        if (partnerPassword !== undefined) {
            updateData.partnerPassword = partnerPassword;
        }

        if (partnerPasswordPlain !== undefined) {
            updateData.partnerPasswordPlain = partnerPasswordPlain;
        }

        if (hotelCode !== undefined) {
            updateData.hotelCode = hotelCode;
        }

        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }

        // Update the property
        const updatedProperty = await PropertyRegistration.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Property updated successfully',
            data: updatedProperty
        });

    } catch (error) {
        console.error('Update Property Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update property',
            message: error.message
        }, { status: 500 });
    }
}