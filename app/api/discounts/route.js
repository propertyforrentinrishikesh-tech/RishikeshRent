import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import Discount from '@/models/Discount';

export async function POST(request) {
    try {
        await connectDB();

        const data = await request.json();
        const { propertyId, couponCode, amount, percentage, startDate, endDate } = data;

        if (!propertyId) {
            return NextResponse.json({ success: false, message: 'Property ID is required' }, { status: 400 });
        }
        if (!couponCode) {
            return NextResponse.json({ success: false, message: 'Coupon Code is required' }, { status: 400 });
        }
        if (!startDate || !endDate) {
            return NextResponse.json({ success: false, message: 'Date range is required' }, { status: 400 });
        }

        const newDiscount = await Discount.create({
            propertyId,
            couponCode,
            amount: amount || null,
            percentage: percentage || null,
            startDate,
            endDate
        });

        return NextResponse.json({
            success: true,
            message: 'Discount created successfully',
            data: newDiscount
        });

    } catch (error) {
        console.error('Error creating discount:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');

        if (!propertyId) {
            return NextResponse.json({ success: false, message: 'Property ID is required' }, { status: 400 });
        }

        const discounts = await Discount.find({ propertyId }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: discounts
        });

    } catch (error) {
        console.error('Error fetching discounts:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Discount ID is required' }, { status: 400 });
        }

        await Discount.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Discount deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting discount:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { id, isActive } = data;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Discount ID is required' }, { status: 400 });
        }

        const updatedDiscount = await Discount.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Discount updated successfully',
            data: updatedDiscount
        });

    } catch (error) {
        console.error('Error updating discount:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { id, couponCode, amount, percentage, startDate, endDate } = data;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Discount ID is required' }, { status: 400 });
        }

        const updatedDiscount = await Discount.findByIdAndUpdate(
            id,
            {
                couponCode,
                amount: amount || null,
                percentage: percentage || null,
                startDate,
                endDate
            },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Discount updated successfully',
            data: updatedDiscount
        });

    } catch (error) {
        console.error('Error updating discount:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}
