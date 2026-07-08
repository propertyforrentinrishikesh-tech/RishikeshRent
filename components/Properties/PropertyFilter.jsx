"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import {
    Search,
    MapPin,
    Calendar,
    User,
    Star,
    ChevronRight,
    ChevronLeft,
    ArrowUpRight,
    LayoutGrid,
    PhoneCall,
} from "lucide-react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';

const PropertyFilter = ({
    properties: propProperties = [], // Fallback for backward compatibility
    initialProperties = [],
    initialHasMore = false,
    searchParams = {}
}) => {
    const router = useRouter();

    // Use initialProperties if provided, otherwise propProperties, but prefer propProperties if initial is empty (unless initialHasMore is set, implying generic usage)
    // Actually, simpler: if initialProperties is passed, use it.
    const startProperties = initialProperties.length > 0 ? initialProperties : propProperties;

    // Initialize search state from URL params
    const [searchLocation, setSearchLocation] = useState(searchParams.location || '');
    const [searchPropertyType, setSearchPropertyType] = useState(searchParams.propertyType || '');
    const [searchPropertyFor, setSearchPropertyFor] = useState(searchParams.propertyFor || '');
    const [searchGuests, setSearchGuests] = useState(searchParams.guests || '');

    // Options state
    const [locations, setLocations] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const propertyForOptions = [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' }
    ];

    const [priceRange, setPriceRange] = useState(0);

    // Pagination State
    const [properties, setProperties] = useState(startProperties);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [loading, setLoading] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px',
    });

    const slugify = (text) =>
        text
            ?.toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')   // spaces → -
            .replace(/[^\w-]+/g, '') // remove special chars
            .replace(/--+/g, '-');   // remove double -

    React.useEffect(() => {
        const fetchOptions = async () => {
            // Fetch locations
            try {
                const locResponse = await fetch("/api/property/createLocation");
                if (locResponse.ok) {
                    const locData = await locResponse.json();
                    if (Array.isArray(locData)) {
                        setLocations(locData);
                    } else if (locData && locData.success && Array.isArray(locData.data)) {
                        setLocations(locData.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching location types:", error);
            }

            // Fetch property types
            try {
                const propResponse = await fetch("/api/createProperty");
                if (propResponse.ok) {
                    const propData = await propResponse.json();
                    if (Array.isArray(propData)) {
                        setPropertyTypes(propData);
                    } else if (propData && propData.success && Array.isArray(propData.data)) {
                        setPropertyTypes(propData.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching property types:", error);
            }
        };

        fetchOptions();
    }, []);

    React.useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMore();
        }
    }, [inView, hasMore, loading]);

    // Reset when searchParams change
    React.useEffect(() => {
        if (initialProperties.length > 0) {
            setProperties(initialProperties);
            setHasMore(initialHasMore);
            setPage(1);
        }
        // Also update inputs if URL params change externally (e.g. back button)
        setSearchLocation(searchParams.location || '');
        setSearchPropertyType(searchParams.propertyType || '');
        setSearchPropertyFor(searchParams.propertyFor || '');
        setSearchGuests(searchParams.guests || '');
    }, [initialProperties, initialHasMore, searchParams]);


    const loadMore = async () => {
        setLoading(true);
        try {
            const nextPage = page + 1;
            const params = new URLSearchParams(searchParams);
            params.set('page', nextPage.toString());
            params.set('limit', '15');
            params.set('fetchAll', 'true');

            const res = await fetch(`/api/searchProperty?${params.toString()}`);
            const data = await res.json();

            if (data.success && data.data) {
                setProperties(prev => [...prev, ...data.data.properties]);
                setHasMore(data.data.hasMore);
                setPage(nextPage);
            }
        } catch (error) {
            console.error("Failed to load more properties", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        // Use state values directly (assuming they align with slug logic or are raw enough to be slugified if needed)
        // If we change Select values to slugs, we don't need to slugify here again generally, but slugify is safe.

        if (searchPropertyType && searchPropertyType !== 'all_types') {
            params.append('propertyType', slugify(searchPropertyType));
        }

        if (searchGuests) params.append('guests', searchGuests);
        if (searchPropertyFor) params.append('propertyFor', searchPropertyFor);

        const citySlug = (searchLocation && searchLocation !== 'all') ? slugify(searchLocation) : 'all';

        router.push(`/properties/${citySlug}?${params.toString()}`);
    };

    const displayProperties = properties.length > 0 ? properties.map((p, index) => ({
        id: p._id || `prop-${index}-${p.propertyName}`, // Ensure unique key
        name: p.propertyName || "Unknown Property",
        location: `${p.galiType || ''} ${p.subLocationType || ''} ${p.locationType || ''}`.trim() || p.address?.city || "Unknown Location",
        contactAddress: p.contactAddress,
        distance: "Distance N/A", // API doesn't seem to have distance
        rating: p.rating || 4.9,
        reviews: 0, // API doesn't seem to have reviews count
        // Image handling: if gallery exists, use it, else use mainImage, else fallback
        images: (p.galleryImages && p.galleryImages.length > 0)
            ? [p.mainImage, ...p.galleryImages].filter(Boolean)
            : [p.mainImage || { url: "" }],
        price: p.rentPrice || 0,
        originalPrice: p.originalPrice || 0,
        maxRentPrice: p.maxRentPrice,
        taxes: 0,
        specs: [
            { label: `${p.bedrooms || 3} Beds` }, // Guessing bedrooms
            { label: `${p.bathrooms || 2} Baths` },
            { label: `${p.sqft || 2200} sqft` }
        ],
        roomName: p.propertyType || "Standard Room",
        slug: p.propertyNameSlug,
        citySlug: p.locationType ? p.locationType.trim().toLowerCase().replace(/\s+/g, '-') : 'all',
        tag: "Verified",
        type: p.propertyType || "Apartment",
        typeColor: "bg-purple-100 text-purple-600"
    })) : [];

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Top Search Bar */}
            <div className="bg-[#0052b4] py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="col-span-1 md:col-span-4">
                            <label className="block text-white text-xs font-bold uppercase mb-2">
                                Where
                            </label>
                            <div className="relative">
                                {/* <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5 z-10" /> */}
                                <Select
                                    value={searchLocation}
                                    onValueChange={(value) => setSearchLocation(value)}
                                >
                                    <SelectTrigger className="w-full h-12 pl-4 pr-4 rounded-md text-gray-900 bg-white border-none focus:ring-0">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="text-blue-500 w-5 h-5" />
                                            <SelectValue placeholder="Select Location" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        {locations.map((loc, index) => (
                                            <SelectItem key={`loc-${index}`} value={slugify(loc.locationType)}>
                                                {loc.locationType}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-white text-xs font-bold uppercase mb-2">
                                Property Type
                            </label>
                            <div className="relative">
                                {/* <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5 z-10" /> */}
                                <Select
                                    value={searchPropertyType}
                                    onValueChange={(value) => setSearchPropertyType(value)}
                                >
                                    <SelectTrigger className="w-full h-12 pl-4 pr-4 rounded-md text-gray-900 bg-white border-none focus:ring-0">
                                        <div className="flex items-center gap-2">
                                            <LayoutGrid className="text-blue-500 w-5 h-5" />
                                            <SelectValue placeholder="Select Type" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all_types">All Types</SelectItem>
                                        {propertyTypes.map((type, index) => (
                                            <SelectItem key={`type-${index}`} value={slugify(type.propertyType)}>
                                                {type.propertyType}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-white text-xs font-bold uppercase mb-2">
                                Property For
                            </label>
                            <div className="relative">
                                <Select
                                    value={searchPropertyFor}
                                    onValueChange={(value) => setSearchPropertyFor(value)}
                                >
                                    <SelectTrigger className="w-full h-12">
                                        <SelectValue placeholder="Property For" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyForOptions.map((option, index) => (
                                            <SelectItem key={`for-${index}`} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <button
                                onClick={handleSearch}
                                className="w-full h-12 bg-[#ffbd00] hover:bg-yellow-400 text-gray-900 font-bold rounded-md flex items-center justify-center gap-2 transition-colors"
                            >
                                <Search className="w-5 h-5" /> Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar Filters */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="flex justify-between items-center bg-white p-4 rounded-t-xl border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-900">Filters</h3>
                        <button className="text-blue-600 text-sm font-semibold hover:underline">
                            Clear All
                        </button>
                    </div>

                    <div className="bg-white p-5 rounded-b-xl shadow-sm border border-gray-100 space-y-8 -mt-6 rounded-t-none">
                        {/* Bed Type */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Bed Type</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    "1 Double Bed",
                                    "2 Beds",
                                    "1 Single Bed",
                                    "3 Beds",
                                    "King Bed",
                                ].map((bed) => (
                                    <label
                                        key={bed}
                                        className="flex items-center justify-center px-3 py-2 border border-gray-100 bg-gray-50 rounded text-xs font-medium text-gray-600 cursor-pointer hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition"
                                    >
                                        {bed}
                                        <input type="checkbox" className="hidden" />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Popular Filters */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Popular Filters</h4>
                            <div className="space-y-3">
                                {[
                                    "Free Cancellation Available",
                                    "Book @ ₹1",
                                    "Pay At Hotel Available",
                                    "Free Breakfast Included",
                                ].map((filter) => (
                                    <label
                                        key={filter}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                            <input
                                                type="checkbox"
                                                className="accent-blue-600 w-4 h-4 cursor-pointer"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                            {filter}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Pricing Range */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">
                                Pricing Range in US$
                            </h4>
                            <div className="flex justify-between text-sm text-gray-600 font-medium mb-4">
                                <span>100</span>
                                <span>900</span>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="900"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        <hr className="border-gray-100" />

                        {/* Customer Ratings */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">
                                Customer Ratings
                            </h4>
                            <div className="space-y-3">
                                {[4.5, 4, 3.5, 3].map((rating, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center group cursor-pointer"
                                    >
                                        <label className="flex items-center gap-3">
                                            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                                <input
                                                    type="checkbox"
                                                    className="accent-blue-600 w-4 h-4 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-bold text-gray-700">
                                                    {rating}+
                                                </span>
                                            </div>
                                        </label>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {Math.floor(Math.random() * 50)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Star Ratings */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Star Ratings</h4>
                            <div className="space-y-3">
                                {[5, 4, 3].map((rating, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center group cursor-pointer"
                                    >
                                        <label className="flex items-center gap-3">
                                            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                                <input
                                                    type="checkbox"
                                                    className="accent-blue-600 w-4 h-4 cursor-pointer"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(rating)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                                                    />
                                                ))}
                                            </div>
                                        </label>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {Math.floor(Math.random() * 50)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Amenities */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Amenities</h4>
                            <div className="space-y-3">
                                {[
                                    "Free Wifi",
                                    "Breakfast included",
                                    "Pool",
                                    "Free Parking",
                                    "Air Conditioning",
                                ].map((filter) => (
                                    <label
                                        key={filter}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                            <input
                                                type="checkbox"
                                                className="accent-blue-600 w-4 h-4 cursor-pointer"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                            {filter}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Fun things to do */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">
                                Fun things To Do
                            </h4>
                            <div className="space-y-3">
                                {[
                                    "Beach",
                                    "Fitness center",
                                    "Cycling",
                                    "Animation Show",
                                ].map((filter) => (
                                    <label
                                        key={filter}
                                        className="flex items-center gap-3 cursor-pointer group"
                                    >
                                        <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                            <input
                                                type="checkbox"
                                                className="accent-blue-600 w-4 h-4 cursor-pointer"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                            {filter}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-3">
                    {/* Sort Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Showing {displayProperties.length} Search Results
                        </h2>
                        <div className="flex items-center gap-4">
                            {/* <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:border-blue-400">
                                <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                                    <div className="w-4 h-4 bg-white rounded-full absolute left-0 shadow-md transform transition-transform"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-600">Map</span>
                            </div> */}
                            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                                <button className="px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-md">
                                    Our Trending
                                </button>
                                <button className="px-4 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded-md">
                                    Most Popular
                                </button>
                                <button className="px-4 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded-md">
                                    Lowest Price
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Property List */}
                    <div className="space-y-6">
                        {displayProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}

                        {/* Loading Skeletons */}
                        {(loading || hasMore) && (
                            <div ref={ref} className="space-y-6">
                                <PropertySkeleton />
                                <PropertySkeleton />
                                <PropertySkeleton />
                                <PropertySkeleton />
                                <PropertySkeleton />
                            </div>
                        )}

                        {!hasMore && displayProperties.length > 0 && (
                            <div className="text-center text-gray-500 py-8">
                                No more properties to load
                            </div>
                        )}

                        {!loading && displayProperties.length === 0 && (
                            <div className="text-center text-gray-500 py-12 flex flex-col items-center justify-center">
                                <Search className="w-12 h-12 text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                                <p className="text-gray-500">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {/* <div className="flex justify-center items-center gap-2 mt-10">
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 flex items-center justify-center bg-[#0052b4] text-white font-bold rounded shadow-md text-sm cursor-pointer">
                            1
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-100 rounded cursor-pointer text-sm">
                            2
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-100 rounded cursor-pointer text-sm">
                            3
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-100 rounded cursor-pointer text-sm">
                            4
                        </div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-100 rounded cursor-pointer text-sm">
                            5
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

const PropertySkeleton = () => {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-6">
            <Skeleton className="w-full md:w-80 h-48 rounded-lg flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-between py-1 w-full space-y-4">
                <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-4">
                    <Skeleton className="h-10 w-32" />
                    <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        </div>
    )
}

const PropertyCard = ({ property }) => {
    const [api, setApi] = React.useState(null);
    const [current, setCurrent] = React.useState(1);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div
            className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition flex flex-col md:flex-row gap-6"
        >
            {/* Image Carousel */}
            <div className="w-full md:w-80 h-48 md:h-auto overflow-hidden rounded-lg relative flex-shrink-0 group">
                <Carousel className="w-full h-full" setApi={setApi}>
                    <CarouselContent className="h-full ml-0">
                        {property.images.map((img, imgIdx) => (
                            <CarouselItem key={imgIdx} className="pl-0 h-full relative aspect-[4/3]">
                                <Image
                                    src={img.url || "/placeholder.jpg"}
                                    alt={`${property.name} - ${imgIdx}`}
                                    fill
                                    className="object-cover w-full h-full"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Carousel Controls (only show if > 1 image) */}
                    {property.images.length > 1 && (
                        <>
                            <CarouselPrevious
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/50 hover:bg-white text-gray-700 border-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            />
                            <CarouselNext
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/50 hover:bg-white text-gray-700 border-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            />
                        </>
                    )}
                </Carousel>

                {/* Simple overlay for count (optional, can be removed if not needed with dots/arrows) */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10 pointer-events-none">
                    {current} / {property.images.length}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            {/* Type Tag */}
                            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md inline-block mb-2 uppercase ${property.typeColor}`}>
                                {property.type}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {property.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                <span>{property.location}</span>
                                <span className="mx-1.5">•</span>
                                {/* <span>{property.distance}</span>
                                <span className="mx-1.5">•</span>
                                <a href="#" className="text-blue-600 hover:underline">
                                    Show on Map
                                </a> */}
                            </div>
                        </div>
                        {/* <div className="text-right flex items-start gap-3">
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-900">
                                    {property.tag}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {property.reviews.toLocaleString()} reviews
                                </div>
                            </div>
                            <div className="bg-orange-400 text-white text-sm font-bold p-1.5 rounded-md min-w-[32px] text-center">
                                {property.rating}
                            </div>
                        </div> */}
                    </div>

                    {/* Specs Grid */}
                    {/* <div className="flex gap-2 mb-4 flex-wrap">
                        {property.specs.map((item, i) => (
                            <div
                                key={i}
                                className="px-3 py-1.5 border border-dashed border-gray-300 rounded text-xs text-gray-600 font-semibold"
                            >
                                {item.label}
                            </div>
                        ))}
                    </div> */}
                </div>

                <div className="flex items-end justify-between w-full border-t border-dashed border-gray-200 pt-4">
                    {/* <div>
                        {/* <div className="font-bold text-gray-800 text-sm mb-1">
                            {property.roomName}
                        </div> */}
                    {/* <div className="text-xs text-gray-400">
                            Last booked 25min ago
                        </div> */}
                    {/* <div className="flex items-center gap-1 text-[10px] text-teal-600 bg-teal-50 w-fit px-2 py-1 rounded mt-2 font-semibold">
                            Free Cancellation Till 10 Aug 23
                        </div>
                        <div className="mt-1 text-xs text-blue-600">
                            <span className="font-semibold">Login</span> & get
                            additional $15 Off Using Visa card
                        </div> 
                    </div> */}
                    <div className="">
                        <a
                            href={`#`}
                            className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2.5 px-6 rounded-lg flex items-center gap-1.5 transition no-underline"
                        >
                            Request a Callback <PhoneCall className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="text-right">
                        {/* <div className="inline-block bg-[#ff3366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">
                            15% Off
                        </div> */}
                        <div className="flex items-baseline justify-end gap-1.5">
                            {property.originalPrice > 0 && <span className="text-xs text-gray-400 line-through">
                                ₹ {property.originalPrice}
                            </span>}
                            <span className="text-2xl font-bold text-[#003b95]">
                                ₹{property.price} <span className="text-sm text-gray-400">/Month</span>
                            </span>
                        </div>
                        {/* <div className="text-[10px] text-gray-500 mb-3">
                            +{property.taxes} taxes & Fees<br />
                            Per Month
                        </div> */}
                        <a
                            href={`/properties/${property.citySlug}/${property.slug}`}
                            className="bg-[#0052b4] hover:bg-blue-800 text-white text-sm font-bold py-2.5 px-6 rounded-lg flex items-center gap-1.5 transition no-underline"
                        >
                            See Availability <ArrowUpRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default PropertyFilter;