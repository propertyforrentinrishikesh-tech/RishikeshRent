// app/api/propertyDetails/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import HotelPropertyDetails from '@/models/HotelPropertyDetails';

export async function POST(request) {
    try {
        // Connect to the database
        await connectDB();

        // Parse the request body
        const formData = await request.json();

        console.log('Received form data:', JSON.stringify(formData, null, 2));

        // Basic validation
        if (!formData.propertyType) {
            return NextResponse.json(
                { success: false, error: 'Property type is required' },
                { status: 400 }
            );
        }

        if (!formData.propertyName) {
            return NextResponse.json(
                { success: false, error: 'Property name is required' },
                { status: 400 }
            );
        }

        if (!formData.mainImage || !formData.mainImage.url) {
            return NextResponse.json(
                { success: false, error: 'Main image is required' },
                { status: 400 }
            );
        }

        if (!formData.locationType) {
            return NextResponse.json(
                { success: false, error: 'Location type is required' },
                { status: 400 }
            );
        }

        if (!formData.rentPrice) {
            return NextResponse.json(
                { success: false, error: 'Rent price is required' },
                { status: 400 }
            );
        }

        if (!formData.contactNumbers || formData.contactNumbers.length === 0) {
            return NextResponse.json(
                { success: false, error: 'At least one contact number is required' },
                { status: 400 }
            );
        }

        // Create a new property
        const property = new HotelPropertyDetails(formData);

        // Save to database
        await property.save();

        console.log('Property saved successfully:', property._id);

        return NextResponse.json(
            {
                success: true,
                data: property,
                message: 'Property details saved successfully'
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving property:', {
            name: error.name,
            message: error.message,
            code: error.code,
            errors: error.errors
        });

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    validationErrors
                },
                { status: 400 }
            );
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'A property with this name already exists' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to save property details',
                details: error.message
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 15;
        const skip = (page - 1) * limit;

        const query = HotelPropertyDetails.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);

        const total = await HotelPropertyDetails.countDocuments({});
        const properties = await query.exec();

        return NextResponse.json({
            success: true,
            data: properties,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch properties', details: error.message },
            { status: 500 }
        );
    }
}

async function deleteFromCloudinary(publicId, resourceType = 'image') {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cloudinary`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                publicId,
                resourceType
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete from Cloudinary');
        }
        return data;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
}

export async function DELETE(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Property ID is required' },
                { status: 400 }
            );
        }

        // Get the property first to access its media files
        const property = await HotelPropertyDetails.findById(id);
        if (!property) {
            return NextResponse.json(
                { success: false, error: 'Property not found' },
                { status: 404 }
            );
        }

        const errors = [];

        // Delete main image
        if (property.mainImage?.key) {
            try {
                await deleteFromCloudinary(property.mainImage.key, 'image');
            } catch (err) {
                errors.push(`Failed to delete main image: ${err.message}`);
                console.error('Error deleting main image:', err);
            }
        }

        // Delete gallery images
        if (Array.isArray(property.galleryImages)) {
            for (const img of property.galleryImages) {
                if (img?.key) {
                    try {
                        await deleteFromCloudinary(img.key, 'image');
                    } catch (err) {
                        errors.push(`Failed to delete gallery image (${img.key}): ${err.message}`);
                        console.error('Error deleting gallery image:', err);
                    }
                }
            }
        }

        // Delete aadhar image
        if (property.aadharImage?.key) {
            try {
                await deleteFromCloudinary(property.aadharImage.key, 'image');
            } catch (err) {
                errors.push(`Failed to delete aadhar image: ${err.message}`);
            }
        }

        // Delete PAN image
        if (property.panImage?.key) {
            try {
                await deleteFromCloudinary(property.panImage.key, 'image');
            } catch (err) {
                errors.push(`Failed to delete PAN image: ${err.message}`);
            }
        }

        // Delete electricity bill image
        if (property.electricityBillImage?.key) {
            try {
                await deleteFromCloudinary(property.electricityBillImage.key, 'image');
            } catch (err) {
                errors.push(`Failed to delete electricity bill image: ${err.message}`);
            }
        }

        // Delete video
        if (property.video?.type === 'upload' && property.video?.key) {
            try {
                await deleteFromCloudinary(property.video.key, 'video');
            } catch (err) {
                errors.push(`Failed to delete video: ${err.message}`);
                console.error('Error deleting video:', err);
            }
        }

        // Delete the property from the database
        await HotelPropertyDetails.findByIdAndDelete(id);

        // If there were any errors during file deletion, still return success but include the errors
        if (errors.length > 0) {
            return NextResponse.json({
                success: true,
                message: 'Property deleted successfully, but some files could not be removed from storage',
                warnings: errors,
                data: property
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Property and all associated files deleted successfully',
            data: property
        });

    } catch (error) {
        console.error('Error deleting property:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete property',
                details: error.message
            },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Property ID is required' },
                { status: 400 }
            );
        }

        const updates = await request.json();

        // Update the updatedAt timestamp
        updates.updatedAt = new Date();

        const updatedProperty = await HotelPropertyDetails.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedProperty) {
            return NextResponse.json(
                { success: false, error: 'Property not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Property updated successfully',
            data: updatedProperty
        });

    } catch (error) {
        console.error('Error updating property:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation failed',
                    validationErrors
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to update property', details: error.message },
            { status: 500 }
        );
    }
}