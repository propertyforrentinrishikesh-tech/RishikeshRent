import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Ward from "@/models/Ward";


export async function GET() {
    await connectDB();
    try {
        const banners = await Ward.find().sort({ order: 1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Ward" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { locationType,subLocationType,wardName, order } = await req.json();

        // Find the highest order number
        const lastBanner = await Ward.findOne().sort({ order: -1 });
        const nextOrder = lastBanner ? lastBanner.order + 1 : 1; // Auto-increment order

        const newBanner = new Ward({ locationType,subLocationType,wardName, order: nextOrder });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create Ward: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id,locationType,subLocationType,wardName } = await req.json();
        const updatedBanner = await Ward.findByIdAndUpdate(id, { locationType,subLocationType,wardName }, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Ward" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await Ward.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Ward not found" }, { status: 404 });
        }
        // Delete banner from database
        await Ward.findByIdAndDelete(id);

        return NextResponse.json({ message: "Ward deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete Ward: ${error.message}` }, { status: 500 });
    }
}
