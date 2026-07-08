import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PropertyGali from "@/models/Property/PropertyGali";

export async function GET() {
    await connectDB();
    try {
        const galis = await PropertyGali.find();
        return NextResponse.json(galis, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Gali" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { locationType, subLocationType, galiName } = await req.json();
        const newGali = new PropertyGali({ locationType, subLocationType, galiName });
        await newGali.save();
        return NextResponse.json(newGali, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create Gali: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id, locationType, subLocationType, galiName, isActive } = await req.json();
        const updated = await PropertyGali.findByIdAndUpdate(
            id,
            { locationType, subLocationType, galiName, isActive },
            { new: true }
        );
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update Gali" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();
        const gali = await PropertyGali.findById(id);
        if (!gali) {
            return NextResponse.json({ error: "Gali not found" }, { status: 404 });
        }
        await PropertyGali.findByIdAndDelete(id);
        return NextResponse.json({ message: "Gali deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete Gali: ${error.message}` }, { status: 500 });
    }
}
