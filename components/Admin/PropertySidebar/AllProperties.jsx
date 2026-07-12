"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Trash2,
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Home,
    MapPin,
    Phone,
    IndianRupee,
    TrendingUp,
    Eye,
    EyeOff,
    Building2,
    Filter,
    X,
    Star,
    Calendar,
    Bed,
    Bath,
    Zap,
    Droplets,
    ShieldCheck,
    Wrench,
    Users,
    PawPrint,
    Cigarette,
    Wine,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Video,
    Image as ImageIcon,
    Info,
    Tag,
    Ruler,
    Car,
    Wifi,
    Lock,
} from "lucide-react";

const ITEMS_PER_PAGE = 15;

// ─── YouTube ID helper ─────────────────────────────────────────────────────────
const getYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AllProperties = ({ propertyTypes = [], locationType = [], subLocationType = [], galiType = [], type = "property" }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalProperties, setTotalProperties] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    // ── Filter form state (uncommitted — only applied on Search click) ──────────
    const [draftPropertyFor, setDraftPropertyFor] = useState({ residential: false, commercial: false });
    const [draftMainLocation, setDraftMainLocation] = useState("all");
    const [draftSubLocation, setDraftSubLocation] = useState("all");
    const [draftPropertyType, setDraftPropertyType] = useState("all");
    const [draftSearch, setDraftSearch] = useState("");

    // ── Committed filter state (applied to API calls) ─────────────────────────
    const [appliedFilters, setAppliedFilters] = useState({
        propertyFor: "",
        mainLocation: "all",
        subLocation: "all",
        propertyType: "all",
        search: "",
    });

    // ── Debounce timer ref ────────────────────────────────────────────────────
    const debounceRef = useRef(null);

    // ── Sub-locations filtered by selected main location ─────────────────────
    const filteredSubLocations = draftMainLocation !== "all"
        ? subLocationType.filter((s) => s.locationType === draftMainLocation)
        : subLocationType;

    // Reset sub-location when main location changes
    useEffect(() => { setDraftSubLocation("all"); }, [draftMainLocation]);

    // Dialogs
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    // ─── Fetch (uses appliedFilters) ─────────────────────────────────────────
    const fetchProperties = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
            if (appliedFilters.search) params.set("search", appliedFilters.search);
            
            if (type === "hostel") {
                params.set("status", "Approved");
                params.set("isActive", "true");
                params.set("propertyCategory", "pg-hostel");
            } else {
                if (appliedFilters.propertyType !== "all") params.set("propertyType", appliedFilters.propertyType);
            }
            
            if (appliedFilters.mainLocation !== "all") params.set("locationType", appliedFilters.mainLocation);
            if (appliedFilters.subLocation !== "all") params.set("subLocationType", appliedFilters.subLocation);
            if (appliedFilters.propertyFor) params.set("propertyFor", appliedFilters.propertyFor);

            const res = await fetch(`/api/property/propertyDetails?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setProperties(data.data || []);
                setTotalProperties(data.total || 0);
                setTotalPages(data.totalPages || 1);
            } else {
                toast.error("Failed to load properties");
            }
        } catch {
            toast.error("Error fetching properties");
        } finally {
            setLoading(false);
        }
    }, [currentPage, appliedFilters]);

    useEffect(() => { fetchProperties(); }, [fetchProperties]);
    useEffect(() => { setCurrentPage(1); }, [appliedFilters]);

    // ─── Handle Search button click ──────────────────────────────────────────
    const handleSearch = () => {
        const propertyForValue =
            draftPropertyFor.residential && draftPropertyFor.commercial ? "" :
                draftPropertyFor.residential ? "residential" :
                    draftPropertyFor.commercial ? "commercial" : "";
        setAppliedFilters({
            propertyFor: propertyForValue,
            mainLocation: draftMainLocation,
            subLocation: draftSubLocation,
            propertyType: draftPropertyType,
            search: draftSearch,
        });
    };

    // ─── Debounced search input ──────────────────────────────────────────────
    const handleSearchInput = (val) => {
        setDraftSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        // Auto-search after 600ms of no typing (debounce)
        debounceRef.current = setTimeout(() => {
            setAppliedFilters((prev) => ({ ...prev, search: val }));
        }, 600);
    };

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
                setProperties((prev) =>
                    prev.map((p) => p._id === property._id ? { ...p, isActive: !p.isActive } : p)
                );
                if (selectedProperty?._id === property._id) {
                    setSelectedProperty((prev) => ({ ...prev, isActive: !prev.isActive }));
                }
            } else {
                toast.error("Failed to update status");
            }
        } catch {
            toast.error("Error updating status");
        } finally {
            setTogglingId(null);
        }
    };

    // ─── Toggle Trending ────────────────────────────────────────────────────────
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
                setProperties((prev) =>
                    prev.map((p) => p._id === property._id ? { ...p, isTrending: !p.isTrending } : p)
                );
                if (selectedProperty?._id === property._id) {
                    setSelectedProperty((prev) => ({ ...prev, isTrending: !prev.isTrending }));
                }
            } else {
                toast.error("Failed to update trending");
            }
        } catch {
            toast.error("Error updating trending");
        } finally {
            setTogglingId(null);
        }
    };

    const toggleShowOnFront = async (property) => {
        setTogglingId(property._id + "_showOnFront");
        try {
            const res = await fetch(`/api/property/propertyDetails?id=${property._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ showOnFront: !property.showOnFront }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`${!property.showOnFront ? "Added to" : "Removed from"} Front Page`);
                setProperties((prev) =>
                    prev.map((p) => p._id === property._id ? { ...p, showOnFront: !p.showOnFront } : p)
                );
                if (selectedProperty?._id === property._id) {
                    setSelectedProperty((prev) => ({ ...prev, showOnFront: !prev.showOnFront }));
                }
            } else {
                toast.error("Failed to update in front page");
            }
        } catch {
            toast.error("Error updating to set in front page");
        } finally {
            setTogglingId(null);
        }
    };


    // ─── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!propertyToDelete) return;
        setDeletingId(propertyToDelete._id);
        try {
            const res = await fetch(`/api/property/propertyDetails?id=${propertyToDelete._id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast.success("Property deleted successfully");
                fetchProperties();
            } else {
                toast.error(data.error || "Failed to delete");
            }
        } catch {
            toast.error("Error deleting property");
        } finally {
            setDeletingId(null);
            setIsDeleteDialogOpen(false);
            setPropertyToDelete(null);
        }
    };

    // ─── Helpers ────────────────────────────────────────────────────────────────
    const formatPrice = (price) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
    };
    const formatDate = (d) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };
    const clearFilters = () => {
        setDraftPropertyFor({ residential: false, commercial: false });
        setDraftMainLocation("all");
        setDraftSubLocation("all");
        setDraftPropertyType("all");
        setDraftSearch("");
        setAppliedFilters({ propertyFor: "", mainLocation: "all", subLocation: "all", propertyType: "all", search: "" });
    };
    const hasActiveFilters =
        appliedFilters.search ||
        appliedFilters.propertyFor ||
        appliedFilters.mainLocation !== "all" ||
        appliedFilters.subLocation !== "all" ||
        appliedFilters.propertyType !== "all";

    const activeCount = properties.filter((p) => p.isActive).length;
    const trendingCount = properties.filter((p) => p.isTrending).length;

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">

            {/* ── Header ── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-7 h-7 text-blue-600" />
                        All Properties
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and monitor all listed properties.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchProperties}
                    className="flex items-center gap-1.5 text-xs">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total", value: totalProperties, color: "bg-blue-600", icon: <Building2 className="w-4 h-4" /> },
                    { label: "Active", value: activeCount, color: "bg-emerald-600", icon: <Eye className="w-4 h-4" /> },
                    { label: "Inactive", value: properties.length - activeCount, color: "bg-slate-500", icon: <EyeOff className="w-4 h-4" /> },
                    { label: "Trending", value: trendingCount, color: "bg-amber-500", icon: <TrendingUp className="w-4 h-4" /> },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md">
                        <div className={`${s.color} text-white rounded-xl p-3 flex-shrink-0 shadow-sm`}>{s.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                            <p className="text-sm font-medium text-slate-500">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">Search & Filter</span>
                    {hasActiveFilters && (
                        <button onClick={clearFilters}
                            className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                            <X className="w-3 h-3" /> Clear All
                        </button>
                    )}
                </div>

                {/* Row 1: Property For checkboxes */}
                <div className="flex items-center gap-6 mb-3 pb-3 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-600 min-w-[50px]">Property For:</span>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-5 justify-start">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="filter-residential"
                                checked={draftPropertyFor.residential}
                                onCheckedChange={(checked) =>
                                    setDraftPropertyFor((prev) => ({ ...prev, residential: !!checked }))
                                }
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label htmlFor="filter-residential" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Residential
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="filter-commercial"
                                checked={draftPropertyFor.commercial}
                                onCheckedChange={(checked) =>
                                    setDraftPropertyFor((prev) => ({ ...prev, commercial: !!checked }))
                                }
                                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                            <Label htmlFor="filter-commercial" className="text-sm font-medium text-slate-700 cursor-pointer">
                                Commercial
                            </Label>
                        </div>
                    </div>
                    {(draftPropertyFor.residential || draftPropertyFor.commercial) && (
                        <span className="ml-auto text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                            {draftPropertyFor.residential && draftPropertyFor.commercial
                                ? "Both"
                                : draftPropertyFor.residential ? "Residential" : "Commercial"}
                        </span>
                    )}
                </div>

                {/* Row 2: Selects + Search + Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-end">

                    {/* Main Location */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500 font-medium">Main Location</Label>
                        <Select value={draftMainLocation} onValueChange={setDraftMainLocation}>
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

                    {/* Sub Location */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500 font-medium">Sub Location</Label>
                        <Select
                            value={draftSubLocation}
                            onValueChange={setDraftSubLocation}
                            disabled={filteredSubLocations.length === 0}
                        >
                            <SelectTrigger className="h-9 text-sm border-slate-200">
                                <SelectValue placeholder={filteredSubLocations.length === 0 ? "No sub-locations" : "All Sub-Locations"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sub-Locations</SelectItem>
                                {filteredSubLocations.map((sl) => (
                                    <SelectItem key={sl._id} value={sl.subLocationType}>{sl.subLocationType}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Property Type */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500 font-medium">Property Type</Label>
                        <Select value={draftPropertyType} onValueChange={setDraftPropertyType}>
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

                    {/* Search Input */}
                    <div className="space-y-1">
                        <Label className="text-xs text-slate-500 font-medium">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <Input
                                placeholder="Name, owner, address..."
                                value={draftSearch}
                                onChange={(e) => handleSearchInput(e.target.value)}
                                className="pl-8 h-9 text-sm border-slate-200"
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <Button
                        onClick={handleSearch}
                        disabled={loading}
                        className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 w-full"
                    >
                        <Search className="w-4 h-4" />
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </div>

                {/* Applied filter pills */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">Active filters:</span>
                        {appliedFilters.propertyFor && (
                            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full capitalize">
                                {appliedFilters.propertyFor}
                            </span>
                        )}
                        {appliedFilters.mainLocation !== "all" && (
                            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                                📍 {appliedFilters.mainLocation}
                            </span>
                        )}
                        {appliedFilters.subLocation !== "all" && (
                            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                                📍 {appliedFilters.subLocation}
                            </span>
                        )}
                        {appliedFilters.propertyType !== "all" && (
                            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full">
                                🏠 {appliedFilters.propertyType}
                            </span>
                        )}
                        {appliedFilters.search && (
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
                                🔍 "{appliedFilters.search}"
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <TableSkeleton />
                ) : properties.length === 0 ? (
                    <EmptyState hasFilters={hasActiveFilters} onClear={clearFilters} />
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                    <TableHead className="w-10 text-slate-600 font-semibold text-xs">S.No</TableHead>
                                    <TableHead className="text-slate-600 font-semibold text-xs">Property Name</TableHead>
                                    <TableHead className="text-slate-600 font-semibold text-xs">Owner Name</TableHead>
                                    <TableHead className="text-slate-600 font-semibold text-xs">Rent / Month</TableHead>
                                    <TableHead className="text-slate-600 font-semibold text-xs">Contact</TableHead>
                                    <TableHead className="text-center text-slate-600 font-semibold text-xs">Active</TableHead>
                                    <TableHead className="text-center text-slate-600 font-semibold text-xs">Trending</TableHead>
                                    <TableHead className="text-center text-slate-600 font-semibold text-xs">Show On Front</TableHead>
                                    <TableHead className="text-center text-slate-600 font-semibold text-xs">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {properties.map((property, idx) => {
                                    const isTogglingActive = togglingId === property._id + "_active";
                                    const isTogglingTrending = togglingId === property._id + "_trending";
                                    const isTogglingShowOnFront=togglingId===property._id+"_showOnFront";
                                    return (
                                        <TableRow key={property._id}
                                            className={`hover:bg-blue-50/40 transition-colors ${!property.isActive ? "opacity-60" : ""}`}>

                                            {/* # */}
                                            <TableCell className="text-xs text-slate-400 font-medium">
                                                {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                            </TableCell>
                                            {/* Name */}
                                            <TableCell>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm line-clamp-1 max-w-[180px]">
                                                        {property.propertyName}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                                        {property.propertyFor && (
                                                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full capitalize">
                                                                {property.propertyFor}
                                                            </span>
                                                        )}
                                                        {property.isTrending && (
                                                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                                <Star className="w-2.5 h-2.5" /> Trending
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {property.brokerName}
                                            </TableCell>
                                            {/* Rent */}
                                            <TableCell>
                                                <span className="text-sm font-semibold text-emerald-700 whitespace-nowrap">
                                                    {formatPrice(property.rentPrice)}
                                                </span>
                                                {property.maxRentPrice && property.maxRentPrice !== property.rentPrice && (
                                                    <span className="text-xs text-slate-400 block">
                                                        – {formatPrice(property.maxRentPrice)}
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Contact */}
                                            <TableCell className="text-xs text-slate-600">
                                                {property.contactNumbers?.[0] || "—"}
                                            </TableCell>

                                            {/* Active */}
                                            <TableCell className="text-center">
                                                <Switch checked={property.isActive}
                                                    onCheckedChange={() => toggleActive(property)}
                                                    disabled={isTogglingActive}
                                                    className="data-[state=checked]:bg-emerald-500" />
                                            </TableCell>

                                            {/* Trending */}
                                            <TableCell className="text-center">
                                                <Switch checked={property.isTrending}
                                                    onCheckedChange={() => toggleTrending(property)}
                                                    disabled={isTogglingTrending}
                                                    className="data-[state=checked]:bg-amber-500" />
                                            </TableCell>
                                            {/* Show on Front Page */}
                                            <TableCell className="text-center">
                                                <Switch checked={property.showOnFront || false}
                                                    onCheckedChange={() => toggleShowOnFront(property)}
                                                    disabled={isTogglingShowOnFront}
                                                    className="data-[state=checked]:bg-amber-500" />
                                            </TableCell>
                                            {/* Actions */}
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => { setSelectedProperty(property); setIsViewDialogOpen(true); }}
                                                        className="p-1 rounded-lg text-blue-700 hover:bg-blue-50 border border-black transition-all"
                                                        title="View Details">
                                                        <Eye className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setPropertyToDelete(property); setIsDeleteDialogOpen(true); }}
                                                        className="p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 border border-black transition-all"
                                                        title="Delete">
                                                        <Trash2 className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* ── Pagination ── */}
            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3">
                    <p className="text-xs text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalProperties)}
                        </span>{" "}
                        of <span className="font-semibold text-slate-700">{totalProperties}</span>
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) page = i + 1;
                            else if (currentPage <= 3) page = i + 1;
                            else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                            else page = currentPage - 2 + i;
                            return (
                                <button key={page} onClick={() => setCurrentPage(page)}
                                    className={`w-7 h-7 rounded-lg text-xs font-medium transition ${currentPage === page
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "border border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                                    {page}
                                </button>
                            );
                        })}
                        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── View Property Dialog ── */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogHeader>
                    <DialogTitle className="sr-only">Property Details</DialogTitle>
                </DialogHeader>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    {selectedProperty && (
                        <PropertyViewModal
                            property={selectedProperty}
                            onToggleActive={toggleActive}
                            onToggleTrending={toggleTrending}
                            onToggleShowOnFront={toggleShowOnFront}
                            togglingId={togglingId}
                            formatPrice={formatPrice}
                            formatDate={formatDate}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* ── Delete Dialog ── */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> Delete Property
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 mt-2">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-slate-800">"{propertyToDelete?.propertyName}"</span>?
                            This will permanently remove the property and all associated media. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-3 justify-end mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={!!deletingId}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={!!deletingId}
                            className="bg-red-600 hover:bg-red-700">
                            {deletingId ? (
                                <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Deleting...</span>
                            ) : "Delete Property"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ─── Property View Modal ───────────────────────────────────────────────────────
const PropertyViewModal = ({ property, onToggleActive, onToggleTrending,onToggleShowOnFront, togglingId, formatPrice, formatDate }) => {
    const isTogglingActive = togglingId === property._id + "_active";
    const isTogglingTrending = togglingId === property._id + "_trending";

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
                                {property.propertyCategory && (
                                    <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full capitalize">
                                        {property.propertyCategory}
                                    </span>
                                )}
                                {property.propertyType && (
                                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                                        {property.propertyType}
                                    </span>
                                )}
                                {property.status && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${property.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                        {property.status}
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
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xs font-medium text-slate-600">Show on Front Page</span>
                        <Switch checked={property.showOnFront} onCheckedChange={() => onToggleShowOnFront(property)}
                            disabled={isTogglingTrending} className="data-[state=checked]:bg-amber-500" />
                        <span className={`text-xs font-semibold ${property.isTrending ? "text-amber-600" : "text-slate-400"}`}>
                            {property.showOnFront ? "Yes" : "No"}
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
                        <InfoRow label="Property Category" value={property.propertyCategory} />
                        <InfoRow label="Property Type" value={property.propertyType} />
                        <InfoRow label="Property For" value={property.propertyFor} capitalize />
                        <InfoRow label="Status" value={property.status} />
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

// ─── Sub-components ────────────────────────────────────────────────────────────

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

// ─── Table Skeleton ────────────────────────────────────────────────────────────
const TableSkeleton = () => (
    <div>
        <div className="h-10 bg-slate-50 border-b border-slate-200" />
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
                <div className="w-6 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="w-11 h-11 rounded-lg bg-slate-200 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-40" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
                </div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-20" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-28" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-20" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-24" />
            </div>
        ))}
    </div>
);

// ─── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ hasFilters, onClear }) => (
    <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Building2 className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">
            {hasFilters ? "No properties match your filters" : "No properties yet"}
        </h3>
        <p className="text-xs text-slate-400 mb-4 text-center max-w-xs">
            {hasFilters ? "Try adjusting or clearing your filters." : "Add your first property using 'Create Property Details'."}
        </p>
        {hasFilters && (
            <Button variant="outline" size="sm" onClick={onClear} className="flex items-center gap-1.5 text-xs">
                <X className="w-3.5 h-3.5" /> Clear Filters
            </Button>
        )}
    </div>
);

export default AllProperties;