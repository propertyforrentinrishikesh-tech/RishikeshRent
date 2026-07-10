"use client";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight, Globe, X, MapPin, } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import Autoplay from "embla-carousel-autoplay";
import QuickViewProductCard from "./QuickViewProductCard";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast"
import { useInView } from 'react-intersection-observer';
import PropertyCard from "./PropertyCard";
const RandomTourPackageSection = () => {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isartisanLoading, setIsArtisanLoading] = useState(true);
  const [artisan, setArtisan] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const [bannerSection3rd, setBannerSection3rd] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBookingProperty, setSelectedBookingProperty] = useState(null);
  const [contactMethod, setContactMethod] = useState('call');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [agreeToContact, setAgreeToContact] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent background scroll when Quick View or booking modal is open
  useEffect(() => {
    if (quickViewProduct || showBookingModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [quickViewProduct, showBookingModal]);

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!selectedBookingProperty) {
      toast.error("Please select a property");
      return;
    }
    let contactValue = "";
    if (contactMethod === "call" || contactMethod === "whatsapp") {
      if (!phone.trim()) {
        toast.error(`Please enter a ${contactMethod === "whatsapp" ? "WhatsApp" : "phone"} number`);
        return;
      }
      contactValue = phone;
    } else if (contactMethod === "email") {
      if (!email.trim()) {
        toast.error("Please enter an email");
        return;
      }
      contactValue = email;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/property/propertyEnquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: bookingName,
          contactMethod,
          phone: contactMethod === "call" || contactMethod === "whatsapp" ? phone : undefined,
          email: contactMethod === "email" ? email : undefined,
          propertyId: selectedBookingProperty._id,
          propertyName: selectedBookingProperty.propertyName,
          propertyNameSlug: selectedBookingProperty.propertyNameSlug,
          locationType: selectedBookingProperty.locationType,
          subLocationType: selectedBookingProperty.subLocationType,
          propertyPrice: selectedBookingProperty.price || selectedBookingProperty.rentPrice,
          propertyImage: selectedBookingProperty.mainImage?.url,
          sourcePage: "properties",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      const message = `Hi,

I am interested in this property.

Property: ${selectedBookingProperty.propertyName}
Location: ${selectedBookingProperty.locationType}
Price: ₹${selectedBookingProperty.price || selectedBookingProperty.rentPrice}

My Name: ${bookingName}
Contact: ${contactMethod === 'email' ? email : phone}`;

      const whatsappUrl = `https://wa.me/917060320678?text=${encodeURIComponent(message)}`;

      toast.success("Enquiry submitted successfully! Redirecting to WhatsApp...");
      setShowBookingModal(false);
      setBookingName("");
      setContactMethod("call");
      setPhone("");
      setEmail("");

      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1500);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error(error.message || "Failed to submit enquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionProducts = Array.isArray(products) ? products.slice(0, 7) : [];
  // console.log(products)
  // Fetch Artisan 
  const fetchArtisan = async () => {
    try {
      const res = await fetch("/api/createArtisan");
      const data = await res.json();
      // console.log(data);
      // Ensure artisan is always an array
      if (Array.isArray(data)) {
        setArtisan(data);
      } else if (Array.isArray(data.artisans)) {
        setArtisan(data.artisans);
      } else {
        setArtisan([]);
      }
    } catch (error) {
      setArtisan([]);
    } finally {
      setIsArtisanLoading(false);
    }
  };
  // Fetch Prouducts
  const fetchProperties = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/property/propertyDetails?page=${page}&limit=15&showOnFront=true`);
      const data = await res.json();
      // console.log("Product API response:", data);
      const products = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

      if (products.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts(prev => {
        // Ensure we always have an array to spread
        const currentProducts = Array.isArray(prev) ? prev : [];
        return [...currentProducts, ...products];
      });
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);
  useEffect(() => {
    if (inView && hasMore) {
      fetchProperties();
    }
  }, [inView, hasMore, fetchProperties]);
  const fetchBannerSection3rd = async () => {
    try {
      const response = await fetch('/api/bannerSection3rd');
      const data = await response.json();
      // console.log(data);
      setBannerSection3rd(data); // Use dummy data if API returns empty
    } catch (error) {
      // console.error('Error fetching data:', error);
      setBannerSection3rd([]); // Use dummy data on error
    } finally {
      setLoading1(false);
    }
  };
  const [consultancyBanner, setConsultancyBanner] = useState([])
  // console.log(promotinalBanner)
  const fetchPromotinalBanner = async () => {
    try {
      const res = await fetch("/api/addConsultancyBanner");
      const data = await res.json();
      // console.log("Consultancy Banner API response:", data);
      if (data && data.length > 0) {
        setConsultancyBanner(data);
      } else {
        setConsultancyBanner([]);
      }
    } catch (error) {
      // console.error("Error fetching products:", error);
      setConsultancyBanner([]);
    }
  };
  useEffect(() => {
    fetchArtisan();
    fetchProperties();
    fetchBannerSection3rd();
    fetchPromotinalBanner();
  }, []);
  const slugify = (text) =>
    text
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')   // spaces → -
      .replace(/[^\w-]+/g, '') // remove special chars
      .replace(/--+/g, '-');   // remove double -
  return (
    <section className="bg-[#fcf7f1] md:mt-19 w-full overflow-hidden max-w-screen overflow-x-hidden">

      {/* New Unrivaled Offer Section */}
      <section className="w-full md:py-12 py-6 px-4 md:px-10 bg-white">
        <div className="flex flex-col mb-8">
          <div className="flex justify-between items-end border-b border-gray-200 pb-2">
            <div className="flex flex-col">
              <span className="text-xs font-barlow uppercase tracking-widest text-gray-900 mb-1">Experience the Unrivaled: Our Deluxe Room Offer</span>
              <h2 className="text-2xl md:text-3xl font-barlow text-gray-900">A Quiet Escape For Modern Travelers Like You</h2>
            </div>
            <Link href="/properties" className="text-sm font-semibold text-gray-800 hover:underline mb-1 hidden md:block">
              View More
            </Link>
          </div>
          <div className="mt-2 text-xs text-gray-900 font-barlow tracking-wide">
            We take the guesswork out of property hunting by focusing on reliable listings and transparent details, ensuring that from your first click to moving into your new home, your transition to life in Rishikesh is as smooth and inspiring as the city itself. Start your journey with us today and discover the address that feels like home.
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sectionProducts.map((item) => (
            <PropertyCard
              key={item?._id || item?.id}
              item={item}
              onDetailsClick={(item, location, slug) => {
                router.push(`/properties/${slugify(location)}/${slugify(slug)}`);
              }}
              onBookingClick={(item) => {
                setSelectedBookingProperty(item);
                setShowBookingModal(true);
              }}
              onQuickViewClick={(item) => setQuickViewProduct(item)}
              slugify={slugify}
            />
          ))}

          {/* Promo banner card as last item */}
          <div key="promo-banner" className="bg-[#0f5886] text-white rounded-xl overflow-hidden shadow-sm flex flex-col h-full p-6">
            <div className="flex flex-col flex-grow">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Stay Longer, Save More</h3>
              <p className="text-sm text-white/90 mb-4">It's simple: the longer you stay, the more you save!</p>

              <div className="flex items-start gap-4 text-sm mb-6">
                <div className="border-l border-white/40 pl-4">
                  <p className="mb-2"><span className="font-semibold">Save up to 30%</span> on daily rate for stays longer than 14 nights</p>
                  <p><span className="font-semibold">Save up to 20%</span> off the nightly rate on stays between 7-14 nights</p>
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <Link href="/properties" className="bg-white hover:bg-gray-200 text-[#0f5886] font-bold rounded-md px-4 py-2">
                Choose Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {bannerSection3rd.length > 0 && (
        <section className="relative w-full">
          {loading1 ? (
            // Skeleton loader
            <div className="w-full">
              <div className="grid grid-cols-1 gap-5 md:gap-4">
                {[...Array(2)].map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[220px] md:h-[400px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : (
            // Actual content
            bannerSection3rd.map((item, idx) => (
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
            ))
          )}
        </section>
      )}

      {/* Artisan Carousel Section */}
      {artisan.length > 0 && (
        <div className="w-full py-10 md:py-20">
          {/* Desktop: Grid/List */}
          <div className="w-full max-w-[90%] mx-auto mb-16">
            <div className="flex flex-col md:flex-row items-start gap-5">
              {/* Left: Heading and description */}
              <div className="flex-1 flex flex-col justify-center md:pr-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-start mb-5 uppercase">Our Industry Experts</h2>
                {/* <h2 className="text-xl font-bold mb-2">Celebrating the Art of Craftsmanship. Honoring the Hands That Shape Beauty</h2> */}
                <div className="text-md text-gray-700 text-justify mb-6">
                  At the heart of every great expedition is dependable gear—and that’s where we come in. As a leading provider of adventure and expedition equipment, we specialize in supplying high-performance, safety-tested gear for professionals, outdoor enthusiasts, rescue teams, and expedition leaders. Our commitment goes beyond products; we offer end-to-end gear solutions designed for extreme conditions, rugged terrains, and mission-critical operations. Backed by trusted global brands and decades of field experience, our management philosophy focuses on quality, innovation, and reliability. Whether you're preparing for a Himalayan ascent, a wilderness survival course, or a high-altitude rescue mission, we ensure you’re equipped to go further—safely, efficiently, and confidently.
                </div>

              </div>
              {/* Right: Top 2 artisan cards in new style */}
              <div className="hidden md:flex flex-row gap-4 justify-end">
                {(artisan && artisan.slice(0, 2).map((item, idx) => {
                  const card = {
                    id: item._id || idx,
                    slug: item.slug,
                    name: `${item.title ? item.title + " " : ""}${item.firstName || ''} ${item.lastName || ''}`.trim() || "Unknown Artisan",
                    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() : "N/A",
                    image: item.profileImage?.url || item.image || "/bg-custom-1.jpg",
                    title: item.specializations && item.specializations.length > 0 ? item.specializations.join(", ") : "Artisan",
                    subtitle: item.shgName || "",
                    experience: item.yearsOfExperience ? `${item.yearsOfExperience} years experience` : "",
                    location: item.address ? `${item.address.city}, ${item.address.state}` : "",
                    socials: [
                      {
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook-icon lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        ), url: item.socialPlugin?.facebook || "#"
                      },
                      {
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        ), url: item.socialPlugin?.instagram || "#"
                      },
                      {
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube-icon lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                        ), url: item.socialPlugin?.youtube || "#"
                      },
                      {
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                            <path d="M21.35 11.1h-9.18v2.83h5.43c-.24 1.38-1.42 4.04-5.43 4.04-3.27 0-5.94-2.71-5.94-6.05s2.67-6.05 5.94-6.05c1.86 0 3.11.8 3.82 1.49l2.6-2.57C17.36 3.43 15.01 2.5 12 2.5 6.95 2.5 2.9 6.53 2.9 11.5S6.95 20.5 12 20.5c6.89 0 9.1-4.82 9.1-7.22 0-.48-.05-.8-.15-1.18z" />
                          </svg>
                        ), url: item.socialPlugin?.google || "#"
                      },
                      {
                        icon: (
                          <Globe />
                        ), url: item.socialPlugin?.website || "#"
                      },
                    ],
                  };
                  return (
                    <div key={card.id} className="relative rounded-2xl shadow-md group transition-all h-full w-[340px] flex flex-col bg-[#fbeff2] overflow-hidden">


                      {/* Card Image */}
                      <div className="relative w-full h-96">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      {/* Card Content Overlay */}
                      <div className="absolute left-0 bottom-0 w-full flex justify-between items-end p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                        <div>
                          <Link
                            href={`/artisan/${card.slug}`}
                            className="font-bold text-2xl text-white mb-3 leading-tight drop-shadow-md hover:underline hover:decoration-2 hover:underline-offset-4 transition cursor-pointer"
                            title={card.name}
                          >
                            {card.name}
                          </Link>
                          <div className="text-md text-white drop-shadow-md">{card.title}</div>
                        </div>
                        {/* Arrow Button with Socials on Hover */}
                        <div className="relative group/arrow">
                          <button className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition group-hover/arrow:bg-[#e84393] group-hover/arrow:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          {/* Social Icons: show on arrow hover */}
                          <div className="absolute bottom-12 right-0 flex flex-col gap-4 opacity-0 group-hover/arrow:opacity-100 transition-opacity duration-300 z-30 items-center">
                            {card.socials.slice(0, 6).map((s, i) => (
                              <a
                                key={i}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                          bg-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition
                          transform translate-y-5 group-hover/arrow:translate-y-0
                        `}
                                style={{
                                  transitionProperty: 'transform, opacity, background-color, box-shadow',
                                  transitionDuration: '0.6s',
                                  transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                                  transitionDelay: `${i * 60}ms`
                                }}
                              >
                                {s.icon}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }))}
              </div>
            </div>
            {/* Carousel for remaining artisans in new style in Laptop View*/}
            {artisan && artisan.length > 2 && (
              <div className="hidden md:flex mt-10">
                <Carousel className="w-full">
                  <CarouselContent className="flex gap-4">
                    {artisan.slice(2).map((item, idx) => {
                      const card = {
                        id: item._id || idx,
                        slug: item.slug,
                        name: `${item.title ? item.title + " " : ""}${item.firstName || ''} ${item.lastName || ''}`.trim() || "Unknown Artisan",
                        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() : "N/A",
                        image: item.profileImage?.url || item.image || "/bg-custom-1.jpg",
                        title: item.specializations && item.specializations.length > 0 ? item.specializations.join(", ") : "Artisan",
                        subtitle: item.shgName || "",
                        experience: item.yearsOfExperience ? `${item.yearsOfExperience} years experience` : "",
                        location: item.address ? `${item.address.city}, ${item.address.state}` : "",
                        socials: [
                          {
                            icon: (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook-icon lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            ), url: item.socialPlugin?.facebook || "#"
                          },
                          {
                            icon: (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            ), url: item.socialPlugin?.instagram || "#"
                          },
                          {
                            icon: (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube-icon lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                            ), url: item.socialPlugin?.youtube || "#"
                          },
                          {
                            icon: (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                                <path d="M21.35 11.1h-9.18v2.83h5.43c-.24 1.38-1.42 4.04-5.43 4.04-3.27 0-5.94-2.71-5.94-6.05s2.67-6.05 5.94-6.05c1.86 0 3.11.8 3.82 1.49l2.6-2.57C17.36 3.43 15.01 2.5 12 2.5 6.95 2.5 2.9 6.53 2.9 11.5S6.95 20.5 12 20.5c6.89 0 9.1-4.82 9.1-7.22 0-.48-.05-.8-.15-1.18z" />
                              </svg>
                            ), url: item.socialPlugin?.google || "#"
                          },
                          {
                            icon: (
                              <Globe />
                            ), url: item.socialPlugin?.website || "#"
                          },
                        ],
                      };
                      return (
                        <CarouselItem key={card.id} className="pl-5 md:basis-1/2 lg:basis-1/4 min-w-0 snap-start">
                          <div className="relative rounded-2xl overflow-hidden shadow-md group transition-all h-full flex flex-col bg-[#fbeff2]">


                            {/* Card Image */}
                            <div className="relative w-full h-96">
                              <img
                                src={card.image}
                                alt={card.name}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            {/* Card Content Overlay */}
                            <div className="absolute left-0 bottom-0 w-full flex justify-between items-end p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                              <div>
                                <Link
                                  href={`/artisan/${card.slug}`}
                                  className="font-bold text-2xl text-white mb-3 leading-tight drop-shadow-md hover:underline hover:decoration-2 hover:underline-offset-4 transition cursor-pointer"
                                  title={card.name}
                                >
                                  {card.name}
                                </Link>
                                <div className="text-md text-white drop-shadow-md">{card.title}</div>
                              </div>
                              {/* Arrow Button with Socials on Hover */}
                              <div className="relative group/arrow">
                                <button className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition group-hover/arrow:bg-[#e84393] group-hover/arrow:text-white">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                {/* Social Icons: show on arrow hover */}
                                <div className="absolute bottom-14 right-0 flex flex-col gap-4 opacity-0 group-hover/arrow:opacity-100 transition-opacity duration-300 z-30 items-center">
                                  {card.socials.slice(0, 6).map((s, i) => (
                                    <a
                                      key={i}
                                      href={s.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`
                                bg-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition
                                transform translate-y-5 group-hover/arrow:translate-y-0
                              `}
                                      style={{
                                        transitionProperty: 'transform, opacity, background-color, box-shadow',
                                        transitionDuration: '0.6s',
                                        transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                                        transitionDelay: `${i * 60}ms`
                                      }}
                                    >
                                      {s.icon}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <div className="flex items-center gap-3 mt-4 justify-center">
                    <CarouselPrevious className="bg-[#f7eedd] !rounded-full !w-12 !h-12 !flex !items-center !justify-center transition" />
                    <CarouselNext className="bg-[#f7eedd] !rounded-full !w-12 !h-12 !flex !items-center !justify-center transition" />
                  </div>
                </Carousel>
              </div>
            )}
            {/* Carousel for remaining artisans in new style */}
            {artisan && artisan.length > 1 && (
              <div className="md:hidden lg:hidden mt-10">
                <Carousel className="w-full">
                  <CarouselContent className="flex gap-4">
                    {artisan.map((item, idx) => {
                      const card = {
                        id: item._id || idx,
                        slug: item.slug,
                        name: `${item.title ? item.title + " " : ""}${item.firstName || ''} ${item.lastName || ''}`.trim() || "Unknown Artisan",
                        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() : "N/A",
                        image: item.profileImage?.url || item.image || "/bg-custom-1.jpg",
                        title: item.specializations && item.specializations.length > 0 ? item.specializations.join(", ") : "Artisan",
                        subtitle: item.shgName || "",
                        experience: item.yearsOfExperience ? `${item.yearsOfExperience} years experience` : "",
                        location: item.address ? `${item.address.city}, ${item.address.state}` : "",
                        socials: [
                          {
                            icon: (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook-icon lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            ), url: item.socialPlugin?.facebook || "#"
                          },
                          {
                            icon: (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            ), url: item.socialPlugin?.instagram || "#"
                          },
                          {
                            icon: (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube-icon lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                            ), url: item.socialPlugin?.youtube || "#"
                          },
                          {
                            icon: (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                                <path d="M21.35 11.1h-9.18v2.83h5.43c-.24 1.38-1.42 4.04-5.43 4.04-3.27 0-5.94-2.71-5.94-6.05s2.67-6.05 5.94-6.05c1.86 0 3.11.8 3.82 1.49l2.6-2.57C17.36 3.43 15.01 2.5 12 2.5 6.95 2.5 2.9 6.53 2.9 11.5S6.95 20.5 12 20.5c6.89 0 9.1-4.82 9.1-7.22 0-.48-.05-.8-.15-1.18z" />
                              </svg>
                            ), url: item.socialPlugin?.google || "#"
                          },
                          {
                            icon: (
                              <Globe />
                            ), url: item.socialPlugin?.website || "#"
                          },
                        ],
                      };
                      return (
                        <CarouselItem key={card.id} className="pl-5 md:basis-1/2 lg:basis-1/4 min-w-0 snap-start">
                          <div className="relative rounded-2xl overflow-hidden shadow-md group transition-all h-full flex flex-col bg-[#fbeff2]">

                            {/* Card Image */}
                            <div className="relative w-full h-96">
                              <img
                                src={card.image}
                                alt={card.name}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            {/* Card Content Overlay */}
                            <div className="absolute left-0 bottom-0 w-full flex justify-between items-end p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                              <div>
                                <Link
                                  href={`/artisan/${card.slug}`}
                                  className="font-bold text-2xl text-white mb-3 leading-tight drop-shadow-md hover:underline hover:decoration-2 hover:underline-offset-4 transition cursor-pointer"
                                  title={card.name}
                                >
                                  {card.name}
                                </Link>
                                <div className="text-md text-white drop-shadow-md">{card.title}</div>
                              </div>
                              {/* Arrow Button with Socials on Hover */}
                              <div className="relative group/arrow">
                                <button className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow transition group-hover/arrow:bg-[#e84393] group-hover/arrow:text-white">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                {/* Social Icons: show on arrow hover */}
                                <div className="absolute bottom-14 right-0 flex flex-col gap-4 opacity-0 group-hover/arrow:opacity-100 transition-opacity duration-300 z-30 items-center">
                                  {card.socials.slice(0, 6).map((s, i) => (
                                    <a
                                      key={i}
                                      href={s.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`
                                bg-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-gray-100 transition
                                transform translate-y-5 group-hover/arrow:translate-y-0
                              `}
                                      style={{
                                        transitionProperty: 'transform, opacity, background-color, box-shadow',
                                        transitionDuration: '0.6s',
                                        transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                                        transitionDelay: `${i * 60}ms`
                                      }}
                                    >
                                      {s.icon}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <div className="flex items-center gap-3 mt-4 justify-center">
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 p-5" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 p-5" />
                  </div>
                </Carousel>
              </div>
            )}
          </div>
        </div>
      )}
      {consultancyBanner.length > 0 && (
        <div className="w-full px-2 md:py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 uppercase">A true reflection of authenticity and tradition.</h2>
          <p className="text-gray-600 text-center py-4 mx-auto md:w-[50%]"> We deliver a true reflection of authenticity and tradition. Our unwavering commitment to time-honored methods ensures a superior, distinct character that mass production will never replicate.</p>
          <Carousel className="w-full px-5 md:px-20 mx-auto">
            <CarouselContent>
              {consultancyBanner.map((item, idx) => (
                <CarouselItem key={item._id || idx} className="w-full md:basis-1/2">

                  <div className="flex flex-col gap-5 md:flex-row md:h-[400px] h-[700px] rounded-xl overflow-hidden group px-2">
                    {/* Image Section */}
                    <div className="w-full h-full overflow-hidden border rounded-md border-gray-300">
                      <div className="relative w-full h-full">
                        <Image
                          src={item?.image?.url || "/placeholder.jpeg"}
                          alt={item?.title || "Consultancy Service"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          priority={idx === 0}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full bg-[#FAF2F2] p-6 flex flex-col justify-center rounded-md border border-gray-300">
                      <div>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-7 h-7 ${star <= (item.rating || 0) ? 'text-orange-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{item.rating || 0}/5</span>
                        </div>
                        <h3 className="text-2xl md:text-xl font-bold text-gray-900 my-3 line-clamp-2">
                          {item.title || 'Title Come Here'}
                        </h3>
                        <p className="text-gray-600 max-h-60 overflow-hidden">
                          {item.shortDescription || 'Short Description'}
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(item.buttonLink, '_blank', 'noopener,noreferrer');
                          }}
                          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto md:mx-0 w-full justify-center"
                        >
                          Explore Now <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="!right-2 !top-1/2 !-translate-y-1/2 z-10 bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow-md" />
            <CarouselPrevious className="!left-2 !top-1/2 !-translate-y-1/2 z-10 bg-white/80 hover:bg-white w-10 h-10 rounded-full shadow-md" />
          </Carousel>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-white rounded-2xl shadow-xl mx-auto md:max-w-4xl w-full relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-2xl font-bold z-50 rounded-full w-8 h-8 border border-black bg-black text-white flex items-center justify-center hover:bg-gray-100 hover:text-black focus:outline-none"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
            >
              <X />
            </button>
            <QuickViewProductCard product={quickViewProduct}
              onBookingClick={(item) => {
                setSelectedBookingProperty(item);
                setShowBookingModal(true);
              }} onClose={() => setQuickViewProduct(null)} />
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#0f172a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[100vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              onClick={() => setShowBookingModal(false)}
              aria-label="Close booking form"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleBookingSubmit} className="p-5 sm:p-6 lg:p-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">Enquiry For</h2>

              {selectedBookingProperty && (
                <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-sm font-semibold text-white mb-1 line-clamp-1">{selectedBookingProperty.propertyName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1bb9c3]" />
                    {selectedBookingProperty.locationType || selectedBookingProperty.subLocationType}
                  </p>
                </div>
              )}

              <div className="mb-5">
                <label className="text-sm sm:text-base font-medium text-gray-300 mb-2 block">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white placeholder:text-gray-500 focus:border-[#1bb9c3] focus:ring-2 focus:ring-[#1bb9c3]/30 outline-none transition"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="contact"
                      value="call"
                      checked={contactMethod === "call"}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 peer-checked:border-[#1bb9c3] peer-checked:bg-[#1bb9c3] transition-all flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Call</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="contact"
                      value="whatsapp"
                      checked={contactMethod === "whatsapp"}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500 peer-checked:border-[#25D366] peer-checked:bg-[#25D366] transition-all flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">WhatsApp</span>
                </label>
              </div>

              {(contactMethod === "call" || contactMethod === "whatsapp") && (
                <div className="mb-5">
                  <div className="flex gap-2">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-semibold flex items-center justify-center sm:justify-start sm:w-[90px]">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength="10"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white placeholder:text-gray-500 focus:border-[#1bb9c3] focus:ring-2 focus:ring-[#1bb9c3]/30 outline-none transition"
                    />
                  </div>
                </div>
              )}

              <div className="relative flex items-center my-7">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-500 uppercase tracking-widest">Or Email</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white placeholder:text-gray-500 focus:border-[#1bb9c3] focus:ring-2 focus:ring-[#1bb9c3]/30 outline-none transition"
                />
              </div>

              <div className="mb-7">
                <label htmlFor="agree" className="text-xs md:text-sm leading-6 text-gray-400">
                  We Appreciate Your Interest! A Member of Our Team Will Reach Out to You Soon to Discuss Your Offer.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#1bb9c3] to-[#15a1ab] py-4 text-base font-semibold text-white transition hover:scale-[1.02] hover:shadow-xl hover:shadow-[#1bb9c3]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Send Enquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
export default RandomTourPackageSection