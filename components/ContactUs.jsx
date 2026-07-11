'use client'

import { MapPin, ArrowUpRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"

const ContactUs = () => {
    const { data: session } = useSession();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        guests: "1 guest",
        plan: "",
        date: "",
        message: "",
    });

    const [phoneError, setPhoneError] = useState("");

    // Auto-fill form when user signs in
    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user.name || "",
                email: session.user.email || "",
                phone: session.user.phone || "",
            }));
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length > 10) return;

            setFormData({ ...formData, phone: numericValue });

            if (numericValue.length !== 10 && numericValue.length > 0) {
                setPhoneError("Phone number must be exactly 10 digits.");
            } else {
                setPhoneError("");
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.phone && (formData.phone.length !== 10 || isNaN(formData.phone))) {
            setPhoneError("Phone number must be exactly 10 digits.");
            return;
        }

        try {
            const response = await fetch("/api/saveContact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userId: session?.user?.id || null 
                }),
            })

            const res = await response.json()
            if (!response.ok) {
                toast.error(res.message || "Something went wrong.");
                return;
            }

            toast.success("Form submitted successfully!", {
                style: { borderRadius: "10px", border: "2px solid green" }
            });

            setFormData(prev => ({
                ...prev,
                message: "",
                plan: "",
                date: "",
                guests: "1 guest"
            }))
        } catch (error) {
            toast.error("Something went wrong. Please try again later.", {
                style: { borderRadius: "10px", border: "2px solid red" },
            });
        }
    };

    const handleWhatsApp = () => {
        const { name, email, phone, guests, plan, date, message } = formData;
        
        const text = `*New Stay Enquiry*
Name: ${name || 'Not provided'}
Email: ${email || 'Not provided'}
Phone: ${phone || 'Not provided'}
Guests: ${guests || '1 guest'}
Plan of Interest: ${plan || 'Not specified'}
Preferred Start Date: ${date || 'Flexible'}

*Message:*
${message || 'No additional details provided.'}`;
        
        const encodedText = encodeURIComponent(text);
        const whatsappNumber = "917060320678";
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
    };

    return (
        <div className="bg-[#FAF8F5] min-h-screen w-full flex flex-col items-center justify-start pt-10 md:pt-20 font-serif text-[#4A4A4A]">
            <div className="container mx-auto px-5 md:px-10 lg:px-20 max-w-6xl">
                
                {/* Header text */}
                <div className="w-full mb-12 md:mb-20">
                    <h1 className="text-4xl md:text-6xl text-[#3E4C3D] font-light mb-6">
                        begin with a <span className="italic">quiet hello.</span>
                    </h1>
                    <p className="text-[#6B6B6B] max-w-lg text-lg font-sans">
                        Send us a note, call us, or WhatsApp if it's easier. We answer ourselves — no bots, no rush.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 w-full justify-between items-start mb-20">
                    {/* Contact Info (Left Side) */}
                    <div className="lg:w-1/3 w-full flex flex-col gap-8 font-sans">
                        
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase mb-4">WhatsApp / Call</h3>
                            <p className="text-2xl text-[#3E4C3D] mb-2 font-serif">+91 01169266090</p>
                            <p className="text-2xl text-[#3E4C3D] mb-4 font-serif">+91 7060320678</p>
                            <div className="flex gap-4 text-sm text-[#6B6B6B]">
                                <a href="https://wa.me/917060320678" className="flex items-center gap-1 hover:text-[#3E4C3D] transition-colors">
                                    <MessageCircle className="w-4 h-4" /> WhatsApp
                                </a>
                                <a href="tel:+9101169266090" className="flex items-center gap-1 hover:text-[#3E4C3D] transition-colors">
                                    <ArrowUpRight className="w-4 h-4" /> Call
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase mb-4">Write to us</h3>
                            <a href="mailto:info@rishikeshrent.com" className="flex items-center gap-2 text-lg text-[#3E4C3D] hover:underline font-serif">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                info@rishikeshrent.com
                            </a>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase mb-4">Find us</h3>
                            <div className="flex items-start gap-2 text-lg text-[#3E4C3D] font-serif">
                                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                                <p>Jai Ram Ashram Complex, First Floor<br/>Rishikesh 249201</p>
                            </div>
                        </div>

                        <div className="w-full max-w-sm mt-4 overflow-hidden rounded-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/contactus.png" alt="Contact Us" className="w-full h-auto object-cover rounded-2xl shadow-sm" />
                        </div>
                    </div>

                    {/* Contact Form (Right Side) */}
                    <div className="lg:w-[55%] w-full bg-[#F3EFE9] rounded-2xl p-8 md:p-12 shadow-sm border border-[#E8E2D9]">
                        <h2 className="text-3xl text-[#3E4C3D] mb-2 font-light">Enquire about a stay</h2>
                        <p className="text-[#6B6B6B] mb-8 font-sans text-sm">A few details and we'll take it from here.</p>

                        <form className="space-y-6 font-sans" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase">Your Name</Label>
                                    <Input
                                        onChange={handleChange}
                                        value={formData.name}
                                        id="name"
                                        name="name"
                                        placeholder="Ananya Kapoor"
                                        required
                                        readOnly={!!session?.user}
                                        className="bg-[#FAF8F5] border-[#DED8CF] focus:border-[#3E4C3D] focus:ring-0 rounded-lg h-12 shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase">Email</Label>
                                    <Input
                                        onChange={handleChange}
                                        value={formData.email}
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        readOnly={!!session?.user}
                                        className="bg-[#FAF8F5] border-[#DED8CF] focus:border-[#3E4C3D] focus:ring-0 rounded-lg h-12 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase">Phone (Optional)</Label>
                                    <Input
                                        onChange={handleChange}
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        placeholder="+91 98XXXXXXXX"
                                        value={formData.phone}
                                        className="bg-[#FAF8F5] border-[#DED8CF] focus:border-[#3E4C3D] focus:ring-0 rounded-lg h-12 shadow-sm"
                                    />
                                    {phoneError && (
                                        <p className="text-sm text-red-600">{phoneError}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guests" className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase">Guests</Label>
                                    <Select value={formData.guests} onValueChange={(val) => handleSelectChange('guests', val)}>
                                        <SelectTrigger className="bg-[#FAF8F5] border-[#DED8CF] focus:border-[#3E4C3D] focus:ring-0 rounded-lg h-12 shadow-sm">
                                            <SelectValue placeholder="1 guest" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1 guest">1 guest</SelectItem>
                                            <SelectItem value="2 guests">2 guests</SelectItem>
                                            <SelectItem value="3 guests">3 guests</SelectItem>
                                            <SelectItem value="4+ guests">4+ guests</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="plan" className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase">Plan of Interest</Label>
                                    <Select value={formData.plan} onValueChange={(val) => handleSelectChange('plan', val)}>
                                        <SelectTrigger className="bg-[#FAF8F5] border-[#DED8CF] focus:border-[#3E4C3D] focus:ring-0 rounded-lg h-12 text-[#6B6B6B] shadow-sm">
                                            <SelectValue placeholder="Choose a retreat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Yoga Retreat">Yoga Retreat</SelectItem>
                                            <SelectItem value="Meditation">Meditation</SelectItem>
                                            <SelectItem value="Wellness">Wellness</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date" className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase">Preferred Start Date</Label>
                                    <Input
                                        onChange={handleChange}
                                        value={formData.date}
                                        id="date"
                                        name="date"
                                        type="date"
                                        className="bg-[#FAF8F5] border-[#DED8CF] focus:border-[#3E4C3D] focus:ring-0 rounded-lg h-12 text-[#6B6B6B] shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-xs font-bold tracking-widest text-[#8F8F8F] uppercase">What are you hoping for?</Label>
                                <Textarea
                                    onChange={handleChange}
                                    value={formData.message}
                                    id="message"
                                    name="message"
                                    placeholder="A few lines about what you're looking for — rest, practice, transformation, or simply space to breathe."
                                    rows={4}
                                    required
                                    className="bg-[#FAF8F5] border-[#DED8CF] focus:border-[#3E4C3D] focus:ring-0 rounded-lg resize-none shadow-sm"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button type="submit" className="bg-[#6B7B5B] hover:bg-[#5A684C] text-white px-8 py-6 rounded-full flex items-center gap-2 transition-colors">
                                    Send enquiry <ArrowUpRight className="w-4 h-4" />
                                </Button>
                                <Button type="button" onClick={handleWhatsApp} variant="outline" className="border-[#A6B29C] text-[#6B7B5B] hover:bg-[#EBE7DF] bg-transparent px-8 py-6 rounded-full flex items-center gap-2 transition-colors">
                                    <MessageCircle className="w-4 h-4" /> WhatsApp instead
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;

