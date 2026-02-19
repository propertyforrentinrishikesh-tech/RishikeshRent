"use client";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import {
    Search,
    Building2,
    MapPin,
    Eye,
    Home,
    Star,
    CheckCircle2,
    IndianRupee,
    Phone,
    Calendar,
    Video,
    Image as ImageIcon,
    Info,
    Filter,
    X,
    RefreshCw,
    TrendingUp,
    Users,
    Zap,
    Droplets,
    Wrench,
    Lock,
    ShieldCheck,
    Bath,
    Car,
    Wifi,
    Clock,
    Ruler,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    Hash,
} from "lucide-react";

// ─── YouTube ID helper ─────────────────────────────────────────────────────────
const getYouTubeId = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
};

const ITEMS_PER_PAGE = 15;

// ─── Amenity groups ────────────────────────────────────────────────────────────
const AMENITY_GROUPS = [
    {
        label: "Power & Facilities",
        color: "yellow",
        items: ["Power Backup Facility", "Balcony Available", "Rooftop Access", "Housekeeping", "Wheelchair Accessible", "Flat-screen TV"],
    },
    {
        label: "Furnishing",
        color: "purple",
        items: ["Furnished", "Semi Furnished", "Fully Furnished", "Wi-Fi", "Bed & Bedding"],
    },
    {
        label: "Room Amenities",
        color: "blue",
        items: ["Air Condition", "Water Cooler", "Heating Facilities", "Ceiling Fan", "Iron and Ironing Board", "Room Almirah", "Hairdyer", "Desk/Workspace"],
    },
    {
        label: "Bathroom",
        color: "cyan",
        items: ["Air Condition", "Western Toilet", "Indian Style", "Both Style Toilet", "Bathroom Toiletries", "Laundry Service", "Bathroom Geyser", "Sharing Style", "Private Style"],
    },
    {
        label: "Parking & Security",
        color: "green",
        items: ["Air Condition", "Lift - Elevator", "CCTV Camera", "Parking Two Wheeler", "Parking Four Wheeler", "Interconnected Room", "Separated Room Style", "New Developed"],
    },
    {
        label: "Policies",
        color: "red",
        items: ["Pet Requirement", "Smoking Allowed", "Muslim Family Allowed", "Non Vegetarian Food", "Alcohol Allowed", "In-Room Party Allowed", "Outside Visitor Allowed"],
    },
];

const COLOR_MAP = {
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", header: "bg-yellow-100 text-yellow-800", check: "data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", header: "bg-purple-100 text-purple-800", check: "data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", header: "bg-blue-100 text-blue-800", check: "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" },
    cyan: { bg: "bg-cyan-50", border: "border-cyan-200", header: "bg-cyan-100 text-cyan-800", check: "data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600" },
    green: { bg: "bg-emerald-50", border: "border-emerald-200", header: "bg-emerald-100 text-emerald-800", check: "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600" },
    red: { bg: "bg-red-50", border: "border-red-200", header: "bg-red-100 text-red-800", check: "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500" },
};

