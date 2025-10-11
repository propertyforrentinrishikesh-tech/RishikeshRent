"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function PropertySection() {
    const smallCards = [1, 2, 3, 4];

    return (
        <section className="relative py-10 w-full px-5 overflow-hidden max-w-screen overflow-x-hidden">
            <h2 className="font-bold text-2xl md:text-4xl text-center mt-7">"Book Now -  Trusted, Transparent & Easy"</h2>
            <p className=" text-xl font-lg md:text-xl text-center mt-2">
                Stay Where Serenity Meets Comforts"
            </p>
            <hr className="h-[2px] w-full md:w-[40%] my-2 mx-auto bg-black" />

            <p className="text-gray-600 py-8 text-center font-barlow  w-full px-2 md:w-[50%] mx-auto">
                Secure your preferred property with a simple online booking and a small deposit.
                All reservations are verified and confirmed by our team to ensure complete transparency.
                Flexible cancellation and refund options are available as per our booking policy
                making your rental experience in Rishikesh smooth, safe, and reliable.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left: Big Card */}
                <Card className="overflow-hidden shadow-lg h-full">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                            alt="Luxury Hotel"
                            className="w-full h-80 object-cover"
                        />
                        <div className="absolute top-4 left-4 flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                        </div>
                    </div>

                    <CardContent className="p-6">
                        <p className="text-gray-600 text-sm mb-1">The Best Five-Star Luxury Hotel</p>
                        <h2 className="text-2xl font-bold mb-2">Property Name</h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Welcome to the best five-star deluxe hotel in New York. The hotel elementum
                            sesue the aucan vestibulum aliquam ustona sapien rutrum volutpat once in quis
                            the veliten...
                        </p>

                        <div className="flex items-center space-x-2 text-sm mb-4">
                            <span className="text-gray-700 font-medium">4.9</span>
                            <span className="text-gray-400">Rated based on 2500+ reviews</span>
                        </div>

                        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            Explore Now
                        </Button>
                    </CardContent>
                </Card>

                {/* Right: 4 Small Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {smallCards.map((card, index) => (
                        <Card key={index} className="overflow-hidden shadow-md">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                                    alt="Hotel Room"
                                    className="w-full h-36 object-cover"
                                />
                                <div className="absolute top-2 left-2 flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Offer: 10% Off
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">Property Name</CardTitle>
                            </CardHeader>

                            <CardContent className="text-xs text-gray-600">
                                <p>
                                    <span className="font-semibold">Type:</span> Hotel &nbsp;
                                    <span className="font-semibold">Location:</span> Tapovan
                                </p>
                                <p>
                                    <span className="font-semibold">Rooms Available:</span> 12
                                </p>

                                <Button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm">
                                    Explore
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

        </section>
    );
}
