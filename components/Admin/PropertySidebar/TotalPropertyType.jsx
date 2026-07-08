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
    XCircle,
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
            const res = await fetch(`/api/property/propertyDetails?${params.toString()}`);
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
            const res = await fetch(`/api/property/propertyDetails?id=${property._id}`, {
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
            const res = await fetch(`/api/property/propertyDetails?id=${property._id}`, {
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
        <>
            <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-all shadow-sm"
            >
                <Eye className="w-3.5 h-3.5" />
                View ({group.properties.length})
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-800">
                            {group.label} <span className="text-sm font-normal text-slate-500">({group.properties.length} properties)</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        {group.properties.map((p) => (
                            <div key={p._id} onClick={() => { onView(p); setOpen(false); }}
                                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-violet-50 border border-slate-100 rounded-xl cursor-pointer transition-colors group">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-slate-200">
                                    {p.mainImage?.url ? (
                                        <Image src={p.mainImage.url} alt={p.propertyName} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Home className="w-6 h-6 text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-violet-700">{p.propertyName}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{p.propertyType} • {p.rentPrice ? `₹${p.rentPrice.toLocaleString()}` : "N/A"}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                            {p.isActive ? "Active" : "Inactive"}
                                        </span>
                                        {p.isTrending && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700 flex items-center gap-0.5">
                                                <TrendingUp className="w-3 h-3" /> Trending
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-500" />
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

// ─── Property View Modal (same as AllProperties) ───────────────────────────────
// ─── Property View Modal (Full Version) ──────────────────────────────────────
const PropertyViewModal = ({ property, onToggleActive, onToggleTrending, togglingId, formatPrice }) => {
    const isTogglingActive = togglingId === property._id + "_active";
    const isTogglingTrending = togglingId === property._id + "_trending";
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    return (
        <div className="flex flex-col">
            {/* Modal Header with main image bg */}
            <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden flex-shrink-0">
                {property.mainImage?.url && (
                    <Image src={property.mainImage.url || ""} alt={property.propertyName}
                        fill className="object-cover opacity-40" sizes="100vw" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {property.propertyFor && (
                                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full capitalize">
                                        {property.propertyFor}
                                    </span>
                                )}
                                {property.propertyType && (
                                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                        {property.propertyType}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-white leading-tight">{property.propertyName}</h2>
                            <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {[property.galiType, property.subLocationType, property.locationType].filter(Boolean).join(", ")}
                            </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-bold text-emerald-400">{formatPrice(property.rentPrice)}</p>
                            {property.maxRentPrice && property.maxRentPrice !== property.rentPrice && (
                                <p className="text-white/60 text-xs">– {formatPrice(property.maxRentPrice)}</p>
                            )}
                            <p className="text-white/50 text-xs">per month</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 bg-slate-50">

                {/* Status Toggles */}
                <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xs font-medium text-slate-600">Active</span>
                        <Switch checked={property.isActive} onCheckedChange={() => onToggleActive(property)}
                            disabled={isTogglingActive} className="data-[state=checked]:bg-emerald-500" />
                        <span className={`text-xs font-semibold ${property.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                            {property.isActive ? "Yes" : "No"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xs font-medium text-slate-600">Trending</span>
                        <Switch checked={property.isTrending} onCheckedChange={() => onToggleTrending(property)}
                            disabled={isTogglingTrending} className="data-[state=checked]:bg-amber-500" />
                        <span className={`text-xs font-semibold ${property.isTrending ? "text-amber-600" : "text-slate-400"}`}>
                            {property.isTrending ? "Yes" : "No"}
                        </span>
                    </div>
                    <div className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Added {formatDate(property.createdAt)}
                    </div>
                </div>

                {/* ── Section: Basic Info ── */}
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
                        <InfoRow label="Son / Daughter / Wife Of" value={property.sonDaughterWifeOf} />
                        <InfoRow label="Contact Address" value={property.contactAddress} />
                        <InfoRow label="Landmark" value={property.landMarkDetails} />
                        <InfoRow label="Google Location" value={property.googleLocation} isLink />
                        <InfoRow label="Property Located On" value={property.propertyForRentLocatedOn} />
                        <InfoRow label="Facing Direction" value={property.propertyFacingDirection} />
                    </div>
                </Section>

                {/* ── Section: Contact ── */}
                <Section title="Contact Information" icon={<Phone className="w-4 h-4" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <div>
                            <p className="text-xs text-slate-500 mb-1 font-medium">Contact Numbers</p>
                            {property.contactNumbers?.filter(Boolean).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {property.contactNumbers.filter(Boolean).map((n, i) => (
                                        <span key={i} className="text-sm bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg font-medium">
                                            {n}
                                        </span>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-slate-400">—</p>}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-1 font-medium">Email Addresses</p>
                            {property.emailAddresses?.filter(Boolean).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {property.emailAddresses.filter(Boolean).map((e, i) => (
                                        <span key={i} className="text-sm bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-lg">
                                            {e}
                                        </span>
                                    ))}
                                </div>
                            ) : <p className="text-sm text-slate-400">—</p>}
                        </div>
                    </div>
                </Section>

                {/* ── Section: ID Docs ── */}
                {(property.aadharCardNumber || property.panCardNumber || property.aadharImage?.url || property.panImage?.url || property.electricityBillImage?.url) && (
                    <Section title="Identity Documents" icon={<ShieldCheck className="w-4 h-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-3">
                            <InfoRow label="Aadhar Card No." value={property.aadharCardNumber} />
                            <InfoRow label="PAN Card No." value={property.panCardNumber} />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {property.aadharImage?.url && (
                                <DocImage src={property.aadharImage.url} label="Aadhar Card" />
                            )}
                            {property.panImage?.url && (
                                <DocImage src={property.panImage.url} label="PAN Card" />
                            )}
                            {property.electricityBillImage?.url && (
                                <DocImage src={property.electricityBillImage.url} label="Electricity Bill" />
                            )}
                        </div>
                    </Section>
                )}

                {/* ── Section: Pricing ── */}
                <Section title="Pricing & Charges" icon={<IndianRupee className="w-4 h-4" />}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <ChargeCard label="Electricity Charges"
                            include={property.electricityCharges?.include}
                            amount={property.electricityCharges?.amount}
                            extra={property.electricityCharges?.type}
                            icon={<Zap className="w-4 h-4 text-yellow-500" />} />
                        <ChargeCard label="Water Charges"
                            include={property.waterCharges?.include}
                            amount={property.waterCharges?.amount}
                            extra={property.waterCharges?.type}
                            icon={<Droplets className="w-4 h-4 text-blue-500" />} />
                        <ChargeCard label="Security Deposit"
                            include={property.securityDeposit?.required}
                            amount={property.securityDeposit?.amount}
                            extra={property.securityDeposit?.months ? `${property.securityDeposit.months} months` : null}
                            icon={<Lock className="w-4 h-4 text-slate-500" />} />
                        <ChargeCard label="Maintenance Charges"
                            include={property.maintenanceCharges?.required}
                            amount={property.maintenanceCharges?.amount}
                            extra={property.maintenanceCharges?.basis}
                            icon={<Wrench className="w-4 h-4 text-orange-500" />} />
                    </div>
                </Section>

                {/* ── Section: Property Details ── */}
                <Section title="Property Details" icon={<Ruler className="w-4 h-4" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <InfoRow label="Detail For" value={property.detailFor} />
                        <InfoRow label="Size Unit" value={property.sizeUnit} />
                        <InfoRow label="Size (L × W)" value={property.sizeLength && property.sizeWidth ? `${property.sizeLength} × ${property.sizeWidth}` : null} />
                        <InfoRow label="Size in Feet" value={property.sizeInFeet} />
                        <InfoRow label="Size in Meter" value={property.sizeInMeter} />
                        <InfoRow label="No. of Rooms" value={property.numberOfRooms > 0 ? property.numberOfRooms : null} />
                        <InfoRow label="No. of Bedrooms" value={property.numberOfBedrooms} />
                        <InfoRow label="No. of Bathrooms" value={property.numberOfBathrooms > 0 ? property.numberOfBathrooms : null} />
                        <InfoRow label="Floor" value={property.floor} />
                        <InfoRow label="Furnishing Status" value={property.furnishingStatus} />
                        <InfoRow label="Room Style" value={property.roomStyle} />
                        <InfoRow label="Lift" value={property.lift} />
                    </div>
                    {property.roomStyleOptions?.length > 0 && (
                        <div className="mt-2">
                            <TagList label="Room Style Options" items={property.roomStyleOptions} color="pink" />
                        </div>
                    )}
                    {/* Boolean features */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {[
                            { label: "Balcony", val: property.balcony },
                            { label: "Rooftop", val: property.rooftop },
                            { label: "Wheelchair Access", val: property.wheelchair },
                            { label: "Housekeeping", val: property.housekeeping },
                        ].map(({ label, val }) => val !== undefined && val !== null && (
                            <FeatureBadge key={label} label={label} active={val} />
                        ))}
                    </div>
                </Section>

                {/* ── Section: Amenities ── */}
                {(property.amenities?.length > 0 || property.roomAmenities?.length > 0 || property.furnishedAmenities?.length > 0) && (
                    <Section title="Amenities" icon={<Wifi className="w-4 h-4" />}>
                        {property.amenities?.length > 0 && (
                            <TagList label="General Amenities" items={property.amenities} color="blue" />
                        )}
                        {property.roomAmenities?.length > 0 && (
                            <TagList label="Room Amenities" items={property.roomAmenities} color="purple" />
                        )}
                        {property.furnishedAmenities?.length > 0 && (
                            <TagList label="Furnished Amenities" items={property.furnishedAmenities} color="green" />
                        )}
                    </Section>
                )}

                {/* ── Section: Bathroom ── */}
                {(property.bathroomType || property.bathroomStyle || property.bathroomFeatures?.length > 0 || property.customBathroomAmenities?.length > 0) && (
                    <Section title="Bathroom Details" icon={<Bath className="w-4 h-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
                            <InfoRow label="Bathroom Type" value={property.bathroomType} />
                            <InfoRow label="Bathroom Style" value={property.bathroomStyle} />
                        </div>
                        {property.bathroomFeatures?.length > 0 && (
                            <TagList label="Bathroom Features" items={property.bathroomFeatures} color="cyan" />
                        )}
                        {property.customBathroomAmenities?.length > 0 && (
                            <TagList label="Custom Bathroom Amenities" items={property.customBathroomAmenities} color="teal" />
                        )}
                    </Section>
                )}

                {/* ── Section: Parking ── */}
                {(property.parkingAvailable || property.parkingType || property.parkingStyle || property.parkingAmenities?.length > 0) && (
                    <Section title="Parking Details" icon={<Car className="w-4 h-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
                            <InfoRow label="Parking Available" value={property.parkingAvailable} />
                            <InfoRow label="Parking Type" value={property.parkingType} />
                            <InfoRow label="Parking Style" value={property.parkingStyle} />
                        </div>
                        {property.parkingAmenities?.length > 0 && (
                            <TagList label="Parking Amenities" items={property.parkingAmenities} color="orange" />
                        )}
                        {property.customParkingAmenities?.length > 0 && (
                            <TagList label="Custom Parking Amenities" items={property.customParkingAmenities} color="orange" />
                        )}
                        {property.parkingStyleOptions?.length > 0 && (
                            <TagList label="Parking Style Options" items={property.parkingStyleOptions} color="amber" />
                        )}
                        {property.customParkingStyles?.length > 0 && (
                            <TagList label="Custom Parking Styles" items={property.customParkingStyles} color="amber" />
                        )}
                    </Section>
                )}

                {/* ── Section: Power Backup ── */}
                {(property.powerBackupAvailable !== undefined && property.powerBackupAvailable !== null) && (
                    <Section title="Power Backup" icon={<Zap className="w-4 h-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            <InfoRow label="Power Backup Available" value={property.powerBackupAvailable ? "Yes" : "No"} />
                            <InfoRow label="Backup Charge" value={property.powerBackupCharge ? "Yes" : "No"} />
                            <InfoRow label="Power Backup Type" value={property.powerBackupType} />
                        </div>
                        {(property.powerBackupSources?.inverter || property.powerBackupSources?.generator) && (
                            <div className="flex gap-2 mt-2">
                                {property.powerBackupSources.inverter && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 px-2.5 py-1 rounded-full">⚡ Inverter</span>
                                )}
                                {property.powerBackupSources.generator && (
                                    <span className="text-xs bg-orange-100 text-orange-800 border border-orange-200 px-2.5 py-1 rounded-full">🔋 Generator</span>
                                )}
                            </div>
                        )}
                    </Section>
                )}

                {/* ── Section: Security ── */}
                {(property.cctv || property.cctvLocation || property.cctvFeatures?.length > 0) && (
                    <Section title="Security" icon={<ShieldCheck className="w-4 h-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-2">
                            <InfoRow label="CCTV" value={property.cctv} />
                            <InfoRow label="CCTV Location" value={property.cctvLocation} />
                        </div>
                        {property.cctvFeatures?.length > 0 && (
                            <TagList label="CCTV Features" items={property.cctvFeatures} color="red" />
                        )}
                    </Section>
                )}

                {/* ── Section: Tenant & Policies ── */}
                <Section title="Tenant Preferences & Policies" icon={<Users className="w-4 h-4" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-3">
                        <InfoRow label="Tenant Type" value={property.tenantType} />
                        <InfoRow label="Stay Allow Only For" value={property.stayAllowOnlyFor} />
                        <InfoRow label="Family Members Allowed" value={property.familyMembers} />
                        <InfoRow label="Pet Allowed" value={property.petAllowed} />
                        <InfoRow label="Pet Shelter" value={property.petShelter} />
                        <InfoRow label="Smoking Allowed" value={property.smokingAllowed} />
                        <InfoRow label="Alcohol Allowed" value={property.alcoholAllowed} />
                        <InfoRow label="Non-Veg Allowed" value={property.nonVegAllowed} />
                        <InfoRow label="Muslim Family Allowed" value={property.muslimFamilyAllowed} />
                        <InfoRow label="In-Room Party Allowed" value={property.inRoomPartyAllowed} />
                        <InfoRow label="Outside Visitor Allowed" value={property.outsideVisitorAllowed} />
                        <InfoRow label="Visitor Entry" value={property.visitorEntry} />
                        <InfoRow label="Prohibited Goods" value={property.prohibitedGoods} />
                        <InfoRow label="Photographs / Videos" value={property.photographsVideos} />
                        <InfoRow label="Prior Notice Required" value={property.priorNotice} />
                        <InfoRow label="Prior Notice Time" value={property.priorNoticeTime} />
                    </div>
                    {property.tenantTypeAllowed?.length > 0 && (
                        <TagList label="Tenant Types Allowed" items={property.tenantTypeAllowed} color="indigo" />
                    )}
                    {property.customTenantTypes?.length > 0 && (
                        <TagList label="Custom Tenant Types" items={property.customTenantTypes} color="indigo" />
                    )}
                </Section>

                {/* ── Section: Availability ── */}
                <Section title="Availability & Stay" icon={<Clock className="w-4 h-4" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                        <InfoRow label="Available From" value={property.propertyAvailableFrom || property.availableFrom} />
                        <InfoRow label="Minimum Stay" value={property.minimumStayAllow || property.minimumStay} />
                        <InfoRow label="Check In" value={property.checkIn} />
                        <InfoRow label="Check Out" value={property.checkOut} />
                        <InfoRow label="Late Night Entry Time" value={property.lateNightEntryTime} />
                        <InfoRow label="Late Night Time In" value={property.lateNightTimeIn} />
                        <InfoRow label="Late Night Time Out" value={property.lateNightTimeOut} />
                    </div>
                </Section>

                {/* ── Section: Highlights ── */}
                {property.highlights?.filter(Boolean).length > 0 && (
                    <Section title="Highlights" icon={<Star className="w-4 h-4" />}>
                        <ul className="space-y-1.5">
                            {property.highlights.filter(Boolean).map((h, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    {h}
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {/* ── Section: Main Image ── */}
                {property.mainImage?.url && (
                    <Section title="Main Image" icon={<ImageIcon className="w-4 h-4" />}>
                        <div className="flex justify-center">
                            <Image src={property.mainImage.url} alt="Main property" height={300} width={500}
                                loading="lazy" className="max-w-full h-auto max-h-64 rounded-xl object-contain border border-slate-200 shadow-sm" />
                        </div>
                    </Section>
                )}

                {/* ── Section: Gallery ── */}
                {property.galleryImages?.length > 0 && (
                    <Section title={`Gallery Images (${property.galleryImages.length})`} icon={<ImageIcon className="w-4 h-4" />}>
                        <div className="flex flex-wrap gap-3 max-h-64 overflow-y-auto">
                            {property.galleryImages.map((img, i) => (
                                <div key={i} className="w-36 h-28 overflow-hidden rounded-lg border border-slate-200 shadow-sm flex-shrink-0">
                                    <Image src={img.url} alt={`Gallery ${i + 1}`} height={200} width={200}
                                        loading="lazy" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* ── Section: Video ── */}
                {property.video?.type === "upload" && property.video?.url && (
                    <Section title="Property Video" icon={<Video className="w-4 h-4" />}>
                        <div className="aspect-video w-full">
                            <video src={property.video.url} controls className="w-full h-full rounded-xl border border-slate-200" />
                        </div>
                    </Section>
                )}
                {property.video?.type === "youtube" && property.video?.youtubeLink && (
                    <Section title="YouTube Video" icon={<Video className="w-4 h-4" />}>
                        <div className="aspect-video w-full">
                            <iframe
                                src={`https://www.youtube.com/embed/${getYouTubeId(property.video.youtubeLink)}`}
                                className="w-full h-full rounded-xl border border-slate-200"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen />
                        </div>
                    </Section>
                )}

                {/* ── Section: Declaration ── */}
                {(property.declarationAccepted || property.signatureUrl) && (
                    <Section title="Declaration" icon={<ShieldCheck className="w-4 h-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-3">
                            <InfoRow label="Declaration Accepted" value={property.declarationAccepted ? "Yes" : "No"} />
                            <InfoRow label="Verification Date" value={property.verificationDate} />
                        </div>
                        {property.signatureUrl && (
                            <div>
                                <p className="text-xs text-slate-500 mb-1.5 font-medium">Signature</p>
                                <Image
                                    src={typeof property.signatureUrl === 'string' ? property.signatureUrl : (property.signatureUrl?.url || "")}
                                    alt="Signature"
                                    height={80}
                                    width={200}
                                    className="border border-slate-200 rounded-lg bg-white p-2 max-h-20 object-contain"
                                />
                            </div>
                        )}
                    </Section>
                )}

            </div>
        </div>
    );
};

// ─── Shared sub-components ─────────────────────────────────────────────────────

const ChargeCard = ({ label, include, amount, extra, icon }) => (
    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
        <div className="flex items-center gap-2 mb-1.5">
            {icon}
            <span className="text-xs font-semibold text-slate-700">{label}</span>
            {include !== null && include !== undefined && (
                <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${include ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {include ? "Included" : "Extra"}
                </span>
            )}
        </div>
        {amount && <p className="text-sm font-bold text-slate-800">₹{amount}</p>}
        {extra && <p className="text-xs text-slate-500 mt-0.5">{extra}</p>}
        {!amount && !extra && include === null && <p className="text-xs text-slate-400">—</p>}
    </div>
);

const TagList = ({ label, items, color }) => {
    const colorMap = {
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        purple: "bg-purple-50 text-purple-700 border-purple-100",
        green: "bg-emerald-50 text-emerald-700 border-emerald-100",
        cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
        teal: "bg-teal-50 text-teal-700 border-teal-100",
        orange: "bg-orange-50 text-orange-700 border-orange-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        red: "bg-red-50 text-red-700 border-red-100",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    };
    const cls = colorMap[color] || colorMap.blue;
    return (
        <div className="mb-2">
            {label && <p className="text-xs text-slate-500 font-medium mb-1.5">{label}</p>}
            <div className="flex flex-wrap gap-1.5">
                {items.filter(Boolean).map((item, i) => (
                    <span key={i} className={`text-xs border px-2.5 py-1 rounded-full font-medium ${cls}`}>{item}</span>
                ))}
            </div>
        </div>
    );
};

const FeatureBadge = ({ label, active }) => (
    <span className={`text-xs border px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${active
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : "bg-slate-50 text-slate-400 border-slate-200 line-through"}`}>
        {active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {label}
    </span>
);

const DocImage = ({ src, label }) => (
    <div className="text-center">
        <p className="text-xs text-slate-500 mb-1.5 font-medium">{label}</p>
        <Image src={src} alt={label} height={120} width={160}
            loading="lazy" className="h-24 w-auto rounded-lg border border-slate-200 object-contain bg-white p-1 shadow-sm" />
    </div>
);

const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50">
            <span className="text-slate-500">{icon}</span>
            <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const InfoRow = ({ label, value, capitalize, isLink }) => {
    if (!value && value !== 0 && value !== false) return null;
    return (
        <div className="flex items-start gap-1.5">
            <span className="text-xs text-slate-500 font-medium min-w-[130px] flex-shrink-0 mt-0.5">{label}:</span>
            {isLink && value ? (
                <a href={value} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all">{value}</a>
            ) : (
                <span className={`text-xs text-slate-800 font-medium ${capitalize ? "capitalize" : ""}`}>
                    {String(value)}
                </span>
            )}
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