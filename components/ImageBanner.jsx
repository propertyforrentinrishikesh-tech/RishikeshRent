import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Star } from 'lucide-react'

const ImageBanner = ({
  imageUrl = '/imagebanner.png',
}) => {
  return (
    <section className="w-full md:w-[95%] mx-auto bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find suitable budget accommodation</h2>
          <p className="text-gray-600 mb-6">Condimentum id venenatis a condimentum vitae sapien pellentesque habitant. At augue eget arcu dictum varius duis at consectetur</p>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Hostel territory</h4>
                <p className="text-sm text-gray-500">Consequat interdum varius sit amet mattis</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-3-3h-2M7 20H2v-2a3 3 0 013-3h2m0 0a4 4 0 018 0m-8 0v1m8-1v1" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Accommodates guests</h4>
                <p className="text-sm text-gray-500">Consequat interdum varius sit amet mattis</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V9H3v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Grateful guests</h4>
                <p className="text-sm text-gray-500">Consequat interdum varius sit amet mattis</p>
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
          <div className="absolute left-6 bottom-10 bg-white rounded-xl shadow-xl p-6 w-64">
            <h3 className="font-bold text-lg">Family Room with Private Bathroom</h3>
            <div className="text-2xl font-extrabold mt-2">$149 <span className="text-sm font-medium">/ 1 night</span></div>
            <div className="mt-4">
              <Button className="bg-blue-100 text-blue-700">See availability</Button>
            </div>
          </div>

          {/* Review card (top-right) */}
          <div className="absolute right-6 top-6 bg-white rounded-xl shadow-xl p-4 w-72">
            <p className="font-bold">This is the perfect hostel for a weekend getaway!</p>
            <div className="flex items-center mt-3 gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" >
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
                  <Star key={i} className="w-4 h-4 text-yellow-400" />
                ))}
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
