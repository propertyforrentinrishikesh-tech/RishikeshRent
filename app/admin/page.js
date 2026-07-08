'use client'
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Users, Settings, Calendar } from "lucide-react"
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'

const Page = () => {
  const router = useRouter();
  const [counts, setCounts] = useState({
    properties: 0,
    propertyRegistrations: 0,
    locations: 0,
    users: 0,
    // Add more counts as needed
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/countDocuments');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch counts`);
        }

        const data = await response.json();
        setCounts(data.data || {});
      } catch (error) {
        console.error('Error fetching counts:', error);
        // Set default counts on error
        setCounts({
          properties: 0,
          propertyRegistrations: 0,
          locations: 0,
          users: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);
  const menuItems = [
    {
      title: "Properties",
      icon: (
        <div className="h-16 w-16 mb-2 relative">
          <Image
            src="/Property.jpg"
            alt="Properties"
            fill
            className="object-cover rounded-full"
          />
        </div>
      ),
      description: "Manage all properties",
      link: "/admin/property_extranet",
      count: counts.properties,
      bgColor: "bg-orange-500",
      hoverBgColor: "hover:bg-orange-600"
    },
    {
      title: "Hostel",
      icon: (
        <div className="h-16 w-16 mb-2 relative">
          <Image
            src="/Hotel.png"
            alt="Hostel"
            fill
            className="object-cover rounded-full"
          />
        </div>
      ),
      description: "Manage Hostel listings",
      link: "/admin/hostel_extranet",
      count: "0",
      bgColor: "bg-blue-500",
      hoverBgColor: "hover:bg-blue-600"
    },
    // {
    //   title: "Pilgrimage",
    //   icon: (
    //     <div className="h-16 w-16 mb-2 relative">
    //       <Image
    //         src="/Pilgrimage.jpg"
    //         alt="Pilgrimage"
    //         fill
    //         className="object-cover rounded-full"
    //       />
    //     </div>
    //   ),
    //   description: "Manage pilgrimage services",
    //   link: "#",
    //   // link: "/admin/pilgrimage_dashboard",
    //   count: 0,
    //   bgColor: "bg-sky-500",
    //   hoverBgColor: "hover:bg-sky-600"
    // },
    // {
    //   title: "Food Chain",
    //   icon: (
    //     <div className="h-16 w-16 mb-2 relative">
    //       <Image
    //         src="/FoodChain.jpg"
    //         alt="Food Chain"
    //         fill
    //         className="object-cover rounded-full"
    //       />
    //     </div>
    //   ),
    //   description: "Manage food services",
    //   link: "#",
    //   // link: "/admin/food_chain_dashboard",
    //   count: 0,
    //   bgColor: "bg-purple-500",
    //   hoverBgColor: "hover:bg-purple-600"
    // }
  ];

  return (
    <SidebarProvider className="!font-barlow">
      <AppSidebar className="py-10 bg-white" />
      <SidebarInset className="flex-1 overflow-auto">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-black sticky top-0 z-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-white hover:bg-white/10" />
          </div>
        </header>

        <div className="min-h-screen w-full bg-black text-white">
          {/* Header with Logo */}
          <header className="py-4 px-6 text-center">
            <div className="flex justify-center ">
              <div className="bg-white/10 p-2 rounded-full">
                <Image
                  src="/logo.png"
                  width={150}
                  height={150}
                  alt="Rishikesh Rent Logo"
                  className="h-24 w-24 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/64';
                  }}
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Rishikesh Rent</h1>
            <p className="text-gray-400 mt-2">Admin Dashboard</p>
          </header>

          {/* Navigation Cards */}
          <div className="px-4 py-7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-[80%] mx-auto">
              {menuItems.map((item, index) => (
                <Card
                  key={index}
                  className={`${item.bgColor} text-white border-0 shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
                  onClick={() => router.push(item.link)}
                >
                  <Link href={item.link}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col items-center text-center">
                        <div className="rounded-full text-white">
                          {item.icon}
                        </div>
                        <CardTitle className="mt-4">{item.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="mb-2">{item.description}</p>
                      <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                        {loading ? '...' : item.count} {item.title.toLowerCase()}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;