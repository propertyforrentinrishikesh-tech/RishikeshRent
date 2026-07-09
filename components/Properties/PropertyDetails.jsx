"use client";
import React, { useState, useEffect } from "react";
import {
    MapPin, Share2, Bookmark, Star, Check, X,
    ArrowUpRight, Users, Calendar, Home, Layers,
    Maximize, BedDouble, Bath, Car, ArrowRight, PhoneCall,
    Wifi, Shield, Camera, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "react-hot-toast";

export const PropertyDetail = ({ property: initialProperty, relatedProperties = [] }) => {
    const [activeTab, setActiveTab] = useState("overview");
    // console.log(initialProperty)
    // Use passed property data or fallback to mock if null/undefined
    const property = initialProperty ? {
        name: initialProperty.propertyName,
        type: initialProperty.propertyType,
        address: `${initialProperty.galiType || ''} ${initialProperty.subLocationType || ''} ${initialProperty.locationType || ''}`.trim() || initialProperty.contactAddress,
        beds: initialProperty.numberOfBedrooms || initialProperty.numberOfRooms || 0,
        baths: initialProperty.numberOfBathrooms || 0,
        area: (initialProperty.sizeLength && initialProperty.sizeWidth) ? `${initialProperty.sizeLength}x${initialProperty.sizeWidth} ${initialProperty.sizeUnit || 'SqFt'}` : "N/A",
        price: initialProperty.rentPrice || "",
        originalPrice: initialProperty.maxRentPrice || "",
        slug: initialProperty.propertyNameSlug || "",
        discount: 0,
        description: initialProperty.detailFor || "Beautifully designed property in a prime location with modern amenities and excellent connectivity. Perfect for families looking for comfort and convenience.",
        highlights: initialProperty.highlights?.length > 0 ? initialProperty.highlights : ["No specific highlights listed."],
        attributes: [
            { label: "Type", value: initialProperty.propertyType || "N/A" },
            { label: "Category", value: initialProperty.propertyFor || "N/A" },
            { label: "Owner", value: initialProperty.ownerName || "N/A" },
            { label: "Phone", value: initialProperty.contactNumbers?.[0] || "N/A" },
            { label: "Furnishing", value: initialProperty.furnishingStatus || "N/A" },
            { label: "Floor", value: initialProperty.floor || "N/A" },
            { label: "Gali", value: initialProperty.galiType || "N/A" },
            { label: "Location", value: initialProperty.subLocationType || "N/A" },
        ],
        inclusions: [
            initialProperty.electricityCharges?.include ? "Electricity" : null,
            initialProperty.waterCharges?.include ? "Water" : null,
            (initialProperty.maintenanceCharges && !initialProperty.maintenanceCharges.required) ? "Maintenance" : null,
        ].filter(Boolean),
        exclusions: [
            (!initialProperty.electricityCharges || !initialProperty.electricityCharges.include) ? "Electricity" : null,
            (!initialProperty.waterCharges || !initialProperty.waterCharges.include) ? "Water" : null,
            initialProperty.maintenanceCharges?.required ? "Maintenance" : null,
        ].filter(Boolean),
        images: (initialProperty.galleryImages && initialProperty.galleryImages.length > 0)
            ? [initialProperty.mainImage, ...initialProperty.galleryImages].filter(Boolean)
            : (initialProperty.mainImage ? [initialProperty.mainImage] : [{ url: "" }])
    } :
        {};
    const slugify = (text) =>
        text
            ?.toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')   // spaces → -
            .replace(/[^\w-]+/g, '') // remove special chars
            .replace(/--+/g, '-');   // remove double -

    const tabs = [
        { id: "overview", label: "Overview", icon: Home },
        { id: "amenities", label: "Amenities", icon: Star },
        { id: "policies", label: "Policies", icon: Shield },
        { id: "location", label: "Location", icon: MapPin },
    ];
    const bookingUrl = property.slug ? `/properties/booking/${property.slug}` : "/";

    // Gallery state and helpers
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

    // Build gallery images: prefer galleryImages, but put mainImage first
    const galleryImages = (initialProperty?.galleryImages && initialProperty.galleryImages.length > 0)
        ? [initialProperty.mainImage, ...initialProperty.galleryImages].filter(Boolean)
        : (initialProperty?.mainImage ? [initialProperty.mainImage] : []);

    const openGallery = (index = 0) => {
        setGalleryIndex(index);
        setGalleryOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeGallery = () => {
        setGalleryOpen(false);
        document.body.style.overflow = "";
    };

    const nextImage = () => setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    const prevImage = () => setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    // Keyboard navigation for gallery
    useEffect(() => {
        if (!galleryOpen) return;
        const handleKey = (e) => {
            if (e.key === "ArrowRight") nextImage();
            else if (e.key === "ArrowLeft") prevImage();
            else if (e.key === "Escape") closeGallery();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [galleryOpen, galleryImages.length]);

    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            setCouponApplied(true);
        }
    };

    // Enquiry form state and submit handler
    const [guestName, setGuestName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [totalPersons, setTotalPersons] = useState(1);
    const [specialRequests, setSpecialRequests] = useState("");
    const [enquiryLoading, setEnquiryLoading] = useState(false);
    const [enquirySuccess, setEnquirySuccess] = useState(null);
    const [enquiryError, setEnquiryError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        setEnquiryError(null);
        setEnquirySuccess(null);
        setEnquiryLoading(true);
        // client-side validation
        if (!validateForm()) {
            setEnquiryLoading(false);
            return;
        }
        try {
            const body = {
                phone,
                email,
                contactMethod: phone ? "phone" : "email",
                propertyId: initialProperty?._id || initialProperty?.id || null,
                propertyName: initialProperty?.propertyName || property.name,
                propertyNameSlug: initialProperty?.propertyNameSlug || property.slug,
                locationType: initialProperty?.locationType || "",
                subLocationType: initialProperty?.subLocationType || "",
                propertyPrice: initialProperty?.maxRentPrice || 0,
                propertyImage: (initialProperty?.galleryImages && initialProperty.galleryImages[0]?.url) || initialProperty?.mainImage?.url || property.images?.[0]?.url || "",
                sourcePage: typeof window !== "undefined" ? window.location.pathname : "",
                message: specialRequests,
                guestName,
                checkInDate,
                totalPersons,
            };

            const res = await fetch('/api/property/propertyDetailEnquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success('Enquiry submitted successfully.');
                setGuestName(''); setPhone(''); setEmail(''); setCheckInDate(''); setTotalPersons(1); setSpecialRequests('');
            } else {
                setEnquiryError(data.message || 'Failed to submit enquiry');
            }
        } catch (err) {
            setEnquiryError('Failed to submit enquiry');
        } finally {
            setEnquiryLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!guestName || !guestName.trim()) errors.guestName = "Name is required";
        const phoneNormalized = (phone || "").replace(/[^0-9+]/g, "").trim();
        if (!phoneNormalized) errors.phone = "Phone is required";
        else if (!/^\+?\d{7,10}$/.test(phoneNormalized)) errors.phone = "Phone number must be 7-10 digits";
        if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address";
        if (!totalPersons || Number(totalPersons) < 1) errors.totalPersons = "Enter number of persons";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleShare = async () => {
        try {
            const shareData = {
                title: document.title,
                text: "Check this page",
                url: window.location.href,
            };

            // Native share (mobile + supported browsers)
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy link
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (error) {
            // console.log("Share cancelled or failed:", error);
        }
    };
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumb */}
            <div className="px-10 py-4 text-sm text-gray-500">
                <Link className="hover:underline hover:text-black" href="/">Home</Link> / <Link className="hover:underline hover:text-black" href="/properties">Properties</Link> / <span className="text-gray-900 font-medium">{property.name}</span>
            </div>

            {/* HEADER GALLERY - large image left, 4 thumbs right (desktop) */}
            <div className="bg-gray-100 ">
                <div className="max-w-8xl mx-auto px-4 md:px-8">
                    <div className="flex items-end justify-between py-6">
                        <div>
                            <span className="inline-block bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-md mb-3">
                                {property.type}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">{property.name}</h1>
                            <div className="flex items-center text-black text-sm gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{property.address}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" className="bg-black/20 hover:bg-black/30 text-black border border-black/40 gap-2" onClick={handleShare}>
                                <Share2 className="w-4 h-4" /> Share
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

                        {/* Large image */}
                        <div className="md:col-span-7 relative h-80 md:h-[420px] rounded-xl overflow-hidden">
                            <div onClick={() => openGallery(0)} className="absolute inset-0 cursor-pointer">
                                <Image
                                    src={galleryImages[0]?.url || property.images?.[0]?.url || "/placeholder.jpg"}
                                    alt={property.name}
                                    fill
                                    loading="eager"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end rounded-xl">
                                <div className="w-full px-6 py-6">

                                    <div className="mt-4">
                                        <button onClick={() => openGallery(0)} className="inline-flex items-center gap-2 bg-black/70 text-white text-xs font-semibold px-3 py-2 rounded-lg">
                                            <Camera className="h-4 w-4" /> VIEW GALLERY →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="md:col-span-5 grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} onClick={() => galleryImages[i] && openGallery(i)} className="relative h-40 md:h-[200px] rounded-xl overflow-hidden cursor-pointer">
                                    {galleryImages[i] ? (
                                        <Image
                                            src={galleryImages[i]?.url}
                                            alt={`Gallery ${i}`}
                                            fill
                                            loading="lazy"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <Camera className="h-6 w-6 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* TWO-COLUMN LAYOUT SECTION */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN - 70% - Tabs Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* TAB NAVIGATION */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex overflow-x-auto border-b border-gray-200">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 px-4 py-4 text-sm font-semibold transition border-b-2 flex items-center justify-center gap-2 ${activeTab === tab.id
                                                ? "text-blue-600 border-b-blue-600"
                                                : "text-gray-600 border-b-transparent hover:text-gray-900"
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* TAB CONTENT */}
                            <div className="p-8">

                                {/* OVERVIEW TAB */}
                                {activeTab === "overview" && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">About This Property</h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {initialProperty?.description || property.description || "Beautifully designed property in a prime location with modern amenities and excellent connectivity. Perfect for families looking for comfort and convenience."}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Bedrooms</div>
                                                <div className="text-2xl font-bold text-gray-900">{initialProperty?.numberOfBedrooms || initialProperty?.numberOfRooms || "N/A"}</div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Bathrooms</div>
                                                <div className="text-2xl font-bold text-gray-900">{initialProperty?.numberOfBathrooms || "N/A"}</div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Area</div>
                                                <div className="text-2xl font-bold text-gray-900">{initialProperty?.sizeLength && initialProperty?.sizeWidth ? `${initialProperty.sizeLength}x${initialProperty.sizeWidth} ${initialProperty.sizeUnit || 'SqFt'}` : property.area || "N/A"}</div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Floor</div>
                                                <div className="text-2xl font-bold text-gray-900">{initialProperty?.floor || "N/A"}</div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Available From</div>
                                                <div className="font-bold text-gray-900 text-lg">{initialProperty?.availableFrom || initialProperty?.propertyAvailableFrom || "Immediate"}</div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 mb-1">Type</div>
                                                <div className="text-2xl font-bold text-gray-900">{initialProperty?.propertyType || property.type || "N/A"}</div>
                                            </div>
                                        </div>

                                        {/* Highlights */}
                                        <div className="pt-4">
                                            <h4 className="font-bold text-gray-900 mb-3">Key Highlights</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {(initialProperty?.highlights?.length > 0 ? initialProperty.highlights : ["Modern kitchen", "High-speed WiFi", "Power backup", "Gym facility", "Swimming pool", "24/7 Security"]).map((highlight, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                                                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                        <span>{highlight}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* AMENITIES TAB */}
                                {activeTab === "amenities" && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-gray-900">Property Amenities</h3>

                                        {initialProperty?.roomAmenities?.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-4">Room Amenities</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {initialProperty.roomAmenities.map((amenity, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 p-2">
                                                            <Check className="w-5 h-5 text-emerald-500" />
                                                            <span className="text-gray-700">{amenity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-4">Common Amenities</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {(initialProperty?.amenities?.length > 0 ? initialProperty.amenities : ["24/7 Security", "CCTV Surveillance", "Lift", "Community Hall", "Parking", "Maintenance Staff"]).map((amenity, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-2">
                                                        <Check className="w-5 h-5 text-emerald-500" />
                                                        <span className="text-gray-700">{amenity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {initialProperty?.furnishedAmenities?.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-4">Furnishing</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {initialProperty.furnishedAmenities.map((amenity, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 p-2">
                                                            <Check className="w-5 h-5 text-emerald-500" />
                                                            <span className="text-gray-700">{amenity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* POLICIES TAB */}
                                {activeTab === "policies" && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-gray-900">Property Policies</h3>

                                        <div className="space-y-3">
                                            {initialProperty?.petAllowed ? (
                                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="font-semibold text-gray-900">Pets Policy</div>
                                                        <div className="text-sm text-gray-600 capitalize">{initialProperty.petAllowed.replace(/_/g, ' ')}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="font-semibold text-gray-900">Pets Not Allowed</div>
                                                        <div className="text-sm text-gray-600">No pets are permitted in the property</div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className={`flex items-start gap-3 p-3 ${initialProperty?.smokingAllowed === 'allowed' ? 'bg-emerald-50' : 'bg-red-50'} rounded-lg`}>
                                                {initialProperty?.smokingAllowed === 'allowed' ? <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /> : <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                                                <div>
                                                    <div className="font-semibold text-gray-900">{initialProperty?.smokingAllowed === 'allowed' ? 'Smoking Allowed' : 'No Smoking'}</div>
                                                    <div className="text-sm text-gray-600">{initialProperty?.smokingAllowed === 'allowed' ? 'Smoking is allowed in the property' : 'Smoking is strictly prohibited inside the property'}</div>
                                                </div>
                                            </div>

                                            <div className={`flex items-start gap-3 p-3 ${initialProperty?.outsideVisitorAllowed === 'allowed' || initialProperty?.visitorEntry === 'allowed' ? 'bg-emerald-50' : 'bg-red-50'} rounded-lg`}>
                                                {initialProperty?.outsideVisitorAllowed === 'allowed' || initialProperty?.visitorEntry === 'allowed' ? <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /> : <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                                                <div>
                                                    <div className="font-semibold text-gray-900">Visitors</div>
                                                    <div className="text-sm text-gray-600">{initialProperty?.outsideVisitorAllowed === 'allowed' || initialProperty?.visitorEntry === 'allowed' ? 'Visitors are welcome' : 'Visitors are not allowed'}</div>
                                                </div>
                                            </div>

                                            <div className={`flex items-start gap-3 p-3 ${initialProperty?.nonVegAllowed === 'allowed' ? 'bg-emerald-50' : 'bg-red-50'} rounded-lg`}>
                                                {initialProperty?.nonVegAllowed === 'allowed' ? <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /> : <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                                                <div>
                                                    <div className="font-semibold text-gray-900">{initialProperty?.nonVegAllowed === 'allowed' ? 'Non-Veg Allowed' : 'Vegetarian Only'}</div>
                                                    <div className="text-sm text-gray-600">{initialProperty?.nonVegAllowed === 'allowed' ? 'Non-vegetarian cooking is permitted' : 'Non-vegetarian cooking is not allowed'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="font-semibold text-gray-900 mb-2">Additional Information</div>
                                            <div className="text-sm text-gray-700 space-y-1">
                                                <p>• Minimum Stay: {initialProperty?.minimumStay || initialProperty?.minimumStayAllow || "12 months"}</p>
                                                <p>• Check-in: {initialProperty?.checkIn || "2:00 PM"}</p>
                                                <p>• Check-out: {initialProperty?.checkOut || "11:00 AM"}</p>
                                                <p>• Maintenance Charges: {initialProperty?.maintenanceCharges?.required ? `₹${initialProperty.maintenanceCharges.amount}/${initialProperty.maintenanceCharges.basis}` : "Not Applicable"}</p>
                                                {initialProperty?.securityDeposit?.required && <p>• Security Deposit: ₹{initialProperty.securityDeposit.amount} ({initialProperty.securityDeposit.months} months)</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* LOCATION TAB */}
                                {activeTab === "location" && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-gray-900">Location & Nearby</h3>

                                        {initialProperty?.googleLocation ? (
                                            <div className="w-full h-80 rounded-lg overflow-hidden border">
                                                {initialProperty.googleLocation.includes('<iframe') ? (
                                                    <div dangerouslySetInnerHTML={{ __html: initialProperty.googleLocation }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
                                                ) : (
                                                    <iframe 
                                                        src={initialProperty.googleLocation} 
                                                        width="100%" 
                                                        height="100%" 
                                                        style={{ border: 0 }} 
                                                        allowFullScreen="" 
                                                        loading="lazy" 
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    ></iframe>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                                <div className="text-center">
                                                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                                                    <p>Google Map details not available</p>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-4">Location Details</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between border-t pt-2">
                                                    <span className="text-gray-700">Area/Sector</span>
                                                    <span className="font-semibold text-gray-900 text-right">{initialProperty?.locationType || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2">
                                                    <span className="text-gray-700">Sub Location</span>
                                                    <span className="font-semibold text-gray-900 text-right">{initialProperty?.subLocationType || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between border-t pt-2">
                                                    <span className="text-gray-700">Landmark</span>
                                                    <span className="font-semibold text-gray-900 text-right">{initialProperty?.landMarkDetails || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BOOKING / ENQUIRY FORM */}
                        <form onSubmit={handleEnquirySubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Guest Information</h3>
                                    <p className="text-sm text-gray-500 mt-1">Fill the details below to send an enquiry or request booking.</p>
                                </div>
                                <div className="hidden md:block text-right">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Selected Property</p>
                                    <p className="text-sm font-semibold text-gray-900">{property.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Guest Name</label>
                                    <input value={guestName} onChange={(e) => setGuestName(e.target.value)} required type="text" placeholder="Enter full name" className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.guestName ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`} aria-invalid={!!formErrors.guestName} />
                                    {formErrors.guestName && <p className="text-xs text-red-600 mt-1">{formErrors.guestName}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Phone Number</label>
                                    <input value={phone} required type="tel" onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="XXXXXXXXXX" className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`} aria-invalid={!!formErrors.phone} />
                                    {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Email Address</label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email address" className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`} aria-invalid={!!formErrors.email} />
                                    {formErrors.email && <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Check-in Date</label>
                                    <input value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} type="date" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-2 block">Total Number of Persons</label>
                                    <input value={totalPersons} onChange={(e) => setTotalPersons(e.target.value)} type="number" min="1" placeholder="Enter total persons" className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 ${formErrors.totalPersons ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`} aria-invalid={!!formErrors.totalPersons} />
                                    {formErrors.totalPersons && <p className="text-xs text-red-600 mt-1">{formErrors.totalPersons}</p>}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-semibold text-gray-700 mb-2 block">Special Request</label>
                                <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows="4" placeholder="Add any note for the booking team" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            {enquiryError && (
                                <div className="mt-4 p-3 text-sm text-red-700 bg-red-50 rounded">{enquiryError}</div>
                            )}

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button type="submit" disabled={enquiryLoading} className="flex-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg gap-2 text-base flex items-center justify-center">
                                    {enquiryLoading ? 'Sending...' : 'Send Request For booking'}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN - Payment Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 sticky top-24 p-6 space-y-6">

                            {/* PROPERTY CARD HEADER */}
                            <div className="rounded-xl overflow-hidden border border-gray-200">
                                <div className="relative h-48 bg-gray-200">
                                    <Image
                                        src={property.images?.[0]?.url || "/placeholder.jpg"}
                                        alt={property.name}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{property.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                            <MapPin className="w-4 h-4" /> {property.address}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-gray-500 text-xs">Property Type</p>
                                            <p className="font-semibold text-gray-900">{property.type}</p>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-gray-500 text-xs">Floor</p>
                                            <p className="font-semibold text-gray-900">Ground+</p>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-gray-500 text-xs">Bedrooms</p>
                                            <p className="font-semibold text-gray-900">{property.beds}</p>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 p-3">
                                            <p className="text-gray-500 text-xs">Bathrooms</p>
                                            <p className="font-semibold text-gray-900">{property.baths}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PRICE SECTION */}
                            <div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-bold text-gray-900">₹{property.originalPrice?.toLocaleString()||property.price?.toLocaleString()||""}</span>
                                    {/* <span className="text-sm text-gray-400 line-through">₹{(property.originalPrice)?.toLocaleString() || "00"}</span> */}
                                </div>
                                <div className="text-xs text-gray-600">Per Month • Inclusive of taxes</div>
                            </div>
                            {/* PAYMENT SUMMARY */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-base border-t pt-3">
                                    <span className="font-bold text-gray-900">Total Payable</span>
                                    <span className="font-bold text-blue-600">₹{(Number(property.originalPrice ||property.price)).toLocaleString()}</span>
                                </div>
                            </div>

                            <Link href={bookingUrl} className="block">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg gap-2 text-base">
                                    Proceed to Pay <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                            {/* VERIFICATION BADGE */}
                            {/* <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 text-center">
                                <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-semibold">
                                    <Check className="w-4 h-4" /> Verified Property
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* YOU MIGHT ALSO LIKE SECTION */}
            {relatedProperties.length > 0 && (
                <div className="bg-white border-t py-12">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="mb-8">
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">You Might Also Like</h3>
                            <p className="text-gray-600 text-base">
                                We don't just suggest—we select. Based on your current interests, we've gathered a collection of insights and products designed to complement your style. Whether you're looking to dive deeper into this topic or find the perfect finishing touch, we've got something for you.
                            </p>
                        </div>

                        <Carousel
                            opts={{ align: "start", loop: true }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {relatedProperties.map((item, idx) => (
                                    <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/4">
                                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                            {/* Image Section */}
                                            <div className="relative h-48 overflow-hidden bg-gray-300">
                                                <Image
                                                    src={item.mainImage?.url || "/placeholder.jpg"}
                                                    alt={item.propertyName}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="group-hover:scale-110 transition duration-500"
                                                />
                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                        ✓ Verified
                                                    </span>
                                                </div>
                                                {/* Rating */}
                                                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
                                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                    <span>4.8</span>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-4 space-y-3">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">
                                                        {item.propertyName}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {item.locationType} {item.subLocationType ? `• ${item.subLocationType}` : ''}
                                                    </p>
                                                </div>

                                                {/* Quick Amenities */}
                                                <div className="flex flex-wrap gap-1">
                                                    {(item.amenities || []).slice(0, 3).map((amenity, i) => (
                                                        <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Price & Discount */}
                                                <div className="space-y-1 pt-2 border-t border-gray-100">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xl font-bold text-gray-900">₹{item.rentPrice?.toLocaleString()}</span>
                                                        {(item.originalPrice || item.maxRentPrice) > item.rentPrice && (
                                                            <>
                                                                <span className="text-xs text-gray-400 line-through">
                                                                    ₹{(item.originalPrice || item.maxRentPrice)?.toLocaleString()}
                                                                </span>
                                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">
                                                                    {Math.round((((item.originalPrice || item.maxRentPrice) - item.rentPrice) / (item.originalPrice || item.maxRentPrice)) * 100)}% off
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 font-medium">Per Month • Additional bank discounts</p>
                                                </div>

                                                {/* CTA Button */}
                                                <Link href={`/properties/${slugify(item.locationType)}/${slugify(item.propertyNameSlug || item.propertyName)}`}>
                                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-10 rounded-lg gap-2 mt-2">
                                                        View Details
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0 -translate-x-12 bg-white text-gray-800 border-gray-200 shadow-sm hover:bg-gray-50" />
                            <CarouselNext className="right-0 translate-x-12 bg-white text-gray-800 border-gray-200 shadow-sm hover:bg-gray-50" />
                        </Carousel>
                    </div>
                </div>
            )}

            {/* ========== GALLERY LIGHTBOX MODAL ========== */}
            {galleryOpen && galleryImages.length > 0 && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col" onClick={closeGallery}>
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-3 text-white" onClick={(e) => e.stopPropagation()}>
                        <span className="text-sm font-medium">
                            {galleryIndex + 1} / {galleryImages.length}
                        </span>
                        <button
                            onClick={closeGallery}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Main image area */}
                    <div className="flex-1 flex items-center justify-center relative px-4" onClick={(e) => e.stopPropagation()}>
                        {/* Prev button */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>

                        {/* Image */}
                        <div className="relative w-full max-w-5xl h-[70vh]">
                            <Image
                                src={galleryImages[galleryIndex]?.url}
                                alt={`Gallery image ${galleryIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Next button */}
                        <button
                            onClick={nextImage}
                            className="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Thumbnail strip */}
                    <div className="px-4 py-3 overflow-x-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-center">
                            {galleryImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setGalleryIndex(i)}
                                    className={`relative w-16 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${i === galleryIndex
                                        ? "border-white opacity-100"
                                        : "border-transparent opacity-50 hover:opacity-80"
                                        }`}
                                >
                                    <Image
                                        src={img?.url}
                                        alt={`Thumb ${i + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PropertyDetail;
