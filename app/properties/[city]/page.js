import PropertyFilter from "@/components/Properties/PropertyFilter";

// Fetch properties based on search parameters (Reused logic from app/property/page.js)
async function fetchProperties(searchParams = {}) {
    try {
        const params = new URLSearchParams();

        // Add search parameters to the query
        const { location, propertyFor, propertyType, checkInDate, guests, q, page = 1 } = searchParams;

        // Assuming the API handles these parameters correctly
        params.append('fetchAll', 'true');
        params.append('page', page);
        params.append('limit', '15');

        if (q) params.append('q', q);
        if (location) params.append('location', location);
        if (propertyFor) params.append('propertyFor', propertyFor);
        if (propertyType) params.append('propertyType', propertyType);
        if (checkInDate) params.append('checkInDate', checkInDate);
        if (guests) params.append('guests', guests);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/searchProperty?${params.toString()}`,
            { cache: "no-store" } // Ensure fresh data
        );

        if (!response.ok) {
            console.warn("Failed to fetch properties in [city] page");
            return { properties: [], hasMore: false, total: 0 };
        }

        const data = await response.json();
        return {
            properties: data.data?.properties || [],
            hasMore: data.data?.hasMore || false,
            total: data.data?.total || 0
        };
    } catch (error) {
        console.error("Error fetching properties:", error);
        return { properties: [], hasMore: false, total: 0 };
    }
}

export default async function PropertyCityPage({ params, searchParams }) {
    const { city } = await params;
    const resolvedSearchParams = await searchParams;

    // If "city" is "all", we might not filter by location, or filter by nothing.
    // Otherwise, we use "city" as the location filter.
    const locationFilter = city === 'all' ? (resolvedSearchParams.location || '') : city;

    const queryParams = {
        ...resolvedSearchParams,
        location: locationFilter
    };

    const { properties, hasMore, total } = await fetchProperties(queryParams);

    return <PropertyFilter initialProperties={properties} initialHasMore={hasMore} totalCount={total} searchParams={queryParams} />;
}