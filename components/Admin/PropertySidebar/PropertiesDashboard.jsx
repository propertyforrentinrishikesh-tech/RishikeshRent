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
  const [activeParent, setActiveParent] = useState("new_booking_arrival");
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

  const [editingProperty, setEditingProperty] = useState(null);

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
    type: "property",
    editingProperty,
    setEditingProperty,
    setActiveParent,
    setActiveChild,
  };

  // ================= SIDEBAR CONFIG =================
  const sectionConfig = [
    {
      key: "new_booking_arrival",
      label: "New Arrival Bookings",
      component: () => <NewArrivalBooking {...sharedProps} />,
    },
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
    <div className="flex flex-col md:flex-row min-h-[85vh] relative bg-slate-50/50">

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors border border-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-lg text-slate-800">Dashboard Menu</h2>
      </div>

      {/* ================= SIDEBAR OVERLAY (Mobile) ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[260px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-r border-slate-200
        md:relative md:translate-x-0 md:w-[280px] md:shadow-none md:h-auto md:min-h-full
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-5 md:hidden border-b border-slate-100 mb-2">
          <span className="font-bold text-lg text-slate-800">Navigation</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col overflow-y-auto h-full max-h-[calc(100vh-70px)] md:max-h-[calc(100vh-40px)] custom-scrollbar gap-2">
          {sectionConfig.map(section => (
            <div key={section.key} className="flex flex-col gap-1">

              {/* Parent Button */}
              <button
                onClick={() => {
                  setActiveParent(section.key);
                  setActiveChild(null);
                  if (!section.children) setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-semibold border-2 border-slate-300 transition-all duration-200
                ${activeParent === section.key
                    ? "bg-slate-900 text-white shadow-md shadow-slate-200/50"
                    : "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
              >
                {section.label}
              </button>

              {/* Children */}
              {section.children && activeParent === section.key && (
                <div className="mt-1 mb-2 flex flex-col gap-1.5 border-l-2 border-slate-100 py-1 relative">

                  {section.children.map(child => (
                    <button
                      key={child.key}
                      onClick={() => {
                        setActiveChild(child.key);
                        setIsSidebarOpen(false);
                      }}
                      className={`text-left px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 relative group gap-2
                      ${activeChild === child.key
                          ? "bg-orange-400 text-white shadow-sm border border-blue-100/50"
                          : "bg-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-800 border border-transparent"
                        }`}
                    >
                      {/* Active indicator dot */}
                      {activeChild === child.key && (
                        <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white" />
                      )}
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
      <div className="flex-1 p-1 w-full overflow-hidden max-w-[calc(100vw-280px)] md:max-w-none">
        <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 min-h-[80vh] overflow-hidden">
          {renderContent()}
        </div>
      </div>

    </div>
  );
};

export default PropertiesDashboard;
