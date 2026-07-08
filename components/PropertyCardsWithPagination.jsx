"use client";
import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import QuickViewProductCard from "./QuickViewProductCard";
import { X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, Hotel, Navigation, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Image from "next/image";

const PropertyCardsWithPagination = ({
  products = [],
  banners = [],
  showBanner = true,
  onBookingClick,
}) => {
  const CARDS_PER_PAGE = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  // const handleDetailsClick = (item) => {
  //   setQuickViewProduct(item);
  // };
  useEffect(() => {
    if (products && products.length > 0) {
      const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
      const endIndex = startIndex + CARDS_PER_PAGE;
      setPaginatedProducts(products.slice(startIndex, endIndex));
    } else {
      setPaginatedProducts([]);
    }
  }, [currentPage, products]);

  const totalPages = Math.ceil(products.length / CARDS_PER_PAGE);

  const slugify = (text) =>
    text
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [location, setLocation] = useState('');
  const [propertyFor, setPropertyFor] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [maxPrice, setMaxPrice] = useState(50000);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch property types
        try {
          const propResponse = await fetch("/api/property/propertyType");
          if (!propResponse.ok) {
            throw new Error(`HTTP error! status: ${propResponse.status}`);
          }
          const propData = await propResponse.json();
          // Handle both response formats
          if (Array.isArray(propData)) {
            setPropertyTypes(propData);
          } else if (propData && propData.success && Array.isArray(propData.data)) {
            setPropertyTypes(propData.data);
          } else {
            console.error("Unexpected property types response format:", propData);
          }
        } catch (error) {
          console.error("Error fetching property types:", error);
          toast.error("Failed to load property types");
        }

        // Fetch locations
        try {
          const locResponse = await fetch("/api/property/createLocation");
          if (!locResponse.ok) {
            throw new Error(`HTTP error! status: ${locResponse.status}`);
          }
          const locData = await locResponse.json();
          // Handle both response formats
          if (Array.isArray(locData)) {
            setLocations(locData);
          } else if (locData && locData.success && Array.isArray(locData.data)) {
            setLocations(locData.data);
          } else {
            console.error("Unexpected location types response format:", locData);
          }
        } catch (error) {
          console.error("Error fetching location types:", error);
          toast.error("Failed to load location types");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams();

      // Filters (query params)
      if (propertyFor) params.append('propertyFor', slugify(propertyFor));
      if (propertyType) params.append('propertyType', slugify(propertyType));
      if (location) params.append('locationType', slugify(location));
      if (maxPrice) params.append('maxRent', maxPrice);

      if (checkInDate) {
        const formattedDate = new Date(checkInDate)
          .toISOString()
          .split('T')[0];
        params.append('checkInDate', formattedDate);
      }

      if (guestCount && guestCount > 1) {
        params.append('guests', guestCount);
      }

      // Client-side navigation to the unified properties page
      router.push(`/properties?${params.toString()}`);

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  // Add useEffect to handle initial load with URL params
  useEffect(() => {
    // Parse URL params on component mount
    const params = new URLSearchParams(window.location.search);
    if (params.get('locationType')) setLocation(params.get('locationType'));
    if (params.get('propertyFor')) setPropertyFor(params.get('propertyFor'));
    if (params.get('propertyType')) setPropertyType(params.get('propertyType'));
    if (params.get('checkInDate')) setCheckInDate(params.get('checkInDate'));
    if (params.get('guests')) setGuestCount(parseInt(params.get('guests')));
    if (params.get('maxRent')) setMaxPrice(params.get('maxRent'));
  }, []);
  return (
    <section className="w-full bg-white">
      {/* Dynamic Banners Section */}
      {banners && banners.length > 0 && (
        <div className="w-full">
          <div className="flex flex-col gap-4">
            {banners.map((banner, idx) => (
              <div key={banner._id || idx} className="w-full overflow-hidden">
                <Image
                  width={1250}
                  height={250}
                  loading="lazy"
                  src={banner.image?.url || banner.image}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-96 object-contain rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Section */}
      <section className="w-full">
        <div className="bg-[#64a8b1] p-6 md:p-10 flex flex-col gap-5">
          <div className="text-black">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">Best Stays, Better Prices: Book Direct.</h2>
            <p className="text-base md:text-lg font-semibold text-white">
              Authentic Comfort. Exceptional Value. Your Home Away From Home In Rishikesh.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4 w-full">
            {/* Location */}
            <div className="w-full md:w-1/4">
              <Select
                value={location}
                onValueChange={(value) => setLocation(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full bg-white h-10 rounded-full px-5 text-black border-none text-sm font-semibold focus:ring-0 shadow-md">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc, index) => (
                    <SelectItem key={`loc-${index}`} value={slugify(loc.locationType)}>
                      {loc.locationType || `Location ${index + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="w-full md:w-1/4">
              <Select
                value={propertyType}
                onValueChange={(value) => setPropertyType(value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full bg-white h-10 rounded-full px-5 text-black border-none text-sm font-semibold focus:ring-0 shadow-md">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type, index) => (
                    <SelectItem key={`type-${index}`} value={slugify(type.propertyType)}>
                      {type.propertyType || `Type ${index + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Slider */}
            <div className="w-full md:w-1/4 flex flex-col text-black font-bold px-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold">Low</span>
                <span className="text-sm font-bold">Price Range</span>
                <span className="text-xs font-semibold">Max</span>
              </div>
              <div className="relative flex items-center w-full mt-1">
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[10px] font-semibold">
                <span>5000</span>
                <span>1,00,000</span>
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full md:w-1/4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#ff6b00] hover:bg-[#e66000] text-black text-sm font-bold rounded-full transition-colors shadow-md"
              >
                {isLoading ? "Searching..." : "Search Now"}
              </Button>
            </div>
          </form>

          <p className="text-white text-xs md:text-sm font-medium max-w-5xl mt-1 leading-relaxed">
            Discover your next getaway without the compromise. We pride ourselves on offering the best rates for your stay, ensuring that luxury and comfort remain perfectly within your budget. Your perfect home away from home is waiting—at the price you deserve.
          </p>
        </div>
      </section>

      {/* Cards Grid */}
      {products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 w-[95%] mx-auto py-10">
          {paginatedProducts.map((item) => (
            <PropertyCard
              key={item?._id || item?.id}
              item={item}
              onQuickViewClick={(item) => setQuickViewProduct(item)}
              onBookingClick={onBookingClick}
              slugify={slugify}
            />
          ))}
        </div>
      )}

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl mx-auto md:max-w-5xl w-full relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-2xl font-bold z-50 rounded-full w-8 h-8 border border-black bg-black text-white flex items-center justify-center hover:bg-gray-100 hover:text-black focus:outline-none"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
            >
              <X />
            </button>
            <QuickViewProductCard
              product={quickViewProduct}
              onClose={() => setQuickViewProduct(null)}
              onRequestBook={onBookingClick}
            />
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2"
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 ${currentPage === page
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
      )}

      {/* No Products Message */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="bg-slate-100 p-6 rounded-full mb-6 ring-8 ring-slate-50">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No properties found</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            We couldn't find any properties matching your exact search criteria. Try adjusting your filters, expanding your price range, or searching in a different city.
          </p>
          <Button
            onClick={() => window.location.href = '/properties'}
            className="bg-[#ff6b00] hover:bg-[#e66000] text-white rounded-full px-8 h-12 font-semibold shadow-md transition-all hover:shadow-lg"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </section>
  );
};

export default PropertyCardsWithPagination;
