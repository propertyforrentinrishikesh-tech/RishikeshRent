import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PropertyDetails from "@/models/Property/PropertyDetails";
import PropertyBooking from "@/models/Property/PropertyBooking";

export async function GET() {
  try {
    await connectDB();

    const hostelCondition = { 
      status: "Approved", 
      propertyCategory: { $in: ["pg-hostel"] } 
    };

    const [
      totalProperties,
      activeProperties,
      trendingProperties,
      totalBookings,
      paidBookings,
      pendingBookings,
      recentProperties,
      recentBookings,
    ] = await Promise.all([
      PropertyDetails.countDocuments(hostelCondition),
      PropertyDetails.countDocuments({ ...hostelCondition, isActive: true }),
      PropertyDetails.countDocuments({ ...hostelCondition, isTrending: true }),
      PropertyBooking.countDocuments({}),
      PropertyBooking.countDocuments({ paymentStatus: "Paid" }),
      PropertyBooking.countDocuments({ paymentStatus: { $ne: "Paid" } }),
      PropertyDetails.find(hostelCondition)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("propertyName propertyType locationType subLocationType rentPrice isActive isTrending mainImage createdAt")
        .lean(),
      PropertyBooking.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("propertyName fullName phone email status paymentStatus amountToPay advanceAmount totalAmount createdAt propertyImage checkInDate lengthOfStay")
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalProperties,
          activeProperties,
          trendingProperties,
          totalBookings,
          paidBookings,
          pendingBookings,
        },
        recentProperties,
        recentBookings,
      },
    });
  } catch (error) {
    console.error("Hostel extranet summary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load hostel extranet summary" },
      { status: 500 }
    );
  }
}
