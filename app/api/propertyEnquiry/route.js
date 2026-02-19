import connectDB from "@/lib/connectDB";
import PropertyEnquiry from "@/models/PropertyEnquiry";
import { NextResponse } from "next/server";

// GET — list all enquiries with optional filters
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const skip = (page - 1) * limit;

        const filter = {};
        const search = searchParams.get("search");
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { propertyName: { $regex: search, $options: "i" } },
            ];
        }
        if (searchParams.get("status")) filter.status = searchParams.get("status");
        if (searchParams.get("locationType")) filter.locationType = searchParams.get("locationType");

        const total = await PropertyEnquiry.countDocuments(filter);
        const enquiries = await PropertyEnquiry.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("propertyId", "propertyName locationType subLocationType rentPrice mainImage")
            .exec();

        return NextResponse.json({
            success: true,
            data: enquiries,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("PropertyEnquiry GET error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch enquiries" }, { status: 500 });
    }
}

// POST — submit a new enquiry (from frontend property page)
export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, phone } = body;
        if (!name || !phone) {
            return NextResponse.json({ success: false, message: "Name and phone are required" }, { status: 400 });
        }
        const enquiry = await PropertyEnquiry.create(body);
        return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
    } catch (error) {
        console.error("PropertyEnquiry POST error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit enquiry" }, { status: 500 });
    }
}

// PUT — update status or admin note
export async function PUT(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const body = await request.json();
        const updated = await PropertyEnquiry.findByIdAndUpdate(id, body, { new: true });
        if (!updated) return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error("PropertyEnquiry PUT error:", error);
        return NextResponse.json({ success: false, message: "Failed to update enquiry" }, { status: 500 });
    }
}

// DELETE — remove an enquiry
export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const deleted = await PropertyEnquiry.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Enquiry deleted" });
    } catch (error) {
        console.error("PropertyEnquiry DELETE error:", error);
        return NextResponse.json({ success: false, message: "Failed to delete enquiry" }, { status: 500 });
    }
}
