"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, Hotel, Navigation, Star, MapPin, Banknote, Building2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import Link from 'next/link';

const SearchSection = () => {
  const [activeTab, setActiveTab] = useState('property');
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
  
  const [searchResults, setSearchResults] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
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
        //fetch Treding property
        try {
          const locResponse = await fetch("/api/property/getTrending");
          if (!locResponse.ok) {
            throw new Error(`HTTP error! status: ${locResponse.status}`);
          }
          const locData = await locResponse.json();
          // Handle both response formats
          if (Array.isArray(locData)) {
            setTrendingSearches(locData);
          } else if (locData && locData.success && Array.isArray(locData.data)) {
            setTrendingSearches(locData.data);
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
  const slugify = (text) =>
    text
      ?.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')   // spaces → -
      .replace(/[^\w-]+/g, '') // remove special chars
      .replace(/--+/g, '-');   // remove double -

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
    if (params.get('location')) setLocation(params.get('location'));
    if (params.get('propertyFor')) setPropertyFor(params.get('propertyFor'));
    if (params.get('propertyType')) setPropertyType(params.get('propertyType'));
    if (params.get('propertyCategory')) setPropertyCategory(params.get('propertyCategory'));
    if (params.get('checkInDate')) setCheckInDate(params.get('checkInDate'));
    if (params.get('guests')) setGuestCount(parseInt(params.get('guests')));
    if (params.get('maxPrice')) setMaxPrice(params.get('maxPrice'));
  }, []);

  return (
    <section className="w-full bg-slate-50 py-10">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 tracking-tight">Best Stays, Better Prices: Book Direct.</h2>
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
  );
};

export default SearchSection;