"use client";
import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import QuickViewProductCard from "./QuickViewProductCard";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Search, Loader2, Hotel, Navigation, MapPin, Building2, Banknote,X } from 'lucide-react';
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
  const [propertyCategory, setPropertyCategory] = useState('');
  const [propertyCategories, setPropertyCategories] = useState([
    { propertyCategory: 'home-rental', label: 'Home Rental' },
    { propertyCategory: 'pg-hostel', label: 'PG / Hostel' },
  ]);
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
      if (propertyCategory) params.append('propertyCategory', slugify(propertyCategory));
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
    if (params.get('propertyCategory')) setPropertyCategory(params.get('propertyCategory'));
    if (params.get('checkInDate')) setCheckInDate(params.get('checkInDate'));
    if (params.get('guests')) setGuestCount(parseInt(params.get('guests')));
    if (params.get('maxRent')) setMaxPrice(params.get('maxRent'));
  }, []);
  return (
    <section className="w-full bg-white">
      {/* Dynamic Banners Section */}
      {banners && banners.length > 0 && (
        <div className="w-full">
          <div className="flex flex-col">
            {banners.map((banner, idx) => (
              <div key={banner._id || idx} className="w-full overflow-hidden">
                <Image
                  width={1250}
                  height={250}
                  loading="lazy"
                  src={banner.image?.url || banner.image}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-48 md:h-52 md:object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Section */}
      <section className="w-full bg-slate-50 py-5 md:py-10">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-bold mb-2 text-gray-900 tracking-tight">Best Stays, Better Prices: Book Direct.</h2>
            <p className="text-sm md:text-lg font-medium text-gray-600">
              Authentic Comfort. Exceptional Value. Your Home Away From Home In Rishikesh.
            </p>
          </div>

          <div className="w-full max-w-5xl bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 w-full">
              {/* Location */}
              <div className="w-full md:w-1/4 h-12 flex items-center border rounded-xl hover:border-gray-300 transition-colors bg-gray-50/50">
                <MapPin className="text-gray-400 w-5 h-5 ml-4 shrink-0" />
                <Select
                  value={location}
                  onValueChange={(value) => setLocation(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full h-full bg-transparent border-none shadow-none text-sm font-medium focus:ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none text-gray-700">
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc, index) => (
                      <SelectItem key={`loc-${index}`} value={loc.locationType}>
                        {loc.locationType || `Location ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="w-full md:w-1/4 h-12 flex items-center border rounded-xl hover:border-gray-300 transition-colors bg-gray-50/50">
                <Building2 className="text-gray-400 w-5 h-5 ml-4 shrink-0" />
                <Select
                  value={propertyType}
                  onValueChange={(value) => setPropertyType(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full h-full bg-transparent border-none shadow-none text-sm font-medium focus:ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none text-gray-700">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type, index) => (
                      <SelectItem key={`type-${index}`} value={type.propertyType}>
                        {type.propertyType || `Type ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Category */}
              <div className="w-full md:w-1/4 h-12 flex items-center border rounded-xl hover:border-gray-300 transition-colors bg-gray-50/50">
                <Building2 className="text-gray-400 w-5 h-5 ml-4 shrink-0" />
                <Select
                  value={propertyCategory}
                  onValueChange={(value) => setPropertyCategory(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full h-full bg-transparent border-none shadow-none text-sm font-medium focus:ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none text-gray-700">
                    <SelectValue placeholder="Property Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyCategories.map((type, index) => (
                      <SelectItem key={`cat-${index}`} value={type.propertyCategory}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Price Range Slider */}
              <div className="w-full md:w-1/4 h-12 flex items-center px-4 border rounded-xl hover:border-gray-300 transition-colors bg-gray-50/50 group relative">
                <Banknote className="text-gray-400 w-5 h-5 mr-3 shrink-0" />
                <div className="flex-grow flex flex-col justify-center relative w-full h-full pt-1">
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Max Price</span>
                    <span className="text-xs font-bold text-gray-900">₹{maxPrice}</span>
                  </div>
                  <div className="relative w-full flex items-center h-2">
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="absolute w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 z-10"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 ${(maxPrice - 5000) / (100000 - 5000) * 100}%, #e5e7eb ${(maxPrice - 5000) / (100000 - 5000) * 100}%)`
                      }}
                    />
                    <div
                      className="absolute -top-7 left-0 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20"
                      style={{ left: `${(maxPrice - 5000) / (100000 - 5000) * 100}%` }}
                    >
                      ₹{maxPrice}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Search Button */}
              <div className="w-full md:w-1/4 h-12">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-full bg-[#1da1f2] hover:bg-[#1a91da] text-white text-base font-semibold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" /> Searching...
                    </>
                  ) : (
                    <>
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
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
              onBookingClick={(item) => {
                setQuickViewProduct(true);
                onBookingClick?.(item);
              }}
              onClose={() => setQuickViewProduct(null)}
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
