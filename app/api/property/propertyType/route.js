import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PropertyTypes from "@/models/Property/PropertyTypes";

export async function GET() {
    await connectDB();
    try {
        const banners = await PropertyTypes.find();
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Property Type" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { propertyType } = await req.json();
        const newBanner = new PropertyTypes({ propertyType});
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create Property Type: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id,propertyType,isActive } = await req.json();
        const updatedBanner = await PropertyTypes.findByIdAndUpdate(id, { propertyType,isActive }, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Property Type" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        const banner = await PropertyTypes.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Property Type not found" }, { status: 404 });
        }
        await PropertyTypes.findByIdAndDelete(id);

        return NextResponse.json({ message: "Property Type deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete Property Type: ${error.message}` }, { status: 500 });
    }
}
