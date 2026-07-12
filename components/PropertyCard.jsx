"use client";
import { ArrowRight, MapPin, Star, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

const PropertyCard = ({
  item,
  onBookingClick,
  onQuickViewClick,
  slugify
}) => {
  const cardTitle = item?.propertyName || item?.title || "";
  const cardLocation = item?.locationType || item?.subLocationType || "Location";
  const cardImage = item?.mainImage?.url || item?.gallery?.mainImage?.url || "/placeholder.jpeg";
  const cardSlug = item?.propertyNameSlug || slugify(cardTitle);
  const cardPrice = item?.maxRentPrice ? `₹${item.maxRentPrice}` : (item?.rentPrice ? `₹${item.rentPrice}` : "N/A");

  return (
    <div
      key={item?._id || item?.id || cardSlug}
      className="group relative bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full p-3"
    >
      <div className="relative h-[240px] w-full overflow-hidden rounded-[20px]">
        <Image
          width={400}
          height={300}
          loading="lazy"
          src={cardImage}
          alt={cardTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-x-0 bottom-0 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 pb-4 px-4">
          <Button
            className="w-full max-w-[200px] bg-white text-black hover:bg-black hover:text-white font-bold text-sm rounded-full shadow-lg h-9"
            onClick={(e) => { e.preventDefault(); onQuickViewClick?.(item); }}
          >
            Quick View
          </Button>
        </div>
      </div>
      {/* Badges */}
      <div className="absolute top-5 left-5 flex flex-wrap gap-2">
        <span className="bg-emerald-500 text-white text-[12px] font-bold px-2 py-1 rounded">
          ✓ Verified
        </span>
        {item?.propertyCategory && (
          <span className="bg-purple-500 text-white text-[12px] font-bold px-2 py-1 rounded capitalize shadow-sm">
            {item.propertyCategory.replace(/-/g, ' ')}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-grow pt-4 px-2 pb-1">
        {/* Middle Row: Location and Price (replacing Duration) */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-4 h-4 text-[#1bb9c3]" />
            <span className="text-sm font-medium">{cardLocation}</span>
          </div>

          <div className="flex items-center gap-3 bg-[#f0f7f7] rounded-full py-1.5 pr-4 pl-1.5 shrink-0">
            <div className="bg-white rounded-full p-1.5 shadow-sm">
              <Wallet className="w-4 h-4 text-[#1bb9c3]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium leading-tight">Price</span>
              <span className="text-sm font-bold text-[#0f3b4c] leading-tight">{cardPrice}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h3 className="text-[20px] md:text-[22px] font-serif font-bold text-[#0f3b4c] line-clamp-2 leading-tight">
            {cardTitle}
          </h3>
        </div>

        <hr className="mt-5 mb-4 border-gray-300" />

        {/* Bottom Row */}
        <div className="mt-auto flex items-end justify-between gap-3">
          <Link
            href={`/properties/${slugify(cardLocation)}/${slugify(cardSlug)}`}
            className="shrink-0"
          >
            <Button
              className="group bg-[#1bb9c3] hover:bg-[#15a1ab] text-white rounded-full px-4 h-10 font-semibold text-sm shadow-md transition-all duration-300"
            >
              View Details <ArrowRight className="w-0 h-4 opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 group-hover:ml-1.5 group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Request Book in place of price */}
          <Button
            className="group bg-[#1bb9c3] hover:bg-[#15a1ab] text-white rounded-full px-4 h-10 font-semibold text-sm shadow-md transition-all duration-300"
            onClick={(e) => { e.preventDefault(); onBookingClick?.(item); }}
          >
            Request Book <ArrowRight className="w-0 h-4 opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 group-hover:ml-1.5 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
