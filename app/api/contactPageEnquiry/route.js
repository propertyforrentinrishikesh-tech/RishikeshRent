import connectDB from "@/lib/connectDB";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ message: "Unauthorized access!" }, { status: 403 });
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        
        let filter = {};
        if (type && type !== 'all') {
            filter.plan = type;
        }

        const enquiries = await Contact.find(filter).sort({ createdAt: -1 });

        return NextResponse.json(enquiries, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
