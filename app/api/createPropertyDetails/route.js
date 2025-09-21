// app/api/createPropertyDetails/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PropertyDetails from '@/models/PropertyDetails';

export async function POST(request) {
    try {
        // Connect to the database
        await connectDB();

        // Parse the request body
        const formData = await request.json();
        

        // Basic validation
        if (!formData.propertyType || !formData.propertyName) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create a new property
        const property = new PropertyDetails(formData);

        // Save to database
        await property.save();

        return NextResponse.json(
            {
                success: true,
                data: property,
                message: 'Property details saved successfully'
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving property details:', error);
        console.error('Error details:', {
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
                { success: false, error: 'A property with these details already exists' },
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

export async function GET() {
    try {
        await connectDB();
        const properties = await PropertyDetails.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: properties });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch properties' },
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
        const property = await PropertyDetails.findById(id);
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

        // Delete video
        if (property.video?.file?.key) {
            try {
                await deleteFromCloudinary(property.video.file.key, 'video');
            } catch (err) {
                errors.push(`Failed to delete video: ${err.message}`);
                console.error('Error deleting video:', err);
            }
        }

        // Delete the property from the database
        await PropertyDetails.findByIdAndDelete(id);

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

        const updatedProperty = await PropertyDetails.findByIdAndUpdate(
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
        return NextResponse.json(
            { success: false, error: 'Failed to update property' },
            { status: 500 }
        );
    }
}