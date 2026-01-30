import { NextResponse } from 'next/server';
import connectDB from "@/lib/connectDB";
import Review from '@/models/Review';

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();

        // Basic validation
        if (!data.propertyId || !data.guestName || !data.rating) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const newReview = await Review.create(data);

        return NextResponse.json({
            success: true,
            message: 'Review created successfully',
            data: newReview
        });

    } catch (error) {
        console.error('Error creating review:', error);
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

        const reviews = await Review.find({ propertyId }).sort({ dateOfReview: -1 });

        return NextResponse.json({
            success: true,
            data: reviews
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Review ID is required' }, { status: 400 });
        }

        await Review.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const data = await request.json();
        const { id, ...updateData } = data;

        if (!id) {
            return NextResponse.json({ success: false, message: 'Review ID is required' }, { status: 400 });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview
        });

    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
    }
}
