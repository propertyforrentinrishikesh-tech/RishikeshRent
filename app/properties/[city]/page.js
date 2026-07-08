import Properties from "@/components/Properties/Properties";

async function fetchProperties(searchParams) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const params = new URLSearchParams();
    params.append('limit', '12');
    
    if (searchParams?.propertyType) params.append('propertyType', searchParams.propertyType);
    if (searchParams?.locationType) params.append('locationType', searchParams.locationType);
    if (searchParams?.propertyFor) params.append('propertyFor', searchParams.propertyFor);
    if (searchParams?.maxRent) params.append('maxRent', searchParams.maxRent);
    if (searchParams?.minRent) params.append('minRent', searchParams.minRent);
    if (searchParams?.search) params.append('search', searchParams.search);

    const response = await fetch(`${baseUrl}/api/property/propertyDetails?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

async function fetchBanners() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/propertyBanner`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch banners");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

export default async function PropertyCityPage({ params, searchParams }) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams);
  
  const { city } = resolvedParams;
  const locationFilter = city === 'all' ? (resolvedSearchParams.locationType || '') : city;
  
  const queryParams = {
      ...resolvedSearchParams,
      locationType: locationFilter
  };

  const [properties, banners] = await Promise.all([
    fetchProperties(queryParams),
    fetchBanners(),
  ]);
  
  return (
    <main className="w-full bg-white">
      <Properties initialProducts={properties} banners={banners} />
    </main>
  );
}