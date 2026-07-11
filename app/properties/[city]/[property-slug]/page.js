import PropertyDetail from "@/components/Properties/PropertyDetails";
import connectDB from "@/lib/connectDB";
import PropertyDetails from "@/models/Property/PropertyDetails";

// Fetch property data by slug
async function fetchPropertyBySlug(slug) {
    try {
        await connectDB();
        const property = await PropertyDetails.findOne({ propertyNameSlug: slug }).select("-contactNumbers -ownerName -emailAddresses -brokerName");
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
        const related = await PropertyDetails.find({
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

export async function generateMetadata({ params }) {
    const { 'property-slug': slug } = await params;
    const property = await fetchPropertyBySlug(slug);

    if (!property) {
        return {
            title: 'Property Not Found - Rishikesh Rent',
        };
    }

    const title = property.metaTitle || property.propertyName;
    const description = property.metaDescription || property.description || `View details for ${property.propertyName} located in ${property.locationType}.`;
    const imageUrl = property.mainImage?.url;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: imageUrl ? [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: property.propertyName,
                },
            ] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export default async function PropertyPage({ params }) {
    const { 'property-slug': slug } = await params;

    // Fetch directly from DB since we are in a server component with direct DB access 
    const property = await fetchPropertyBySlug(slug);
    // console.log(property)
    if (!property) {
        return <div className="p-10 text-center">Property not found</div>;
    }

    // Fetch related properties based on the current property's location and type
    const relatedProperties = await fetchRelatedProperties(property.locationType, property.propertyType, property._id);

    return <PropertyDetail property={property} relatedProperties={relatedProperties} />;
}