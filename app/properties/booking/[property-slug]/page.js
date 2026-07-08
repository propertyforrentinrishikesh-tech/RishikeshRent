import connectDB from "@/lib/connectDB";
import PropertyDetails from "@/models/Property/PropertyDetails";
import PropertyBooking from "@/components/Booking/PropertyBooking";

async function fetchPropertyBySlug(slug) {
    try {
        await connectDB();
        const property = await PropertyDetails.findOne({ propertyNameSlug: slug });
        return property ? JSON.parse(JSON.stringify(property)) : null;
    } catch (error) {
        console.error("Error fetching booking property:", error);
        return null;
    }
}

export default async function BookingPage({ params }) {
    const { "property-slug": slug } = await params;
    const property = await fetchPropertyBySlug(slug);

    if (!property) {
        return <div className="p-10 text-center">Property not found</div>;
    }

    return <PropertyBooking property={property} />;
}
