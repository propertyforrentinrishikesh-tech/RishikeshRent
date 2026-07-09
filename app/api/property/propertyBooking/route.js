import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PropertyBooking from "@/models/Property/PropertyBooking";
import PropertyDetails from "@/models/Property/PropertyDetails";
import { sendOTP } from "@/lib/brevo";
import { wrapEmailTemplate } from "@/lib/emailTemplate";
function generateBookingRef() {
  return `BG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}

function isValidPhone(phone) {
  const normalized = String(phone || "").replace(/[^0-9]/g, "");
  return /^\d{7,10}$/.test(normalized);
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { propertyName: { $regex: search, $options: "i" } },
        { bookingRef: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;

    const total = await PropertyBooking.countDocuments(filter);
    const bookings = await PropertyBooking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("propertyId", "propertyName propertyNameSlug locationType subLocationType rentPrice mainImage")
      .lean();

    return NextResponse.json({
      success: true,
      data: bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("PropertyBooking GET error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      propertyId,
      propertyName,
      propertyNameSlug,
      propertyImage,
      propertyAddress,
      locationType,
      subLocationType,
      guestTitle,
      firstName,
      lastName,
      phone,
      email,
      totalPersons,
      checkInDate,
      idProofType,
      idImage,
      propertyPrice,
      currency = "INR",
      message,
      sourcePage,
    } = body;

    const requiredFields = [];
    if (!propertyName) requiredFields.push("propertyName");
    if (!firstName?.trim()) requiredFields.push("firstName");
    if (!phone?.trim()) requiredFields.push("phone");
    if (!email?.trim()) requiredFields.push("email");
    if (!checkInDate) requiredFields.push("checkInDate");
    if (!idImage?.url) requiredFields.push("idImage");
    if (!propertyPrice) requiredFields.push("propertyPrice");

    if (requiredFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${requiredFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ success: false, message: "Phone number must be 7-10 digits" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, message: "A valid email address is required" }, { status: 400 });
    }

    const property = propertyId
      ? await PropertyDetails.findById(propertyId).select("propertyName propertyNameSlug locationType subLocationType contactAddress mainImage rentPrice maxRentPrice").lean()
      : null;

    const bookingAmount = Number(propertyPrice || property?.rentPrice || 0);
    if (!Number.isFinite(bookingAmount) || bookingAmount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid property price" }, { status: 400 });
    }

    const booking = await PropertyBooking.create({
      bookingRef: generateBookingRef(),
      propertyId: property?._id || propertyId || undefined,
      propertyName: propertyName || property?.propertyName,
      propertyNameSlug: propertyNameSlug || property?.propertyNameSlug,
      propertyImage: propertyImage || property?.mainImage?.url || "",
      propertyAddress: propertyAddress || property?.contactAddress || "",
      locationType: locationType || property?.locationType || "",
      subLocationType: subLocationType || property?.subLocationType || "",
      guestTitle,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      totalPersons: Number(totalPersons || 1),
      checkInDate,
      idProofType,
      idImage,
      totalAmount: bookingAmount,
      propertyPrice: bookingAmount,
      currency,
      message,
      sourcePage,
      status: "Pending",
    });

    try {
      const resolvedPropertyName = propertyName || property?.propertyName || "Property";
      const resolvedLocation = locationType || property?.locationType || "";
      const emailContent = `
        <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #0EA5E9;">Thank You for Your Booking Request!</h2>
          <p>Dear ${firstName.trim()} ${lastName.trim()},</p>
          <p>Your booking request for <strong>${resolvedPropertyName}</strong> has been successfully received.</p>
          <p>Our team will review it and message you shortly with further details.</p>
          
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Booking Details</h3>
            <p style="margin: 4px 0;"><strong>Property Name:</strong> ${resolvedPropertyName}</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> ${resolvedLocation}</p>
            <p style="margin: 4px 0;"><strong>Check-in Date:</strong> ${new Date(checkInDate).toLocaleDateString("en-IN")}</p>
            <p style="margin: 4px 0;"><strong>Total Persons:</strong> ${Number(totalPersons || 1)}</p>
            <p style="margin: 4px 0;"><strong>Rent Price:</strong> ₹${bookingAmount.toLocaleString("en-IN")}</p>
          </div>
          
          <p>If you have any urgent questions, please feel free to contact our team.</p>
          <p>Best regards,<br/><strong>Rishikesh Rent Team</strong></p>
        </div>
      `;

      const formattedEmail = wrapEmailTemplate({
        bodyContent: emailContent,
        title: "Booking Request Received - Rishikesh Rent",
      });

      await sendOTP(email.trim(), null, formattedEmail, "Booking Request Received - Rishikesh Rent");
    } catch (emailErr) {
      console.error("Failed to send booking confirmation email:", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("PropertyBooking POST error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create booking",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Booking ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { status, adminNote } = body;

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (adminNote !== undefined) updateFields.adminNote = adminNote;

    const updatedBooking = await PropertyBooking.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("PropertyBooking PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update booking" },
      { status: 500 }
    );
  }
}