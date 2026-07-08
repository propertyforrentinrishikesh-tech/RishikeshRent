// app/api/createPropertyDetails/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PropertyDetails from '@/models/Property/PropertyDetails';
export async function GET() {
    try {
        await connectDB();
        const properties = await PropertyDetails.find({isTrending:true})
        .select('propertyNameSlug propertyName')
        .sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: properties });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to fetch properties' },
            { status: 500 }
        );
    }
}