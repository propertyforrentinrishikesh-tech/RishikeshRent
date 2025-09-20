import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import LocationType from "@/models/LocationType";


export async function GET() {
    await connectDB();
    try {
        const banners = await LocationType.find().sort({ order: 1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Location Name" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { locationType, order } = await req.json();

        // Find the highest order number
        const lastBanner = await LocationType.findOne().sort({ order: -1 });
        const nextOrder = lastBanner ? lastBanner.order + 1 : 1; // Auto-increment order

        const newBanner = new LocationType({ locationType, order: nextOrder });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create Location Name: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id,locationType } = await req.json();
        const updatedBanner = await LocationType.findByIdAndUpdate(id, { locationType }, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Location Name" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await LocationType.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Location Name not found" }, { status: 404 });
        }
        // Delete banner from database
        await LocationType.findByIdAndDelete(id);

        return NextResponse.json({ message: "Location Name deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete Location Name: ${error.message}` }, { status: 500 });
    }
}
