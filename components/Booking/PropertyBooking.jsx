"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, PhoneCall, Trash2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PropertyBooking({ property }) {
  const router = useRouter();
  const propertySlug = property?.slug || property?.propertyNameSlug || property?.nameSlug || "property";
  const propertyLocation = property?.location || property?.locationType || "location";
  const heroImage = property?.images?.[0]?.url || property?.mainImage?.url || "/placeholder.jpg";
  const propertyName = property?.propertyName || property?.name || "Property Booking";
  const propertyAddress =
    property?.contactAddress ||
    [property?.galiType, property?.subLocationType, property?.locationType].filter(Boolean).join(" ") ||
    "Address not available";
  const propertyPrice = Number(property?.maxRentPrice ||property?.rentPrice|| 0);
  const fullRentAmount = propertyPrice;
  const advanceAmount = Math.round(propertyPrice * 0.25);
  const customAmountMin = Math.max(Math.ceil(propertyPrice * 0.1), 1);
  const customAmountMax = propertyPrice;
  const slugify = (text) =>
    text
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')   // spaces → -
      .replace(/[^\w-]+/g, '') // remove special chars
      .replace(/--+/g, '-');
  const [formData, setFormData] = useState({
    title: "Mr.",
    fullName: "",
    phone: "",
    email: "",
    totalPersons: 1,
    checkInDate: "",
    lengthOfStay: "",
    idProofType: "Aadhaar Card",
    idProofType: "",
    idImage: { url: "", key: "", loading: false },
  });
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const idImageRef = useRef(null);

  const selectedPaymentAmount =
    selectedPaymentOption === "full"
      ? fullRentAmount
      : selectedPaymentOption === "advance"
        ? advanceAmount
        : Number(customAmount || 0);

  const selectedPaymentLabel =
    selectedPaymentOption === "full"
      ? "Full max rent"
      : selectedPaymentOption === "advance"
        ? "25% of max rent"
        : selectedPaymentOption === "custom"
          ? "Custom amount"
          : "No payment option selected";

  const setPaymentOption = (option) => {
    setSelectedPaymentOption(option);
    clearFieldError("paymentAmount");
    clearFieldError("customAmount");
  };


  const clearFieldError = (field) => {
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^0-9+]/g, "").trim();
    if (value.startsWith("+")) {
      value = "+" + value.slice(1).replace(/\D/g, "").slice(0, 10);
    } else {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, phone: value }));
    clearFieldError("phone");
  };

  const handleIDProofImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setFormData((prev) => ({ ...prev, idImage: { ...prev.idImage, loading: true } }));

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/cloudinary", { method: "POST", body: uploadData });
      const data = await res.json();

      if (res.ok && data.url) {
        setFormData((prev) => ({
          ...prev,
          idImage: { url: data.url, key: data.key || "", loading: false },
        }));
        clearFieldError("idImage");
        toast.success("ID proof image uploaded successfully!");
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error(err.message || "Failed to upload image");
      setFormData((prev) => ({ ...prev, idImage: { ...prev.idImage, loading: false } }));
    }
  };

  const removeIDProofImage = () => {
    setFormData((prev) => ({ ...prev, idImage: { url: "", key: "", loading: false } }));
    if (idImageRef.current) idImageRef.current.value = "";
    clearFieldError("idImage");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";

    const phoneNormalized = (formData.phone || "").replace(/[^0-9]/g, "");
    if (!phoneNormalized) errors.phone = "Phone is required";
    else if (!/^\d{7,10}$/.test(phoneNormalized)) errors.phone = "Phone must be 7-10 digits";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Enter a valid email";

    if (!formData.totalPersons || Number(formData.totalPersons) < 1) errors.totalPersons = "At least 1 person required";
    if (!formData.checkInDate) errors.checkInDate = "Check-in date is required";
    if (!formData.lengthOfStay) errors.lengthOfStay = "Length of stay is required";
    if (!formData.idImage.url) errors.idImage = "Please upload ID proof image";
    if (!selectedPaymentOption) errors.paymentOption = "Please select a payment option";

    if (!propertyPrice || propertyPrice <= 0) {
      errors.paymentAmount = "Property rent amount is not available";
    }

    if (selectedPaymentOption === "custom") {
      const parsedCustomAmount = Number(customAmount);
      if (!customAmount.trim()) {
        errors.customAmount = "Enter a custom amount";
      } else if (!Number.isFinite(parsedCustomAmount)) {
        errors.customAmount = "Enter a valid amount";
      } else if (parsedCustomAmount < customAmountMin || parsedCustomAmount > customAmountMax) {
        errors.customAmount = `Amount must be between ₹${customAmountMin.toLocaleString("en-IN")} and ₹${customAmountMax.toLocaleString("en-IN")}`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill Input fields before submitting");
      return;
    }

    setPaymentLoading(true);
    try {
      const amountToPay = selectedPaymentAmount;
      if (!amountToPay || amountToPay <= 0) {
        throw new Error("Invalid payment amount");
      }

      const expectedTotalAmount = Number(fullRentAmount || amountToPay || 0);
      const remainingAmount = Math.max(expectedTotalAmount - amountToPay, 0);

      const bookingAmountFields = {
        totalAmount: selectedPaymentOption === "full" ? amountToPay : 0,
        advanceAmount: selectedPaymentOption === "advance" ? amountToPay : 0,
        otherAmount: selectedPaymentOption === "custom" ? amountToPay : 0,
      };

      const bookingPayload = {
        propertyId: property?._id || property?.id,
        propertyName: property?.propertyName || property?.name,
        propertyNameSlug: property?.propertyNameSlug || property?.slug,
        propertyImage: heroImage,
        propertyAddress,
        locationType: property?.locationType || "",
        subLocationType: property?.subLocationType || "",
        amountToPay,
        expectedTotalAmount,
        remainingAmount,
        selectedPaymentOption,
        selectedPaymentLabel,
        ...bookingAmountFields,
        ...formData,
      };

      const bookingRes = await fetch("/api/property/propertyBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });
      const bookingData = await bookingRes.json();

      if (!bookingRes.ok || !bookingData.success) {
        throw new Error(bookingData.message || "Failed to create booking");
      }

      toast.success("Booking confirmed successfully!");
      toast("Redirecting to property details page in 5 seconds...", { icon: '⏳', duration: 5000 });
      setFormData({
        title: "Mr.",
        fullName: "",
        phone: "",
        email: "",
        totalPersons: 1,
        checkInDate: "",
        lengthOfStay: "",
        idProofType: "Aadhaar Card",
        idProofType: "",
        idImage: { url: "", key: "", loading: false },
      });
      setSelectedPaymentOption("");
      setCustomAmount("");
      setFormErrors({});
      
      setTimeout(() => {
        router.push(`/properties/${slugify(propertyLocation)}/${slugify(propertySlug)}`);
      }, 5000);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error submitting booking");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_28%),linear-gradient(180deg,_#f7fbff_0%,_#edf4fb_100%)] py-8">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[-6rem] top-24 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-[-5rem] top-48 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <Link href={`/properties/${slugify(propertyLocation)}/${slugify(propertySlug)}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
                <ArrowLeft className="h-4 w-4" />
                Back to property details
              </Link>
              <div className="space-y-3">
                <p className="inline-flex w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
                  Booking summary
                </p>
                <h1 className="max-w-2xl text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Finalize your stay with a clean, secure checkout</h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">Review the property, choose a payment amount, and submit your booking details in one simple flow.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[28rem]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Property</p>
                <p className="mt-1 text-base font-bold text-slate-900">{propertyName}</p>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{propertyAddress}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Selected payment</p>
                <p className="mt-1 text-2xl font-black text-slate-900">₹{selectedPaymentAmount.toLocaleString("en-IN")}</p>
                <p className="mt-1 text-sm text-slate-600">{selectedPaymentLabel}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1.65fr_0.95fr] items-start">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Basic Information</h2>
                  <p className="mt-1 text-sm text-slate-500">Tell us who will be staying and how we can reach you.</p>
                </div>
                <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 md:block">Step 1 of 3</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                    <option>Dr.</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${formErrors.fullName ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`}
                  />
                  {formErrors.fullName && <p className="text-xs text-red-600 mt-1">{formErrors.fullName}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+91 XXXXXXXXXX"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${formErrors.phone ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`}
                  />
                  {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${formErrors.email ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`}
                  />
                  {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Total Number of Persons</label>
                  <div className="flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <input
                      type="number"
                      name="totalPersons"
                      value={formData.totalPersons}
                      onChange={handleChange}
                      min="1"
                      className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 outline-none"
                    />
                    {/* <div className="bg-slate-900 px-4 py-3 text-sm font-bold text-white">+</div> */}
                  </div>
                  {formErrors.totalPersons && <p className="text-xs text-red-600 mt-1">{formErrors.totalPersons}</p>}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7 space-y-4">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Stay Schedule</h3>
                    <p className="mt-1 text-sm text-slate-500">Pick your arrival and stay duration.</p>
                  </div>
                  <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 md:block">Step 2 of 3</div>
                </div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Check-in Date</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${formErrors.checkInDate ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`}
                />
                {formErrors.checkInDate && <p className="text-xs text-red-600 mt-1">{formErrors.checkInDate}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Check Out Date</label>
                <input
                  type="date"
                  name="lengthOfStay"
                  value={formData.lengthOfStay}
                  onChange={handleChange}
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${formErrors.lengthOfStay ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`}
                />
                {formErrors.lengthOfStay && <p className="text-xs text-red-600 mt-1">{formErrors.lengthOfStay}</p>}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
              <div className="mb-5">
                <h3 className="text-lg font-black text-slate-900">ID Proof</h3>
                <p className="mt-1 text-sm text-slate-500">Choose an ID type and upload a clear image.</p>
              </div>
              <div className="space-y-4 w-full">
                <div className="flex items-end mt-2 gap-3 w-full">
                  <div className="w-full">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Select ID Type</label>
                    <select
                      name="idProofType"
                      value={formData.idProofType}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    >
                      <option>Aadhaar Card</option>
                      <option>Passport</option>
                      <option>Voter ID</option>
                      <option>Driving License</option>
                    </select>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIDProofImageUpload}
                      className="hidden"
                      ref={idImageRef}
                      id="id-proof-input"
                      disabled={formData.idImage.loading}
                    />
                    <Button
                      type="button"
                      className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-5 text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 hover:text-white w-48"
                      onClick={() => idImageRef.current?.click()}
                      disabled={formData.idImage.loading}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{formData.idImage.loading ? "Uploading..." : "Upload ID Image"}</span>
                    </Button>
                  </div>
                </div>
                {formErrors.idProofType && <p className="text-xs text-red-600 mt-1">{formErrors.idProofType}</p>}
                {formData.idImage.url && (
                  <div className="relative h-32 w-48 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                    <Image src={formData.idImage.url} alt="ID Proof" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={removeIDProofImage}
                      className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
                {formErrors.idImage && <p className="text-xs text-red-600 mt-1">{formErrors.idImage}</p>}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7 space-y-4">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Choose Payment Amount</h3>
                    <p className="mt-1 text-sm text-slate-500">Select one option. The amount shown here will be the final payment during checkout.</p>
                  </div>
                  <div className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 md:block">Step 3 of 3</div>
                </div>
              </div>

              <label className={`flex items-start gap-3 rounded-[1.25rem] border p-4 transition ${selectedPaymentOption === "full" ? "border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm" : "border-slate-200 bg-white"}`}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={selectedPaymentOption === "full"}
                  onChange={() => setPaymentOption("full")}
                  className="mt-1 h-4 w-4 text-blue-600"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Pay full max rent</p>
                      <p className="text-xs text-slate-500">100% of the max rent price</p>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={`₹${fullRentAmount.toLocaleString("en-IN")}`}
                      className="w-40 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right text-sm font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3 rounded-[1.25rem] border p-4 transition ${selectedPaymentOption === "advance" ? "border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm" : "border-slate-200 bg-white"}`}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={selectedPaymentOption === "advance"}
                  onChange={() => setPaymentOption("advance")}
                  className="mt-1 h-4 w-4 text-blue-600"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Pay 25% of max rent</p>
                      <p className="text-xs text-slate-500">Quarter of the max rent price</p>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={`₹${advanceAmount.toLocaleString("en-IN")}`}
                      className="w-40 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right text-sm font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </label>

              <label className={`flex items-start gap-3 rounded-[1.25rem] border p-4 transition ${selectedPaymentOption === "custom" ? "border-blue-500 bg-gradient-to-r from-blue-50 to-white shadow-sm" : "border-slate-200 bg-white"}`}>
                <input
                  type="radio"
                  name="paymentOption"
                  checked={selectedPaymentOption === "custom"}
                  onChange={() => setPaymentOption("custom")}
                  className="mt-1 h-4 w-4 text-blue-600"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Enter a custom amount</p>
                      <p className="text-xs text-slate-500">
                        Must be between ₹{customAmountMin.toLocaleString("en-IN")} and ₹{customAmountMax.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <input
                      type="number"
                      name="customAmount"
                      value={customAmount}
                      onChange={(e) => {
                        setPaymentOption("custom");
                        const nextValue = e.target.value;
                        setCustomAmount(nextValue);
                        clearFieldError("customAmount");
                      }}
                      onBlur={(e) => {
                        const nextValue = e.target.value;
                        if (!nextValue) return;

                        const parsedValue = Number(nextValue);
                        if (!Number.isFinite(parsedValue)) return;

                        if (parsedValue > customAmountMax) {
                          toast.error(`Custom amount cannot be more than ₹${customAmountMax.toLocaleString("en-IN")}`);
                        } else if (parsedValue < customAmountMin) {
                          toast.error(`Custom amount must be at least ₹${customAmountMin.toLocaleString("en-IN")}`);
                        }
                      }}
                      min={customAmountMin}
                      max={customAmountMax}
                      placeholder="Enter amount"
                      disabled={selectedPaymentOption !== "custom"}
                      className={`w-40 rounded-2xl border px-4 py-2 text-right text-sm font-bold outline-none ${formErrors.customAmount ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`}
                    />
                  </div>
                  {formErrors.customAmount && <p className="text-xs text-red-600">{formErrors.customAmount}</p>}
                </div>
              </label>

              {formErrors.paymentAmount && <p className="text-xs text-red-600">{formErrors.paymentAmount}</p>}
              {formErrors.paymentOption && <p className="text-xs text-red-600">{formErrors.paymentOption}</p>}
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
              <p className="text-sm font-semibold leading-6 text-slate-600 text-justify">
                This apartment is available for a total stay of 03 To 06 months, providing a structured rental period that offers the perfect balance of long-term stability and residential flexibility.
              </p>
            </div>
          </div>

          <div className="lg:self-start">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">

              <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-slate-100">
                <Image src={heroImage} alt={propertyName} fill className="object-cover" />
              </div>

              <div className="mt-5 space-y-2 text-slate-900">
                <h2 className="text-md mb-3"><span className="text-md font-bold">
                  Property Name: </span>{propertyName}</h2>
                <div className="text-md text-slate-700"><span className="font-bold text-md text-slate-900">Address :</span> {propertyAddress}</div>
                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="font-semibold text-slate-500">Room</div>
                      <div className="mt-1 text-slate-900">Apartment</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="font-semibold text-slate-500">Type</div>
                      <div className="mt-1 text-slate-900">Sharing (Bed Only)</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="font-semibold text-slate-500">Floor</div>
                      <div className="mt-1 text-slate-900">3rd</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="font-semibold text-slate-500">Rent Type</div>
                      <div className="mt-1 text-slate-900">Month Basis</div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Final payment during checkout</p>
                  <div className="mt-2 text-3xl font-black text-slate-900">
                    {selectedPaymentOption ? `₹${selectedPaymentAmount.toLocaleString("en-IN")}` : "Select a payment option"}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{selectedPaymentLabel}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                  Reserve now, pay later option available
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <PhoneCall className="mt-0.5 h-4 w-4 text-blue-600" />
                  Call our team for booking confirmation
                </div>
              </div>

              <Button type="submit" disabled={paymentLoading} className="mt-5 w-full rounded-2xl bg-slate-900 py-6 font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 gap-2">
                {paymentLoading ? "Processing..." : (
                  <>
                    Confirm Booking <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
