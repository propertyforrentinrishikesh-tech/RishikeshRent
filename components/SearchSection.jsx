"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, Hotel, Navigation, Star } from 'lucide-react';
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
  const [searchResults, setSearchResults] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [maxPrice, setMaxPrice] = useState(50000);
  const router = useRouter();

  // Reusable Number Input Component
  const NumberInput = ({ value, onChange, min = 1, max = 10, className = '' }) => {
    const increment = () => {
      if (value < max) onChange(value + 1);
    };

    const decrement = () => {
      if (value > min) onChange(value - 1);
    };

    return (
      <div className={`flex items-center border rounded-md overflow-hidden ${className}`}>
        <button
          type="button"
          onClick={decrement}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 focus:outline-none"
          disabled={value <= min}
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value) || min;
            onChange(Math.min(Math.max(val, min), max));
          }}
          min={min}
          max={max}
          className="w-14 text-center border-0 focus:ring-0"
        />
        <button
          type="button"
          onClick={increment}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 focus:outline-none"
          disabled={value >= max}
        >
          +
        </button>
      </div>
    );
  };

  // console.log(trendingSearches)
  // Property types for the second dropdown
  const propertyForOptions = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' }
  ];
  const accommodationType = [
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Homestay', label: 'Homestay' }
  ];
  const pilgrimType = [
    { value: 'Badrinath', label: 'Badrinath' },
    { value: 'Yamunotri', label: 'Yamunotri' }
  ]
  const yatraType = [
    { value: 'Group_Tour', label: 'Group Tour' },
    { value: 'Solo_Traveller', label: 'Solo Traveller' }
  ]
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch property types
        try {
          const propResponse = await fetch("/api/createProperty");
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
          const locResponse = await fetch("/api/createLocation");
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
          const locResponse = await fetch("/api/createPropertyDetails/getTrending");
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
      if (propertyFor) params.append('propertyFor', propertyFor);
      if (propertyType) params.append('propertyType', slugify(propertyType));
      if (maxPrice) params.append('maxPrice', maxPrice);

      if (checkInDate) {
        const formattedDate = new Date(checkInDate)
          .toISOString()
          .split('T')[0];
        params.append('checkInDate', formattedDate);
      }

      if (guestCount && guestCount > 1) {
        params.append('guests', guestCount);
      }

      // Route param (city)
      const citySlug = location ? slugify(location) : 'all';

      // Client-side navigation (BEST)
      router.push(`/properties/${citySlug}?${params.toString()}`);

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  // Handle input changes to update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'location') setLocation(value);
    if (name === 'checkInDate') setCheckInDate(value);
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    if (name === 'propertyFor') setPropertyFor(value);
    if (name === 'propertyType') setPropertyType(value);
  };

  // Add useEffect to handle initial load with URL params
  useEffect(() => {
    // Parse URL params on component mount
    const params = new URLSearchParams(window.location.search);
    if (params.get('location')) setLocation(params.get('location'));
    if (params.get('propertyFor')) setPropertyFor(params.get('propertyFor'));
    if (params.get('propertyType')) setPropertyType(params.get('propertyType'));
    if (params.get('checkInDate')) setCheckInDate(params.get('checkInDate'));
    if (params.get('guests')) setGuestCount(parseInt(params.get('guests')));
    if (params.get('maxPrice')) setMaxPrice(params.get('maxPrice'));
  }, []);

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-10">
      <div className="bg-[#64a8b1] rounded-3xl shadow-xl p-6 md:p-10 flex flex-col gap-5">
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
                  <SelectItem key={`loc-${index}`} value={loc.locationType}>
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
                  <SelectItem key={`type-${index}`} value={type.propertyType}>
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
  );
};

export default SearchSection;