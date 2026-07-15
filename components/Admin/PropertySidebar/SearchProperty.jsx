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
    XCircle,
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
    Edit,
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
const SearchProperty = ({ propertyTypes = [], locationType = [], subLocationType = [], type = "property", setEditingProperty, setActiveParent, setActiveChild }) => {
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

    const handleEditClick = (property) => {
        if (setEditingProperty && setActiveParent) {
            setEditingProperty(property);
            setActiveParent("create_property_details");
            if (setActiveChild) setActiveChild(null);
        } else {
            toast.error("Edit functionality is not available.");
        }
    };

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
            
            if (type === "hostel") {
                params.set("status", "Approved");
                params.set("isActive", "true");
                params.set("propertyCategory", "pg-hostel");
            } else {
                if (draftPropertyType !== "all") params.set("propertyType", draftPropertyType);
                if (resultPropertyType !== "all") params.set("propertyType", resultPropertyType);
            }
            
            if (draftMinRent > 0) params.set("minRent", draftMinRent);
            if (draftMaxRent < 100000) params.set("maxRent", draftMaxRent);
            
            // Allow overriding isActive if searching specifically from Search UI unless type is hostel
            if (type !== "hostel" && resultStatus !== "all") {
                params.set("isActive", resultStatus === "active" ? "true" : "false");
            }

            const res = await fetch(`/api/property/propertyDetails?${params.toString()}`);
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
            const res = await fetch(`/api/property/propertyDetails?id=${property._id}`, {
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
            const res = await fetch(`/api/property/propertyDetails?id=${property._id}`, {
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
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Search className="w-7 h-7 text-orange-500" />
                        Search Property
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Advanced property search with multiple filters.</p>
                </div>
                <Button variant="outline" size="sm" onClick={clearAll} className="flex items-center gap-1.5 text-xs">
                    <X className="w-3.5 h-3.5" /> Clear All
                </Button>
            </div>

            {/* ── Filter Panel ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                <div className="space-y-4">
                    {/* Results Header */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
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
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                onClick={() => handleEditClick(property)}
                                                                className="p-1.5 rounded-lg text-green-700 hover:bg-green-50 border border-green-200 transition-all shadow-sm"
                                                                title="Edit Details">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedProperty(property); setIsViewDialogOpen(true); }}
                                                                className="p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-sm"
                                                                title="View Details">
                                                                <Eye className="w-4 h-4" />
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
// ─── Shared sub-components ─────────────────────────────────────────────────────

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

// ─── Property View Modal ───────────────────────────────────────────────────────
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