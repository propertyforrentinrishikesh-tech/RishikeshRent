import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PropertyType from "@/models/PropertyType";



export async function GET() {
    await connectDB();
    try {
        const banners = await PropertyType.find().sort({ order: 1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Property Type" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { propertyType } = await req.json();

        // Find the highest order number
        const lastBanner = await PropertyType.findOne().sort({ order: -1 });
        const nextOrder = lastBanner ? lastBanner.order + 1 : 1; // Auto-increment order

        const newBanner = new PropertyType({ propertyType, order: nextOrder });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create Property Type: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id,propertyType } = await req.json();
        const updatedBanner = await PropertyType.findByIdAndUpdate(id, { propertyType }, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Property Type" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await PropertyType.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Property Type not found" }, { status: 404 });
        }
        // Delete banner from database
        await PropertyType.findByIdAndDelete(id);

        return NextResponse.json({ message: "Property Type deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete Property Type: ${error.message}` }, { status: 500 });
    }
}
