"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// ===== IMPORT YOUR COMPONENTS =====
import PropertyType from "@/components/Admin/PropertySidebar/PropertyType";
// import CreatePropertyDetails from "@/CreatePropertyDetails";
import PropertyDetails from "@/components/Admin/PropertySidebar/PropertyDetails";
import CreateLocation from "@/components/Admin/PropertySidebar/CreateLocation";
import CreateSubLocation from "@/components/Admin/PropertySidebar/CreateSubLocation";
import CreateGali from "@/components/Admin/PropertySidebar/CreateGali";
import AllProperties from "@/components/Admin/PropertySidebar/AllProperties";
import TotalPropertyType from "@/components/Admin/PropertySidebar/TotalPropertyType";
import SearchProperty from "@/components/Admin/PropertySidebar/SearchProperty";
import PropertyEnquiry from "@/components/Admin/PropertySidebar/PropertyEnquiry";

const PropertiesDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locationType, setLocationType] = useState([]);
  const [subLocationType, setSubLocationType] = useState([]);
  const [galiType, setGaliType] = useState([]);

  const [activeParent, setActiveParent] = useState("property_type");
  const [activeChild, setActiveChild] = useState(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          propResponse,
          locResponse,
          subLocResponse,
          galiResponse,
        ] = await Promise.all([
          fetch("/api/hotels/propertyType"),
          fetch("/api/hotels/createLocation"),
          fetch("/api/hotels/createSubLocation"),
          fetch("/api/hotels/createGali"),
        ]);

        const [
          propData,
          locData,
          subLocData,
          galiData,
        ] = await Promise.all([
          propResponse.json(),
          locResponse.json(),
          subLocResponse.json(),
          galiResponse.json(),
        ]);

        setPropertyTypes(propData);
        setLocationType(locData);
        setSubLocationType(subLocData);
        setGaliType(galiData);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= SHARED PROPS =================
  const sharedProps = {
    propertyTypes,
    locationType,
    subLocationType,
    galiType,
    setPropertyTypes,
    setLocationType,
    setSubLocationType,
    setGaliType,
  };

  // ================= SIDEBAR CONFIG =================
  const sectionConfig = [
    {
      key: "property_type",
      label: "Create Property Type",
      component: () => <PropertyType {...sharedProps} />,
    },

    {
      key: "location",
      label: "Create New Location",
      children: [
        {
          key: "create_location",
          label: "Create New Location",
          component: () => <CreateLocation {...sharedProps} />,
        },
        {
          key: "sub_location",
          label: "Add Sub Location",
          component: () => <CreateSubLocation {...sharedProps} />,
        },
        {
          key: "gali",
          label: "Add Gali / Mohalla",
          component: () => <CreateGali {...sharedProps} />,
        },
      ],
    },

    {
      key: "create_property_details",
      label: "Create Property Details",
      component: () => <PropertyDetails {...sharedProps} />,
    },

    {
      key: "property",
      label: "Property Details",
      children: [
        {
          key: "all_property",
          label: "Total Property Type",
          component: () => <AllProperties {...sharedProps} />,
        },
        {
          key: "available",
          label: "Total Property Type",
          component: () => <TotalPropertyType {...sharedProps} />,
        },
        {
          key: "search",
          label: "Search Property",
          component: () => <SearchProperty {...sharedProps} />,
        },
        {
          key: "enquiry",
          label: "Property Enquiry",
          component: () => <PropertyEnquiry {...sharedProps} />,
        },
      ],
    },
  ];

  // ================= RENDER ACTIVE COMPONENT =================
  const renderContent = () => {
    const parent = sectionConfig.find(sec => sec.key === activeParent);

    if (!parent) return null;

    if (!parent.children) return parent.component();

    const child = parent.children.find(c => c.key === activeChild);
    if (child) return child.component();

    return (
      <div className="text-gray-500 text-lg font-semibold text-center mt-10">
        Select a sub section
      </div>
    );
  };

  // ================= LOADING =================
  if (loading)
    return (
      <div className="text-center text-xl font-bold mt-20">
        Loading dashboard...
      </div>
    );

  // ================= UI =================
  return (
    <div className="flex min-h-[85vh]">

      {/* ================= SIDEBAR ================= */}
      <div className="w-[260px] bg-gray-200 h-fit p-3 flex flex-col gap-3">

        {sectionConfig.map(section => (
          <div key={section.key}>

            {/* Parent Button */}
            <button
              onClick={() => {
                setActiveParent(section.key);
                setActiveChild(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition
              ${
                activeParent === section.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-blue-100 hover:bg-blue-300"
              }`}
            >
              {section.label}
            </button>

            {/* Children */}
            {section.children && activeParent === section.key && (
              <div className="ml-3 mt-2 flex flex-col gap-2">

                {section.children.map(child => (
                  <button
                    key={child.key}
                    onClick={() => setActiveChild(child.key)}
                    className={`text-left px-3 py-2 rounded-lg transition
                    ${
                      activeChild === child.key
                        ? "bg-green-600 text-white"
                        : "bg-green-100 hover:bg-green-300"
                    }`}
                  >
                    {child.label}
                  </button>
                ))}

              </div>
            )}

          </div>
        ))}

      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="flex-1 p-5 rounded-l-3xl">
        {renderContent()}
      </div>

    </div>
  );
};

export default PropertiesDashboard;
