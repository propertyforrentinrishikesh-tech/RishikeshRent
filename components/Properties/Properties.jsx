"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyCardsWithPagination from "@/components/PropertyCardsWithPagination";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

export default function Properties({ initialProducts = [], banners = [] }) {
  const router = useRouter();
  const [selectedBookingProperty, setSelectedBookingProperty] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [contactMethod, setContactMethod] = useState("call");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreeToContact, setAgreeToContact] = useState(false);
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

    if (!agreeToContact) {
      toast.error("Please agree to be contacted");
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

      toast.success("Enquiry submitted successfully!");
      setShowBookingModal(false);
      setBookingName("");
      setContactMethod("call");
      setPhone("");
      setEmail("");
      setAgreeToContact(false);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowBookingModal(false)}>
          <div className="bg-[#f5a962] rounded-2xl shadow-xl mx-auto w-full max-w-sm relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-3 right-3 p-2 text-2xl font-bold z-50 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 focus:outline-none"
              onClick={() => setShowBookingModal(false)}
              aria-label="Close booking form"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleBookingSubmit} className="p-6 pt-8">
              <h2 className="text-2xl font-bold text-center mb-6 text-black">Enquiry For</h2>

              {selectedBookingProperty && (
                <div className="mb-4 rounded-xl bg-white/40 p-3 text-black">
                  <p className="text-sm font-semibold">{selectedBookingProperty.propertyName}</p>
                  <p className="text-xs">{selectedBookingProperty.locationType || selectedBookingProperty.subLocationType}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="text-sm font-bold text-black mb-2 block">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/90 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
              </div>

              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contact"
                    value="call"
                    checked={contactMethod === "call"}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-black">Call</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="contact"
                    value="whatsapp"
                    checked={contactMethod === "whatsapp"}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-black">WhatsApp</span>
                </label>
              </div>

              {(contactMethod === "call" || contactMethod === "whatsapp") && (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <div className="bg-red-600 text-white rounded-lg px-3 py-2 font-bold flex items-center">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      maxLength="10"
                      className="flex-1 px-4 py-2 rounded-lg bg-white/90 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="text-black text-center py-1 rounded text-md font-bold mb-2">Or Email</div>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-blue-100 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
              </div>

              <div className="mb-6 flex gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeToContact}
                  onChange={(e) => setAgreeToContact(e.target.checked)}
                  className="w-4 h-4 mt-1 accent-black"
                />
                <label htmlFor="agree" className="text-xs text-black leading-tight">
                  We Appreciate Your Interest! A Member of Our Team Will Reach Out to You Soon to Discuss Your Offer
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold py-3 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
