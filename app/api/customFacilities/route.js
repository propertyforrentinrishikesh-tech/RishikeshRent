import { NextResponse } from 'next/server'
import connectDB from '@/lib/connectDB';
import CustomFacility from '@/models/CustomFacility'

// GET - Fetch all custom facilities
export async function GET() {
    try {
        await connectDB()
        const facilities = await CustomFacility.find().sort({ createdAt: -1 })

        return NextResponse.json({
            success: true,
            facilities
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching custom facilities:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch custom facilities',
            error: error.message
        }, { status: 500 })
    }
}

// POST - Create a new custom facility
export async function POST(request) {
    try {
        await connectDB()
        const { name } = await request.json()

        // Validation
        if (!name || !name.trim()) {
            return NextResponse.json({
                success: false,
                message: 'Facility name is required'
            }, { status: 400 })
        }

        // Check if facility already exists
        const existingFacility = await CustomFacility.findOne({
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        })

        if (existingFacility) {
            return NextResponse.json({
                success: false,
                message: 'This facility already exists'
            }, { status: 400 })
        }

        // Create new facility
        const facility = await CustomFacility.create({
            name: name.trim(),
            id: name.toLowerCase().replace(/\s+/g, '-')
        })

        return NextResponse.json({
            success: true,
            message: 'Custom facility added successfully',
            facility
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating custom facility:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to create custom facility',
            error: error.message
        }, { status: 500 })
    }
}

// DELETE - Remove a custom facility
export async function DELETE(request) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Facility ID is required'
            }, { status: 400 })
        }

        const deletedFacility = await CustomFacility.findByIdAndDelete(id)

        if (!deletedFacility) {
            return NextResponse.json({
                success: false,
                message: 'Facility not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Custom facility deleted successfully'
        }, { status: 200 })
    } catch (error) {
        console.error('Error deleting custom facility:', error)
        return NextResponse.json({
            success: false,
            message: 'Failed to delete custom facility',
            error: error.message
        }, { status: 500 })
    }
}
