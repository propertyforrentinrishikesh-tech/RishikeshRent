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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="bg-[#0f172a] rounded-[24px] shadow-2xl mx-auto w-full max-w-md h-auto relative overflow-hidden border border-white/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
              onClick={() => setShowBookingModal(false)}
              aria-label="Close booking form"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleBookingSubmit} className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-white">Enquiry For</h2>

              {selectedBookingProperty && (
                <div className="mb-6 rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-sm font-semibold text-white mb-1 line-clamp-1">{selectedBookingProperty.propertyName}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1bb9c3]" />
                    {selectedBookingProperty.locationType || selectedBookingProperty.subLocationType}
                  </p>
                </div>
              )}

              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-300 mb-2 block">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1bb9c3] focus:ring-1 focus:ring-[#1bb9c3] transition-all"
                />
              </div>

              <div className="flex gap-6 mb-6">
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
                    <div className="bg-white/5 border border-white/10 text-gray-300 rounded-xl px-4 font-semibold flex items-center">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength="10"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1bb9c3] focus:ring-1 focus:ring-[#1bb9c3] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="mb-6 relative flex items-center py-2">
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
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1bb9c3] focus:ring-1 focus:ring-[#1bb9c3] transition-all"
                />
              </div>

              <div className="mb-8 flex gap-3 items-start">
                <label htmlFor="agree" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
                  We Appreciate Your Interest! A Member of Our Team Will Reach Out to You Soon to Discuss Your Offer.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#1bb9c3] to-[#15a1ab] text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#1bb9c3]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
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
