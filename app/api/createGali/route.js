import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Gali from "@/models/Gali";


export async function GET() {
    await connectDB();
    try {
        const banners = await Gali.find().sort({ order: 1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch galiMohalla Name" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { locationType,subLocationType,galiName, order } = await req.json();

        // Find the highest order number
        const lastBanner = await Gali.findOne().sort({ order: -1 });
        const nextOrder = lastBanner ? lastBanner.order + 1 : 1; // Auto-increment order

        const newBanner = new Gali({ locationType,subLocationType,galiName, order: nextOrder });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create Gali: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id,locationType,subLocationType,galiName } = await req.json();
        const updatedBanner = await Gali.findByIdAndUpdate(id, { locationType,subLocationType,galiName }, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Gali" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await Gali.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Gali not found" }, { status: 404 });
        }
        // Delete banner from database
        await Gali.findByIdAndDelete(id);

        return NextResponse.json({ message: "Gali deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete Gali: ${error.message}` }, { status: 500 });
    }
}
