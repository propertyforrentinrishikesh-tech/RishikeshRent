import PropertyDetails from "@/components/Properties/PropertyDetails";
import connectDB from "@/lib/connectDB";
import PropertyDetailsModel from "@/models/PropertyDetails";

// Fetch property data by slug
async function fetchPropertyBySlug(slug) {
    try {
        await connectDB();
        const property = await PropertyDetailsModel.findOne({ propertyNameSlug: slug });
        // Convert Mongoose document to plain POJO
        return property ? JSON.parse(JSON.stringify(property)) : null;
    } catch (error) {
        console.error("Error fetching property details:", error);
        return null;
    }

}

// Fetch related properties
async function fetchRelatedProperties(locationType, propertyType, currentId) {
    try {
        await connectDB();
        const related = await PropertyDetailsModel.find({
            locationType: locationType,
            _id: { $ne: currentId } // Exclude current property
        })
            .limit(6)
            .lean();

        return JSON.parse(JSON.stringify(related));
    } catch (error) {
        console.error("Error fetching related properties:", error);
        return [];
    }
}

export default async function PropertyPage({ params }) {
    const { 'property-slug': slug } = await params;

    // Fetch directly from DB since we are in a server component with direct DB access 
    const property = await fetchPropertyBySlug(slug);

    if (!property) {
        return <div className="p-10 text-center">Property not found</div>;
    }

    // Fetch related properties based on the current property's location and type
    const relatedProperties = await fetchRelatedProperties(property.locationType, property.propertyType, property._id);

    return <PropertyDetails property={property} relatedProperties={relatedProperties} />;
}