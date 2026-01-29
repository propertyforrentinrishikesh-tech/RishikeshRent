import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import CommissionRate from '@/models/CommissionRate';

// GET - Fetch commission rates
export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');

        if (!propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Property ID is required'
            }, { status: 400 });
        }

        // Fetch all commission rates for the property, sorted by date
        const commissionRates = await CommissionRate.find({ propertyId })
            .sort({ effectiveDate: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: commissionRates
        });

    } catch (error) {
        console.error('Error fetching commission rates:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch commission rates',
            error: error.message
        }, { status: 500 });
    }
}

// POST - Create new commission rate
export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            propertyId,
            rate,
            effectiveDate,
            notes
        } = body;

        // Validation
        if (!propertyId || rate === undefined || rate === null) {
            return NextResponse.json({
                success: false,
                message: 'Property ID and Rate are required'
            }, { status: 400 });
        }

        if (rate < 0 || rate > 30) {
            return NextResponse.json({
                success: false,
                message: 'Rate must be between 0 and 30'
            }, { status: 400 });
        }

        // Create commission rate
        const commissionRate = await CommissionRate.create({
            propertyId,
            rate,
            effectiveDate: effectiveDate || new Date(),
            notes: notes || '',
            createdBy: propertyId
        });

        return NextResponse.json({
            success: true,
            message: 'Commission rate created successfully',
            data: commissionRate
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating commission rate:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to create commission rate',
            error: error.message
        }, { status: 500 });
    }
}

// PUT - Update commission rate
export async function PUT(request) {
    try {
        await connectDB();

        const body = await request.json();
        const {
            rateId,
            propertyId,
            rate,
            effectiveDate,
            notes,
            isActive
        } = body;

        // Validation
        if (!rateId || !propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Rate ID and Property ID are required'
            }, { status: 400 });
        }

        if (rate !== undefined && (rate < 0 || rate > 30)) {
            return NextResponse.json({
                success: false,
                message: 'Rate must be between 0 and 30'
            }, { status: 400 });
        }

        // Find the commission rate
        const commissionRate = await CommissionRate.findOne({ _id: rateId, propertyId });
        if (!commissionRate) {
            return NextResponse.json({
                success: false,
                message: 'Commission rate not found'
            }, { status: 404 });
        }

        // Update fields
        if (rate !== undefined) commissionRate.rate = rate;
        if (effectiveDate !== undefined) commissionRate.effectiveDate = effectiveDate;
        if (notes !== undefined) commissionRate.notes = notes;
        if (isActive !== undefined) commissionRate.isActive = isActive;
        commissionRate.updatedBy = propertyId;

        await commissionRate.save();

        return NextResponse.json({
            success: true,
            message: 'Commission rate updated successfully',
            data: commissionRate
        });

    } catch (error) {
        console.error('Error updating commission rate:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update commission rate',
            error: error.message
        }, { status: 500 });
    }
}

// DELETE - Delete commission rate
export async function DELETE(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const rateId = searchParams.get('rateId');
        const propertyId = searchParams.get('propertyId');

        if (!rateId || !propertyId) {
            return NextResponse.json({
                success: false,
                message: 'Rate ID and Property ID are required'
            }, { status: 400 });
        }

        // Delete the commission rate
        const result = await CommissionRate.deleteOne({ _id: rateId, propertyId });

        if (result.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'Commission rate not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Commission rate deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting commission rate:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to delete commission rate',
            error: error.message
        }, { status: 500 });
    }
}
