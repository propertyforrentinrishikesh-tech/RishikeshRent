import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import CategoryAds from "@/components/CategoryAds"
import CategoryCard from "@/components/Category/category-card"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import HeroSection from "@/components/HeroSection"

import PropertyCards from "@/components/PropertyCards";
// Fetch properties based on search parameters
async function fetchProperties(searchParams = {}) {
  try {
    const params = new URLSearchParams();

    // Add search parameters to the query
    const { location, propertyFor, propertyType, checkInDate, guests, q } = searchParams;

    if (q) params.append('q', q);
    if (location) params.append('location', location);
    if (propertyFor) params.append('propertyFor', propertyFor);
    if (propertyType) params.append('propertyType', propertyType);
    if (checkInDate) params.append('checkInDate', checkInDate);
    if (guests) params.append('guests', guests);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchProperty?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const data = await response.json();
    return data.data?.properties || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

// Fetch data in parallel
export default async function PropertyPage({ searchParams }) {
  const [properties, categoryAds, allCategories] = await Promise.all([
    fetchProperties(await searchParams),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categoryAdvertisment`, { cache: 'no-store' })
      .then(res => res.json())
      .catch(() => []),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getAllMenuItems`, { cache: 'no-store' })
      .then(res => res.json())
      .catch(() => [])
  ]);
  // console.log(properties)

  const categoryAdList = Array.isArray(categoryAds) ? categoryAds : [];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Reusing the same HeroSection component */}
      <HeroSection />

      <div className="px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Sidebar - Advertisements */}
          <aside className="hidden lg:block w-full lg:w-1/4 space-y-4">
            <CategoryAds categoryAdList={categoryAdList} />
          </aside>

          {/* Main Content - Search Results */}
          <main className="flex-1">
            <PropertyCards properties={properties} />
            {/* Categories Section */}
            {allCategories.length > 0 && (
              <>
                <h2 className="text-2xl font-bold px-4 underline">Category</h2>
                <Carousel className="w-full mx-auto my-4">
                  <CarouselContent className="w-full gap-5">
                    {Array.isArray(allCategories) && allCategories.flatMap(cat =>
                      Array.isArray(cat.subMenu) ? cat.subMenu.map((sub, idx) => (
                        <CarouselItem key={`${cat._id || cat.title || idx}-${sub._id || sub.url || idx}`} className="basis-1/2 md:basis-1/4 xl:basis-1/5 min-w-0 snap-start">
                          <CategoryCard category={{
                            title: sub.title,
                            profileImage: sub.profileImage,
                            url: `/category/${sub.url}`
                          }} />
                        </CarouselItem>
                      )) : []
                    )}
                  </CarouselContent>
                  <CarouselNext className="!right-2 !top-1/2 !-translate-y-1/2 z-10 " />
                  <CarouselPrevious className="!left-1 !top-1/2 !-translate-y-1/2 z-10" />
                </Carousel>
              </>
            )}
          </main>

        </div>


      </div>
    </div>
  )
}