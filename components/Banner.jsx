"use client";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import Link from "next/link";

const Banner = () => {
    const [promotinalBanner, setPromotinalBanner] = useState([])
    const [featuredOffer, setFeaturedOffer] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [bannerSection2nd, setBannerSection2nd] = useState([]);
    // console.log(promotinalBanner)
    const fetchPromotinalBanner = async () => {
        try {
            const res = await fetch("/api/addPromotinalBanner");
            const data = await res.json();
            // console.log("Promotinal Banner API response:", data);
            if (data && data.length > 0) {
                setPromotinalBanner(data);
            } else {
                setPromotinalBanner([]);
            }
        } catch (error) {
            // console.error("Error fetching products:", error);
            setPromotinalBanner([]);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchFeaturedOffer = async () => {
        try {
            const res = await fetch("/api/addFeaturedOffer");
            const data = await res.json();
            // console.log("Featured Offer API response:", data);
            if (data && data.length > 0) {
                setFeaturedOffer(data);
            } else {
                setFeaturedOffer([]);
            }
        } catch (error) {
            // console.error("Error fetching products:", error);
            setFeaturedOffer([]);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchBannerSection2nd = async () => {
        try {
            const response = await fetch('/api/bannerSection2nd');
            const data = await response.json();
            // console.log(data);
            setBannerSection2nd(data); // Use dummy data if API returns empty
        } catch (error) {
            // console.error('Error fetching data:', error);
            setBannerSection2nd([]); // Use dummy data on error
        } finally {
            setIsLoading(false);
            setLoading1(false);
        }
    };
    useEffect(() => {
        fetchPromotinalBanner();
        fetchFeaturedOffer();
        fetchBannerSection2nd();
    }, [])
    return (
        <div className="bg-[#fcf7f1] w-full overflow-hidden max-w-screen overflow-x-hidden">
            {/* Promotional Banner Section */}
            {promotinalBanner.length > 0 && (
                <div className="w-full py-10 px-2 md:py-20 bg-[#FCF7F1]">
                    <h2 className="text-2xl md:text-4xl font-bold text-center mb-5 uppercase">
                        <span className="italic">Click</span>,
                        <span >Collect</span>,
                        <span>Checkout</span>
                    </h2>
                    <p className="font-barlow text-gray-600 mb-5 md:w-[50%] w-full mx-auto text-center">From everyday essentials to the latest trends, we bring everything to your fingertips. Enjoy easy browsing, secure checkout, and doorstep delivery with exciting deals and free shipping.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 px-2">
                        {promotinalBanner.map((item, idx) => (
                            <div key={idx} className="flex flex-col h-[220px] md:h-[450px] p-0 overflow-hidden relative group">
                                <Link href={item?.buttonLink || '#'} target="_blank" rel="noopener noreferrer" ><img src={item.image?.url} alt={item.title} className="absolute inset-0 w-full h-full md:object-cover object-contain object-center transition-transform duration-300 group-hover:scale-105" /></Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Featured Offer For You Section */}
            {featuredOffer.length > 0 && (
                <div className="w-full md:py-20 py-10 px-2 md:px-10">
                    <h4 className="text-xl font-bold mb-2 uppercase tracking-wide">Stay where Serenity Meets Comforts, Popular Owner Properties</h4>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 uppercase tracking-wide">"Explore Now - Truster, Transparent & Easy "Your Holiday Rental In Rishikesh!</h2>
                    <hr className="border-gray-500 mb-3 w-[85%]" />
                    <p className="font-barlow text-gray-600 mb-10  w-full text-sm">Secure your preferred property with a simple online booking and a small deposit. All reservations are verified and confirmed by our team to ensure complete transparency. Flexible cancellation and refund options are available as per our booking policy making your
                        rental experience in Rishikesh smooth, safe, and reliable.</p>
                    <Carousel className="w-full">
                        <CarouselContent className="-ml-4">
                            {featuredOffer.map((item, idx) => (
                                <CarouselItem key={idx} className="pl-4 md:basis-1/3 lg:basis-1/4">
                                    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                        {/* Image Container with Badge */}
                                        <div className="relative h-[240px] overflow-hidden">
                                            <Link href={item?.buttonLink || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                                <img
                                                    src={item.image?.url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </Link>
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm z-10 border border-gray-100">
                                                <span className="text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-wider">
                                                    {item.subDestination || 'Sub Destination'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-md text-gray-900 line-clamp-1 capitalize" title={item.title}>
                                                        {item.propertyName}
                                                    </h3>
                                                    <span className="shrink-0 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                                        {item.propertyType || 'Property Type'}
                                                    </span>
                                                </div>
                                                <div className="w-full h-px bg-gray-100/80"></div>
                                            </div>

                                            <div className="flex justify-between items-center pt-1">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Starting from</span>
                                                    <span className="text-sm font-bold text-gray-800">
                                                        {item.price ? `₹ ${item.price}` : 'Price On Request'}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={item?.buttonLink || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-5 py-2.5 bg-[#E8E6E1] hover:bg-[#dcd9d2] text-gray-900 text-xs font-bold rounded-full transition-colors duration-300 shadow-sm hover:shadow"
                                                >
                                                    View Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext className="xl:-right-5 right-2 w-12 h-12 border-none bg-white/80 hover:bg-white shadow-lg text-gray-800" />
                        <CarouselPrevious className="xl:-left-5 left-2 w-12 h-12 border-none bg-white/80 hover:bg-white shadow-lg text-gray-800" />
                    </Carousel>
                </div>
            )}
            <section className="relative w-full">

                {bannerSection2nd.map((item, idx) => (
                    <div className="w-full" key={item._id}>
                        <div className="grid grid-cols-1 gap-5 md:gap-4 overflow-hidden">
                            <div className="hidden md:flex flex-col md:h-[430px] overflow-hidden relative group">
                                <Link
                                    href={item.buttonLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <img
                                        src={item.image?.url}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                                    />
                                </Link>
                            </div>
                            <div className="md:hidden flex flex-col h-[450px] overflow-hidden relative group">
                                <Link
                                    href={item.buttonLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <img
                                        src={item.mobileImage?.url}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

            </section>
        </div>
    )
}

export default Banner