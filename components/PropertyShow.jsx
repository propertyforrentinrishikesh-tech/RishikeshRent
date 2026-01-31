"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function PropertySection() {
    const smallCards = [1, 2, 3, 4];

    return (
        <>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:p-6">
                    {/* Left: Big Card */}
                    <Card className="overflow-hidden h-full border-0 shadow-none">
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

            <section className="w-full md:w-[95%] mx-auto py-12 px-2 md:px-5 bg-[#f9f9f970]">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 uppercase tracking-tight">Top Destinations</h2>
                <Carousel className="w-full">
                    <CarouselContent className="">
                        {[
                            { title: "Tapovan", count: "25 Properties", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Laxman Jhula", count: "18 Properties", image: "https://images.unsplash.com/photo-1518182170546-0766aa6f69ae?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Neelkanth", count: "12 Properties", image: "https://images.unsplash.com/photo-1596021688656-35fdc9ed0274?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Shivpuri", count: "30 Properties", image: "https://plus.unsplash.com/premium_photo-1697730414399-3d4d9ada9853?q=80&w=1000&auto=format&fit=crop" },
                            { title: "Rishikesh", count: "45 Properties", image: "https://images.unsplash.com/photo-1592639296346-60144f86d631?q=80&w=1000&auto=format&fit=crop" }
                        ].map((item, idx) => (
                            <CarouselItem key={idx} className="md:basis-1/3 lg:basis-1/4 pl-4">
                                <div className="relative h-[380px] w-full rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500">
                                    {/* Image */}
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                    {/* Top Badges */}
                                    <div className="absolute top-4 left-0 right-0 px-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-y-2 group-hover:translate-y-0">
                                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-white/30 tracking-wider ring-1 ring-white/20">{item.count}</span>
                                    </div>

                                    {/* Bottom Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center justify-end text-center">
                                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md tracking-wide group-hover:-translate-y-2 transition-transform duration-300">{item.title}</h3>

                                        {/* Reveal Button */}
                                        <div className="h-0 overflow-hidden opacity-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 ease-out">
                                            <Button className="mt-2 bg-white text-black hover:bg-gray-200 rounded-full px-8 py-5 font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0">
                                                Discover <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex xl:-left-12 -left-6 border-none bg-white/80 hover:bg-white text-gray-900 shadow-lg w-12 h-12" />
                    <CarouselNext className="hidden md:flex xl:-right-12 -right-6 border-none bg-white/80 hover:bg-white text-gray-900 shadow-lg w-12 h-12" />
                </Carousel>
            </section>

        </>
    );
}
