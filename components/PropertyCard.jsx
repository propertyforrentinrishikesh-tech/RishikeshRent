"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const PropertyCard = ({ 
  item, 
  onBookingClick, 
  onQuickViewClick,
  slugify 
}) => {
  const cardTitle = item?.propertyName || item?.title || "";
  const cardLocation = item?.locationType || item?.subLocationType || "";
  const cardImage = item?.mainImage?.url || item?.gallery?.mainImage?.url || "/placeholder.jpeg";
  const cardSlug = item?.propertyNameSlug || slugify(cardTitle);
  const cardPrice = item?.maxRentPrice ? `₹${item.maxRentPrice}` : item?.rentPrice;

  return (
    <div
      key={item?._id || item?.id || cardSlug}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={cardImage}
          alt={cardTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-x-0 bottom-0 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 pb-5 px-4">
          <Button
            className="w-full max-w-[220px] bg-white text-black hover:bg-black hover:text-white font-bold text-sm rounded-full shadow-lg"
            onClick={() => onQuickViewClick?.(item)}
          >
            Quick View <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow gap-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-lg font-bold leading-tight line-clamp-2">{cardTitle}</h3>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 text-md">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{cardPrice}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-4">
        <Link
          href={`/properties/${slugify(cardLocation)}/${slugify(cardSlug)}`}
          className="flex-1"
        >
          <Button
            variant="outline"
            className="w-full border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-semibold rounded-lg"
          >
            View Details
          </Button>
        </Link>

        <Button
          className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-bold text-sm rounded-lg"
          onClick={() => onBookingClick?.(item)}
        >
          Request Book <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;
