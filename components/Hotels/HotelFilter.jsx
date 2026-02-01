"use client";
import React, { useState } from "react";
import {
    Search,
    MapPin,
    Calendar,
    User,
    Star,
    ChevronRight,
    ChevronLeft,
    ArrowUpRight,
} from "lucide-react";
import Image from "next/image";

const HotelFilter = () => {
    const [priceRange, setPriceRange] = useState(500);

    const hotels = [
        {
            id: 1,
            name: "Hotel Chancellor@Orchard",
            location: "Waterloo and Southwark",
            distance: "9.8 km from Delhi Airport",
            rating: 4.8,
            reviews: 3014,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
            price: 59,
            originalPrice: 79,
            taxes: 22,
            roomName: "Standard Twin Double Room",
            amenities: ["Parking", "WiFi", "Eating", "Cooling", "Pet"],
            tag: "Exceptional"
        },
        {
            id: 2,
            name: "Dorsett Singapore",
            location: "Waterloo and Southwark",
            distance: "9.8 km from Delhi Airport",
            rating: 4.8,
            reviews: 3014,
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop",
            price: 59,
            originalPrice: 79,
            taxes: 22,
            roomName: "Standard Twin Double Room",
            amenities: ["Parking", "WiFi", "Eating", "Cooling", "Pet"],
            tag: "Exceptional"
        },
        {
            id: 3,
            name: "Value Hotel Balestier",
            location: "Waterloo and Southwark",
            distance: "9.8 km from Delhi Airport",
            rating: 4.8,
            reviews: 3014,
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop",
            price: 59,
            originalPrice: 79,
            taxes: 22,
            roomName: "Standard Twin Double Room",
            amenities: ["Parking", "WiFi", "Eating", "Cooling", "Pet"],
            tag: "Exceptional"
        },
        {
            id: 4,
            name: "Vigara Hotel Lavender",
            location: "Waterloo and Southwark",
            distance: "9.8 km from Delhi Airport",
            rating: 4.8,
            reviews: 3014,
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop",
            price: 59,
            originalPrice: 79,
            taxes: 22,
            roomName: "Standard Twin Double Room",
            amenities: ["Parking", "WiFi", "Eating", "Cooling", "Pet"],
            tag: "Exceptional"
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Top Search Bar */}
            <div className="bg-[#0052b4] py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="col-span-1 md:col-span-4">
                            <label className="block text-white text-xs font-bold uppercase mb-2">Where</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Going To"
                                    className="w-full h-12 pl-12 pr-4 rounded-md text-gray-900 focus:outline-none"
                                    defaultValue="Goint To"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-white text-xs font-bold uppercase mb-2">Checkin & Checkout</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Choose Date"
                                    className="w-full h-12 pl-12 pr-4 rounded-md text-gray-900 focus:outline-none"
                                    defaultValue="Choose Date"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-white text-xs font-bold uppercase mb-2">Guests & Rooms</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="1 Room, 1 Adult"
                                    className="w-full h-12 pl-12 pr-4 rounded-md text-gray-900 focus:outline-none"
                                    defaultValue="1 Room, 1 Adult"
                                />
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <button className="w-full h-12 bg-[#ffbd00] hover:bg-yellow-400 text-gray-900 font-bold rounded-md flex items-center justify-center gap-2 transition-colors">
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
                        <button className="text-blue-600 text-sm font-semibold hover:underline">Clear All</button>
                    </div>

                    <div className="bg-white p-5 rounded-b-xl shadow-sm border border-gray-100 space-y-8 -mt-6 rounded-t-none">
                        {/* Bed Type */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Bed Type</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {['1 Double Bed', '2 Beds', '1 Single Bed', '3 Beds', 'King Bed'].map((bed) => (
                                    <label key={bed} className="flex items-center justify-center px-3 py-2 border border-gray-100 bg-gray-50 rounded text-xs font-medium text-gray-600 cursor-pointer hover:bg-blue-50 hover:border-blue-100 hover:text-blue-600 transition">
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
                                {['Free Cancellation Available', 'Book @ ₹1', 'Pay At Hotel Available', 'Free Breakfast Included'].map((filter) => (
                                    <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                            <input type="checkbox" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{filter}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Pricing Range */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Pricing Range in US$</h4>
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
                            <h4 className="font-bold text-gray-800 mb-4">Customer Ratings</h4>
                            <div className="space-y-3">
                                {[4.5, 4, 3.5, 3].map((rating, idx) => (
                                    <div key={idx} className="flex justify-between items-center group cursor-pointer">
                                        <label className="flex items-center gap-3">
                                            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                                <input type="checkbox" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-bold text-gray-700">{rating}+</span>
                                            </div>
                                        </label>
                                        <span className="text-xs text-gray-400 font-medium">{Math.floor(Math.random() * 50)}</span>
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
                                    <div key={idx} className="flex justify-between items-center group cursor-pointer">
                                        <label className="flex items-center gap-3">
                                            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                                <input type="checkbox" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[...Array(rating)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                ))}
                                            </div>
                                        </label>
                                        <span className="text-xs text-gray-400 font-medium">{Math.floor(Math.random() * 50)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Amenities */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Amenities</h4>
                            <div className="space-y-3">
                                {['Free Wifi', 'Breakfast included', 'Pool', 'Free Parking', 'Air Conditioning'].map((filter) => (
                                    <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                            <input type="checkbox" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{filter}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Fun things to do */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-4">Fun things To Do</h4>
                            <div className="space-y-3">
                                {['Beach', 'Fitness center', 'Cycling', 'Animation Show'].map((filter) => (
                                    <label key={filter} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center group-hover:border-blue-500">
                                            <input type="checkbox" className="accent-blue-600 w-4 h-4 cursor-pointer" />
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900">{filter}</span>
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
                        <h2 className="text-lg font-bold text-gray-900">Showing 280 Search Results</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:border-blue-400">
                                <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                                    <div className="w-4 h-4 bg-white rounded-full absolute left-0 shadow-md transform transition-transform"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-600">Map</span>
                            </div>
                            <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                                <button className="px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-md">Our Trending</button>
                                <button className="px-4 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded-md">Most Popular</button>
                                <button className="px-4 py-1.5 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded-md">Lowest Price</button>
                            </div>
                        </div>
                    </div>

                    {/* Hotel List */}
                    <div className="space-y-6">
                        {hotels.map((hotel) => (
                            <div key={hotel.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition flex flex-col md:flex-row gap-6">
                                {/* Image */}
                                <div className="w-full md:w-72 h-48 md:h-auto overflow-hidden rounded-lg relative flex-shrink-0">
                                    <Image
                                        src={hotel.image}
                                        alt={hotel.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="group-hover:scale-105 transition duration-500"
                                    />
                                    <button className="absolute top-1/2 left-2 p-1 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white text-gray-700">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button className="absolute top-1/2 right-2 p-1 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white text-gray-700">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex text-yellow-400 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(hotel.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
                                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                                    <span>{hotel.location}</span>
                                                    <span className="mx-1.5">•</span>
                                                    <span>{hotel.distance}</span>
                                                    <span className="mx-1.5">•</span>
                                                    <a href="#" className="text-blue-600 hover:underline">Show on Map</a>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-start gap-3">
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-gray-900">{hotel.tag}</div>
                                                    <div className="text-xs text-gray-500">{hotel.reviews.toLocaleString()} reviews</div>
                                                </div>
                                                <div className="bg-orange-400 text-white text-sm font-bold p-1.5 rounded-md min-w-[32px] text-center">
                                                    {hotel.rating}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            {hotel.amenities.map((item, i) => (
                                                <span key={i} className="px-2 py-1 border border-gray-200 border-dashed rounded text-[10px] text-gray-600 font-medium">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-4">
                                        <div>
                                            <div className="font-bold text-gray-800 text-sm mb-1">{hotel.roomName}</div>
                                            <div className="text-xs text-gray-400">Last booked 25min ago</div>
                                            <div className="flex items-center gap-1 text-[10px] text-teal-600 bg-teal-50 w-fit px-2 py-1 rounded mt-2 font-semibold">
                                                Free Cancellation, till 1 hour of Pick up
                                            </div>
                                            <div className="mt-1 text-xs text-blue-600">
                                                <span className="font-semibold">Login</span> & get additional $15 Off Using Visa card
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="inline-block bg-[#ff3366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded mb-1">
                                                15% Off
                                            </div>
                                            <div className="flex items-baseline justify-end gap-1.5">
                                                <span className="text-xs text-gray-400 line-through">US${hotel.originalPrice}</span>
                                                <span className="text-2xl font-bold text-[#003b95]">${hotel.price}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 mb-3">
                                                +${hotel.taxes} taxes & Fees<br />For 2 Nights
                                            </div>
                                            <button className="bg-[#0052b4] hover:bg-blue-800 text-white text-sm font-bold py-2.5 px-6 rounded-lg flex items-center gap-1.5 transition">
                                                See Availability <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 mt-10">
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900"><ChevronLeft className="w-4 h-4" /></button>
                        <div className="w-8 h-8 flex items-center justify-center bg-[#0052b4] text-white font-bold rounded shadow-md text-sm cursor-pointer">1</div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-100 rounded cursor-pointer text-sm">2</div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-100 rounded cursor-pointer text-sm">3</div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-100 rounded cursor-pointer text-sm">4</div>
                        <div className="w-8 h-8 flex items-center justify-center text-gray-600 font-medium hover:bg-gray-100 rounded cursor-pointer text-sm">5</div>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelFilter;