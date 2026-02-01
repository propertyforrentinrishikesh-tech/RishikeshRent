"use client";
import React, { useState } from "react";
import {
    Star, MapPin, Share2, Bookmark, Calendar, User, Check,
    Wifi, Car, Coffee, Utensils, Plane, Train, Map, ArrowRight, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HotelDetails = () => {
    // Mock Data
    const hotel = {
        name: "Royal Plaza on Scotts",
        address: "577 Jalan Sultan Road Singapore, 245652 Singapore.",
        rating: 4.8,
        stars: 5,
        price: 2999,
        originalPrice: 5000,
        discount: 40,
        images: [
            "https://images.unsplash.com/photo-1571896349842-6e5a513e610a?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"
        ],
        reviews: 3014,
        amenities: [
            { name: "Parking", value: "Free", icon: <Car className="w-4 h-4" /> },
            { name: "Wi-Fi in Public Areas", value: "Free", icon: <Wifi className="w-4 h-4" /> },
            { name: "Outdoor Swimming Pool", value: "", icon: <Coffee className="w-4 h-4" /> }, // Placeholder icon
            { name: "Meeting Room", value: "", icon: <MapPin className="w-4 h-4" /> },
        ]
    };

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

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
                <Link href="/">Home</Link> / <Link href="/hotels">Hotel in Denver, USA</Link> / <span className="text-gray-900 font-medium">Royal Plaza on Scotts</span>
            </div>

            <div className="container  w-[90%] mx-auto px-4">
                {/* Left Column (Main Content) */}
                <div className="space-y-8 w-full">
                    <div className="flex items-center gap-4">


                        {/* Header Section */}
                        <div className="w-[70%]">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">Health Protected</span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 text-orange-400 fill-orange-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-1">{hotel.name}</h1>
                                        <div className="flex items-center text-gray-600 text-sm gap-2">
                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                            <span>{hotel.address}</span>
                                            <button className="text-blue-600 hover:underline font-medium">Show on Map</button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-none hover:bg-blue-100 gap-1">
                                            <Bookmark className="w-4 h-4" /> Bookmark
                                        </Button>
                                        <Button variant="outline" size="sm" className="bg-orange-50 text-orange-600 border-none hover:bg-orange-100 gap-1">
                                            <Share2 className="w-4 h-4" /> Share
                                        </Button>
                                    </div>
                                </div>
                                <div className="inline-block bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-medium">
                                    Free Cancellation Till 10 Aug 23 12:10AM
                                </div>
                            </div>

                            {/* Gallery Section */}
                            <div className="grid grid-cols-3 gap-2 h-[400px] rounded-2xl overflow-hidden relative">
                                <div className="col-span-2 h-full">
                                    <img src={hotel.images[0]} alt="Main" className="w-full h-full object-cover" />
                                </div>
                                <div className="grid grid-rows-2 gap-2 h-full">
                                    <img src={hotel.images[1]} alt="Sub 1" className="w-full h-full object-cover" />
                                    <div className="relative h-full">
                                        <img src={hotel.images[2]} alt="Sub 2" className="w-full h-full object-cover" />
                                        <button className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-black/80 transition">
                                            <Map className="w-3 h-3" /> 16 More Photos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right Column (Booking Widget) */}
                        <div className="w-[30%]">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-4">
                                <div className="flex justify-between items-center bg-blue-50 rounded-lg p-3 mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="text-blue-600 font-bold text-lg cursor-pointer hover:underline">%</div>
                                        <span className="text-xs font-bold text-gray-700 leading-tight">LOGIN NOT TO GET UPTO 20% LOWER <br /> PRICE</span>
                                    </div>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-8 px-4 rounded">LOGIN</Button>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-3xl font-bold text-gray-900">${hotel.price}</span>
                                        <span className="text-sm text-gray-400 line-through">US${hotel.originalPrice}</span>
                                        <span className="text-sm font-bold text-orange-500">{hotel.discount}% Off</span>
                                    </div>
                                    <div className="text-xs text-gray-500">inclusive of all taxes</div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500 transition">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">Choose Date</span>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-blue-500 transition">
                                        <User className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">1 Room, 1 Adult</span>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-lg flex justify-between items-center mb-6">
                                    <span>OYOFESTIVE40 COUPON APPLIED</span>
                                    <span>-$1780</span>
                                </div>

                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-lg text-lg mb-6">
                                    Check Availability
                                </Button>

                                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                    <div className="bg-orange-500 text-white font-bold rounded p-2 text-sm">4.8</div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">Exceptional</div>
                                        <div className="text-xs text-gray-500">{hotel.reviews} reviews</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Location/Attractions Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-sm">
                                <Map className="w-4 h-4" /> Top Attractions
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex justify-between"><span>Hong Kong Disneyland</span> <span>170m</span></li>
                                <li className="flex justify-between"><span>Hong Kong Museum</span> <span>250m</span></li>
                                <li className="flex justify-between"><span>The Peak Tram</span> <span>80m</span></li>
                            </ul>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-sm">
                                <Plane className="w-4 h-4" /> Nearest Airport & Metro
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex justify-between"><span>Airport: Janghai Airport</span> <span>370m</span></li>
                                <li className="flex justify-between"><span>Airport: Shivalay Airport</span> <span>2.4km</span></li>
                                <li className="flex justify-between"><span>Metro: Mandpam</span> <span>500m</span></li>
                            </ul>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold text-sm">
                                <Coffee className="w-4 h-4" /> Cafe & Bars
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex justify-between"><span>Cafe: Bekker Coffee Cafe</span> <span>60m</span></li>
                                <li className="flex justify-between"><span>Cafe: Levendaram</span> <span>120m</span></li>
                                <li className="flex justify-between"><span>Bar: The Blue Bar</span> <span>90m</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Room Options */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4">Superior Double Room</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Room Image & Basics */}
                            <div className="w-full md:w-1/3">
                                <div className="h-40 rounded-lg overflow-hidden mb-3">
                                    <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop" alt="Room" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded font-medium">King Bed</span>
                                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded font-medium">3 Sleeps</span>
                                </div>
                                <div className="grid grid-cols-2 gap-y-1 text-xs text-gray-600">
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> City View</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Non-Smoking</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 1800sqft | 6 Floor</span>
                                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Free Wi-Fi</span>
                                </div>
                                <button className="text-blue-600 text-xs font-semibold mt-2 hover:underline">Show More Room Amenities</button>
                            </div>

                            {/* Room Options List */}
                            <div className="flex-1 space-y-4">
                                {/* Option 1 */}
                                <div className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-500 transition">
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-1 font-bold text-gray-800 text-sm">Your Choice <div className="w-3 h-3 rounded-full bg-gray-200 text-[8px] flex items-center justify-center text-gray-600">?</div></div>
                                        <div className="text-sm text-gray-600 flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full"></div> Breakfast for US$10 (Optional)</div>
                                        <div className="text-sm text-gray-600 flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full"></div> Non-Refundable</div>
                                        <div className="text-sm text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Instant Confirmation</div>
                                        <div className="text-sm text-gray-600 flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full"></div> Prepay Online</div>
                                        <div className="text-sm text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Booking of Maximum 5 Rooms</div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div>
                                            <span className="text-xl font-bold text-gray-900">US$ 99</span>
                                            <div className="text-xs text-gray-500">After tax US$ 102</div>
                                        </div>
                                        <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-bold text-xs h-8">Book at This Price</Button>
                                        <Button className="bg-blue-600 text-white hover:bg-blue-700 border-none font-bold text-xs h-8">Access Lower Price</Button>
                                    </div>
                                </div>

                                {/* Option 2 */}
                                <div className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-500 transition">
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-1 font-bold text-gray-800 text-sm">Your Choice <div className="w-3 h-3 rounded-full bg-gray-200 text-[8px] flex items-center justify-center text-gray-600">?</div></div>
                                        <div className="text-sm text-emerald-600 flex items-center gap-2"><Coffee className="w-3 h-3" /> Breakfast Included</div>
                                        <div className="text-sm text-gray-600 flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full"></div> Non-Refundable</div>
                                        <div className="text-sm text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Instant Confirmation</div>
                                        <div className="text-sm text-gray-600 flex items-center gap-2"><div className="w-1 h-1 bg-gray-400 rounded-full"></div> Prepay Online</div>
                                        <div className="text-sm text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> Booking of Maximum 5 Rooms</div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <div>
                                            <span className="text-xl font-bold text-gray-900">US$ 107</span>
                                            <div className="text-xs text-gray-500">After tax US$ 110</div>
                                        </div>
                                        <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-bold text-xs h-8">Book at This Price</Button>
                                        <Button className="bg-blue-600 text-white hover:bg-blue-700 border-none font-bold text-xs h-8">Access Lower Price</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-6">Service & Amenities</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                            <div className="border-b border-gray-100 pb-4">
                                <h4 className="font-bold text-sm mb-3">Most Popular Amenities</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Parking</span>
                                        <span className="text-emerald-500 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Fitness Room</span>
                                        <span></span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Luggage Storage</span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-gray-100 pb-4">
                                <h4 className="font-bold text-sm mb-3 opacity-0">.</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Outdoor Swimming Pool</span>
                                        <span></span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Wi-Fi in Public Areas</span>
                                        <span className="text-emerald-500 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">24-Hour Front Desk</span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { name: "Meeting Room", img: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1000&auto=format&fit=crop" },
                                { name: "Restaurant", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop" },
                                { name: "Playground", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop" },
                                { name: "Night Bars", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop" },
                            ].map((item, idx) => (
                                <div key={idx} className="rounded-lg overflow-hidden border border-gray-100">
                                    <div className="h-24 md:h-28 bg-gray-200">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-2 text-center text-xs font-medium text-gray-700">{item.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Guest Reviews */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Guest Reviews</h3>
                            <Button variant="outline" className="text-blue-600 border-none bg-blue-50 hover:bg-blue-100 text-sm h-8">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, idx) => (
                                <div key={idx} className="border border-gray-100 rounded-lg p-4 flex gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden flex-shrink-0">
                                        <img src={`https://i.pravatar.cc/150?img=${idx + 10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">Adam Bluecart</h4>
                                                <p className="text-xs text-gray-500">Canada</p>
                                            </div>
                                            <span className="text-xs text-gray-400">10 July 2023</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            In a free hour, But in certain circumstances and owing to the claims of duty or the obligations of business when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full text-center text-blue-600 font-bold text-sm mt-6 flex items-center justify-center gap-1">
                            Load More Guest Reviews <span className="rotate-90">›</span>
                        </button>
                    </div>

                    {/* Similar Hotels & Resorts */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Similar Hotels & Resorts</h3>
                            <Button variant="outline" className="bg-blue-50 text-blue-600 border-none hover:bg-blue-100 gap-1 font-bold h-9 px-4">
                                More <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {similarHotels.map((hotel, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                        <button className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white text-gray-500 hover:text-blue-600 shadow-sm">
                                            <Bookmark className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-md truncate">{hotel.name}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">{hotel.location}</p>
                                        </div>
                                        <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded w-fit">
                                            Free Cancellation Till 10 Aug 23
                                        </div>
                                        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                                            {hotel.amenities.map((amenity, i) => (
                                                <div key={i} className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                                                    <Check className="w-3 h-3 text-emerald-500" /> {amenity}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
                                            <div>
                                                <div className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mb-1">15% Off</div>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-lg font-bold text-gray-900">US${hotel.price}</span>
                                                    <span className="text-xs text-gray-400 line-through">US${hotel.originalPrice}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500">Per Night</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-500 mb-0.5 leading-tight">Exceptional <br /> <span className="text-[10px] text-gray-400">3,014 reviews</span></div>
                                                <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded inline-block">4.8</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>


            </div>
        </div>
    );
};

export default HotelDetails;