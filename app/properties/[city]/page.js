import PropertyFilter from "@/components/Properties/PropertyFilter";

// Fetch properties based on search parameters (Reused logic from app/property/page.js)
async function fetchProperties(searchParams = {}) {
    try {
        const params = new URLSearchParams();

        // Add search parameters to the query
        const { location, propertyFor, propertyType, checkInDate, guests, q } = searchParams;

        // Assuming the API handles these parameters correctly
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
            return [];
        }

        const data = await response.json();
        return data.data?.properties || [];
    } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
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

    const properties = await fetchProperties(queryParams);

    return <PropertyFilter properties={properties} />;
}