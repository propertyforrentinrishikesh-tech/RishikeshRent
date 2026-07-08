import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PropertyDetails from "@/models/Property/PropertyDetails";
import PropertyEnquiry from "@/models/Property/PropertyEnquiry";
import PropertyBooking from "@/models/Property/PropertyBooking";

export async function GET() {
  try {
    await connectDB();

    const [
      totalProperties,
      activeProperties,
      trendingProperties,
      totalEnquiries,
      newEnquiries,
      totalBookings,
      paidBookings,
      pendingBookings,
      recentProperties,
      recentEnquiries,
      recentBookings,
    ] = await Promise.all([
      PropertyDetails.countDocuments({}),
      PropertyDetails.countDocuments({ isActive: true }),
      PropertyDetails.countDocuments({ isTrending: true }),
      PropertyEnquiry.countDocuments({}),
      PropertyEnquiry.countDocuments({ status: "New" }),
      PropertyBooking.countDocuments({}),
      PropertyBooking.countDocuments({ paymentStatus: "Paid" }),
      PropertyBooking.countDocuments({ paymentStatus: { $ne: "Paid" } }),
      PropertyDetails.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("propertyName propertyType locationType subLocationType rentPrice isActive isTrending mainImage createdAt")
        .lean(),
      PropertyEnquiry.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("propertyName phone email contactMethod status createdAt propertyImage locationType subLocationType")
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
          totalEnquiries,
          newEnquiries,
          totalBookings,
          paidBookings,
          pendingBookings,
        },
        recentProperties,
        recentEnquiries,
        recentBookings,
      },
    });
  } catch (error) {
    console.error("Property extranet summary error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load property extranet summary" },
      { status: 500 }
    );
  }
}