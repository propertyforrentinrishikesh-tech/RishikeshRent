import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import SubLocation from "@/models/SubLocation";


export async function GET() {
    await connectDB();
    try {
        const banners = await SubLocation.find().sort({ order: 1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch SubLocation" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { locationType,subLocationType, order } = await req.json();

        // Find the highest order number
        const lastBanner = await SubLocation.findOne().sort({ order: -1 });
        const nextOrder = lastBanner ? lastBanner.order + 1 : 1; // Auto-increment order

        const newBanner = new SubLocation({ locationType,subLocationType, order: nextOrder });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create SubLocation: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id,locationType,subLocationType } = await req.json();
        const updatedBanner = await SubLocation.findByIdAndUpdate(id, { locationType,subLocationType }, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update SubLocation" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await SubLocation.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "SubLocation not found" }, { status: 404 });
        }
        // Delete banner from database
        await SubLocation.findByIdAndDelete(id);

        return NextResponse.json({ message: "SubLocation deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete SubLocation: ${error.message}` }, { status: 500 });
    }
}
