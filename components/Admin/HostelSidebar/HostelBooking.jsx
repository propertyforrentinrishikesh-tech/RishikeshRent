"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
    Eye,
    Search,
    MapPin,
    Phone,
    Mail,
    Building2,
    Calendar,
    IndianRupee,
    X,
    MessageSquare,
    RefreshCw,
    Star,
    AlertCircle,
    Hash,
    Filter,
} from "lucide-react";
import toast from "react-hot-toast";

const HostelBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterLocation, setFilterLocation] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();
            if (filterStatus !== "All") query.append("status", filterStatus);
            
            const res = await fetch(`/api/hostelRegistration?${query.toString()}`);
            const json = await res.json();
            
            if (res.ok && json.success) {
                setBookings(json.data);
            } else {
                toast.error(json.error || "Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus, id) => {
        try {
            const res = await fetch(`/api/hostelRegistration?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                toast.success("Status updated successfully");
                setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
                if (selectedBooking && selectedBooking._id === id) {
                    setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
                }
            } else {
                toast.error(json.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("An error occurred while updating status");
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [filterStatus]);

    const filteredBookings = bookings.filter(b => {
        const matchesSearch = (b.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (b.caseIdNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (b.locationType?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
        const matchesLocation = filterLocation === "all" || b.locationType === filterLocation;
        return matchesSearch && matchesLocation;
    });

    const uniqueLocations = Array.from(new Set(bookings.map((b) => b.locationType).filter(Boolean)));
    const hasFilters = searchQuery || filterStatus !== "All" || filterLocation !== "all";

    const clearFilters = () => {
        setSearchQuery("");
        setFilterStatus("All");
        setFilterLocation("all");
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending Review": return "bg-yellow-100 text-yellow-800";
            case "Approved": return "bg-emerald-100 text-emerald-800";
            case "Rejected": return "bg-red-100 text-red-800";
            default: return "bg-slate-100 text-slate-800";
        }
    };

    const renderBooleanItem = (label, value) => {
        if (!value) return null;
        return (
            <div key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {label}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-teal-600" />
                        Hostel Bookings
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">Manage all hostel registrations and details</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchBookings}
                    className="flex items-center gap-1.5 text-xs">
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(() => {
                    const approvedCount = bookings.filter((b) => b.status === "Approved").length;
                    const pendingCount = bookings.filter((b) => b.status === "Pending Review" || !b.status).length;
                    return [
                        { label: "Total Bookings", value: bookings.length, color: "bg-teal-600", icon: <MessageSquare className="w-4 h-4" /> },
                        { label: "Approved", value: approvedCount, color: "bg-emerald-600", icon: <Star className="w-4 h-4" /> },
                        { label: "Pending", value: pendingCount, color: "bg-amber-600", icon: <AlertCircle className="w-4 h-4" /> },
                        { label: "This Page", value: filteredBookings.length, color: "bg-violet-600", icon: <Hash className="w-4 h-4" /> },
                    ].map((s) => (
                        <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
                            <div className={`${s.color} text-white rounded-lg p-2 flex-shrink-0`}>{s.icon}</div>
                            <div>
                                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                                <p className="text-xs text-slate-500">{s.label}</p>
                            </div>
                        </div>
                    ));
                })()}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
                <div className="flex items-center gap-2 mb-2.5">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">Filter Bookings</span>
                    {hasFilters && (
                        <button onClick={clearFilters}
                            className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium">
                            <X className="w-3 h-3" /> Clear
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Search */}
                    <div className="relative sm:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input
                            placeholder="phone, email, property..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 h-9 text-sm border-slate-200"
                        />
                    </div>
                    {/* Status */}
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-9 text-sm border-slate-200 bg-white">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Status</SelectItem>
                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* Location */}
                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                        <SelectTrigger className="h-9 text-sm border-slate-200 bg-white">
                            <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {uniqueLocations.map((lt) => (
                                <SelectItem key={lt} value={lt}>{lt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Case ID</th>
                                <th className="px-6 py-4">Hostel Details</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Rent / Deposit</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                            Loading hostels...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        No hostel registrations found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-600">
                                            {booking.caseIdNumber}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{booking.propertyName}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{booking.propertyType} • {booking.propertyFor}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                {booking.locationType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="font-medium text-slate-900">₹{booking.monthlyRent}</div>
                                            {booking.totalSecurityDepositAmount && (
                                                <div className="text-xs text-slate-500">Dep: ₹{booking.totalSecurityDepositAmount}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`hover:bg-transparent ${getStatusColor(booking.status)}`}>
                                                {booking.status || "Pending Review"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {format(new Date(booking.createdAt), "dd MMM, yyyy")}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => setSelectedBooking(booking)}
                                                className="gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* View Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-start pt-10 pb-10 overflow-y-auto px-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-6 flex justify-between items-center rounded-t-2xl">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    {selectedBooking.propertyName}
                                    <Select 
                                        value={selectedBooking.status || "Pending Review"} 
                                        onValueChange={(val) => handleStatusChange(val, selectedBooking._id)}
                                    >
                                        <SelectTrigger className={`h-8 border-0 text-sm font-semibold rounded-full px-3 w-fit focus:ring-0 ${getStatusColor(selectedBooking.status || 'Pending Review')}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending Review">Pending Review</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </h2>
                                <p className="text-slate-500 mt-1 text-sm font-mono flex gap-4">
                                    <span>Case ID: {selectedBooking.caseIdNumber}</span>
                                    <span>Submitted: {format(new Date(selectedBooking.createdAt), "PPP")}</span>
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(null)} className="rounded-full bg-slate-100 hover:bg-slate-200">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-8">
                            {/* Images Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Primary', data: selectedBooking.primaryImage },
                                    { label: 'Building', data: selectedBooking.outsideBuilding },
                                    { label: 'Room', data: selectedBooking.roomImage },
                                    { label: 'Bathroom', data: selectedBooking.bathroomImage },
                                    { label: 'Other', data: selectedBooking.otherImage },
                                ].map((img, i) => img.data?.url && (
                                    <div key={i} className="space-y-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase">{img.label}</p>
                                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                                            <Image src={img.data.url} alt={img.label} fill className="object-cover" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Details Column */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Hostel Details</h3>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500 flex items-center gap-2"><Building2 className="w-4 h-4" /> Type</span>
                                                <span className="font-medium text-slate-900">{selectedBooking.propertyType} for {selectedBooking.propertyFor}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                                                <span className="font-medium text-slate-900">{selectedBooking.locationType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500 flex items-center gap-2"><Phone className="w-4 h-4" /> Contact</span>
                                                <span className="font-medium text-slate-900">{selectedBooking.contactNumber}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                                                <span className="font-medium text-slate-900">{selectedBooking.email || "-"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Pricing & Terms</h3>
                                        <div className="space-y-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Monthly Rent</span>
                                                <span className="text-lg font-bold text-slate-900">₹{selectedBooking.monthlyRent}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Security Deposit</span>
                                                <span className="font-medium text-slate-900">
                                                    {selectedBooking.securityDeposit} Month(s) 
                                                    {selectedBooking.totalSecurityDepositAmount && ` (₹${selectedBooking.totalSecurityDepositAmount})`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500">Available From</span>
                                                <span className="font-medium text-slate-900">
                                                    {selectedBooking.availability ? format(new Date(selectedBooking.availability), "PP") : "Immediate"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Address</h3>
                                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            {[
                                                selectedBooking.address1, 
                                                selectedBooking.address2, 
                                                selectedBooking.address3, 
                                                selectedBooking.address4
                                            ].filter(Boolean).join(", ")}
                                            {selectedBooking.landmark && (
                                                <span className="block mt-1 text-slate-500">Landmark: {selectedBooking.landmark}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Amenities Column */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Provided Amenities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedBooking.amenities && Object.entries(selectedBooking.amenities).map(([key, value]) => {
                                                // Convert camelCase to Title Case
                                                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                                return renderBooleanItem(formattedKey, value);
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2 mb-4">Rules & Requirements</h3>
                                        <div className="space-y-2">
                                            {renderBooleanItem("Couples Welcome", selectedBooking.couplesWelcome)}
                                            {renderBooleanItem("Pets Welcome", selectedBooking.petsWelcome)}
                                            {renderBooleanItem("3 to 6 Months Commitment", selectedBooking.commitment3to6Months)}
                                            {renderBooleanItem("11 Months Commitment", selectedBooking.commitment11Months)}
                                        </div>
                                        {selectedBooking.specialNote && (
                                            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                                <p className="text-xs font-semibold text-blue-800 uppercase mb-1">Special Note</p>
                                                <p className="text-sm text-blue-900">{selectedBooking.specialNote}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default HostelBooking;