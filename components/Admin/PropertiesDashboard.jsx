"use client"
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import CreatePropertyType from './CreatePropertyType';
import CreatePropertyDetails from './CreatePropertyDetails';
import PropertyDetails from './PropertyDetails';

const PropertiesDashboard = ({ productId }) => {
  const [loading, setLoading] = useState(true);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locationType, setLocationType] = useState([]);
  const [subLocationType, setSubLocationType] = useState([]);
  const [wardType, setWardType] = useState([]);
  const [galiType, setGaliType] = useState([]);

  // Fetch property types and locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch property types
        const propResponse = await fetch("/api/createProperty");
        const propData = await propResponse.json();
        setPropertyTypes(propData);

        // Fetch locations
        const locResponse = await fetch("/api/createLocation");
        const locData = await locResponse.json();
        setLocationType(locData);

        // Fetch sub locations
        const subLocResponse = await fetch("/api/createSubLocation");
        const subLocData = await subLocResponse.json();
        setSubLocationType(subLocData);

        // Fetch wards
        const wardResponse = await fetch("/api/createWard");
        const wardData = await wardResponse.json();
        setWardType(wardData);

        // Fetch galis
        const galiResponse = await fetch("/api/createGali");
        const galiData = await galiResponse.json();
        setGaliType(galiData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sectionConfig = [
    { 
      key: 'create_property_type', 
      label: 'Create Property Type', 
      component: (props) => <CreatePropertyType 
        propertyTypes={propertyTypes} 
        locationType={locationType} 
        subLocationType={subLocationType}
        wardType={wardType}
        galiType={galiType}
        setPropertyTypes={setPropertyTypes}
        setLocationType={setLocationType}
        setSubLocationType={setSubLocationType}
        setWardType={setWardType}
        setGaliType={setGaliType}
        {...props} 
      /> 
    },
    { 
      key: 'create_property_details', 
      label: 'Create Property Details', 
      component: (props) => <CreatePropertyDetails 
        propertyTypes={propertyTypes} 
        locationType={locationType} 
        setPropertyTypes={setPropertyTypes}
        setLocationType={setLocationType}
        {...props} 
      /> 
    },
    { 
      key: 'property_details', 
      label: 'Property Details', 
      component: (props) => <PropertyDetails 
        propertyTypes={propertyTypes} 
        locationType={locationType} 
        setPropertyTypes={setPropertyTypes}
        setLocationType={setLocationType}
        {...props} 
      /> 
    },
  ];
  
  const [activeSection, setActiveSection] = useState(sectionConfig[0].key);

  return (
    <div style={{ minHeight: '85vh', background: '#fff', padding: '20px' }}>
      {loading ? (
        <div className="text-center text-lg font-semibold">Loading properties...</div>
      ) : (
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full h-full">
          <div className="flex h-full">
            {/* Sidebar Tabs */}
            <TabsList className="flex flex-col gap-2 min-w-[220px] w-[220px] bg-gray-300 border-r border-gray-200 py-4 px-2 rounded-l-lg shadow-sm h-fit">
              {sectionConfig.map(section => (
                <TabsTrigger
                  key={section.key}
                  value={section.key}
                  className={
                    `text-base px-6 py-3 text-left rounded-lg transition-all font-medium
                    data-[state=active]:bg-blue-600 data-[state=active]:text-white
                    data-[state=inactive]:bg-blue-100 data-[state=inactive]:text-gray-900
                    hover:bg-blue-400 focus:outline-none w-full`
                  }
                  style={{ justifyContent: 'flex-start' }}
                >
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* Section Content */}
            <div className="flex-1 p-2 rounded-r-lg shadow-sm min-h-[400px]">
              {sectionConfig.map(section => (
                <TabsContent key={section.key} value={section.key} className="h-full">
                  {section.component()}
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      )}
    </div>
  );
};

export default PropertiesDashboard;