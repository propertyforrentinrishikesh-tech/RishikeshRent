"use client";

import { ChevronsLeft, ChevronsRight, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const AboutUsSection = ({ section = "frontend" }) => {
    const [featuredPackages, setFeaturedPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
      const [offerDetails, setOfferDetails] = useState(null);
    const [bannerSection1st, setBannerSection1st] = useState([]);
    // console.log(featuredPackages)
    const fetchPackages = async () => {
        try {
            const response = await fetch(`/api/featured-packages?section=${section}`);
            const data = await response.json();
            // console.log(data);
            setFeaturedPackages(data.data || []); // Access the data property from the response
        } catch (error) {
            // console.error('Error fetching data:', error);
            setFeaturedPackages([]); // Use dummy data on error
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };
    const fetchBannerSection1st = async () => {
        try {
            const response = await fetch(`/api/bannerSection1st?section=${section}`);
            const data = await response.json();
            // console.log(data);
            setBannerSection1st(data); // Use dummy data if API returns empty
        } catch (error) {
            // console.error('Error fetching data:', error);
            setBannerSection1st([]); // Use dummy data on error
        } finally {
            setIsLoading(false);
            setLoading1(false);
        }
    };
    useEffect(() => {
        fetchPackages();
        fetchBannerSection1st();
        fetch("/api/offerDetails")
          .then(res => res.json())
          .then(data => { if (data) setOfferDetails(data); })
          .catch(() => { });
    }, [section]);
    return (
        <>
            {featuredPackages.length > 0 && (
                <section className="relative w-full px-5 overflow-hidden max-w-screen overflow-x-hidden">
                    <div className="w-full">
                        <h2 className="font-bold text-2xl md:text-4xl text-center mt-7">Home Away From Home is Waiting.
                        </h2>
                        <p className=" text-xl font-lg md:text-xl text-center mt-2">
                            "personalized experience tailored just for you."
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto">
                            {loading ? (
                                // Loading skeletons
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col items-center w-42 rounded-3xl animate-pulse"
                                        style={{ padding: "1rem 0 0.5rem 0" }}
                                    >
                                        <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden flex items-end justify-center bg-gray-200" />
                                        <div className="mt-4 text-center px-2 w-full flex justify-start">
                                            <span className="block h-6 w-32 rounded bg-gray-200" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                featuredPackages.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex flex-col items-center w-42 mx-auto md:w-80 rounded-3xl group"
                                        style={{ padding: "1rem 0 0.5rem 0" }}
                                    >
                                        <div className="relative w-full aspect-[4/5] rounded-2xl border overflow-hidden">
                                            <img
                                                src={item.image.url}
                                                alt={item.title}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <Link
                                                href={item.link}
                                                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            >
                                                <span className="bg-white text-black font-medium px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    View Product
                                                </span>
                                            </Link>
                                        </div>
                                        <div className="mt-4 text-center px-2 w-full flex justify-start">
                                            <Link key={item._id} href={item.link}>
                                                <div className="font-bold text-md md:text-xl text-black hover:underline transition cursor-pointer">{item.title}</div>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            )}
            <section className="w-full md:w-[95%] mx-auto space-y-3 px-3 sm:px-4 md:px-0 my-5">
                {/* Banner 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#fde8e2] via-[#fdf0ec] to-[#fef6f4] rounded-xl px-4 sm:px-5 py-4 shadow-sm border border-orange-100/60">

                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <Image src="/clockImage.png" alt="clock" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />

                        <div>
                            <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                                {offerDetails?.lastMinuteDeal?.heading || 'Last Minute Deal'}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500">
                                {offerDetails?.lastMinuteDeal?.description || 'Up to 75% off on selected hotels'}
                            </p>
                        </div>
                    </div>

                    <Link
                        href={offerDetails?.lastMinuteDeal?.link || ''}
                        className="w-full sm:w-auto text-center text-sm text-nowrap bg-white font-medium text-gray-700 border border-gray-300 rounded-full px-4 sm:px-5 py-2 hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                        Know More
                    </Link>
                </div>

                {/* Banner 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#ede4f5] via-[#f3eef9] to-[#f8f5fc] rounded-xl px-4 sm:px-5 py-4 shadow-sm border border-purple-100/60">

                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <Image src="/banner1.png" alt="card" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />

                        <p className="text-xs sm:text-sm md:text-base text-gray-700">
                            {offerDetails?.promoBanner?.description || 'Save ₹2,000 on Hotels by using Adani One ICICI Bank credit card.'}
                        </p>
                    </div>

                    <Link
                        href={offerDetails?.promoBanner?.link || ''}
                        className="w-full sm:w-auto text-center text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-5 py-2 hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                        Apply
                    </Link>
                </div>

            </section>
            {bannerSection1st.length > 0 && (
                <section className="bg-[#ededed] relative w-full">
                    {bannerSection1st.map((item, idx) => (
                        <div className="w-full" key={item._id}>
                            <div className="grid grid-cols-1 gap-4 md:gap-5 overflow-hidden">
                                <div className="hidden md:flex flex-col h-[430px] overflow-hidden relative group">
                                    <Link
                                        href={item.buttonLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <img
                                            src={item.image?.url}
                                            alt={item.title}
                                            className="absolute inset-0 w-full h-full md:object-contain object-contain object-center transition-transform duration-300 group-hover:scale-105"
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
                                            className="absolute inset-0 w-full h-full md:object-contain object-contain object-center transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            )}

        </>
    );
};

export default AboutUsSection;
