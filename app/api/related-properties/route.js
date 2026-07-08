
import connectDB from "@/lib/connectDB";
import PropertyDetailsModel from "@/models/Property/PropertyDetails";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const city = searchParams.get("city");
        const type = searchParams.get("type");
        const excludeId = searchParams.get("excludeId");

        const query = {};
        if (city) query.locationType = city;
        if (type) query.propertyType = type;
        if (excludeId) query._id = { $ne: excludeId };

        const properties = await PropertyDetailsModel.find(query).limit(6);

        return NextResponse.json(properties);
    } catch (error) {
        console.error("Error fetching related properties:", error);
        return NextResponse.json({ error: "Failed to fetch related properties" }, { status: 500 });
    }
}
