import connectDB from "@/lib/connectDB";
import MenuBar from "@/models/MenuBar";
import { NextResponse } from "next/server";
import { getAdminSectionFilter } from "@/lib/admin-section";
import Package from "@/models/Piligrimage/Package"
export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url)
    const section = searchParams.get("section")
    const frontendOnly = searchParams.get("frontendOnly") === "1" || searchParams.get("frontendOnly") === "true"

    const menu = await MenuBar.find(getAdminSectionFilter(section))
        .populate({
            path: 'subMenu.packages',
        })
        .sort({ order: 1 });

    const output = frontendOnly
        ? menu
            .filter((item) => item.active && item.showOnFrontend !== false)
            .map((item) => ({
                ...item.toObject(),
                subMenu: Array.isArray(item.subMenu)
                    ? item.subMenu.filter((subItem) => subItem.active && subItem.showOnFrontend !== false)
                    : [],
            }))
        : menu

    return NextResponse.json(output);
}