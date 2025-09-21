'use client'
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Users, Settings, Calendar } from "lucide-react"
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [counts, setCounts] = useState({
    properties: 0,
    propertyTypes: 0,
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
          propertyTypes: 0,
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
      icon: <Home className="h-10 w-10 mb-2" />,
      description: "Manage all properties",
      link: "/admin/properties_dashboard",
      count: counts.properties,
      bgColor: "bg-orange-500",
      hoverBgColor: "hover:bg-orange-600"
    },
    {
      title: "Hotel Business",
      icon: <Users className="h-10 w-10 mb-2" />,
      description: "Manage hotel listings",
      link: "#",
      count: 18,
      bgColor: "bg-blue-500",
      hoverBgColor: "hover:bg-blue-600"
    },
    {
      title: "Pilgrimage",
      icon: <Calendar className="h-10 w-10 mb-2" />,
      description: "Manage pilgrimage services",
      link: "#",
      count: 27,
      bgColor: "bg-sky-500",
      hoverBgColor: "hover:bg-sky-600"
    },
    {
      title: "Food Chain",
      icon: <Settings className="h-10 w-10 mb-2" />,
      description: "Manage food services",
      link: "#",
      count: 15,
      bgColor: "bg-purple-500",
      hoverBgColor: "hover:bg-purple-600"
    }
  ];
  return (
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
      <div className="px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className={`${item.bgColor} text-white border-0 shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
              onClick={() => router.push(item.link)}
            >
              <Link href={item.link}>
              <CardHeader className="pb-2">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-white/20 rounded-full text-white">
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

      {/* Logout Button */}
      {/* <div className="fixed bottom-8 right-8">
        <Button 
          variant="outline" 
          className="bg-red-600 hover:bg-red-700 text-white border-red-700"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div> */}
    </div>
  );
};

export default Page;