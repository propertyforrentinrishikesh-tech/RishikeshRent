import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import HotelLocationType from "@/models/Hotels/HotelLocationType";


export async function GET() {
    await connectDB();
    try {
        const banners = await HotelLocationType.find()
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Location Name" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { locationType } = await req.json();
        const newBanner = new HotelLocationType({ locationType });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create Location Name: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id,locationType,isActive } = await req.json();
        const updatedBanner = await HotelLocationType.findByIdAndUpdate(id, { locationType,isActive }, { new: true });
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
        const banner = await HotelLocationType.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Location Name not found" }, { status: 404 });
        }
        // Delete banner from database
        await HotelLocationType.findByIdAndDelete(id);

        return NextResponse.json({ message: "Location Name deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete Location Name: ${error.message}` }, { status: 500 });
    }
}
