"use client";
import React from "react";
import {
    MapPin, Share2, Bookmark, Star, Check, X,
    ArrowUpRight, Users, Calendar, Home, Layers,
    Maximize, BedDouble, Bath, Car, ArrowRight, PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
const similarHotels = [
    {
        name: "Value Hotel Balestier",
        location: "Delhi | 3.5 Km From Delhi",
        price: 59,
        originalPrice: 79,
        image: "https://images.unsplash.com/photo-1571896349842-6e5a513e610a?q=80&w=600&auto=format&fit=crop",
        amenities: ["Cooling", "Pet Allow", "Free WiFi", "Food", "Parking", "Spa & Massage"]
    },
    {
        name: "Mercure Singapore Tyrwhitt",
        location: "Delhi | 3.5 Km From Delhi",
        price: 59,
        originalPrice: 79,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop",
        amenities: ["Cooling", "Pet Allow", "Free WiFi", "Food", "Parking", "Spa & Massage"]
    },
    {
        name: "Hotel Calmo Chinatown",
        location: "Delhi | 3.5 Km From Delhi",
        price: 59,
        originalPrice: 79,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
        amenities: ["Cooling", "Pet Allow", "Free WiFi", "Food", "Parking", "Spa & Massage"]
    }
];
export const PropertyDetails = ({ property: initialProperty, relatedProperties = [] }) => {
    // Use passed property data or fallback to mock if null/undefined
    const property = initialProperty ? {
        name: initialProperty.propertyName,
        type: initialProperty.propertyType,
        address: `${initialProperty.galiType || ''} ${initialProperty.subLocationType || ''} ${initialProperty.locationType || ''}`.trim() || initialProperty.contactAddress,
        beds: initialProperty.bedrooms || 3,
        baths: initialProperty.bathrooms || 2,
        area: initialProperty.sqft ? `${initialProperty.sqft} SqFt` : "N/A",
        year: initialProperty.buildYear || 2022,
        price: initialProperty.rentPrice || 0,
        originalPrice: initialProperty.originalPrice || initialProperty.maxRentPrice || 0,
        discount: 0,
        description: initialProperty.description || "No description available.",
        highlights: initialProperty.highlights || [
            initialProperty.amenities || "No specific highlights listed."
        ].flat(),
        attributes: [
            { label: "Type", value: initialProperty.propertyType || "Apartment" },
            { label: "Category", value: initialProperty.propertyFor || "Rent" },
            { label: "Owner", value: initialProperty.ownerName || "N/A" },
            { label: "Phone", value: initialProperty.contactNumbers?.[0] || "N/A" },
            { label: "Furnishing", value: initialProperty.furnishingStatus || "Semi-Furnished" },
            { label: "Floor", value: initialProperty.floorNo || "Ground" },
            { label: "Gali", value: initialProperty.galiType || "N/A" },
            { label: "Location", value: initialProperty.subLocationType || "N/A" },
        ],
        inclusions: initialProperty.inclusions || ["Water", "Maintenance"], // Mock default if missing
        exclusions: initialProperty.exclusions || ["Electricity", "WiFi"], // Mock default if missing
        images: (initialProperty.galleryImages && initialProperty.galleryImages.length > 0)
            ? [initialProperty.mainImage, ...initialProperty.galleryImages].filter(Boolean)
            : [initialProperty.mainImage || { url: "" }]
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

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
                <Link href="/">Home</Link> / <Link href="/properties/all">Properties</Link> / <span className="text-gray-900 font-medium">{property.name}</span>
            </div>

            <div className="container w-[95%] mx-auto px-4">

                {/* Top Section: Header/Gallery + Booking Widget */}
                {/* Header Section - Full Width */}
                <div className="flex justify-between items-start mb-6 w-full">
                    <div>
                        <span className="inline-block bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-md mb-2">
                            {property.type}
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h1>
                        {/* <div className="flex items-center text-gray-600 text-sm gap-4 font-medium">
                            <span>{property.beds} Beds</span>
                            <span className="w-px h-3 bg-gray-300"></span>
                            <span>{property.baths} Baths</span>
                            <span className="w-px h-3 bg-gray-300"></span>
                            <span>{property.area}</span>
                            <span className="w-px h-3 bg-gray-300"></span>
                            <span>{property.year}</span>
                        </div> */}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-none hover:bg-blue-100 gap-1.5 font-semibold">
                            <Bookmark className="w-4 h-4" /> Bookmark
                        </Button>
                        <Button variant="outline" size="sm" className="bg-orange-50 text-orange-600 border-none hover:bg-orange-100 gap-1.5 font-semibold">
                            <Share2 className="w-4 h-4" /> Share
                        </Button>
                    </div>
                </div>

                {/* Main Content: Gallery + Booking Widget */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">

                    {/* Left Side: Gallery */}
                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-3 gap-4 h-[450px] rounded-2xl overflow-hidden clear-both">
                            <div className="col-span-2 h-full relative cursor-pointer group">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="w-full h-full relative">
                                            <Image
                                                src={property.images[0]?.url || "/placeholder.jpg"}
                                                alt="Main Property Image"
                                                layout="fill"
                                                objectFit="cover"
                                                className="group-hover:scale-105 transition duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition duration-300"></div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl h-[80vh] p-0 bg-black border-none flex items-center justify-center">
                                        <DialogClose className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 z-50 outline-none">
                                            <X className="w-6 h-6" />
                                        </DialogClose>
                                        <DialogTitle>
                                            <VisuallyHidden>Property Gallery</VisuallyHidden>
                                        </DialogTitle>
                                        <Carousel className="w-full max-h-full">
                                            <CarouselContent>
                                                {property.images.map((img, index) => (
                                                    <CarouselItem key={index} className="flex items-center justify-center h-[75vh]">
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={img.url || "/placeholder.jpg"}
                                                                alt={`Gallery Image ${index + 1}`}
                                                                layout="fill"
                                                                objectFit="contain"
                                                                className="rounded-lg"
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="left-4 bg-white/20 text-white border-transparent hover:bg-white/40" />
                                            <CarouselNext className="right-4 bg-white/20 text-white border-transparent hover:bg-white/40" />
                                        </Carousel>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="grid grid-rows-2 gap-4 h-full">
                                <div className="relative h-full cursor-pointer">
                                    {property.images[1] && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div className="w-full h-full relative">
                                                    <Image
                                                        src={property.images[1]?.url || "/placeholder.jpg"}
                                                        alt="Sub Image 1"
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-r-xl"
                                                    />
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl h-[80vh] p-0 bg-black border-none flex items-center justify-center">
                                                <DialogClose className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 z-50 outline-none">
                                                    <X className="w-6 h-6" />
                                                </DialogClose>
                                                <DialogTitle>
                                                    <VisuallyHidden>Property Gallery</VisuallyHidden>
                                                </DialogTitle>
                                                <Carousel className="w-full max-h-full" opts={{ startIndex: 1 }}>
                                                    <CarouselContent>
                                                        {property.images.map((img, index) => (
                                                            <CarouselItem key={index} className="flex items-center justify-center h-[75vh]">
                                                                <div className="relative w-full h-full">
                                                                    <Image
                                                                        src={img.url}
                                                                        alt={`Gallery Image ${index + 1}`}
                                                                        layout="fill"
                                                                        objectFit="contain"
                                                                        className="rounded-lg"
                                                                    />
                                                                </div>
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious className="left-4 bg-white/20 text-white border-transparent hover:bg-white/40" />
                                                    <CarouselNext className="right-4 bg-white/20 text-white border-transparent hover:bg-white/40" />
                                                </Carousel>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                                <div className="relative h-full cursor-pointer">
                                    {property.images[2] && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <div className="w-full h-full relative">
                                                    <Image
                                                        src={property.images[2]?.url || "/placeholder.jpg"}
                                                        alt="Sub Image 2"
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-r-xl"
                                                    />
                                                    {property.images.length > 3 && (
                                                        <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition flex items-center justify-center rounded-r-xl">
                                                            <div className="text-white font-bold flex items-center gap-2 text-lg">
                                                                <Maximize className="w-5 h-5" />
                                                                View All Photos ({property.images.length})
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-4xl h-[80vh] p-0 bg-black border-none flex items-center justify-center">
                                                <DialogClose className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 z-50 outline-none">
                                                    <X className="w-6 h-6" />
                                                </DialogClose>
                                                <DialogTitle>
                                                    <div className="sr-only flex items-center gap-2">
                                                        <MapPin className="w-5 h-5" />
                                                        <span className="text-white font-bold text-lg">{property.address}</span>
                                                    </div>
                                                </DialogTitle>
                                                <Carousel className="w-full max-h-full" opts={{ startIndex: 2 }}>
                                                    <CarouselContent>
                                                        {property.images.map((img, index) => (
                                                            <CarouselItem key={index} className="flex items-center justify-center h-[75vh]">
                                                                <div className="relative w-full h-full">
                                                                    <Image
                                                                        src={img.url}
                                                                        alt={`Gallery Image ${index + 1}`}
                                                                        layout="fill"
                                                                        objectFit="contain"
                                                                        className="rounded-lg"
                                                                    />
                                                                </div>
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious className="left-4 bg-white/20 text-white border-transparent hover:bg-white/40" />
                                                    <CarouselNext className="right-4 bg-white/20 text-white border-transparent hover:bg-white/40" />
                                                </Carousel>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Booking Widget */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-4">
                            {/* Same Booking Widget UI */}
                            <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3 mb-6">
                                {/* ... Content ... */}
                                <div className="flex items-center gap-2">
                                    <div className="text-blue-600 font-bold text-lg cursor-pointer hover:underline">%</div>
                                    <span className="text-xs font-bold text-gray-700 leading-tight">LOGIN NOT TO GET UPTO 20% LOWER <br /> PRICE</span>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-8 px-4 rounded">LOGIN</Button>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-4xl font-bold text-gray-900">₹{property.price}</span>
                                    {property.originalPrice > 0 && <span className="text-sm text-gray-400 line-through">₹{property.originalPrice}</span>}
                                    {/* <span className="text-sm font-bold text-orange-500">{property.discount}% Off</span> */}
                                </div>
                                <div className="text-xs text-gray-500">inclusive of all taxes</div>
                            </div>

                            {/* Form ... */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Your name</label>
                                    <input type="text" placeholder="Enter Your Name" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Mobile number</label>
                                    <input type="text" placeholder="Contact Number" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg text-lg mb-6">
                                <PhoneCall className="mr-2 h-4 w-4" /> Call Agent
                            </Button>
                            {/* ... */}
                        </div>
                    </div>
                </div>


                {/* Property Info, Highlights, Etc */}
                <div className="">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Overview</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{property.description}</p>
                        </div>

                        {/* Highlights */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Highlights</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {property.highlights.map((highlight, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span>{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Property Information */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Property Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                                {property.attributes.map((attr, idx) => (
                                    <div key={idx} className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                                        <span className="font-bold text-gray-800 text-sm">{attr.label}</span>
                                        <span className="text-sm text-gray-500">{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inclusions / Exclusions */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 text-sm">Inclusions</h4>
                                    <ul className="space-y-3">
                                        {property.inclusions.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                <div className="w-4 h-4 rounded-full border border-teal-500 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-teal-500"></div></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/* Exclusions similar... */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Properties Section */}
                {relatedProperties.length > 0 && (
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Similar Properties</h3>
                            {/* <Button variant="outline" className="bg-blue-50 text-blue-600 border-none hover:bg-blue-100 gap-1 font-bold h-9 px-4">
                            More <ArrowUpRight className="w-4 h-4" />
                        </Button> */}
                        </div>

                        <Carousel
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4 mb-5">
                                {relatedProperties.map((item, idx) => (
                                    <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition h-full flex flex-col">
                                            <div className="relative h-64 overflow-hidden shrink-0">
                                                <Image
                                                    src={item.mainImage?.url || "/placeholder.jpg"}
                                                    alt={item.propertyName}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="group-hover:scale-105 transition duration-300"
                                                />
                                                <button className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white text-gray-500 hover:text-blue-600 shadow-sm z-10">
                                                    <Bookmark className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="p-2 space-y-3">

                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-md truncate">{item.propertyName}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5 capitalize">{item.locationType} {item.subLocationType ? `| ${item.subLocationType}` : ''}</p>
                                                </div>
                                                {/* <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded w-fit">
                                                Verified Property
                                                </div> */}
                                                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                                                    {(item.amenities || []).slice(0, 4).map((amenity, i) => (
                                                        <div key={i} className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                                                            <Check className="w-3 h-3 text-emerald-500" /> {amenity}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
                                                    <div>
                                                        {(item.originalPrice || item.maxRentPrice) > item.rentPrice && (
                                                            <div className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-1">
                                                                {Math.round((((item.originalPrice || item.maxRentPrice) - item.rentPrice) / (item.originalPrice || item.maxRentPrice)) * 100)}% Off
                                                            </div>
                                                        )}
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-lg font-bold text-gray-900">₹{item.rentPrice}</span>
                                                            {(item.originalPrice || item.maxRentPrice) > 0 && <span className="text-xs text-gray-400 line-through">₹{item.originalPrice || item.maxRentPrice}</span>}
                                                        </div>
                                                        <p className="text-[13px] text-gray-500">/ Per Month</p>
                                                    </div>
                                                    <Link href={`/properties/${slugify(item.locationType)}/${slugify(item.propertyNameSlug)}`}>
                                                        <div className="text-right bg-green-500 px-5 py-2 rounded-md border text-white flex items-center gap-1">
                                                            <div className="text-md mb-0.5 leading-tight">View Details</div>
                                                            <ArrowUpRight className="w-4 h-4 ml-auto text-white" />
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-0 -translate-x-1/2 bg-white text-gray-800 border-gray-200 shadow-sm hover:bg-gray-50" />
                            <CarouselNext className="right-0 translate-x-1/2 bg-white text-gray-800 border-gray-200 shadow-sm hover:bg-gray-50" />
                        </Carousel>
                    </div>
                )}
            </div>
        </div >
    );
};
export default PropertyDetails;
