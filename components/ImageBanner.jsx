import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import {
  Building2, Star,
  Users,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link"
const ImageBanner = ({
  imageUrl = '/imagebanner.png',
}) => {
  return (
    <section className="w-full md:w-[95%] mx-auto bg-white py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left content */}
        <div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Find suitable budget accommodation</h2>
          <p className="text-gray-600 text-sm md:text-lg mb-6">Finding the right home for you and your family—or securing a peaceful space for your solo journey—should be as rewarding as the time you spend in Rishikesh.  Whether you are looking for a spacious, secure home for your loved ones or a quiet, well-connected retreat for your personal exploration, our platform ensures every listing is verified for quality and peace of mind.</p>


          <div className="space-y-6">
            {/* Card 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                <Building2 className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Hostel Territory
                </h4>
                <p className="mt-1 text-sm sm:text-base text-gray-500 leading-relaxed">
                  Search Smart, Live Better. Rishikesh's Premier Rental Marketplace.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                <Users className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Accommodates Guests
                </h4>
                <p className="mt-1 text-sm sm:text-base text-gray-500 leading-relaxed">
                  Verified Homes. Trusted Rentals. Seamless Searches in Rishikesh.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                <CalendarCheck className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  Grateful Guests
                </h4>
                <p className="mt-1 text-sm sm:text-base text-gray-500 leading-relaxed">
                  Skip the Search, Start Living. Handpicked Properties Across Rishikesh.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right image with overlay cards */}
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt="Room"
              width={900}
              height={600}
              className="object-cover w-full h-[420px] md:h-[500px]"
            />
          </div>

          {/* Price card (bottom-left) */}
          <div className="absolute left-6 bottom-10 bg-white rounded-xl shadow-xl p-2 md:p-6 w-64">
            <h3 className="font-bold text-sm md:text-lg">Family Room with Private Bathroom</h3>
            <div className="texts-sm md:text-2xl font-extrabold mt-2">₹9000 <span className="text-xs md:text-sm font-medium">/ Month Start</span></div>
            <div className="mt-4">
              <Link href={"/properties"} className="md:px-4 md:py-2 px-2 py-1 rounded text-xs md:text-sm bg-blue-100 text-blue-700">See availability</Link>
            </div>
          </div>

          {/* Review card (top-right) */}
          <div className="absolute right-6 top-6 bg-white rounded-xl shadow-xl p-2 md:p-4 w-48 md:w-72">
            <p className="font-bold text-sm md:text-md">This is the perfect hostel for a weekend gateway!</p>
            <div className="hidden md:flex items-center mt-3 gap-3">
              <div className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-gray-200" >
                <Image
                  src="/person.png"
                  alt="Reviewer Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="md:w-4 md:h-4 w-3 h-3 text-yellow-400" />
                ))}
              </div>
              <div className="ml-2 text-sm text-gray-600">Esmond Ward</div>
            </div>
            <div className="flex flex-col md:hidden items-start mt-3 gap-3">
              <div className="flex flex-items justify-center gap-2">

              <div className="md:w-10 md:h-10 w-8 h-8 rounded-full bg-gray-200" >
                <Image
                  src="/person.png"
                  alt="Reviewer Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="md:w-4 md:h-4 w-3 h-3 text-yellow-400" />
                ))}
              </div>
                </div>
              <div className="ml-2 text-sm text-gray-600">Esmond Ward</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImageBanner
