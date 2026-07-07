import connectDB from "@/lib/connectDB"
import SubMenuFixed from "@/models/SubMenuFixed"
import { NextResponse } from "next/server"
import { getAdminSectionFilter, normalizeAdminSection } from "@/lib/admin-section"

export async function PUT(req, { params }) {
    await connectDB()
    try {
        const { id } = await params
        const body = await req.json()
        const section = normalizeAdminSection(body.section)

        const updatedItem = await SubMenuFixed.findOneAndUpdate({ _id: id, ...getAdminSectionFilter(section) }, body, { new: true })
        if (!updatedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Item updated successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
    }
}

export async function DELETE(req, {params}) {
    await connectDB()
    try {
        const { id } = await params
        const { searchParams } = new URL(req.url)
        const section = searchParams.get("section")
        const deletedItem = await SubMenuFixed.findOneAndDelete({ _id: id, ...getAdminSectionFilter(section) })
        if (!deletedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }
        return NextResponse.json({ message: "Item deleted successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
    }
}