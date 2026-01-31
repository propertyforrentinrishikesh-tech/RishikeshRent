import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import FeaturedBanner from "@/models/FeaturedBanner";
import { deleteFileFromCloudinary } from "@/utils/cloudinary";


export async function GET() {
    await connectDB();
    try {
        const banners = await FeaturedBanner.find()
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { propertyName, propertyType, propertySubDestination, price, buttonLink, image } = await req.json();

        const lastBanner = await FeaturedBanner.findOne().sort({});

        const newBanner = new FeaturedBanner({ propertyName, propertyType, propertySubDestination, price, buttonLink, image });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create banner: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id, propertyName, propertyType, propertySubDestination, price, buttonLink, image } = await req.json();
        const updatedBanner = await FeaturedBanner.findByIdAndUpdate(id, { propertyName, propertyType, propertySubDestination, price, buttonLink, image }, { new: true });
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
        const banner = await FeaturedBanner.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }

        // Delete the image from Uploadthing (if key exists)
        if (banner.image?.key) {
            await deleteFileFromCloudinary(banner.image.key);
        }

        // Delete banner from database
        await FeaturedBanner.findByIdAndDelete(id);

        return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to delete banner: ${error.message}` }, { status: 500 });
    }
}
