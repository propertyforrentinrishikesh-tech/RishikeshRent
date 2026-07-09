'use client'
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Building2, Home, Users, LayoutDashboard, Settings, Compass, Megaphone, Image as ImageIcon, MapPin, Search, ListTodo, Check, User, Sparkles, ArrowUpRight } from "lucide-react"
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));

const StatCard = ({ title, value, description, icon, tone, accent, onClick }) => (
  <Card 
    className={`border-0 shadow-lg ${tone} text-white overflow-hidden relative cursor-pointer group`}
    onClick={onClick}
  >
    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${accent} transition-transform duration-500 group-hover:scale-110`} />
    <CardContent className="relative p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/70">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold leading-none">{value}</h3>
          <p className="mt-2 text-sm text-white/80">{description}</p>
        </div>
        <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="flex items-start justify-between gap-4 mb-4">
    <div>
      <div className="flex items-center gap-2 text-slate-900">
        <span className="rounded-xl bg-slate-900 text-white p-2">{icon}</span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [counts, setCounts] = useState({
    properties: 0,
    hostels: 0,
    propertyRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/countDocuments');
        if (!response.ok) throw new Error('Failed to fetch counts');
        const data = await response.json();
        setCounts(data.data || {});
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const adminName = session?.user?.name || "Admin";
  const adminEmail = session?.user?.email || "admin@rishikeshrent.com";

  return (
    <SidebarProvider className="!font-barlow">
      <AppSidebar className="py-10 bg-white" />
      <SidebarInset className="flex-1 overflow-auto bg-slate-50">
        
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/50 backdrop-blur-md sticky top-0 z-20 px-4">
          <SidebarTrigger className="-ml-1 text-slate-600 hover:bg-slate-100" />
          <div className="flex-1 flex items-center justify-between">
            <h1 className="font-semibold text-slate-900 tracking-tight">Main Dashboard</h1>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_52%,_#f8fafc_100%)] p-4 md:p-6 lg:p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

            <div className="relative z-10 space-y-6">
              
              {/* Dark Hero Card exactly like PropertyExtranet */}
              <div className="rounded-[1.75rem] bg-slate-950 text-white p-6 md:p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.28),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.22),_transparent_30%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-white p-2 shadow-xl shrink-0 hidden sm:block">
                      <Image src="/logo.png" width={80} height={80} alt="Logo" className="h-full w-full object-contain" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase text-white/80">
                        <Sparkles className="h-3.5 w-3.5" />
                        Central Command
                      </div>
                      <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight">
                        Welcome back, {adminName}.
                      </h1>
                      <p className="mt-4 max-w-2xl text-sm md:text-base text-white/75 leading-7">
                        A live operating dashboard for the main platform. Track listed properties, user registrations, and configure global platform settings. This view is built to give the head admin a quick read on overall system health.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                    <Button asChild className="bg-white text-slate-950 hover:bg-slate-100 rounded-2xl h-12">
                      <Link href="/admin/property_extranet">
                        Properties
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-white/15 text-white bg-white/5 hover:bg-white/10 rounded-2xl h-12">
                      <Link href="/admin/hostel_extranet">
                        Hostels
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Title row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Global Overview</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">System counts and quick metrics</p>
                </div>
              </div>

              {/* StatCards identical to the extranet style */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard
                  title="Total Properties"
                  value={loading ? "..." : formatNumber(counts.properties)}
                  description="All property records in the system"
                  icon={<Building2 className="h-6 w-6" />}
                  tone="bg-gradient-to-br from-slate-900 to-slate-700"
                  accent="from-blue-500/40 to-cyan-400/10"
                  onClick={() => router.push("/admin/property_extranet")}
                />
                <StatCard
                  title="Total Hostels"
                  value={loading ? "..." : "0"}
                  description="All hostel listings live right now"
                  icon={<Home className="h-6 w-6" />}
                  tone="bg-gradient-to-br from-blue-600 to-sky-500"
                  accent="from-white/20 to-white/5"
                  onClick={() => router.push("/admin/hostel_extranet")}
                />
                <StatCard
                  title="Partner Leads"
                  value={loading ? "..." : formatNumber(counts.propertyRegistrations)}
                  description="New property registrations awaiting action"
                  icon={<Users className="h-6 w-6" />}
                  tone="bg-gradient-to-br from-emerald-600 to-teal-500"
                  accent="from-white/20 to-white/5"
                  onClick={() => router.push("/admin/partner_queries")}
                />
              </div>

              {/* Modules section in extranet Card style */}
              <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
                <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur">
                  <CardHeader className="pb-3">
                    <SectionTitle
                      icon={<LayoutDashboard className="h-5 w-5" />}
                      title="Platform Modules"
                      subtitle="Quick access to essential configuration modules."
                    />
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
                    
                    {/* Banner Manager */}
                    <div onClick={() => router.push('/admin/change_banner_image')} className="cursor-pointer group rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 hover:shadow-md transition">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Media</p>
                        <ImageIcon className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="mt-2 text-lg font-semibold text-slate-900">Banner Manager</p>
                      <p className="mt-1 text-sm text-slate-500">Update homepage & promotional banners</p>
                    </div>

                    {/* Menu Config */}
                    <div onClick={() => router.push('/admin/navbar_section')} className="cursor-pointer group rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 hover:shadow-md transition">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Navigation</p>
                        <ListTodo className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="mt-2 text-lg font-semibold text-slate-900">Menu Configuration</p>
                      <p className="mt-1 text-sm text-slate-500">Manage navbars and site menus</p>
                    </div>

                    {/* Quick actions row */}
                    <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-sm text-slate-500">Quick actions</p>
                          <p className="mt-1 font-semibold text-slate-900">Move straight to the operational areas</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" className="rounded-full">
                            <Link href="/admin/company_basic_information">Company Info</Link>
                          </Button>
                          <Button asChild variant="outline" className="rounded-full">
                            <Link href="/admin/manage_packages_category">Categories</Link>
                          </Button>
                          <Button asChild className="rounded-full bg-slate-900 hover:bg-slate-800 text-white">
                            <Link href="/admin/create_user">Manage Admins</Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur">
                  <CardHeader className="pb-3">
                    <SectionTitle
                      icon={<Settings className="h-5 w-5" />}
                      title="System Information"
                      subtitle="Details about the platform status."
                    />
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Platform Status</span>
                        <span className="text-emerald-500 font-semibold flex items-center gap-1"><Check className="w-4 h-4" /> Healthy</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500 w-full" />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-950 text-white p-4 mt-6">
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <User className="h-4 w-4" />
                        Active Session
                      </div>
                      <p className="mt-2 text-xl font-semibold break-all">{adminEmail}</p>
                      <p className="mt-1 text-sm text-white/70">Logged in as {adminName}. You have full access to platform configurations.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>

      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;