"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarCheck2,
  Clock3,
  Eye,
  LayoutDashboard,
  MessageSquare,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));

const StatCard = ({ title, value, description, icon, tone, accent }) => (
  <Card className={`border-0 shadow-lg ${tone} text-white overflow-hidden relative`}>
    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${accent}`} />
    <CardContent className="relative p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/70">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold leading-none">{value}</h3>
          <p className="mt-2 text-sm text-white/80">{description}</p>
        </div>
        <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatusBadge = ({ label, active }) => (
  <Badge
    className={active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"}
  >
    {label}
  </Badge>
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

const PropertyExtranet = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/property/extranet-summary");
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load property dashboard");
      }

      setData(json.data);
    } catch (error) {
      console.error("Property extranet summary error:", error);
      toast.error(error.message || "Failed to load property dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const summary = data?.summary || {};
  const totalPortfolioValue = (data?.recentProperties || []).reduce(
    (acc, property) => acc + Number(property.rentPrice || 0),
    0
  );

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_52%,_#f8fafc_100%)] p-4 md:p-6 lg:p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 space-y-6">
        <div className="rounded-[1.75rem] bg-slate-950 text-white p-6 md:p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.28),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.22),_transparent_30%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase text-white/80">
                <Sparkles className="h-3.5 w-3.5" />
                Property Extranet
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-semibold leading-tight">
                A live operating dashboard for your property portfolio.
              </h1>
              <p className="mt-4 max-w-2xl text-sm md:text-base text-white/75 leading-7">
                Track how many properties are live, how many enquiries are coming in, and how many bookings are moving through the system. This view is built to give admins a quick read on portfolio health.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <Button asChild className="bg-white text-slate-950 hover:bg-slate-100 rounded-2xl h-12">
                <Link href="/admin/property_dashboard">
                  Dashboard
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/15 text-white bg-white/5 hover:bg-white/10 hover:text-white rounded-2xl h-12">
                <Link href="/admin/property_booking">
                  Bookings
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Portfolio snapshot</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">Current counts and recent activity</p>
          </div>
          <Button variant="outline" onClick={fetchSummary} className="rounded-full gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Properties"
            value={loading ? "..." : formatNumber(summary.totalProperties)}
            description="All property records in the system"
            icon={<Building2 className="h-6 w-6" />}
            tone="bg-gradient-to-br from-slate-900 to-slate-700"
            accent="from-blue-500/40 to-cyan-400/10"
          />
          <StatCard
            title="Total Enquiries"
            value={loading ? "..." : formatNumber(summary.totalEnquiries)}
            description={`${formatNumber(summary.newEnquiries)} new enquiries awaiting follow-up`}
            icon={<MessageSquare className="h-6 w-6" />}
            tone="bg-gradient-to-br from-blue-600 to-sky-500"
            accent="from-white/20 to-white/5"
          />
          <StatCard
            title="Total Bookings"
            value={loading ? "..." : formatNumber(summary.totalBookings)}
            description={`${formatNumber(summary.paidBookings)} paid and ${formatNumber(summary.pendingBookings)} pending`}
            icon={<CalendarCheck2 className="h-6 w-6" />}
            tone="bg-gradient-to-br from-emerald-600 to-teal-500"
            accent="from-white/20 to-white/5"
          />
          <StatCard
            title="Active Portfolio"
            value={loading ? "..." : `${formatNumber(summary.activeProperties)} / ${formatNumber(summary.totalProperties)}`}
            description={`${formatNumber(summary.trendingProperties)} trending listings live right now`}
            icon={<BadgeCheck className="h-6 w-6" />}
            tone="bg-gradient-to-br from-amber-500 to-orange-500"
            accent="from-white/20 to-white/5"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
          <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur">
            <CardHeader className="pb-3">
              <SectionTitle
                icon={<LayoutDashboard className="h-5 w-5" />}
                title="Portfolio Pulse"
                subtitle="A quick read on occupancy and demand across the property stack."
              />
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Recent property value</p>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">₹{formatNumber(totalPortfolioValue)}</p>
                <p className="mt-1 text-sm text-slate-500">Total rent price from the latest properties shown below</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Operational focus</p>
                  <Clock3 className="h-4 w-4 text-blue-600" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(summary.newEnquiries)} new leads</p>
                <p className="mt-1 text-sm text-slate-500">Prioritize outreach and follow up to convert fresh interest</p>
              </div>

              <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm text-slate-500">Quick actions</p>
                    <p className="mt-1 font-semibold text-slate-900">Move straight to the operational areas</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/admin/property_banner">Banners</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/admin/property_dashboard">Manage Properties</Link>
                    </Button>
                    <Button asChild className="rounded-full bg-slate-900 hover:bg-slate-800">
                      <Link href="/admin/property_booking">View Bookings</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur">
            <CardHeader className="pb-3">
              <SectionTitle
                icon={<Eye className="h-5 w-5" />}
                title="Status Overview"
                subtitle="The most important numbers at a glance."
              />
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {[
                { label: "Properties active", value: summary.activeProperties, total: summary.totalProperties, color: "bg-emerald-500" },
                { label: "New enquiries", value: summary.newEnquiries, total: summary.totalEnquiries, color: "bg-blue-500" },
                { label: "Paid bookings", value: summary.paidBookings, total: summary.totalBookings, color: "bg-violet-500" },
              ].map((item) => {
                const pct = item.total ? Math.min((Number(item.value) / Number(item.total)) * 100, 100) : 0;
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-500">{formatNumber(item.value)} / {formatNumber(item.total)}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}

              <div className="rounded-2xl bg-slate-950 text-white p-4">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Users className="h-4 w-4" />
                  Portfolio workload
                </div>
                <p className="mt-2 text-2xl font-semibold">{formatNumber(summary.totalEnquiries + summary.totalBookings)}</p>
                <p className="mt-1 text-sm text-white/70">Open operational records to process across enquiries and bookings.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        {data?.charts && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur">
              <CardHeader className="pb-2">
                <SectionTitle
                  icon={<Building2 className="h-5 w-5" />}
                  title="Properties by Type"
                  subtitle="Distribution of your portfolio"
                />
              </CardHeader>
              <CardContent className="h-[320px] flex items-center justify-center pt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.charts.propertiesByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.charts.propertiesByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#ef4444', '#06b6d4'][index % 10]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }} 
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur lg:col-span-2">
              <CardHeader className="pb-2">
                <SectionTitle
                  icon={<Building2 className="h-5 w-5" />}
                  title="Properties by Location"
                  subtitle="Top 10 locations in your portfolio"
                />
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.propertiesByLocation} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} 
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                      {data.charts.propertiesByLocation.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={['#3b82f6', '#60a5fa', '#93c5fd'][index % 3]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur xl:col-span-1">
            <CardHeader>
              <SectionTitle
                icon={<Building2 className="h-5 w-5" />}
                title="Latest Properties"
                subtitle="Recently added listings in the portfolio."
              />
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {(data?.recentProperties || []).map((property) => (
                <div key={property._id} className="rounded-2xl border border-slate-200 p-3 hover:border-slate-300 transition">
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      {property.mainImage?.url ? (
                        <Image src={property.mainImage.url} alt={property.propertyName || "Property"} width={56} height={56} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">
                          <Building2 className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900 truncate">{property.propertyName || "Untitled property"}</p>
                        <span className="text-xs text-slate-400">{property.isTrending ? "Trending" : "Live"}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 truncate">
                        {property.locationType}{property.subLocationType ? ` · ${property.subLocationType}` : ""}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <StatusBadge label={property.isActive ? "Active" : "Inactive"} active={property.isActive} />
                        <span className="text-sm font-semibold text-slate-900">₹{formatNumber(property.rentPrice || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {!loading && (data?.recentProperties || []).length === 0 && (
                <p className="text-sm text-slate-500">No properties found.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur xl:col-span-1">
            <CardHeader>
              <SectionTitle
                icon={<MessageSquare className="h-5 w-5" />}
                title="Recent Enquiries"
                subtitle="Latest lead activity from the enquiry funnel."
              />
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {(data?.recentEnquiries || []).map((enquiry) => (
                <div key={enquiry._id} className="rounded-2xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{enquiry.propertyName || "Property enquiry"}</p>
                      <p className="mt-1 text-sm text-slate-500 truncate">{enquiry.phone || enquiry.email || "No contact details"}</p>
                    </div>
                    <StatusBadge label={enquiry.status || "New"} active={(enquiry.status || "New") === "Interested"} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{enquiry.contactMethod || "call"}</span>
                    <span>{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString("en-IN") : "—"}</span>
                  </div>
                </div>
              ))}
              {!loading && (data?.recentEnquiries || []).length === 0 && (
                <p className="text-sm text-slate-500">No enquiries found.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg bg-white/90 backdrop-blur xl:col-span-1">
            <CardHeader>
              <SectionTitle
                icon={<CalendarCheck2 className="h-5 w-5" />}
                title="Recent Bookings"
                subtitle="Newest bookings and payment status."
              />
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {(data?.recentBookings || []).map((booking) => (
                <div key={booking._id} className="rounded-2xl border border-slate-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{booking.propertyName || "Property booking"}</p>
                      <p className="mt-1 text-sm text-slate-500 truncate">{booking.fullName || "Guest"} · {booking.phone || "No phone"}</p>
                    </div>
                    <StatusBadge label={booking.paymentStatus || "Pending"} active={(booking.paymentStatus || "Pending") === "Paid"} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString("en-IN") : "Check-in pending"}</span>
                    <span>₹{formatNumber(booking.amountToPay || booking.advanceAmount || booking.totalAmount || 0)}</span>
                  </div>
                </div>
              ))}
              {!loading && (data?.recentBookings || []).length === 0 && (
                <p className="text-sm text-slate-500">No bookings found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyExtranet;