// ─── Main Component ────────────────────────────────────────────────────────────
const SearchProperty = ({ propertyTypes = [], locationType = [], subLocationType = [] }) => {
    // ── Draft filter state ──────────────────────────────────────────────────────
    const [draftPropertyFor, setDraftPropertyFor] = useState("all");
    const [draftMainLocation, setDraftMainLocation] = useState("all");
    const [draftSubLocation, setDraftSubLocation] = useState("all");
    const [draftPropertyType, setDraftPropertyType] = useState("all");
    const [draftMinRent, setDraftMinRent] = useState(0);
    const [draftMaxRent, setDraftMaxRent] = useState(100000);
    const [draftPropertyLocatedOn, setDraftPropertyLocatedOn] = useState("all");
    const [draftFacingDirection, setDraftFacingDirection] = useState("all");
    const [draftFamilyMembers, setDraftFamilyMembers] = useState("");
    const [draftTenantType, setDraftTenantType] = useState("all");
    const [draftStayAllow, setDraftStayAllow] = useState("all");
    const [draftAmenities, setDraftAmenities] = useState([]);

    // ── Results state ───────────────────────────────────────────────────────────
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // ── Result filters ──────────────────────────────────────────────────────────
    const [resultStatus, setResultStatus] = useState("all");
    const [resultPropertyType, setResultPropertyType] = useState("all");

    // ── View modal ──────────────────────────────────────────────────────────────
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [togglingId, setTogglingId] = useState(null);

    // ── Sub-locations filtered by main location ─────────────────────────────────
    const filteredSubLocations = draftMainLocation !== "all"
        ? subLocationType.filter((s) => s.locationType === draftMainLocation)
        : subLocationType;

    // ── Amenity toggle ──────────────────────────────────────────────────────────
    const toggleAmenity = (item) => {
        setDraftAmenities((prev) =>
            prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
        );
    };

    // ── Search ──────────────────────────────────────────────────────────────────
    const handleSearch = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setSearched(true);
            const params = new URLSearchParams({ page, limit: ITEMS_PER_PAGE });
            if (draftPropertyFor !== "all") params.set("propertyFor", draftPropertyFor);
            if (draftMainLocation !== "all") params.set("locationType", draftMainLocation);
            if (draftSubLocation !== "all") params.set("subLocationType", draftSubLocation);
            if (draftPropertyType !== "all") params.set("propertyType", draftPropertyType);
            if (draftMinRent > 0) params.set("minRent", draftMinRent);
            if (draftMaxRent < 100000) params.set("maxRent", draftMaxRent);
            if (resultStatus !== "all") params.set("isActive", resultStatus === "active" ? "true" : "false");
            if (resultPropertyType !== "all") params.set("propertyType", resultPropertyType);

            const res = await fetch(`/api/propertyDetails?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setResults(data.data || []);
                setTotalCount(data.total || 0);
                setTotalPages(data.totalPages || 1);
                setCurrentPage(page);
            } else {
                toast.error("Search failed");
            }
        } catch {
            toast.error("Error searching properties");
        } finally {
            setLoading(false);
        }
    }, [draftPropertyFor, draftMainLocation, draftSubLocation, draftPropertyType, draftMinRent, draftMaxRent, resultStatus, resultPropertyType]);

    const clearAll = () => {
        setDraftPropertyFor("all"); setDraftMainLocation("all"); setDraftSubLocation("all");
        setDraftPropertyType("all"); setDraftMinRent(0); setDraftMaxRent(100000);
        setDraftPropertyLocatedOn("all"); setDraftFacingDirection("all");
        setDraftFamilyMembers(""); setDraftTenantType("all"); setDraftStayAllow("all");
        setDraftAmenities([]); setResults([]); setSearched(false); setTotalCount(0);
    };

    // ── Toggle Active ───────────────────────────────────────────────────────────
    const toggleActive = async (property) => {
        setTogglingId(property._id + "_active");
        try {
            const res = await fetch(`/api/propertyDetails?id=${property._id}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !property.isActive }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Property ${!property.isActive ? "activated" : "deactivated"}`);
                setResults((prev) => prev.map((p) => p._id === property._id ? { ...p, isActive: !p.isActive } : p));
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
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isTrending: !property.isTrending }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`${!property.isTrending ? "Added to" : "Removed from"} trending`);
                setResults((prev) => prev.map((p) => p._id === property._id ? { ...p, isTrending: !p.isTrending } : p));
                if (selectedProperty?._id === property._id)
                    setSelectedProperty((prev) => ({ ...prev, isTrending: !prev.isTrending }));
            } else toast.error("Failed to update");
        } catch { toast.error("Error updating"); }
        finally { setTogglingId(null); }
    };

    const formatPrice = (p) => p ? `₹${p.toLocaleString("en-IN")}` : "N/A";
    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="p-4 space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Search className="w-6 h-6 text-orange-500" />
                        Search Property
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">Advanced property search with multiple filters</p>
                </div>
                <Button variant="outline" size="sm" onClick={clearAll} className="flex items-center gap-1.5 text-xs">
                    <X className="w-3.5 h-3.5" /> Clear All
                </Button>
            </div>

            {/* ── Filter Panel ── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Filter Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                    <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-orange-800">Search Filters</span>
                </div>

                <div className="p-4 space-y-4">
                    {/* Row 1: Main dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Property For */}
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500 font-semibold">Property For</Label>
                            <Select value={draftPropertyFor} onValueChange={(v) => { setDraftPropertyFor(v); }}>
                                <SelectTrigger className="h-9 text-sm border-slate-200 bg-slate-50">
                                    <SelectValue placeholder="Select Commercial / Residential" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All (Commercial + Residential)</SelectItem>
                                    <SelectItem value="commercial">Commercial</SelectItem>
                                    <SelectItem value="residential">Residential</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Main Location */}
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500 font-semibold">Main Location</Label>
                            <Select value={draftMainLocation} onValueChange={(v) => { setDraftMainLocation(v); setDraftSubLocation("all"); }}>
                                <SelectTrigger className="h-9 text-sm border-slate-200 bg-slate-50">
                                    <SelectValue placeholder="Select Main Location" />
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
                            <Label className="text-xs text-slate-500 font-semibold">Sub Location</Label>
                            <Select value={draftSubLocation} onValueChange={setDraftSubLocation} disabled={filteredSubLocations.length === 0}>
                                <SelectTrigger className="h-9 text-sm border-slate-200 bg-slate-50">
                                    <SelectValue placeholder={filteredSubLocations.length === 0 ? "No sub-locations" : "Select Sub Location"} />
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
                            <Label className="text-xs text-slate-500 font-semibold">Property Type</Label>
                            <Select value={draftPropertyType} onValueChange={setDraftPropertyType}>
                                <SelectTrigger className="h-9 text-sm border-slate-200 bg-slate-50">
                                    <SelectValue placeholder="Property Type" />
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

                    {/* Row 2: Rent Range */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Rent Range
                            </Label>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                                ₹{draftMinRent.toLocaleString()} – ₹{draftMaxRent.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 w-8">₹0</span>
                            <div className="flex-1 relative h-6 flex items-center">
                                <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />
                                <div
                                    className="absolute h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                                    style={{
                                        left: `${(draftMinRent / 100000) * 100}%`,
                                        right: `${100 - (draftMaxRent / 100000) * 100}%`,
                                    }}
                                />
                                <input type="range" min={0} max={100000} step={500}
                                    value={draftMinRent}
                                    onChange={(e) => setDraftMinRent(Math.min(Number(e.target.value), draftMaxRent - 500))}
                                    className="absolute w-full h-1.5 opacity-0 cursor-pointer" />
                                <input type="range" min={0} max={100000} step={500}
                                    value={draftMaxRent}
                                    onChange={(e) => setDraftMaxRent(Math.max(Number(e.target.value), draftMinRent + 500))}
                                    className="absolute w-full h-1.5 opacity-0 cursor-pointer" />
                            </div>
                            <span className="text-xs text-slate-400 w-14 text-right">₹1,00,000</span>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <div className="flex-1">
                                <Label className="text-[10px] text-slate-400">Min Rent</Label>
                                <Input type="number" value={draftMinRent} min={0} max={draftMaxRent - 500}
                                    onChange={(e) => setDraftMinRent(Number(e.target.value))}
                                    className="h-7 text-xs border-slate-200 mt-0.5" />
                            </div>
                            <div className="flex-1">
                                <Label className="text-[10px] text-slate-400">Max Rent</Label>
                                <Input type="number" value={draftMaxRent} min={draftMinRent + 500} max={100000}
                                    onChange={(e) => setDraftMaxRent(Number(e.target.value))}
                                    className="h-7 text-xs border-slate-200 mt-0.5" />
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Additional selects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500 font-semibold">Property Located On</Label>
                            <Select value={draftPropertyLocatedOn} onValueChange={setDraftPropertyLocatedOn}>
                                <SelectTrigger className="h-9 text-sm border-slate-200 bg-slate-50">
                                    <SelectValue placeholder="For Rent Located On" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    {["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor+", "Basement", "Terrace"].map((v) => (
                                        <SelectItem key={v} value={v}>{v}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500 font-semibold">Facing Direction</Label>
                            <Select value={draftFacingDirection} onValueChange={setDraftFacingDirection}>
                                <SelectTrigger className="h-9 text-sm border-slate-200 bg-slate-50">
                                    <SelectValue placeholder="Property Facing Direction" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Direction</SelectItem>
                                    {["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"].map((v) => (
                                        <SelectItem key={v} value={v}>{v}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500 font-semibold">Tenant Type Allow</Label>
                            <Select value={draftTenantType} onValueChange={setDraftTenantType}>
                                <SelectTrigger className="h-9 text-sm border-slate-200 bg-slate-50">
                                    <SelectValue placeholder="Tenant Type Allow" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Tenant</SelectItem>
                                    {["Family", "Bachelor", "Working Professional", "Student", "Any"].map((v) => (
                                        <SelectItem key={v} value={v}>{v}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-500 font-semibold">Stay Allow Only For</Label>
                            <Select value={draftStayAllow} onValueChange={setDraftStayAllow}>
                                <SelectTrigger className="h-9 text-sm border-slate-200 bg-slate-50">
                                    <SelectValue placeholder="Stay Allow Only For" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    {["Male", "Female", "Both"].map((v) => (
                                        <SelectItem key={v} value={v}>{v}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 4: Family Members */}
                    <div className="flex items-center gap-3">
                        <Label className="text-xs text-slate-500 font-semibold whitespace-nowrap">Family Members Allowed:</Label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {["—", "1", "2", "3", "4", "5", "6+"].map((v) => (
                                <button key={v}
                                    onClick={() => setDraftFamilyMembers(v === "—" ? "" : v)}
                                    className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-all ${draftFamilyMembers === (v === "—" ? "" : v)
                                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600"}`}>
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Row 5: Amenity checkboxes */}
                    <div>
                        <div className="flex items-center gap-2 mb-2.5">
                            <Wifi className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-700">Amenities & Features</span>
                            {draftAmenities.length > 0 && (
                                <span className="ml-auto text-xs bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-semibold">
                                    {draftAmenities.length} selected
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {AMENITY_GROUPS.map((group) => {
                                const colors = COLOR_MAP[group.color];
                                return (
                                    <div key={group.label} className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
                                        <div className={`px-3 py-1.5 ${colors.header} text-xs font-bold`}>
                                            {group.label}
                                        </div>
                                        <div className="p-2.5 space-y-1.5">
                                            {group.items.map((item) => (
                                                <div key={item} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`amenity-${item}-${group.label}`}
                                                        checked={draftAmenities.includes(item)}
                                                        onCheckedChange={() => toggleAmenity(item)}
                                                        className={`w-3.5 h-3.5 ${colors.check}`}
                                                    />
                                                    <Label htmlFor={`amenity-${item}-${group.label}`}
                                                        className="text-xs text-slate-700 cursor-pointer leading-tight">
                                                        {item}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex justify-start pt-1">
                        <Button
                            onClick={() => handleSearch(1)}
                            disabled={loading}
                            className="px-10 h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            {loading ? "Searching..." : "Search"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Results ── */}
            {searched && (
                <div className="space-y-3">
                    {/* Results Header */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-orange-500" />
                                Result
                                {!loading && (
                                    <span className="text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full ml-1">
                                        Total Count: {totalCount}
                                    </span>
                                )}
                            </h2>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                                    <Select value={resultStatus} onValueChange={(v) => { setResultStatus(v); handleSearch(1); }}>
                                        <SelectTrigger className="h-8 text-xs border-slate-200 w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Available</SelectItem>
                                            <SelectItem value="inactive">Not Available</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-slate-500 font-medium">Property Type:</span>
                                    <Select value={resultPropertyType} onValueChange={(v) => { setResultPropertyType(v); handleSearch(1); }}>
                                        <SelectTrigger className="h-8 text-xs border-slate-200 w-36">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">As Per Type</SelectItem>
                                            {propertyTypes.map((pt) => (
                                                <SelectItem key={pt._id} value={pt.propertyType}>{pt.propertyType}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {loading ? (
                            <ResultsSkeleton />
                        ) : results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                                    <Search className="w-8 h-8 text-orange-200" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-700 mb-1">No properties found</h3>
                                <p className="text-xs text-slate-400 text-center max-w-xs">
                                    Try adjusting your filters or search with different criteria.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                            <TableHead className="text-slate-600 font-bold text-xs w-12 text-center">S.No</TableHead>
                                            <TableHead className="text-slate-600 font-bold text-xs">Property Name</TableHead>
                                            <TableHead className="text-slate-600 font-bold text-xs">Owner Name</TableHead>
                                            <TableHead className="text-slate-600 font-bold text-xs">Contact Number</TableHead>
                                            <TableHead className="text-slate-600 font-bold text-xs">Accepted Amount</TableHead>
                                            <TableHead className="text-center text-slate-600 font-bold text-xs">Active</TableHead>
                                            <TableHead className="text-center text-slate-600 font-bold text-xs">Trending</TableHead>
                                            <TableHead className="text-center text-slate-600 font-bold text-xs">View</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {results.map((property, idx) => {
                                            const isTogglingActive = togglingId === property._id + "_active";
                                            const isTogglingTrending = togglingId === property._id + "_trending";
                                            const rowColors = [
                                                "bg-sky-50/60 hover:bg-sky-100/60",
                                                "bg-violet-50/60 hover:bg-violet-100/60",
                                                "bg-emerald-50/60 hover:bg-emerald-100/60",
                                                "bg-amber-50/60 hover:bg-amber-100/60",
                                                "bg-pink-50/60 hover:bg-pink-100/60",
                                            ];
                                            const rowBg = rowColors[idx % rowColors.length];
                                            return (
                                                <TableRow key={property._id}
                                                    className={`transition-colors ${rowBg} ${!property.isActive ? "opacity-60" : ""}`}>
                                                    <TableCell className="text-center">
                                                        <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center mx-auto">
                                                            {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-semibold text-slate-800 text-sm line-clamp-1 max-w-[180px]">
                                                                {property.propertyName}
                                                            </p>
                                                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                                                {property.propertyType && (
                                                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{property.propertyType}</span>
                                                                )}
                                                                {property.propertyFor && (
                                                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full capitalize">{property.propertyFor}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-slate-700 font-medium">
                                                        {property.brokerName || property.ownerName || "—"}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-slate-700">
                                                        {property.contactNumbers?.[0] || "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm font-bold text-emerald-700">
                                                            {property.rentPrice ? `₹${property.rentPrice.toLocaleString()}` : "N/A"}
                                                        </span>
                                                        {property.maxRentPrice && property.maxRentPrice !== property.rentPrice && (
                                                            <span className="text-xs text-slate-400 block">– ₹{property.maxRentPrice.toLocaleString()}</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Switch checked={property.isActive}
                                                            onCheckedChange={() => toggleActive(property)}
                                                            disabled={isTogglingActive}
                                                            className="data-[state=checked]:bg-emerald-500" />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Switch checked={property.isTrending}
                                                            onCheckedChange={() => toggleTrending(property)}
                                                            disabled={isTogglingTrending}
                                                            className="data-[state=checked]:bg-amber-500" />
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <button
                                                            onClick={() => { setSelectedProperty(property); setIsViewDialogOpen(true); }}
                                                            className="p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-sm"
                                                            title="View Details">
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-2.5">
                            <p className="text-xs text-slate-500">
                                Showing <span className="font-semibold text-slate-700">
                                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
                                </span> of <span className="font-semibold text-slate-700">{totalCount}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleSearch(currentPage - 1)} disabled={currentPage === 1}
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
                                        <button key={page} onClick={() => handleSearch(page)}
                                            className={`w-7 h-7 rounded-lg text-xs font-medium transition ${currentPage === page
                                                ? "bg-orange-500 text-white shadow-sm"
                                                : "border border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                                            {page}
                                        </button>
                                    );
                                })}
                                <button onClick={() => handleSearch(currentPage + 1)} disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                            formatDate={formatDate}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

// ─── Property View Modal ───────────────────────────────────────────────────────
const PropertyViewModal = ({ property, onToggleActive, onToggleTrending, togglingId, formatPrice, formatDate }) => {
    const isTogglingActive = togglingId === property._id + "_active";
    const isTogglingTrending = togglingId === property._id + "_trending";
    return (
        <div className="flex flex-col">
            <div className="relative h-44 bg-gradient-to-br from-orange-600 to-amber-700 overflow-hidden flex-shrink-0">
                {property.mainImage?.url && (
                    <Image src={property.mainImage.url} alt={property.propertyName} fill className="object-cover opacity-30" sizes="100vw" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                {property.propertyFor && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full capitalize">{property.propertyFor}</span>}
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
            <div className="p-5 space-y-4 bg-slate-50">
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
                        <InfoRow label="Furnishing Status" value={property.furnishingStatus} />
                        <InfoRow label="Floor" value={property.floor} />
                        <InfoRow label="Tenant Type" value={property.tenantType} />
                        <InfoRow label="Stay Allow Only For" value={property.stayAllowOnlyFor} />
                        <InfoRow label="Family Members" value={property.familyMembers} />
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

const ResultsSkeleton = () => (
    <div>
        <div className="h-10 bg-slate-50 border-b border-slate-200" />
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-40" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
                </div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-24" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-24" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-20" />
                <div className="w-10 h-6 bg-slate-200 rounded animate-pulse" />
                <div className="w-10 h-6 bg-slate-200 rounded animate-pulse" />
                <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
            </div>
        ))}
    </div>
);

export default SearchProperty;