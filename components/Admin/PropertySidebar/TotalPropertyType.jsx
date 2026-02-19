"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Building2,
    MapPin,
    RefreshCw,
    Eye,
    TrendingUp,
    Hash,
    BarChart3,
    Filter,
    ChevronRight,
    Home,
    Star,
    CheckCircle2,
    IndianRupee,
    Phone,
    Calendar,
    Video,
    Image as ImageIcon,
    Info,
    Ruler,
    Car,
    Wifi,
    Lock,
    Wrench,
    Droplets,
    Zap,
    ShieldCheck,
    Users,
    Clock,
    Bath,
    X,
} from "lucide-react";

// ─── YouTube ID helper ─────────────────────────────────────────────────────────
const getYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
};

// ─── Main Component ────────────────────────────────────────────────────────────
const TotalPropertyType = ({ propertyTypes = [], locationType = [], subLocationType = [] }) => {
    const [allProperties, setAllProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterMainLocation, setFilterMainLocation] = useState("all");
    const [filterPropertyType, setFilterPropertyType] = useState("all");

    // View modal
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    // ─── Fetch all properties (no pagination — we need counts) ─────────────────
    const fetchAll = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page: 1, limit: 1000 });
            if (filterMainLocation !== "all") params.set("locationType", filterMainLocation);
            if (filterPropertyType !== "all") params.set("propertyType", filterPropertyType);
            const res = await fetch(`/api/propertyDetails?${params.toString()}`);
            const data = await res.json();
            if (data.success) setAllProperties(data.data || []);
            else toast.error("Failed to load properties");
        } catch {
            toast.error("Error fetching properties");
        } finally {
            setLoading(false);
        }
    }, [filterMainLocation, filterPropertyType]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ─── Group by sub-location ─────────────────────────────────────────────────
    const grouped = React.useMemo(() => {
        const map = {};
        allProperties.forEach((p) => {
            const key = p.subLocationType || p.locationType || "Unknown";
            if (!map[key]) map[key] = { label: key, mainLocation: p.locationType || "—", properties: [] };
            map[key].properties.push(p);
        });
        return Object.values(map).sort((a, b) => b.properties.length - a.properties.length);
    }, [allProperties]);

    const totalCount = allProperties.length;
    const activeCount = allProperties.filter((p) => p.isActive).length;
    const trendingCount = allProperties.filter((p) => p.isTrending).length;

    // ─── Toggle Active ──────────────────────────────────────────────────────────
    const toggleActive = async (property) => {
        setTogglingId(property._id + "_active");
        try {
            const res = await fetch(`/api/propertyDetails?id=${property._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !property.isActive }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Property ${!property.isActive ? "activated" : "deactivated"}`);
                setAllProperties((prev) =>
                    prev.map((p) => p._id === property._id ? { ...p, isActive: !p.isActive } : p)
                );
                if (selectedProperty?._id === property._id)
                    setSelectedProperty((prev) => ({ ...prev, isActive: !prev.isActive }));
            } else toast.error("Failed to update");
        } catch { toast.error("Error updating"); }
        finally { setTogglingId(null); }
    };

    const toggleTrending = async (property) => {
        setTogglingId(property._id + "_trending");
        try {
            const res = await fetch(`/api/propertyDetails?id=${property._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isTrending: !property.isTrending }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`${!property.isTrending ? "Added to" : "Removed from"} trending`);
                setAllProperties((prev) =>
                    prev.map((p) => p._id === property._id ? { ...p, isTrending: !p.isTrending } : p)
                );
                if (selectedProperty?._id === property._id)
                    setSelectedProperty((prev) => ({ ...prev, isTrending: !prev.isTrending }));
            } else toast.error("Failed to update");
        } catch { toast.error("Error updating"); }
        finally { setTogglingId(null); }
    };

    const formatPrice = (p) => p ? `₹${p.toLocaleString("en-IN")}` : "N/A";

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="p-4 space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-violet-600" />
                        Total Property Count
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">Properties grouped by sub-location</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchAll}
                    className="flex items-center gap-1.5 text-xs">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total Properties", value: totalCount, color: "bg-violet-600", icon: <Building2 className="w-4 h-4" /> },
                    { label: "Active", value: activeCount, color: "bg-emerald-600", icon: <Eye className="w-4 h-4" /> },
                    { label: "Inactive", value: totalCount - activeCount, color: "bg-slate-500", icon: <EyeOff className="w-4 h-4" /> },
                    { label: "Trending", value: trendingCount, color: "bg-amber-500", icon: <TrendingUp className="w-4 h-4" /> },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
                        <div className={`${s.color} text-white rounded-lg p-2`}>{s.icon}</div>
                        <div>
                            <p className="text-xl font-bold text-slate-800">{s.value}</p>
                            <p className="text-xs text-slate-500">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
                <div className="flex items-center gap-2 mb-2.5">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">Filter Count By</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-medium">Main Location</p>
                        <Select value={filterMainLocation} onValueChange={setFilterMainLocation}>
                            <SelectTrigger className="h-9 text-sm border-slate-200">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {locationType.map((lt) => (
                                    <SelectItem key={lt._id} value={lt.locationType}>{lt.locationType}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-500 font-medium">Property Type</p>
                        <Select value={filterPropertyType} onValueChange={setFilterPropertyType}>
                            <SelectTrigger className="h-9 text-sm border-slate-200">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {propertyTypes.map((pt) => (
                                    <SelectItem key={pt._id} value={pt.propertyType}>{pt.propertyType}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Count Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-purple-50 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-violet-800 flex items-center gap-2">
                        <Hash className="w-4 h-4" /> Property Count by Sub-Location
                    </h2>
                    <span className="text-xs text-violet-600 font-semibold bg-violet-100 px-2.5 py-1 rounded-full">
                        {grouped.length} groups
                    </span>
                </div>

                {loading ? (
                    <CountTableSkeleton />
                ) : grouped.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Building2 className="w-10 h-10 text-slate-200 mb-2" />
                        <p className="text-slate-400 text-sm">No properties found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                    <TableHead className="text-slate-600 font-bold text-xs w-16 text-center">S.No</TableHead>
                                    <TableHead className="text-slate-600 font-bold text-xs">Main Location</TableHead>
                                    <TableHead className="text-slate-600 font-bold text-xs">Sub Location</TableHead>
                                    <TableHead className="text-center text-slate-600 font-bold text-xs">Total Count</TableHead>
                                    <TableHead className="text-center text-slate-600 font-bold text-xs">Active</TableHead>
                                    <TableHead className="text-center text-slate-600 font-bold text-xs">Inactive</TableHead>
                                    <TableHead className="text-center text-slate-600 font-bold text-xs">Trending</TableHead>
                                    <TableHead className="text-center text-slate-600 font-bold text-xs">View</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {grouped.map((group, idx) => {
                                    const active = group.properties.filter((p) => p.isActive).length;
                                    const trending = group.properties.filter((p) => p.isTrending).length;
                                    const rowBg = idx % 2 === 0
                                        ? "bg-violet-50/40 hover:bg-violet-50"
                                        : "bg-sky-50/40 hover:bg-sky-50";
                                    return (
                                        <TableRow key={group.label} className={`transition-colors ${rowBg}`}>
                                            <TableCell className="text-center">
                                                <span className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center mx-auto">
                                                    {idx + 1}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                                    <span className="text-sm text-slate-700 font-medium">{group.mainLocation}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <ChevronRight className="w-3 h-3 text-slate-400" />
                                                    <span className="text-sm text-slate-800 font-semibold">{group.label}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600 text-white font-bold text-base shadow-sm">
                                                    {group.properties.length}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm">
                                                    {active}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm">
                                                    {group.properties.length - active}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold text-sm">
                                                    {trending}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <SubGroupViewButton
                                                    group={group}
                                                    onView={(p) => { setSelectedProperty(p); setIsViewDialogOpen(true); }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {/* Total Row */}
                                <TableRow className="bg-gradient-to-r from-violet-100 to-purple-100 border-t-2 border-violet-300">
                                    <TableCell colSpan={3} className="text-right">
                                        <span className="text-sm font-bold text-violet-800">Total Final Count</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center justify-center w-12 h-10 rounded-xl bg-violet-700 text-white font-bold text-lg shadow-md">
                                            {totalCount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-emerald-700 font-bold text-sm">{activeCount}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-slate-600 font-bold text-sm">{totalCount - activeCount}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-amber-700 font-bold text-sm">{trendingCount}</span>
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* View Property Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Property Details</DialogTitle>
                    </DialogHeader>
                    {selectedProperty && (
                        <PropertyViewModal
                            property={selectedProperty}
                            onToggleActive={toggleActive}
                            onToggleTrending={toggleTrending}
                            togglingId={togglingId}
                            formatPrice={formatPrice}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ─── Sub-group view button with dropdown list ──────────────────────────────────
const SubGroupViewButton = ({ group, onView }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-all shadow-sm"
            >
                <Eye className="w-3.5 h-3.5" />
                View ({group.properties.length})
            </button>
            {open && (
                <div className="absolute right-0 top-9 z-50 w-72 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-violet-50 border-b border-violet-100">
                        <span className="text-xs font-bold text-violet-800">{group.label} — {group.properties.length} properties</span>
                        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                        {group.properties.map((p) => (
                            <button key={p._id} onClick={() => { onView(p); setOpen(false); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-violet-50 transition-colors text-left">
                                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                    {p.mainImage?.url ? (
                                        <Image src={p.mainImage.url} alt={p.propertyName} fill className="object-cover" sizes="36px" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Home className="w-4 h-4 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">{p.propertyName}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{p.propertyType} · {p.rentPrice ? `₹${p.rentPrice.toLocaleString()}` : "N/A"}/mo</p>
                                </div>
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Property View Modal (same as AllProperties) ───────────────────────────────
const PropertyViewModal = ({ property, onToggleActive, onToggleTrending, togglingId, formatPrice }) => {
    const isTogglingActive = togglingId === property._id + "_active";
    const isTogglingTrending = togglingId === property._id + "_trending";
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <div className="relative h-44 bg-gradient-to-br from-violet-700 to-purple-900 overflow-hidden flex-shrink-0">
                {property.mainImage?.url && (
                    <Image src={property.mainImage.url} alt={property.propertyName} fill className="object-cover opacity-30" sizes="100vw" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {property.propertyFor && <span className="text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full capitalize">{property.propertyFor}</span>}
                                {property.propertyType && <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{property.propertyType}</span>}
                            </div>
                            <h2 className="text-xl font-bold text-white">{property.propertyName}</h2>
                            <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {[property.galiType, property.subLocationType, property.locationType].filter(Boolean).join(", ")}
                            </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-bold text-emerald-400">{formatPrice(property.rentPrice)}</p>
                            <p className="text-white/50 text-xs">per month</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 bg-slate-50">
                {/* Toggles */}
                <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xs font-medium text-slate-600">Active</span>
                        <Switch checked={property.isActive} onCheckedChange={() => onToggleActive(property)} disabled={isTogglingActive} className="data-[state=checked]:bg-emerald-500" />
                        <span className={`text-xs font-semibold ${property.isActive ? "text-emerald-600" : "text-slate-400"}`}>{property.isActive ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xs font-medium text-slate-600">Trending</span>
                        <Switch checked={property.isTrending} onCheckedChange={() => onToggleTrending(property)} disabled={isTogglingTrending} className="data-[state=checked]:bg-amber-500" />
                        <span className={`text-xs font-semibold ${property.isTrending ? "text-amber-600" : "text-slate-400"}`}>{property.isTrending ? "Yes" : "No"}</span>
                    </div>
                    <div className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Added {formatDate(property.createdAt)}
                    </div>
                </div>

                <Section title="Basic Information" icon={<Info className="w-4 h-4" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <InfoRow label="Property Name" value={property.propertyName} />
                        <InfoRow label="Property Type" value={property.propertyType} />
                        <InfoRow label="Property For" value={property.propertyFor} capitalize />
                        <InfoRow label="Location" value={property.locationType} />
                        <InfoRow label="Sub Location" value={property.subLocationType} />
                        <InfoRow label="Gali / Mohalla" value={property.galiType} />
                        <InfoRow label="Min Rent" value={property.rentPrice ? `₹${property.rentPrice?.toLocaleString()}` : null} />
                        <InfoRow label="Max Rent" value={property.maxRentPrice ? `₹${property.maxRentPrice?.toLocaleString()}` : null} />
                        <InfoRow label={property.brokerName ? "Broker Name" : "Owner Name"} value={property.brokerName || property.ownerName} />
                        <InfoRow label="Contact Address" value={property.contactAddress} />
                    </div>
                </Section>

                <Section title="Contact" icon={<Phone className="w-4 h-4" />}>
                    <div className="flex flex-wrap gap-2">
                        {property.contactNumbers?.filter(Boolean).map((n, i) => (
                            <span key={i} className="text-sm bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg font-medium">{n}</span>
                        ))}
                        {!property.contactNumbers?.filter(Boolean).length && <p className="text-sm text-slate-400">—</p>}
                    </div>
                </Section>

                {property.highlights?.filter(Boolean).length > 0 && (
                    <Section title="Highlights" icon={<Star className="w-4 h-4" />}>
                        <ul className="space-y-1.5">
                            {property.highlights.filter(Boolean).map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />{h}
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {property.mainImage?.url && (
                    <Section title="Main Image" icon={<ImageIcon className="w-4 h-4" />}>
                        <div className="flex justify-center">
                            <Image src={property.mainImage.url} alt="Main" height={300} width={500} loading="lazy"
                                className="max-w-full h-auto max-h-64 rounded-xl object-contain border border-slate-200 shadow-sm" />
                        </div>
                    </Section>
                )}

                {property.galleryImages?.length > 0 && (
                    <Section title={`Gallery (${property.galleryImages.length})`} icon={<ImageIcon className="w-4 h-4" />}>
                        <div className="flex flex-wrap gap-3 max-h-56 overflow-y-auto">
                            {property.galleryImages.map((img, i) => (
                                <div key={i} className="w-32 h-24 overflow-hidden rounded-lg border border-slate-200 shadow-sm flex-shrink-0">
                                    <Image src={img.url} alt={`Gallery ${i + 1}`} height={200} width={200} loading="lazy" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {property.video?.type === "upload" && property.video?.url && (
                    <Section title="Video" icon={<Video className="w-4 h-4" />}>
                        <div className="aspect-video w-full">
                            <video src={property.video.url} controls className="w-full h-full rounded-xl border border-slate-200" />
                        </div>
                    </Section>
                )}
                {property.video?.type === "youtube" && property.video?.youtubeLink && (
                    <Section title="YouTube Video" icon={<Video className="w-4 h-4" />}>
                        <div className="aspect-video w-full">
                            <iframe src={`https://www.youtube.com/embed/${getYouTubeId(property.video.youtubeLink)}`}
                                className="w-full h-full rounded-xl border border-slate-200" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </div>
                    </Section>
                )}
            </div>
        </div>
    );
};

// ─── Shared sub-components ─────────────────────────────────────────────────────
const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50">
            <span className="text-slate-500">{icon}</span>
            <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const InfoRow = ({ label, value, capitalize }) => {
    if (!value && value !== 0 && value !== false) return null;
    return (
        <div className="flex items-start gap-1.5">
            <span className="text-xs text-slate-500 font-medium min-w-[130px] flex-shrink-0 mt-0.5">{label}:</span>
            <span className={`text-xs text-slate-800 font-medium ${capitalize ? "capitalize" : ""}`}>{String(value)}</span>
        </div>
    );
};

// EyeOff icon (not imported from lucide above, inline)
const EyeOff = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const CountTableSkeleton = () => (
    <div>
        <div className="h-10 bg-slate-50 border-b border-slate-200" />
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />
                <div className="flex-1 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="flex-1 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
                <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
                <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
                <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
                <div className="w-20 h-7 rounded-lg bg-slate-200 animate-pulse" />
            </div>
        ))}
    </div>
);

export default TotalPropertyType;