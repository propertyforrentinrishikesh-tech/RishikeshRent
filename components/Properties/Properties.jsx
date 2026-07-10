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
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#eff6ff] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[100vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-5 right-5 z-20 flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition hover:bg-black/5 hover:text-black"
              onClick={() => setShowBookingModal(false)}
              aria-label="Close booking form"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6">Enquiry For</h2>

              {selectedBookingProperty && (
                <div className="mb-6 rounded-2xl border border-gray-300 bg-transparent p-4">
                  <p className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{selectedBookingProperty.propertyName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {selectedBookingProperty.locationType || selectedBookingProperty.subLocationType}
                  </p>
                </div>
              )}

              <div className="mb-5">
                <label className="text-sm font-bold text-gray-900 mb-2 block">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
                />
              </div>

              <div className="flex flex-row gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="contact"
                      value="call"
                      checked={contactMethod === "call"}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-[#387478] peer-checked:bg-[#387478] transition-all flex items-center justify-center">
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 transition-colors">Call</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="contact"
                      value="whatsapp"
                      checked={contactMethod === "whatsapp"}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-[#387478] peer-checked:bg-transparent transition-all flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#387478] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 transition-colors">WhatsApp</span>
                </label>
              </div>

              {(contactMethod === "call" || contactMethod === "whatsapp") && (
                <div className="mb-5">
                  <div className="flex gap-2">
                    <div className="border border-gray-300 bg-transparent rounded-xl px-4 py-3 text-gray-900 font-bold flex items-center justify-center sm:justify-start w-16 sm:w-20">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength="10"
                      className="flex-1 rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
                    />
                  </div>
                </div>
              )}

              <div className="relative flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-900 uppercase tracking-widest">OR EMAIL</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
                />
              </div>

              <div className="mb-8">
                <p className="text-[10px] sm:text-xs leading-relaxed text-gray-900 font-medium">
                  We Appreciate Your Interest! A Member of Our Team Will Reach Out to You Soon to Discuss Your Offer.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#df7152] py-4 text-base font-bold text-white transition hover:bg-[#e08a74] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
