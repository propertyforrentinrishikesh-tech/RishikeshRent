'use client'
import { useRouter } from 'next/navigation';
import {
  Building2, Home, Users, LayoutDashboard, Settings, Compass, Megaphone,
  Image as ImageIcon, MapPin, Search, ListTodo, Check, User, Sparkles, ArrowUpRight,
  UserCog, History, ChevronRight, Menu, Network, Boxes, Images, Smartphone,
  FileText, Newspaper, HelpCircle, Globe, Inbox, MessageCircle, Mail, Bell,
  Star, Package, Tag, Briefcase, Share2, FilePlus, TrendingUp, MessageSquare, StickyNote, BarChart
} from "lucide-react"
import Image from 'next/image';
import Link from "next/link";
import { useEffect, useState, useRef } from 'react';
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useSession } from "next-auth/react"

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [counts, setCounts] = useState({
    properties: 0,
    hostels: 0,
    propertyRegistrations: 0,
    newArrivals: 0,
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

  return (
    <SidebarProvider className="!font-barlow">
      <AppSidebar className="py-10 bg-white" />
      <SidebarInset className="flex-1 overflow-auto bg-slate-50 text-slate-900 font-inter">
        <div className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-900 font-inter !font-barlow">

          {/* TopNavBar Replacement */}
          <header className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1440px] mx-auto h-16">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1 text-slate-600 hover:bg-slate-100" />

                <span className="text-xl font-bold text-slate-900">CommandCenter</span>
              </div>
              {/* <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                  <Image
                    src={session?.user?.image || "/user.png"}
                    alt="Admin Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div> */}
            </div>
          </header>

          <main className="pt-8 pb-12 px-4 md:px-8 max-w-[1440px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Hero Section */}
            <section className="bg-[#0f172a] rounded-[24px] min-h-[280px] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-xl">
              {/* <HeroShader /> */}
              <div className="relative z-10 space-y-6 text-left max-w-2xl w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-[14px] h-[14px]" />
                  Central Command
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Welcome back, {adminName}.</h1>
                  <p className="text-lg text-white/70 mt-4 leading-relaxed">
                    A live operating dashboard for the main platform. Track listed properties, user registrations, and configure global platform settings. This view is built to give the head admin a quick read on overall system health.
                  </p>
                </div>
              </div>
              <div className="relative z-10 grid grid-cols-2 md:grid-cols-2 gap-4 items-center shrink-0 w-full md:w-auto">
                <Link href="/admin/property_extranet" className="px-6 py-3 bg-white text-slate-900 font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-white/90 transition-colors shadow-lg active:scale-95 w-full md:w-auto">
                  Properties
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/admin/hostel_extranet" className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors active:scale-95 w-full md:w-auto">
                  Hostels
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/admin/property_dashboard" className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors active:scale-95 w-full md:w-auto">
                  New Arrival Bookings
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            {/* Analytics Grid */}
            <section className="space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">System counts and quick metrics</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Stat Card 1: Dark Blue */}
                <div className="bg-[#1e293b] rounded-3xl p-8 relative overflow-hidden group shadow-lg cursor-pointer" onClick={() => router.push('/admin/property_extranet')}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="text-white/60 text-xs font-bold uppercase tracking-wider">Total Properties</div>
                      <div className="text-5xl font-bold text-white">{loading ? "..." : formatNumber(counts.properties)}</div>
                      <div className="text-white/40 text-xs">All property records in the system</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Stat Card 2: Bright Blue */}
                <div className="bg-[#3b82f6] rounded-3xl p-8 relative overflow-hidden group shadow-lg cursor-pointer" onClick={() => router.push('/admin/hostel_extranet')}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="text-white/80 text-xs font-bold uppercase tracking-wider">Total Hostels</div>
                      <div className="text-5xl font-bold text-white">{loading ? "..." : formatNumber(counts.hostels)}</div>
                      <div className="text-white/60 text-xs">All hostel listings live right now</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Stat Card 3: Emerald Green */}
                <div className="bg-[#10b981] rounded-3xl p-8 relative overflow-hidden group shadow-lg cursor-pointer" onClick={() => router.push('/admin/property_dashboard')}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="text-white/80 text-xs font-bold uppercase tracking-wider">New Arrival Booking Enquiries</div>
                      <div className="text-5xl font-bold text-white">{loading ? "..." : formatNumber(counts.newArrivals)}</div>
                      <div className="text-white/60 text-xs">New property registrations awaiting action</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                </div>

              </div>
              {/* Secondary Stats Row */}
              {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-2">
                <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Blogs</div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">News</div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">FAQs</div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Webpages</div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Admins</div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
                </div>
              </div> */}

              {/* Secondary Stats Row */}
              {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-2">
              <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Blogs</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">News</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">FAQs</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Webpages</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 group shadow-sm">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Admins</div>
                <div className="text-3xl font-bold text-slate-900 mt-2">...</div>
              </div>
            </div> */}
            </section>

            {/* Module Sections */}
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
              <h2 className="text-xl font-semibold text-slate-900 border-l-4 border-slate-900 pl-4">Platform Administration</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div onClick={() => router.push('/admin/company_basic_information')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-start gap-6 bg-blue-50/50 hover:bg-blue-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <Building2 className="w-8 h-8 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Company Info</div>
                    <div className="text-sm text-slate-500 mt-1">Identity and core assets.</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 self-center" />
                </div>

                <div onClick={() => router.push('/admin/create_user')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-start gap-6 bg-blue-50/50 hover:bg-blue-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <UserCog className="w-8 h-8 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Manage Admins</div>
                    <div className="text-sm text-slate-500 mt-1">User roles and permissions.</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 self-center" />
                </div>

                <div onClick={() => router.push('/admin/user_login_logs')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-start gap-6 bg-blue-50/50 hover:bg-blue-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <History className="w-8 h-8 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Login Logs</div>
                    <div className="text-sm text-slate-500 mt-1">Security audit trails.</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 self-center" />
                </div>

              </div>
            </section>

            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
              <h2 className="text-xl font-semibold text-slate-900 border-l-4 border-slate-900 pl-4">Navigation Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div onClick={() => router.push('/admin/navbar_section')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex flex-col gap-4 bg-emerald-50/50 hover:bg-emerald-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <Menu className="w-8 h-8 text-emerald-700" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Navbar</div>
                    <div className="text-sm text-slate-500 mt-1">Top-level site navigation.</div>
                  </div>
                  <div className="flex justify-end"><ChevronRight className="w-5 h-5 text-slate-400" /></div>
                </div>
              </div>
            </section>

            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              <h2 className="text-xl font-semibold text-slate-900 border-l-4 border-slate-900 pl-4">Banner Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div onClick={() => router.push('/admin/top_advertisment_banner')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-indigo-50/50 hover:bg-indigo-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Images className="w-8 h-8 text-indigo-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Top Banner</div>
                </div>

                <div onClick={() => router.push('/admin/promotional_banner')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-indigo-50/50 hover:bg-indigo-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Megaphone className="w-8 h-8 text-indigo-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Promotional</div>
                </div>

                <div onClick={() => router.push('/admin/change_banner_image')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-indigo-50/50 hover:bg-indigo-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Home className="w-8 h-8 text-indigo-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Hero Section Banner</div>
                </div>

                <div onClick={() => router.push('/admin/popup_banner')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-indigo-50/50 hover:bg-indigo-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Smartphone className="w-8 h-8 text-indigo-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Popup Banner</div>
                </div>

                <div onClick={() => router.push('/admin/featured_offered_banner')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-purple-50/50 hover:bg-purple-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Star className="w-8 h-8 text-purple-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Featured Offer</div>
                </div>
                <div onClick={() => router.push('/admin/offer_details')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-purple-50/50 hover:bg-purple-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Star className="w-8 h-8 text-purple-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Offer Details</div>
                </div>
                <div onClick={() => router.push('/admin/manage_featured_packages')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-purple-50/50 hover:bg-purple-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Package className="w-8 h-8 text-purple-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Featured Product</div>
                </div>

                <div onClick={() => router.push('/admin/category_advertisment')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-indigo-50/50 hover:bg-indigo-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Tag className="w-8 h-8 text-indigo-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Category Ad</div>
                </div>

                <div onClick={() => router.push('/admin/consultancy_banner')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-indigo-50/50 hover:bg-indigo-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <Briefcase className="w-8 h-8 text-indigo-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Consultancy Banner</div>
                </div>

                <div onClick={() => router.push('/admin/banner_section_1st')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-slate-50 hover:bg-slate-100 transition-all hover:shadow-md hover:-translate-y-1">
                  <Images className="w-8 h-8 text-slate-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Banner Sec 1</div>
                </div>

                <div onClick={() => router.push('/admin/banner_section_2nd')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-slate-50 hover:bg-slate-100 transition-all hover:shadow-md hover:-translate-y-1">
                  <Images className="w-8 h-8 text-slate-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Banner Sec 2</div>
                </div>

                <div onClick={() => router.push('/admin/banner_section_3rd')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-4 bg-slate-50 hover:bg-slate-100 transition-all hover:shadow-md hover:-translate-y-1">
                  <Images className="w-8 h-8 text-slate-600" />
                  <div className="flex-1 text-sm font-semibold text-slate-900">Banner Sec 3</div>
                </div>

              </div>
            </section>

            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
              <h2 className="text-xl font-semibold text-slate-900 border-l-4 border-slate-900 pl-4">Content Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div onClick={() => router.push('/admin/manage_blogs')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer bg-red-50/50 hover:bg-red-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <FileText className="w-8 h-8 mb-4 text-red-600" />
                  <div className="text-lg font-semibold text-slate-900">Blogs</div>
                  <div className="text-sm text-slate-500 mt-1">Manage editorial articles.</div>
                </div>

                <div onClick={() => router.push('/admin/news')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer bg-red-50/50 hover:bg-red-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <Newspaper className="w-8 h-8 mb-4 text-red-600" />
                  <div className="text-lg font-semibold text-slate-900">News</div>
                  <div className="text-sm text-slate-500 mt-1">Press releases & updates.</div>
                </div>

                <div onClick={() => router.push('/admin/faq')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer bg-red-50/50 hover:bg-red-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <HelpCircle className="w-8 h-8 mb-4 text-red-600" />
                  <div className="text-lg font-semibold text-slate-900">FAQ</div>
                  <div className="text-sm text-slate-500 mt-1">Help center resources.</div>
                </div>
                <div onClick={() => router.push('/admin/create_webpage')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer bg-orange-50/50 hover:bg-orange-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <FilePlus className="w-8 h-8 mb-4 text-orange-600" />
                  <div className="text-lg font-semibold text-slate-900">Create Webpage</div>
                  <div className="text-sm text-slate-500 mt-1">Build a new static page.</div>
                </div>

                <div onClick={() => router.push('/admin/manage_webpage')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer bg-red-50/50 hover:bg-red-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <Globe className="w-8 h-8 mb-4 text-red-600" />
                  <div className="text-lg font-semibold text-slate-900">Webpages</div>
                  <div className="text-sm text-slate-500 mt-1">Manage existing pages.</div>
                </div>


              </div>
            </section>

            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
              <h2 className="text-xl font-semibold text-slate-900 border-l-4 border-slate-900 pl-4">Communication</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div onClick={() => router.push('/admin/contact_page_enquiry')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-6 bg-sky-50/50 hover:bg-sky-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="p-4 bg-sky-100 text-sky-700 rounded-xl">
                    <Inbox className="w-6 h-6 text-sky-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Contact Enquiries</div>
                  </div>
                </div>

                <div onClick={() => router.push('/admin/chat')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-6 bg-sky-50/50 hover:bg-sky-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="p-4 bg-sky-100 text-sky-700 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-sky-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Live Chat</div>
                  </div>
                </div>

                <div onClick={() => router.push('/admin/send_promotional_emails')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-center gap-6 bg-sky-50/50 hover:bg-sky-50 transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="p-4 bg-sky-100 text-sky-700 rounded-xl">
                    <Mail className="w-6 h-6 text-sky-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Promo Emails</div>
                  </div>
                </div>

              </div>
            </section>


            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
              <h2 className="text-xl font-semibold text-slate-900 border-l-4 border-slate-900 pl-4">Social & Marketing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div onClick={() => router.push('/admin/insta_fb_post')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex flex-col gap-4 bg-pink-50/50 hover:bg-pink-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <Share2 className="w-8 h-8 text-pink-600" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Social Posts</div>
                    <div className="text-sm text-slate-500 mt-1">Manage Insta/FB posts.</div>
                  </div>
                  <div className="flex justify-end"><ChevronRight className="w-5 h-5 text-slate-400" /></div>
                </div>
              </div>
            </section>

            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
              <h2 className="text-xl font-semibold text-slate-900 border-l-4 border-slate-900 pl-4">Manager Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                <div onClick={() => router.push('/admin/sales_section')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-start gap-6 bg-amber-50/50 hover:bg-amber-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <BarChart className="w-8 h-8 text-amber-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Sales Section</div>
                    <div className="text-sm text-slate-500 mt-1">Monitor sales and revenue.</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 self-center" />
                </div>

                <div onClick={() => router.push('/admin/manager_enquiry_chat')} className="border border-slate-200 rounded-3xl p-6 cursor-pointer flex items-start gap-6 bg-amber-50/50 hover:bg-amber-50 transition-all hover:shadow-lg hover:-translate-y-1">
                  <MessageSquare className="w-8 h-8 text-amber-600 mt-1" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-slate-900">Manager Chat</div>
                    <div className="text-sm text-slate-500 mt-1">Handle manager-level enquiries.</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 self-center" />
                </div>

              </div>
            </section>

          </main>
        </div>
      </SidebarInset>
    </SidebarProvider >
  );
};

export default Page;