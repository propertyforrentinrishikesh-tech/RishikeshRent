"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyCardsWithPagination from "@/components/PropertyCardsWithPagination";
import { toast } from "react-hot-toast";
import { X, MapPin } from "lucide-react";

export default function Properties({ initialProducts = [], banners = [] }) {
  const router = useRouter();
  const [selectedBookingProperty, setSelectedBookingProperty] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [contactMethod, setContactMethod] = useState("call");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <main className="w-full bg-white">
      <PropertyCardsWithPagination
        products={initialProducts}
        banners={banners}
        showBanner={true}
        onBookingClick={(item) => {
          setSelectedBookingProperty(item);
          setShowBookingModal(true);
        }}
      />

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
    </main>
  );
}
