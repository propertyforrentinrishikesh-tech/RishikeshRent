import { NextResponse } from 'next/server'
import connectDB from '@/lib/connectDB'
import CustomBreakfastType from '@/models/CustomBreakfastType'

// GET - Fetch all custom breakfast types
export async function GET() {
    try {
        await connectDB()
        const breakfastTypes = await CustomBreakfastType.find().sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            breakfastTypes
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching custom breakfast types:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch custom breakfast types',
            error: error.message
        }, { status: 500 })
    }
}

// POST - Create a new custom breakfast type
export async function POST(request) {
    try {
        await connectDB()
        const { name } = await request.json()

        // Validation
        if (!name || !name.trim()) {
            return NextResponse.json({
                success: false,
                message: 'Breakfast type name is required'
            }, { status: 400 })
        }

        // Check if breakfast type already exists
        const existingType = await CustomBreakfastType.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        })

        if (existingType) {
            return NextResponse.json({
                success: false,
                message: 'This breakfast type already exists'
            }, { status: 400 })
        }

        // Create new breakfast type
        const breakfastType = await CustomBreakfastType.create({
            name: name.trim(),
            id: name.toLowerCase().replace(/\s+/g, '-')
        })

        return NextResponse.json({
            success: true,
            message: 'Custom breakfast type added successfully',
            breakfastType
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating custom breakfast type:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to create custom breakfast type',
            error: error.message
        }, { status: 500 })
    }
}

// DELETE - Remove a custom breakfast type
export async function DELETE(request) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Breakfast type ID is required'
            }, { status: 400 })
        }

        const deletedType = await CustomBreakfastType.findByIdAndDelete(id)

        if (!deletedType) {
            return NextResponse.json({
                success: false,
                message: 'Breakfast type not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Custom breakfast type deleted successfully'
        }, { status: 200 })
    } catch (error) {
        console.error('Error deleting custom breakfast type:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to delete custom breakfast type',
            error: error.message
        }, { status: 500 })
    }
}
