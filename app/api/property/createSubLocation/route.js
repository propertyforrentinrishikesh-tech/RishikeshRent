import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PropertySubLocation from "@/models/Property/PropertySubLocation";


export async function GET() {
    await connectDB();
    try {
        const banners = await PropertySubLocation.find()
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch SubLocation" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { locationType,subLocationType } = await req.json();
        const newBanner = new PropertySubLocation({ locationType,subLocationType });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create SubLocation: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id,locationType,subLocationType,isActive } = await req.json();
        const updatedBanner = await PropertySubLocation.findByIdAndUpdate(id, { locationType,subLocationType,isActive }, { new: true });
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
        const banner = await PropertySubLocation.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "SubLocation not found" }, { status: 404 });
        }
        // Delete banner from database
        await PropertySubLocation.findByIdAndDelete(id);

        return NextResponse.json({ message: "SubLocation deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete SubLocation: ${error.message}` }, { status: 500 });
    }
}
