"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Menu, X } from "lucide-react";

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
import PropertyDetailEnquiry from "@/components/Admin/PropertySidebar/PropertyDetailEnquiry";
import NewArrivalBooking from "./NewArrivalBooking";
const PropertiesDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locationType, setLocationType] = useState([]);
  const [subLocationType, setSubLocationType] = useState([]);
  const [galiType, setGaliType] = useState([]);
  const [activeParent, setActiveParent] = useState("property_type");
  const [activeChild, setActiveChild] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          fetch("/api/property/propertyType"),
          fetch("/api/property/createLocation"),
          fetch("/api/property/createSubLocation"),
          fetch("/api/property/createGali"),
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
          label: "All Property",
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
         {
          key: "detail_enquiry",
          label: "Property Detail Enquiry",
          component: () => <PropertyDetailEnquiry {...sharedProps} />,
        },{
          key: "new_booking_arrival",
          label: "New Arrival Bookings",
          component: () => <NewArrivalBooking {...sharedProps} />,
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
    <div className="flex flex-col md:flex-row min-h-[85vh] relative">

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden p-4 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-lg text-slate-800">Dashboard Menu</h2>
      </div>

      {/* ================= SIDEBAR OVERLAY (Mobile) ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[200px] bg-gray-100 shadow-2xl transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-[240px] md:shadow-none md:bg-gray-200 md:h-auto md:min-h-full
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200 mb-2">
          <span className="font-bold text-lg text-slate-800">Navigation</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2 flex flex-col gap-3 overflow-y-auto h-full max-h-[calc(100vh-60px)] md:max-h-none md:h-auto">
          {sectionConfig.map(section => (
            <div key={section.key}>

              {/* Parent Button */}
              <button
                onClick={() => {
                  setActiveParent(section.key);
                  setActiveChild(null);
                  if (!section.children) setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition
                ${activeParent === section.key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white border border-black md:bg-blue-100/50 hover:bg-blue-200 text-slate-700"
                  }`}
              >
                {section.label}
              </button>

              {/* Children */}
              {section.children && activeParent === section.key && (
                <div className="ml-3 mt-2 flex flex-col gap-2 border-l-2 border-slate-200 pl-3">

                  {section.children.map(child => (
                    <button
                      key={child.key}
                      onClick={() => {
                        setActiveChild(child.key);
                        setIsSidebarOpen(false);
                      }}
                      className={`text-left px-3 py-2.5 rounded-lg text-sm font-bold transition
                      ${activeChild === child.key
                          ? "bg-green-600 text-white shadow-sm"
                          : "bg-white border border-black md:bg-green-100/50 hover:bg-green-200 font-bold hover:text-slate-900"
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

      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="flex-1 p-1 md:p-6 w-full overflow-hidden">
        <div className="bg-white rounded-2xl md:rounded-l-3xl md:rounded-r-none min-h-full">
          {renderContent()}
        </div>
      </div>

    </div>
  );
};

export default PropertiesDashboard;
