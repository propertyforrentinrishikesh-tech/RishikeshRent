import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import HeroBanner from "@/models/HeroBanner";
import { deleteFileFromCloudinary } from "@/utils/cloudinary";
export async function GET(req) {
    await connectDB();
    try {
        const url = new URL(req.url, `http://${req.headers.get('host') || 'localhost'}`);
        const section = url.searchParams.get('section');
        // console.log(section)
        const query = {};
        if (section) {
            query.section = section;
        }
        const banners = await HeroBanner.find(query).sort({ createdAt: -1 });
        return NextResponse.json(banners, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const { buttonLink, frontImg, mobileImg, section } = await req.json();

        const newBanner = new HeroBanner({
            buttonLink,
            frontImg,
            mobileImg,
            section: section || "frontend"
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
        const { id, buttonLink, frontImg, mobileImg, section } = await req.json();
        
        const updateData = {};
        if (buttonLink !== undefined) updateData.buttonLink = buttonLink;
        if (frontImg !== undefined) updateData.frontImg = frontImg;
        if (mobileImg !== undefined) updateData.mobileImg = mobileImg;
        if (section !== undefined) updateData.section = section;

        const updatedBanner = await HeroBanner.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
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
        const banner = await HeroBanner.findById(id);
        if (!banner) {
            return NextResponse.json({ error: "Banner not found" }, { status: 404 });
        }
        // console.log(banner.mobileImg.key)
        try {
            // Delete front image from Cloudinary if it exists
            if (banner.frontImg?.key) {
                try {
                    await deleteFileFromCloudinary(banner.frontImg.key);
                } catch (cloudinaryError) {
                    console.error('Error deleting front image from Cloudinary:', cloudinaryError);
                    // Continue with deletion even if Cloudinary deletion fails
                }
            }

            if (banner.mobileImg?.key) {
                try {
                    await deleteFileFromCloudinary(banner.mobileImg.key);
                } catch (cloudinaryError) {
                    console.error('Error deleting mobile image from Cloudinary:', cloudinaryError);
                    // Continue with deletion even if Cloudinary deletion fails
                }
            }

            // Delete banner from database
            await HeroBanner.findByIdAndDelete(id);

            return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
        } catch (dbError) {
            console.error('Database error:', dbError);
            throw dbError; // This will be caught by the outer catch
        }
    } catch (error) {
        console.error('Error in DELETE /api/addBanner:', error);
        return NextResponse.json(
            { error: error.message || "Failed to delete banner" },
            { status: 500 }
        );
    }
}
