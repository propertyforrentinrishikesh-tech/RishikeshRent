"use client";

import { ChevronsLeft, ChevronsRight, MapPinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const AboutUsSection = () => {
    const [featuredPackages, setFeaturedPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/featured-packages');
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
        fetchPackages();
    }, []);

    return (
        <section className="relative py-10 w-full px-5 overflow-hidden max-w-screen overflow-x-hidden">
            <div className="w-full">
                <h2 className="font-bold text-2xl md:text-4xl text-center mt-7">Find Your Peaceful Home Amidst the Rishikesh Himalayas.
                </h2>
                <p className=" text-xl font-lg md:text-xl text-center mt-2">
                    "Where the Ganga Flows, Your New Home Awaits"
                </p>
                <hr className="h-[2px] w-full md:w-[50%] mx-auto bg-black" />

                <p className="text-gray-600 py-8 text-center font-barlow  w-full px-2 md:w-[50%] mx-auto">
                    At Find Your Best Choice, we take pride in connecting people with the finest
                    commercial and residential rental properties across the scenic city of Rishikesh.
                    Whether you're seeking a peaceful home near the Ganges, a modern apartment
                    in the city center, or a well-located space for your business, we bring you the best
                    deals and trusted options. Our dedicated team ens   ures every property meets the
                    highest standards of comfort, convenience, and value. With deep local expertise
                    and a commitment to customer satisfaction,

                    <br />
                    we help you find not just a property - but the perfect place to live, work, and grow
                    in the serene beauty of Rishikesh.
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
    );
};

export default AboutUsSection;
