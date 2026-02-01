"use client"
import React, { useState, useEffect } from 'react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Search, Star } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image"
import { toast } from "react-hot-toast";
const PropertyCards = ({ properties }) => {
    const [location, setLocation] = useState('');
    const [propertyFor, setPropertyFor] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [locations, setLocations] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [checkInDate, setCheckInDate] = useState('');
    const [guestCount, setGuestCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const propertyForOptions = [
        { value: 'residential', label: 'Residential' },
        { value: 'commercial', label: 'Commercial' }
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch property types
                try {
                    const propResponse = await fetch("/api/createProperty");
                    if (!propResponse.ok) {
                        throw new Error(`HTTP error! status: ${propResponse.status}`);
                    }
                    const propData = await propResponse.json();
                    // Handle both response formats
                    if (Array.isArray(propData)) {
                        setPropertyTypes(propData);
                    } else if (propData && propData.success && Array.isArray(propData.data)) {
                        setPropertyTypes(propData.data);
                    } else {
                        console.error("Unexpected property types response format:", propData);
                    }
                } catch (error) {
                    console.error("Error fetching property types:", error);
                    toast.error("Failed to load property types");
                }

                // Fetch locations
                try {
                    const locResponse = await fetch("/api/createLocation");
                    if (!locResponse.ok) {
                        throw new Error(`HTTP error! status: ${locResponse.status}`);
                    }
                    const locData = await locResponse.json();
                    // Handle both response formats
                    if (Array.isArray(locData)) {
                        setLocations(locData);
                    } else if (locData && locData.success && Array.isArray(locData.data)) {
                        setLocations(locData.data);
                    } else {
                        console.error("Unexpected location types response format:", locData);
                    }
                } catch (error) {
                    console.error("Error fetching location types:", error);
                    toast.error("Failed to load location types");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Build query parameters
            const params = new URLSearchParams();

            // Add only non-empty values to the query params
            if (location) params.append('location', location);
            if (propertyFor) params.append('propertyFor', propertyFor);
            if (propertyType) params.append('propertyType', propertyType);
            if (checkInDate) {
                const formattedDate = new Date(checkInDate).toISOString().split('T')[0];
                params.append('checkInDate', formattedDate);
            }
            if (guestCount && guestCount > 1) params.append('guests', guestCount);

            // Always use window.location for navigation to avoid hook issues
            const targetLocation = location || 'all';
            window.location.href = `/properties/${encodeURIComponent(targetLocation)}/search?${params.toString()}`;

        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to perform search. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Search Property</h1>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Location Select */}
                    <div className="w-full">
                        <Select
                            value={location}
                            onValueChange={(value) => setLocation(value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((loc, index) => (
                                    <SelectItem key={`loc-${index}`} value={loc.locationType}>
                                        {loc.locationType || `Location ${index + 1}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Property For Select */}
                    <Select
                        value={propertyFor}
                        onValueChange={(value) => setPropertyFor(value)}
                    >
                        <SelectTrigger className="w-full">
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

                    {/* Property Type Select */}
                    <div className="w-full">
                        <Select
                            value={propertyType}
                            onValueChange={(value) => setPropertyType(value)}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Property Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {propertyTypes.map((type, index) => (
                                    <SelectItem key={`type-${index}`} value={type.propertyType}>
                                        {type.propertyType || `Type ${index + 1}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>


                    <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Search className="mr-2 h-4 w-4" /> Search
                            </span>
                        )}
                    </Button>
                </form>
            </div>

            {properties.length > 0 ? (
                <div className="space-y-6 py-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Properties ({properties.length})</h2>
                    </div>
                    {properties.map((pkg, idx) => (
                        <Card key={idx} className="overflow-hidden border border-gray-200">
                            <div className="max-w-5xl mx-auto border rounded-lg overflow-hidden hover:shadow-lg">
                                <div className="flex flex-col md:flex-row">
                                    {/* IMAGE */}
                                    <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden hover:scale-105 transition-transform duration-300 ease-in-out">
                                        <Image
                                            src={pkg.mainImage?.url || '/placeholder.jpg'}
                                            alt={pkg.propertyName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* TEXT CONTENT */}
                                    <div className="md:w-1/2 p-6 flex flex-col justify-between bg-white">
                                        {/* RATING + TITLE */}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                {/* Rating */}
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold">{pkg.rating || '4.9'}</span>
                                                    <span className="text-xs text-gray-400">(2500+ reviews)</span>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <span className="text-xl font-bold text-black">
                                                        ₹ {pkg.rentPrice || 'XXXX'}
                                                    </span>
                                                    <span className="block text-sm text-gray-500">/ Per Month</span>
                                                </div>
                                            </div>

                                            {/* Property Name */}
                                            <h2 className="text-2xl font-bold mt-3">{pkg.propertyName || 'Property Name'}</h2>

                                            {/* Description */}
                                            <p className="text-sm text-gray-700 mt-2">
                                                {pkg.description ||
                                                    'Welcome to the best five-star deluxe hotel in New York. The in hotel elementum sesue the aucan vestibulum aliquam ustona sapien rutrum volutpat onec in quis the veliten...'}
                                            </p>
                                        </div>

                                        {/* Buttons */}
                                        <div className="mt-6 flex gap-4 items-center justify-between">
                                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-semibold">
                                                Explore Now
                                            </button>
                                            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold">
                                                Request To Callback
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

            ) : (
                <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                        <Search className="h-full w-full" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you&apos;re looking for.</p>
                    <Button className="mt-6" asChild>
                        <Link href="/">Go To Home</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

export default PropertyCards