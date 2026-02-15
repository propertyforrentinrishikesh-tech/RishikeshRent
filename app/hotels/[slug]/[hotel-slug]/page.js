import HotelDetails from "@/components/Hotels/HotelDetails";
import connectDB from "@/lib/connectDB";
import PropertyRegistrationModel from "@/models/PropertyRegistration";

// Fetch property data by slug
async function fetchHotelBySlug(slug) {
    try {
        await connectDB();
        const property = await PropertyRegistrationModel.findOne({ propertyNameSlug: slug });
        // Convert Mongoose document to plain POJO
        return property ? JSON.parse(JSON.stringify(property)) : null;
    } catch (error) {
        console.error("Error fetching hotel details:", error);
        return null;
    }

}

// Fetch related hotels
async function fetchRelatedHotels(locationType, propertyType, currentId) {
    try {
        await connectDB();
        const related = await PropertyRegistrationModel.find({
            locationType: locationType,
            _id: { $ne: currentId } // Exclude current property
        })
            .limit(6)
            .lean();

        return JSON.parse(JSON.stringify(related));
    } catch (error) {
        console.error("Error fetching related hotels:", error);
        return [];
    }
}

export default async function PropertyPage({ params }) {
    const { 'property-slug': slug } = await params;

    // Fetch directly from DB since we are in a server component with direct DB access 
    const hotel = await fetchHotelBySlug(slug);

    if (!hotel) {
        return <div className="p-10 text-center">Hotels not found</div>;
    }

    // Fetch related properties based on the current property's location and type
    const relatedHotels = await fetchRelatedHotels(hotel.locationType, hotel.propertyType, hotel._id);

    return <HotelDetails hotel={hotel} relatedHotels={relatedHotels} />;
}