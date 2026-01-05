import { NextResponse } from 'next/server'
import connectDB from '@/lib/connectDB'
import CustomRoomAmenity from '@/models/CustomRoomAmenity'

// GET - Fetch custom amenities by category
export async function GET(request, { params }) {
    try {
        await connectDB()
        const { category } = await params

        const items = await CustomRoomAmenity.find({ category }).sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            items
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching custom room amenities:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch custom room amenities',
            error: error.message
        }, { status: 500 })
    }
}

// POST - Create a new custom amenity
export async function POST(request, { params }) {
    try {
        await connectDB()
        const { category } = await params
        const { name } = await request.json()

        // Validation
        if (!name || !name.trim()) {
            return NextResponse.json({
                success: false,
                message: 'Amenity name is required'
            }, { status: 400 })
        }

        // Check if amenity already exists in this category
        const existingItem = await CustomRoomAmenity.findOne({
            category,
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        })

        if (existingItem) {
            return NextResponse.json({
                success: false,
                message: 'This amenity already exists in this category'
            }, { status: 400 })
        }

        // Create new amenity
        const item = await CustomRoomAmenity.create({
            category,
            name: name.trim()
        })

        return NextResponse.json({
            success: true,
            message: 'Custom amenity added successfully',
            item
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating custom room amenity:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to create custom room amenity',
            error: error.message
        }, { status: 500 })
    }
}

// DELETE - Remove a custom amenity
export async function DELETE(request, { params }) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Amenity ID is required'
            }, { status: 400 })
        }

        const deletedItem = await CustomRoomAmenity.findByIdAndDelete(id)

        if (!deletedItem) {
            return NextResponse.json({
                success: false,
                message: 'Amenity not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Custom amenity deleted successfully'
        }, { status: 200 })
    } catch (error) {
        console.error('Error deleting custom room amenity:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to delete custom room amenity',
            error: error.message
        }, { status: 500 })
    }
}
