"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutMe = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Main Content */}
      <section className="container mx-auto px-4 py-5 md:px-10 max-w-7xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl">
          {/* Intro */}
          <div className="">
            <h4 className="text-md mb-2 uppercase tracking-wide">Stay where Serenity Meets Comforts, Popular Owner Properties</h4>
            <h2 className="text-2xl font-bold mb-2 uppercase tracking-wide">"Explore Now - Truster, Transparent & Easy "Your Holiday Rental In Rishikesh!</h2>
            <hr className="border-gray-500 mb-3 w-[85%]" />
            <p className="font-barlow text-gray-600 mb-10  w-full text-sm">Secure your preferred property with a simple online booking and a small deposit. All reservations are verified and confirmed by our team to ensure complete transparency. Flexible cancellation and refund options are available as per our booking policy making your
              rental experience in Rishikesh smooth, safe, and reliable.</p>
            <h1 className="text-xl font-bold mb-2 drop-shadow-lg uppercase tracking-wide">
              Professional Excellence. Digital Integrity. Local Expertise.
            </h1>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              <span className="font-bold text-gray-900">www.rishikeshrent.com</span> is Rishikesh’s premier smart property management ecosystem. We bridge the gap between traditional hospitality and modern digital solutions by offering an integrated suite of services, including automated rent collection, comprehensive tenant oversight, and a streamlined Hotel Booking OTA. Operating with a commitment to integrity, we ensure peace of mind through 24/7 dedicated support and a rigorous zero-tolerance policy.
            </p>
          </div>

          {/* Key Policy & Feature Details */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Key Policy & Feature Details:</h3>

            <div className="space-y-8">
              {/* 1. Advanced Digital Rent Collection */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">1. Advanced Digital Rent Collection</h4>
                <ul className="list-none space-y-2 pl-4 border-l-4 border-orange-200">
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">1) Automated Payments:</span> Seamless integration with major digital wallets, UPI, and net banking for friction-free transactions.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">2) Automated Reminders:</span> Intelligent notification system to reduce late payments and improve cash flow.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">3) Real-Time Accounting:</span> Instant receipt generation and financial tracking for owners to monitor ROI at a glance.</li>
                </ul>
              </div>

              {/* 2. Comprehensive Tenant Management */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">2. Comprehensive Tenant Management</h4>
                <ul className="list-none space-y-2 pl-4 border-l-4 border-blue-200">
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">1) Verified Onboarding:</span> Rigorous background checks and ID verification to ensure high-quality placements.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">2) Digital Documentation:</span> Paperless lease management, including automated e-registrations and renewal tracking.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">3) Centralized Communication:</span> A dedicated portal for tenant queries, reducing administrative overhead for owners.</li>
                </ul>
              </div>

              {/* 3. Hospitality & OTA Integration */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">3. Hospitality & OTA Integration</h4>
                <ul className="list-none space-y-2 pl-4 border-l-4 border-green-200">
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">1) Global Visibility:</span> Your property is listed on our proprietary Online Travel Agency (OTA) platform, reaching a global audience of travelers and pilgrims.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">2) Dynamic Pricing:</span> Smart tools to adjust rates based on seasonal demand in the Rishikesh market.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">3) Seamless Booking:</span> Real-time availability calendars with instant confirmation capabilities.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Trust & Safety Policies */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Trust & Safety Policies</h3>

            <div className="space-y-8">
              {/* 1. Regulatory Compliance & Legal Standards */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">1. Regulatory Compliance & Legal Standards</h4>
                <ul className="list-none space-y-2 pl-4 border-l-4 border-red-200">
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">1) Zero-Tolerance Policy:</span> We strictly prohibit any illegal activities. Any violation results in immediate contract termination and reporting to local authorities.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">2) Model Tenancy Act Alignment:</span> Our agreements are drafted to comply with the latest 2026 Indian rental regulations, ensuring protection for both parties.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">3) Identity Integrity:</span> Mandatory Aadhaar/Passport verification for every individual entering the property.</li>
                </ul>
              </div>

              {/* 2. 24/7 Operations & Support */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">2. 24/7 Operations & Support</h4>
                <ul className="list-none space-y-2 pl-4 border-l-4 border-yellow-200">
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">1) Round-the-Clock Assistance:</span> Dedicated support teams available 24/7 for emergency maintenance, check-in issues, or urgent tenant concerns.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">2) Proactive Monitoring:</span> Regular property audits to ensure upkeep and adherence to community guidelines.</li>
                </ul>
              </div>

              {/* 3. Data Privacy & Security */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">3. Data Privacy & Security</h4>
                <ul className="list-none space-y-2 pl-4 border-l-4 border-purple-200">
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">1) Secure Infrastructure:</span> State-of-the-art encryption for all financial data and personal tenant information.</li>
                  <li className="text-gray-700"><span className="font-semibold text-gray-900">2) Privacy Commitment:</span> Strict data-handling protocols that ensure owner and tenant information is never shared with unauthorized third parties.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Closing */}
          <div className="mt-12 p-6 bg-gray-50 rounded-xl">
            <p className="text-gray-700 leading-relaxed text-lg font-medium italic text-justify">
              "We recognize that property is more than just an asset—it is a commitment. As Rishikesh's leading smart management platform, we specialize in end-to-end digital transformations for landlords and hotel operators. Our dual-purpose platform simplifies the complexities of long-term leasing and short-term hospitality through a foundation of strict legal compliance and 24/7 operational support. We pride ourselves on maintaining the highest standards of safety and professional conduct, ensuring that every transaction on our platform is secure, seamless, and transparent."
            </p>
          </div>

        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="w-full bg-black py-10 text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-24 gap-6 ">
        <div className="md:mb-0 md:px-3 text-center md:text-left">
          <h3 className="text-xl md:text-3xl font-bold mb-2">Questions?</h3>
          <p className="text-sm md:text-lg font-normal text-gray-300">
            Our experts will help find the solutions that are right for you
          </p>
        </div>
        <Link href="/contact" className="btn bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-lg shadow transition">
          Get In Touch
        </Link>
      </section>
    </div>
  );
};

export default AboutMe;