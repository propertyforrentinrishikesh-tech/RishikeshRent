import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import ConsultancyBanner from "@/models/ConsultancyBanner";
import { deleteFileFromCloudinary } from "@/utils/cloudinary";


export async function GET(req) {
    await connectDB();
    try {
        const url = new URL(req.url, `http://${req.headers.get('host') || 'localhost'}`);
        const section = url.searchParams.get('section');
        const query = {};
        if (section) {
            query.section = section;
        }
        const banners = await ConsultancyBanner.find(query).sort({ createdAt: -1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { title, buttonLink, rating, image, shortDescription, section } = await req.json();

        const newBanner = new ConsultancyBanner({ title, buttonLink, rating, shortDescription, image, section: section || "frontend" });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create banner: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id, title, buttonLink, image, rating, shortDescription, section } = await req.json();
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
        if (rating !== undefined) updateData.rating = rating;
        if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
        if (image !== undefined) updateData.image = image;
        if (section !== undefined) updateData.section = section;

        const updatedBanner = await ConsultancyBanner.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedBanner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    try {
        const { id } = await req.json();

        // Find the banner first
        const banner = await ConsultancyBanner.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }

        // Delete the image from Uploadthing (if key exists)
        if (banner.image?.key) {
            await deleteFileFromCloudinary(banner.image.key);
        }

        // Delete banner from database
        await ConsultancyBanner.findByIdAndDelete(id);

        return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete banner: ${error.message}` }, { status: 500 });
    }
}
