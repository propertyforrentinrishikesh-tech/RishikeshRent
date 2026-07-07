import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import FeaturedBanner from "@/models/FeaturedBanner";
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
        const banners = await FeaturedBanner.find(query).sort({ createdAt: -1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { propertyName, propertyType, propertySubDestination, price, buttonLink, image, section } = await req.json();

        const newBanner = new FeaturedBanner({ 
            propertyName, 
            propertyType, 
            propertySubDestination, 
            price, 
            buttonLink, 
            image,
            section: section || 'frontend'
        });
        await newBanner.save();
        return NextResponse.json(newBanner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create banner: ${error.message}` }, { status: 500 });
    }
}

export async function PATCH(req) {
    await connectDB();
    try {
        const { id, propertyName, propertyType, propertySubDestination, price, buttonLink, image, section } = await req.json();
        
        const updateData = {};
        if (propertyName !== undefined) updateData.propertyName = propertyName;
        if (propertyType !== undefined) updateData.propertyType = propertyType;
        if (propertySubDestination !== undefined) updateData.propertySubDestination = propertySubDestination;
        if (price !== undefined) updateData.price = price;
        if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
        if (image !== undefined) updateData.image = image;
        if (section !== undefined) updateData.section = section;

        const updatedBanner = await FeaturedBanner.findByIdAndUpdate(id, updateData, { new: true });
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
