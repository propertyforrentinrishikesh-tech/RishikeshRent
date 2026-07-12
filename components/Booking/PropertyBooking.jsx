"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, PhoneCall, Trash2, Upload, X } from "lucide-react";
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
  const propertyPrice = Number(property?.maxRentPrice || property?.rentPrice || 0);
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
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    totalPersons: 1,
    checkInDate: "",
    lengthOfStay: "",
    idProofType: "Aadhaar Card",
    idImage: { url: "", key: "", loading: false },
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const idImageRef = useRef(null);

  // Prevent accidental page refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome to show dialog
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Email Verification State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

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

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setEmailError("Please enter your email first.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Invalid email format.");
      return;
    }

    setEmailLoading(true);
    setEmailError("");
    setEmailSuccess("");

    try {
      const response = await fetch('/api/property/booking-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSuccess("OTP sent successfully to your email!");
        setIsOtpSent(true);
      } else {
        setEmailError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setEmailError("An error occurred. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setEmailError("Please enter the OTP.");
      return;
    }

    setEmailLoading(true);
    setEmailError("");

    try {
      const response = await fetch('/api/property/booking-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailSuccess("Email verified successfully!");
        setIsEmailVerified(true);
        setIsOtpSent(false);
        setOtp("");
      } else {
        setEmailError(data.message || "Verification failed");
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setEmailError("An error occurred. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";

    if (!isEmailVerified) {
      errors.email = "Please verify your email address before booking.";
      toast.error("Please verify your email address.");
    }

    const phoneNormalized = (formData.phone || "").replace(/[^0-9]/g, "");
    if (!phoneNormalized) errors.phone = "Phone is required";
    else if (!/^\d{7,10}$/.test(phoneNormalized)) errors.phone = "Phone must be 7-10 digits";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Enter a valid email";

    if (!formData.totalPersons || Number(formData.totalPersons) < 1) errors.totalPersons = "At least 1 person required";
    if (!formData.checkInDate) errors.checkInDate = "Check-in date is required";
    if (!formData.idImage.url) errors.idImage = "Please upload ID proof image";

    if (!propertyPrice || propertyPrice <= 0) {
      errors.paymentAmount = "Property rent amount is not available";
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
      const bookingPayload = {
        propertyId: property?._id || property?.id,
        propertyName: property?.propertyName || property?.name,
        propertyNameSlug: property?.propertyNameSlug || property?.slug,
        propertyImage: heroImage,
        propertyAddress,
        locationType: property?.locationType || "",
        subLocationType: property?.subLocationType || "",
        propertyPrice,
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

      setShowSuccessModal(true);
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
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  <p className="text-base font-bold text-slate-900">{propertyName}</p>
                  {property?.propertyCategory && (
                    <span className="inline-block bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                      {property.propertyCategory.replace(/-/g, ' ')}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{propertyAddress}</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Property Rent</p>
                <p className="mt-1 text-2xl font-black text-slate-900">₹{propertyPrice.toLocaleString("en-IN")}</p>
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
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-2 w-full">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    >
                      <option>Mr.</option>
                      <option>Miss.</option>
                      <option>Mrs.</option>
                      <option>Dr.</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${formErrors.firstName ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`}
                    />
                    {formErrors.firstName && <p className="text-xs text-red-600 mt-1">{formErrors.firstName}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${formErrors.lastName ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"}`}
                    />
                    {formErrors.lastName && <p className="text-xs text-red-600 mt-1">{formErrors.lastName}</p>}
                  </div>
                </div>
                <div className="grid grid-col-1 md:grid-cols-2 gap-2  ">
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
                  </div>
                  {formErrors.totalPersons && <p className="text-xs text-red-600 mt-1">{formErrors.totalPersons}</p>}
                </div>
                <div className="md:col-span-3">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                      <div className="relative flex-1 w-full">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => {
                            handleChange(e);
                            if (isEmailVerified) setIsEmailVerified(false);
                            if (isOtpSent) setIsOtpSent(false);
                          }}
                          disabled={isEmailVerified || emailLoading}
                          placeholder="Enter email address"
                          className={`w-full rounded-2xl border px-4 py-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${formErrors.email ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                            } ${isEmailVerified ? "bg-slate-50 opacity-80" : ""}`}
                        />
                        {isEmailVerified && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 bg-emerald-50 p-1 rounded-full">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {!isEmailVerified && !isOtpSent && (
                        <Button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={!formData.email || emailLoading}
                          className="w-full md:w-auto shrink-0 rounded-2xl bg-slate-900 px-6 py-3 text-white shadow-lg transition-all hover:bg-slate-800 disabled:opacity-50 h-[46px]"
                        >
                          {emailLoading ? "Sending..." : "Verify Email"}
                        </Button>
                      )}
                    </div>

                    {formErrors.email && <p className="text-xs text-red-600">{formErrors.email}</p>}
                    {emailError && <p className="text-xs text-red-600">{emailError}</p>}
                    {emailSuccess && <p className="text-xs text-emerald-600">{emailSuccess}</p>}

                    {/* OTP Input Section */}
                    {isOtpSent && !isEmailVerified && (
                      <div className="mt-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col md:flex-row items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="w-full md:flex-1 rounded-xl border border-blue-200 bg-white px-4 py-3 text-center text-lg tracking-[0.2em] font-medium outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                        <Button
                          type="button"
                          onClick={handleVerifyOTP}
                          disabled={otp.length !== 6 || emailLoading}
                          className="w-full md:w-auto shrink-0 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50 h-[48px]"
                        >
                          {emailLoading ? "Verifying..." : "Confirm OTP"}
                        </Button>
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={emailLoading}
                          className="text-sm font-medium text-blue-600 underline hover:text-blue-700 disabled:opacity-50 mt-2 md:mt-0"
                        >
                          Resend OTP
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7 space-y-4">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Stay Schedule</h3>
                    <p className="mt-1 text-sm text-slate-500">Pick your arrival duration.</p>
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
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
              <div className="flex justify-between items-center">
                <div className="mb-5">
                  <h3 className="text-lg font-black text-slate-900">ID Proof</h3>
                  <p className="mt-1 text-sm text-slate-500">Choose an ID type and upload a clear image.</p>
                </div>
                <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 md:block">Step 3 of 3</div>
              </div>

              <div className="space-y-4 w-full">
                <div className="flex flex-col md:flex-row items-center w-full md:items-end mt-2 gap-3 ">
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
                      className="flex items-center gap-2 rounded-2xl bg-slate-900 md:px-5 py-5 text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 hover:text-white w-64 md:w-48"
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
                <h2 className="text-md mb-3 flex items-center flex-wrap gap-2">
                  <span className="text-md font-bold">Property Name: </span>
                  {propertyName}
                  {property?.propertyCategory && (
                    <span className="inline-block bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                      {property.propertyCategory.replace(/-/g, ' ')}
                    </span>
                  )}
                </h2>
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
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Property Rent</p>
                  <div className="mt-2 text-3xl font-black text-slate-900">
                    ₹{propertyPrice.toLocaleString("en-IN")}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Rent Price</p>
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center lg:items-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">

          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col lg:flex-row my-8 lg:my-0 animate-in zoom-in-95 fade-in duration-300">

            {/* Close Button */}
            <button
              onClick={() => router.push("/")}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-100 transition"
            >
              <X className="h-5 w-5 text-slate-700" />
            </button>

            {/* ================= LEFT ================= */}
            <div className="order-2 lg:order-1 w-full lg:w-1/2 bg-gradient-to-br from-emerald-50 to-white p-6 sm:p-4 lg:p-12 flex flex-col justify-center">

              <div className="hidden md:flex flex-col">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                <Check className="h-8 w-8" />
              </div>

                <h2 className="mt-6 text-3xl sm:text-4xl font-black text-slate-900">
                  Thank You!
                </h2>

                <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">
                  Your booking request has been successfully received.
                </p>
              </div>

              <div className="md:mt-8 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <p className="text-sm leading-7 text-slate-600">
                  Our{" "}
                  <span className="font-bold text-emerald-600">
                    Rishikesh Rent
                  </span>
                  {" "}team will contact you shortly to confirm your booking
                  and provide all the necessary details.
                </p>
              </div>

              <Button
                onClick={() => router.push("/")}
                className="mt-8 w-full sm:w-fit rounded-xl bg-emerald-600 hover:bg-emerald-700 px-8 py-6 text-white font-semibold shadow-lg transition-all hover:scale-[1.02]"
              >
                Return to Home
              </Button>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="order-1 lg:order-2 w-full lg:w-1/2 bg-slate-50 p-6 sm:p-8">
       
              <div className="flex flex-col items-center gap-2 pb-5">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                <Check className="h-8 w-8" />
              </div>

                <h2 className="mt-6 text-3xl sm:text-4xl font-black text-slate-900">
                  Thank You!
                </h2>

                <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600 text-center">
                  Your booking request has been successfully received.
                </p>
              </div>
              <div className="overflow-hidden rounded-2xl shadow">
                <img
                  src={heroImage}
                  alt={propertyName}
                  className="w-full h-60 sm:h-72 lg:h-80 object-cover"
                />
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  Booked Property
                </p>

                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 line-clamp-2">
                  {propertyName}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-2">
                  {propertyAddress}
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm md:text-xl text-gray-900">
                    Rent Price
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{propertyPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
