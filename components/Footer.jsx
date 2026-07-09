"use client"
import {
    Users,
    BriefcaseBusiness,
    Globe2,
} from "lucide-react";
import { Facebook, Instagram, MapPin, Youtube } from "lucide-react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
const Footer = ({ companyBasicInfo = null }) => {
    const pathName = usePathname()
    const [pages, setPages] = useState([])
    const companyName = companyBasicInfo?.companyName || 'Kag Premium Homes'
    const footerLogoSrc = companyBasicInfo?.footerLogo?.url || companyBasicInfo?.mainLogo?.url || '/HeaderLogo.png'
    const contactNumbers = Array.isArray(companyBasicInfo?.contactNumbers) ? companyBasicInfo.contactNumbers.filter(Boolean) : []
    const emails = Array.isArray(companyBasicInfo?.emails) ? companyBasicInfo.emails.filter(Boolean) : []
    const officeAddresses = Array.isArray(companyBasicInfo?.officeAddresses) ? companyBasicInfo.officeAddresses.filter(Boolean) : []
    const socialLinks = [
        { label: 'Facebook', href: companyBasicInfo?.facebookLink },
        { label: 'Instagram', href: companyBasicInfo?.instagramLink },
        { label: 'YouTube', href: companyBasicInfo?.youtubeLink },
        { label: 'Google Map', href: companyBasicInfo?.googleMapLink },
    ].filter((item) => item.href)

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await fetch("/api/getAllPages")
                const data = await response.json()
                setPages(data.pages)
            } catch (error) {
                // console.error("Error fetching pages:", error)
            }
        }
        fetchPages()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value.trim();
        if (!email) {
            return toast.error("Please Enter Your Email", { style: { borderRadius: "10px", border: "2px solid red" } });
        }
        try {
            const res = await fetch('/api/newsLetter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Thank you for Subscribing!", { style: { borderRadius: "10px", border: "2px solid green" } });
                e.target.reset();
            } else {
                toast.error(data.message || "Subscription failed.", { style: { borderRadius: "10px", border: "2px solid red" } });
            }
        } catch {
            toast.error("An error occurred.", { style: { borderRadius: "10px", border: "2px solid red" } });
        }
    };

    function Counter({ end, title }) {
        const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.4,
        });

        return (
            <div ref={ref} className="text-center">
                <h3 className="text-5xl font-bold text-white">
                    {inView && <CountUp end={end} duration={2.5} />}
                    +
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                    {title}
                </p>
            </div>
        );
    }
    return (
        <footer className={`relative print:hidden ${pathName.includes('admin') && 'hidden'}
          ${pathName.includes('artisan') && 'block'} 
          ${pathName.includes('product') && 'block'} 
          ${pathName.includes('sign-in') && 'hidden'}
          ${pathName.includes('sign-up') && 'hidden'}  
          ${pathName.includes('customEnquiry') && 'hidden'} 
          ${pathName.includes('checkout') && 'hidden'}  
          ${pathName.includes('category') && 'block'}relative overflow-hidden border-t bg-[#f8fafc]`}>
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    backgroundImage: `
        linear-gradient(to right, rgba(148,163,184,.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(148,163,184,.15) 1px, transparent 1px)
      `,
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="relative z-10">
                {/* Experience Section */}
                <section className="relative bg-[#0B1E33] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 lg:px-5">
                        <div className="grid lg:grid-cols-[58%,42%] lg:grid-rows-[auto_auto] gap-x-12">
                            {/* ================= LEFT TOP ================= */}
                            <div className="text-white pt-20">

                                <p className="text-sm leading-7 text-gray-300 max-w-2xl mb-8">
                                    Rishikesh is a place where the soul finds its rhythm, nestled at
                                    the foothills of the mighty Himalayas where the emerald-green
                                    Ganga begins her journey onto the plains. Known globally as the
                                    Yoga Capital of the World, it is a sanctuary where spirituality,
                                    adventure and nature exist together.
                                </p>

                                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                    Experience Rishikesh with
                                </h2>

                                <div className="inline-block mt-3">
                                    <h3 className="text-4xl md:text-5xl font-bold">
                                        www.rishikeshrent.com
                                    </h3>

                                    <div className="w-full h-1 bg-yellow-400 mt-2"></div>
                                </div>

                                <p className="text-gray-300 mt-8 max-w-2xl leading-8">
                                    To truly immerse yourself in the magic of this town, you need a
                                    home that combines comfort with the serenity of the mountains.
                                    <span className="font-semibold text-white">
                                        {" "}www.rishikeshrent.com
                                    </span>{" "}
                                    serves as your gateway to the perfect stay, simplifying your
                                    search for your ideal retreat.
                                </p>

                            </div>
                            {/* ================= RIGHT IMAGE ================= */}
                            <div className="relative lg:row-span-2 flex justify-end lg:-mt-10">
                                <div className="relative w-full max-w-lg">
                                    {/* Border */}
                                    <Image
                                        src="/footerimage.png"
                                        width={900}
                                        height={1000}
                                        alt="Experience"
                                        className="w-full h-[700px] object-cover"
                                    />
                                </div>
                            </div>
                            {/* ================= LEFT BOTTOM ================= */}

                            <div className="pb-16 mt-10">

                                {/* CTA */}

                                <div className="flex h-12 gap-4">

                                    <button
                                        className="bg-[#324EA7]
                        hover:bg-[#263d8e]
                        px-5
                        py-3
                        text-white
                        font-semibold
                        flex
                        items-center
                        gap-3"
                                    >
                                        About More ↗
                                    </button>

                                    <span className="bg-white rounded-full px-4 py-3 text-black font-semibold shadow hover:scale-105 transition-all">
                                        Verified Listings
                                    </span>

                                    <span className="bg-white rounded-full px-4 py-3 text-black font-semibold shadow hover:scale-105 transition-all">
                                        Centric Features
                                    </span>

                                    <span className="bg-white rounded-full px-4 py-3 text-black font-semibold shadow hover:scale-105 transition-all">
                                        Diverse Options
                                    </span>

                                </div>

                                {/* STATS */}

                                <div className="grid grid-cols-3 mt-16 border-t border-white/10 pt-10 text-white">

                                    {/* 1 */}

                                    <div className="flex gap-4">

                                        <Users
                                            size={34}
                                            className="text-white/70 mt-1"
                                        />

                                        <div>

                                            <h3 className="text-white text-5xl font-bold">
                                                <Counter end={69} />
                                            </h3>

                                            <p className="text-white/70 text-sm mt-2">
                                                Professional Experts
                                            </p>

                                        </div>

                                    </div>

                                    {/* 2 */}

                                    <div className="flex gap-4">

                                        <BriefcaseBusiness
                                            size={34}
                                            className="text-white/70 mt-1"
                                        />

                                        <div>

                                            <h3 className="text-white text-5xl font-bold">
                                                <Counter end={20} />
                                            </h3>

                                            <p className="text-white/70 text-sm mt-2">
                                                Projects Complete
                                            </p>

                                        </div>

                                    </div>

                                    {/* 3 */}

                                    <div className="flex gap-4">

                                        <Globe2
                                            size={34}
                                            className="text-white/70 mt-1"
                                        />

                                        <div>

                                            <h3 className="text-white text-5xl font-bold">
                                                <Counter end={6} />
                                            </h3>

                                            <p className="text-white/70 text-sm mt-2">
                                                Worldwide Clients
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* CTA Section */}
                <div className="w-[90%] max-w-6xl mx-auto pt-16">
                    <div className="bg-white border rounded-3xl p-8 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase">
                                Get Started
                            </p>
                            <h2 className="text-2xl font-semibold mt-2">
                                Find your dream stay with Kag Premium Homes
                            </h2>
                            <p className="text-slate-600 mt-2">
                                Discover luxury stays, premium experiences and seamless bookings.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href="/properties"
                                className="px-8 py-3 rounded-full bg-[#0f2747] text-white font-medium"
                            >
                                Browse Properties
                            </Link>

                            <Link
                                href="/contact"
                                className="px-8 py-3 rounded-full border bg-white"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Footer */}
                <div className="bg-[#0B1521] text-white mt-16 pt-10 pb-4 w-full">
                    <div className="w-[80%] max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                            {/* Left: Logo */}
                            <div className="md:w-1/4 flex justify-center md:justify-end md:border-r border-slate-700 pr-0 md:pr-10">
                                <div className="flex items-center justify-center h-full min-h-[150px]">
                                    <Image
                                        src={footerLogoSrc}
                                        width={240}
                                        height={80}
                                        alt={companyName}
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="md:w-2/3 flex flex-col gap-5">
                                <p className="text-[13px] text-slate-300 leading-relaxed max-w-3xl font-light">
                                    <span className="font-medium text-white">"Stay where Serenity meets Comfort."</span> Visit Rishikeshrent.com today to secure your slice of heaven in the Yoga Capital of the World. Beyond just a stay, We offer a smooth rental experience. From flexible cancellation options to dedicated support, they handle the logistics so you can focus entirely on your spiritual or adventurous journey.
                                </p>

                                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-white">
                                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                                    <span className="text-slate-600">|</span>
                                    <Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
                                    <span className="text-slate-600">|</span>
                                    <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">Legality / Policy</Link>
                                    <span className="text-slate-600">|</span>
                                    <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link>
                                    <span className="text-slate-600">|</span>
                                    <Link href="#" className="hover:text-emerald-400 transition-colors">Our Support</Link>
                                </div>

                                <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-6 text-[13px] text-slate-300 mt-1">
                                    <div className="flex items-start gap-2 max-w-[280px]">
                                        <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                                        <span>Corporate Address : Jai Ram Ashram Complex, First Floor Rishikesh 249201</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                            <span>+91 7060320678, +91 9557839999</span>
                                        </div>
                                        <Link href="https://wa.me/917060320678" target="_blank" className="flex items-center gap-1.5 bg-black border border-slate-700 px-3 py-1.5 rounded-full hover:bg-slate-800 transition shadow-sm">
                                            <div className="bg-green-500 rounded-full p-0.5">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" /></svg>
                                            </div>
                                            <span className="font-semibold text-white">Whatsapp</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-slate-700 mt-10 pt-4 pb-2">
                        <div className="w-[90%] max-w-5xl mx-auto text-center text-[13px] text-white font-medium pl-0 md:pl-[33%] md:ml-10">
                            <p>© {new Date().getFullYear()} Rishikesh Rent. All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
