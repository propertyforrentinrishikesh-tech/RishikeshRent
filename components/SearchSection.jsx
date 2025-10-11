"use client"
import React, { useState, useEffect } from 'react';
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

  console.log(trendingSearches)
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

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add only non-empty values to the query params
      if (location) params.append('location', location);
      if (propertyFor) params.append('propertyFor', propertyFor);
      if (propertyType) params.append('propertyType', propertyType);
      if (checkInDate) {
        const formattedDate = new Date(checkInDate).toISOString().split('T')[0];
        params.append('checkInDate', formattedDate);
      }
      if (guestCount && guestCount > 1) params.append('guests', guestCount);

      // Always use window.location for navigation to avoid hook issues
      window.location.href = `/property?${params.toString()}`;

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
  }, []);

  return (
    <section className="p-5 bg-gray-100 w-[80%] mx-auto my-10 rounded-lg shadow-md border border-gray-400">
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <Tabs
          defaultValue="property"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white rounded-lg shadow-sm">
            <TabsTrigger
              value="property"
              className="flex items-center gap-2 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 border border-gray-400"
            >
              <Home className="h-4 w-4" />
              Search Property
            </TabsTrigger>
            <TabsTrigger
              value="hotel"
              className="flex items-center gap-2 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 border border-gray-400"
            >
              <Hotel className="h-4 w-4" />
              Search Hotels
            </TabsTrigger>
            <TabsTrigger
              value="homestay"
              className="flex items-center gap-2 py-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 border border-gray-400"
            >
              <Home className="h-4 w-4" />
              Home Stay
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location Select */}
                <div className="w-full">
                  <Select
                    value={location}
                    onValueChange={(value) => setLocation(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
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

                {/* Property For Select */}
                <Select
                  value={propertyFor}
                  onValueChange={(value) => setPropertyFor(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Property For" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyForOptions.map((option, index) => (
                      <SelectItem key={`for-${index}`} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Property Type Select */}
                <div className="w-full">
                  <Select
                    value={propertyType}
                    onValueChange={(value) => setPropertyType(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Property Type" />
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


                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" /> Search
                    </span>
                  )}
                </Button>
              </form>
              <div className="mt-8">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Trending Properties</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.length > 0 ? (
                    trendingSearches.map((property, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="rounded-full px-4 py-1 text-sm hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                        asChild
                      >
                        <Link href={`/properties/${property.propertyNameSlug}`}>
                          {property.propertyName}
                        </Link>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No trending properties found</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hotel">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location Select */}
                <div className="w-full">
                  <Select
                    value={location}
                    onValueChange={(value) => setLocation(value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
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

                {/* Property For Select */}
                <Select
                  value={propertyFor}
                  onValueChange={(value) => setPropertyFor(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Accommodation Be Like" />
                  </SelectTrigger>
                  <SelectContent>
                    {accommodationType.map((option, index) => (
                      <SelectItem key={`for-${index}`} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Property Type Select */}
                <div className="w-full">
                  <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                </div>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" /> Search
                    </span>
                  )}
                </Button>
              </form>
              <div className="mt-8">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Trending Properties</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.length > 0 ? (
                    trendingSearches.map((property, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="rounded-full px-4 py-1 text-sm hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                        asChild
                      >
                        <Link href={`/properties/${property.propertyNameSlug}`}>
                          {property.propertyName}
                        </Link>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No trending properties found</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="homestay">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Location Select */}
                <div className="w-full">
                  <Select
                    value={propertyType}
                    onValueChange={(value) => handleSelectChange('propertyType', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilgrimage Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {pilgrimType.map((option, index) => (
                        <SelectItem key={`pilgrim-${index}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Property For Select */}
                <div className="w-full">
                  <Select
                    value={propertyFor}
                    onValueChange={(value) => handleSelectChange('propertyFor', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Yatra Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {yatraType.map((option, index) => (
                        <SelectItem key={`yatra-${index}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Check-in Date */}
                <div className="w-full">
                  <Input 
                    type="date" 
                    name="checkInDate"
                    value={checkInDate} 
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <NumberInput
                    value={guestCount}
                    onChange={setGuestCount}
                    min={1}
                    max={20}
                    className=""
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" /> Search Packages
                    </span>
                  )}
                </Button>
              </form>
              <div className="mt-8">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold">Trending Properties</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.length > 0 ? (
                    trendingSearches.map((property, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="rounded-full px-4 py-1 text-sm hover:bg-blue-50 hover:text-blue-600 border-gray-200"
                        asChild
                      >
                        <Link href={`/properties/${property.propertyNameSlug}`}>
                          {property.propertyName}
                        </Link>
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No trending properties found</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SearchSection;