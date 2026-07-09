import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import PropertyBooking from "@/models/Property/PropertyBooking";
import PropertyDetails from "@/models/Property/PropertyDetails";
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
      totalAmount,
      advanceAmount,
      otherAmount,
      amountToPay,
      expectedTotalAmount,
      remainingAmount,
      selectedPaymentOption,
      selectedPaymentLabel,
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
    if (!amountToPay && !advanceAmount && !totalAmount) requiredFields.push("amountToPay");

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

    const bookingAmount = Number(amountToPay || advanceAmount || totalAmount || property?.rentPrice || 0);
    if (!Number.isFinite(bookingAmount) || bookingAmount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid payment amount" }, { status: 400 });
    }

    const expectedAmount = Number(
      expectedTotalAmount || property?.maxRentPrice || totalAmount || bookingAmount
    );
    const normalizedExpectedAmount = Number.isFinite(expectedAmount) && expectedAmount > 0
      ? expectedAmount
      : bookingAmount;
    const normalizedRemainingAmount = Math.max(
      Number.isFinite(Number(remainingAmount)) ? Number(remainingAmount) : normalizedExpectedAmount - bookingAmount,
      0
    );

    const resolvedPaymentOption = selectedPaymentOption || (
      Number(totalAmount) > 0 ? "full" : Number(advanceAmount) > 0 ? "advance" : Number(otherAmount) > 0 ? "custom" : ""
    );
    const resolvedPaymentLabel = selectedPaymentLabel || (
      resolvedPaymentOption === "full"
        ? "Full max rent"
        : resolvedPaymentOption === "advance"
          ? "Minimum amount"
          : resolvedPaymentOption === "custom"
            ? "Custom amount"
            : ""
    );

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
      totalAmount: Number(totalAmount || 0),
      advanceAmount: Number(advanceAmount || 0),
      otherAmount: Number(otherAmount || 0),
      amountToPay: bookingAmount,
      expectedTotalAmount: normalizedExpectedAmount,
      remainingAmount: normalizedRemainingAmount,
      selectedPaymentOption: resolvedPaymentOption,
      selectedPaymentLabel: resolvedPaymentLabel,
      currency,
      message,
      sourcePage,
      status: "Pending",
    });

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