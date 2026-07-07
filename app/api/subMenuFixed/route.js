
import connectDB from "@/lib/connectDB"
import SubMenuFixed from "@/models/SubMenuFixed"
import { NextResponse } from "next/server"
import { getAdminSectionFilter, normalizeAdminSection } from "@/lib/admin-section"

export async function GET(req) {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const section = searchParams.get("section")
    const frontendOnly = searchParams.get("frontendOnly") === "1" || searchParams.get("frontendOnly") === "true"
    try {
        const menuItems = await SubMenuFixed.find(getAdminSectionFilter(section))
        const output = frontendOnly
            ? menuItems
                .filter((item) => item.active && item.showOnFrontend !== false)
                .map((item) => ({
                    ...item.toObject(),
                    subCat: Array.isArray(item.subCat)
                        ? item.subCat
                            .filter((subCat) => subCat.active && subCat.showOnFrontend !== false)
                            .map((subCat) => ({
                                ...subCat,
                                subCatPackage: Array.isArray(subCat.subCatPackage)
                                    ? subCat.subCatPackage.filter((pkg) => pkg.active && pkg.showOnFrontend !== false)
                                    : [],
                            }))
                        : [],
                }))
            : menuItems

        return NextResponse.json(output)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 })
    }
}

export async function POST(req) {
    await connectDB()
    try {
        const body = await req.json()
        const { type, catTitle, categoryId, subCatTitle, subCategoryId, title, url,showOnFrontend } = body
        const section = normalizeAdminSection(body.section)
        if (type === "category") {
            const newCategory = new SubMenuFixed({
                catTitle,
                section,
                active: true,
                showOnFrontend
            })
            await newCategory.save()
            return NextResponse.json({ message: "Category added successfully" })
        }

        if (type === "subcategory") {
            const category = await SubMenuFixed.findOne({ _id: categoryId, ...getAdminSectionFilter(section) })
            if (!category) {
                return NextResponse.json({ error: "Category not found" }, { status: 404 })
            }

            category.subCat.push({
                title: subCatTitle,
                active: true,
                showOnFrontend
            })
            await category.save()
            return NextResponse.json({ message: "Subcategory added successfully" })
        }

        if (type === "package") {
            const category = await SubMenuFixed.findOne({ "subCat._id": subCategoryId, ...getAdminSectionFilter(section) })
            if (!category) {
                return NextResponse.json({ error: "Subcategory not found" }, { status: 404 })
            }

            const subCategory = category.subCat.id(subCategoryId)
            subCategory.subCatPackage.push({
                title,
                url,
                active: true,
                showOnFrontend
            })
            await category.save()
            return NextResponse.json({ message: "Package added successfully" })
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to add item" }, { status: 500 })
    }
}