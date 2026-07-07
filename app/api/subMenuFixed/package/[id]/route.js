import connectDB from "@/lib/connectDB"
import SubMenuFixed from "@/models/SubMenuFixed"
import { NextResponse } from "next/server"
import { getAdminSectionFilter, normalizeAdminSection } from "@/lib/admin-section"

export async function PUT(req, { params }) {
    await connectDB()
    try {
        const { id } = await params
        const { subCategoryId, title, url, section ,showOnFrontend } = await req.json()
        const normalizedSection = normalizeAdminSection(section)

        const category = await SubMenuFixed.findOne({ "subCat._id": subCategoryId, ...getAdminSectionFilter(normalizedSection) })
        if (!category) {
            return NextResponse.json({ error: "Subcategory not found" }, { status: 404 })
        }

        const subCategory = category.subCat.id(subCategoryId)
        const pkg = subCategory.subCatPackage.id(id)
        pkg.title = title
        pkg.url = url
        pkg.showOnFrontend = showOnFrontend
        await category.save()

        return NextResponse.json({ message: "Package updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update package" }, { status: 500 })
    }
}

export async function DELETE(req, { params }) {
    await connectDB()
    try {
        const { id } = await params
        const { searchParams } = new URL(req.url)
        const subCategoryId = searchParams.get('subCategoryId')
        const section = searchParams.get('section')

        const category = await SubMenuFixed.findOne({ "subCat._id": subCategoryId, ...getAdminSectionFilter(section) })
        if (!category) {
            return NextResponse.json({ error: "Subcategory not found" }, { status: 404 })
        }

        const subCategory = category.subCat.id(subCategoryId)
        subCategory.subCatPackage.pull(id)
        await category.save()

        return NextResponse.json({ message: "Package deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete package" }, { status: 500 })
    }
}