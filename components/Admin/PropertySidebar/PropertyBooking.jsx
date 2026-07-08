"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  Trash2,
  Search,
  Filter,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Star,
  StickyNote,
  Hash,
  User,
} from "lucide-react";

const STATUS_CONFIG = {
  Pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  Confirmed: {
    label: "Confirmed",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Cancelled: {
    label: "Cancelled",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    icon: <X className="w-3 h-3" />,
  },
};

const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);
const ITEMS_PER_PAGE = 15;

// ─── Main Component ────────────────────────────────────────────────────────────
const PropertyBooking = ({ locationType = [] }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const debounceRef = useRef(null);

  // Dialogs
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Note editing
  const [editingNote, setEditingNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: currentPage, limit: ITEMS_PER_PAGE });
      if (search) params.set("search", search);
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterLocation !== "all") params.set("locationType", filterLocation);

      // Fetch bookings instead of enquiries
      const res = await fetch(`/api/property/propertyBooking?${params.toString()}`);
      const data = await res.json();
      // console.log(data)
      if (data.success) {
        setEnquiries(data.data || []);
        setTotalEnquiries(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error("Failed to load bookings");
      }
    } catch {
      toast.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, filterStatus, filterLocation]);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);
  useEffect(() => { setCurrentPage(1); }, [search, filterStatus, filterLocation]);

  // ─── Debounced search ────────────────────────────────────────────────────────
  const handleSearchInput = (val) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(val), 500);
  };

  // ─── Update status ───────────────────────────────────────────────────────────
  const updateStatus = async (enquiry, newStatus) => {
    setUpdatingId(enquiry._id);
    try {
      const res = await fetch(`/api/property/propertyBooking?id=${enquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status updated to "${newStatus}"`);
        setEnquiries((prev) =>
          prev.map((e) => e._id === enquiry._id ? { ...e, status: newStatus } : e)
        );
        if (selectedEnquiry?._id === enquiry._id)
          setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
      } else toast.error("Failed to update status");
    } catch { toast.error("Error updating status"); }
    finally { setUpdatingId(null); }
  };

  // ─── Save admin note ─────────────────────────────────────────────────────────
  const saveNote = async () => {
    if (!selectedEnquiry) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/property/propertyBooking?id=${selectedEnquiry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: editingNote }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Note saved");
        setEnquiries((prev) =>
          prev.map((e) => e._id === selectedEnquiry._id ? { ...e, adminNote: editingNote } : e)
        );
        setSelectedEnquiry((prev) => ({ ...prev, adminNote: editingNote }));
      } else toast.error("Failed to save note");
    } catch { toast.error("Error saving note"); }
    finally { setSavingNote(false); }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const formatDateTime = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
  const formatCurrency = (value) =>
    value === 0 || value ? `₹${Number(value).toLocaleString("en-IN")}` : "—";

  const getPaymentTypeLabel = (enquiry) => {
    if (enquiry?.selectedPaymentLabel) return enquiry.selectedPaymentLabel;
    if (enquiry?.selectedPaymentOption === "full") return "Full amount";
    if (enquiry?.selectedPaymentOption === "advance") return "Minimum amount";
    if (enquiry?.selectedPaymentOption === "custom") return "Custom amount";
    if (Number(enquiry?.totalAmount) > 0) return "Full amount";
    if (Number(enquiry?.advanceAmount) > 0) return "Minimum amount";
    if (Number(enquiry?.otherAmount) > 0) return "Custom amount";
    return "—";
  };

  const getExpectedAmount = (enquiry) => {
    const expected = Number(enquiry?.expectedTotalAmount || 0);
    if (expected > 0) return expected;
    const fallback = Number(enquiry?.totalAmount || enquiry?.amountToPay || enquiry?.amount || 0);
    return fallback > 0 ? fallback : 0;
  };

  const getRemainingAmount = (enquiry) => {
    const storedRemaining = Number(enquiry?.remainingAmount || 0);
    if (storedRemaining > 0) return storedRemaining;
    const expected = getExpectedAmount(enquiry);
    const paid = Number(enquiry?.amountToPay || enquiry?.amount || 0);
    return Math.max(expected - paid, 0);
  };

  const clearFilters = () => { setSearch(""); setFilterStatus("all"); setFilterLocation("all"); };
  const hasFilters = search || filterStatus !== "all" || filterLocation !== "all";
  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-teal-600" />
            Property Bookings
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage all property bookings and payments</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchEnquiries}
          className="flex items-center gap-1.5 text-xs">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(() => {
          const confirmedCount = enquiries.filter((b) => b.status === "Confirmed").length;
          const pendingCount = enquiries.filter((b) => b.status === "Pending").length;
          return [
            { label: "Total Bookings", value: totalEnquiries, color: "bg-teal-600", icon: <MessageSquare className="w-4 h-4" /> },
            { label: "Confirmed", value: confirmedCount, color: "bg-emerald-600", icon: <Star className="w-4 h-4" /> },
            { label: "Pending", value: pendingCount, color: "bg-amber-600", icon: <AlertCircle className="w-4 h-4" /> },
            { label: "This Page", value: enquiries.length, color: "bg-violet-600", icon: <Hash className="w-4 h-4" /> },
          ].map((s) => (
            s
          ));
        })().map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex items-center gap-3">
            <div className={`${s.color} text-white rounded-lg p-2 flex-shrink-0`}>{s.icon}</div>
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
              onChange={(e) => handleSearchInput(e.target.value)}
              className="pl-8 h-9 text-sm border-slate-200"
            />
          </div>
          {/* Status */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9 text-sm border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Location */}
          <Select value={filterLocation} onValueChange={setFilterLocation}>
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-cyan-50">
            <h2 className="text-sm font-bold text-teal-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Booking List
            </h2>
          <span className="text-xs text-teal-600 font-semibold bg-teal-100 px-2.5 py-1 rounded-full">
            {totalEnquiries} total
          </span>
        </div>

        {loading ? (
          <EnquirySkeleton />
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-3">
              <MessageSquare className="w-8 h-8 text-teal-200" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">No bookings found</h3>
            <p className="text-xs text-slate-400 text-center max-w-xs">
              {hasFilters ? "Try adjusting your filters." : "Bookings from property pages will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-slate-600 font-bold text-xs w-12 text-center">S.No</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs">Contact</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs">Property</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs">Location</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs">Booking Date</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs">Amount</TableHead>
                  <TableHead className="text-slate-600 font-bold text-xs">Status</TableHead>
                  <TableHead className="text-center text-slate-600 font-bold text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.map((enquiry, idx) => {
                  const rowColors = [
                    "bg-teal-50/40 hover:bg-teal-50",
                    "bg-cyan-50/40 hover:bg-cyan-50",
                    "bg-sky-50/40 hover:bg-sky-50",
                  ];
                  const rowBg = rowColors[idx % rowColors.length];
                  return (
                    <TableRow key={enquiry._id} className={`transition-colors ${rowBg}`}>
                      <TableCell className="text-center">
                        <span className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center mx-auto">
                          {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                        </span>
                      </TableCell>

                      <TableCell>
                        <a href={`tel:${enquiry.phone || enquiry.contact || enquiry.userPhone}`}
                          className="flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                          {enquiry.phone || enquiry.contact || enquiry.userPhone || "—"}
                        </a>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm text-slate-700 font-medium line-clamp-1 max-w-[160px]">
                          {enquiry.propertyName || enquiry.propertySnapshot?.propertyName || enquiry.propertyId?.propertyName || "—"}
                        </p>
                      </TableCell>

                      <TableCell>
                        {(enquiry.locationType || enquiry.propertySnapshot?.locationType || enquiry.propertyId?.locationType) ? (
                          <div className="flex items-center gap-1 text-xs text-slate-600">
                            <MapPin className="w-3 h-3 text-teal-500 flex-shrink-0" />
                            {enquiry.locationType || enquiry.propertySnapshot?.locationType || enquiry.propertyId?.locationType}
                          </div>
                        ) : <span className="text-slate-400 text-xs">—</span>}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(enquiry.createdAt)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm font-semibold text-slate-800">{formatCurrency(enquiry.amountToPay || enquiry.amount || 0)}</p>
                        <p className="text-[11px] text-slate-500">{getPaymentTypeLabel(enquiry)}</p>
                        <p className="text-[11px] text-amber-600 font-medium">Remaining: {formatCurrency(getRemainingAmount(enquiry))}</p>
                      </TableCell>

                      <TableCell>
                        <span className={`text-xs font-semibold ${enquiry.status === "Confirmed" ? "text-emerald-600" : enquiry.status === "Cancelled" ? "text-slate-600" : "text-amber-600"}`}>
                          {enquiry.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedEnquiry(enquiry);
                              setEditingNote(enquiry.adminNote || "");
                              setIsViewOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-all shadow-sm"
                            title="View Details">
                            <Eye className="w-3.5 h-3.5" />
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
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalEnquiries)}
            </span> of <span className="font-semibold text-slate-700">{totalEnquiries}</span>
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
                    ? "bg-teal-600 text-white shadow-sm"
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

      {/* ── View Dialog ── */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="flex flex-col">
              {/* Hero */}
              <div className="bg-gradient-to-br from-teal-600 to-cyan-700 p-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {selectedEnquiry.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{selectedEnquiry.fullName}</h2>
                      <p className="text-teal-100 text-sm flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5" />{selectedEnquiry.phone}
                      </p>
                      {selectedEnquiry.email && (
                        <p className="text-teal-100 text-xs flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />{selectedEnquiry.email}
                        </p>
                      )}
                      {selectedEnquiry.bookingRef && (
                        <p className="text-teal-50 text-xs mt-1 font-medium">Ref: {selectedEnquiry.bookingRef}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-teal-100 text-xs">Created</p>
                    <p className="text-white font-semibold text-sm">{formatDateTime(selectedEnquiry.createdAt)}</p>
                    <p className="text-teal-50 text-xs mt-1">Updated: {formatDateTime(selectedEnquiry.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4 bg-slate-50">
                {/* Status Update */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" /> Update Booking Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const isActive = selectedEnquiry.status === s;
                      return (
                        <button key={s}
                          onClick={() => updateStatus(selectedEnquiry, s)}
                          disabled={updatingId === selectedEnquiry._id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${isActive
                            ? `${cfg.color} shadow-sm ring-2 ring-offset-1 ring-current`
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Guest Info */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" /> Guest Info
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Guest Title" value={selectedEnquiry.guestTitle} />
                    <InfoRow label="Full Name" value={selectedEnquiry.fullName} />
                    <InfoRow label="Phone" value={selectedEnquiry.phone} />
                    <InfoRow label="Email" value={selectedEnquiry.email} />
                    <InfoRow label="Total Persons" value={selectedEnquiry.totalPersons} />
                  </div>
                </div>

                {/* Property Info */}
                {(selectedEnquiry.propertyName || selectedEnquiry.propertyId || selectedEnquiry.propertyAddress) && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-600" /> Property Booked
                    </h3>
                    <div className="space-y-2">
                      <InfoRow label="Property Name" value={selectedEnquiry.propertyName || selectedEnquiry.propertyId?.propertyName} />
                      <InfoRow label="Property Address" value={selectedEnquiry.propertyAddress} />
                      <InfoRow label="Location" value={selectedEnquiry.locationType || selectedEnquiry.propertyId?.locationType} />
                      <InfoRow label="Sub Location" value={selectedEnquiry.subLocationType || selectedEnquiry.propertyId?.subLocationType} />
                    </div>
                  </div>
                )}

                {/* Stay Info */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" /> Stay Details
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Check-in Date" value={formatDate(selectedEnquiry.checkInDate)} />
                    <InfoRow label="Length Of Stay" value={selectedEnquiry.lengthOfStay} />
                    <InfoRow label="Source Page" value={selectedEnquiry.sourcePage} />
                    <InfoRow label="Booking Status" value={selectedEnquiry.status} />
                  </div>
                </div>

                {/* ID Proof */}
                {(selectedEnquiry.idProofType || selectedEnquiry.idImage?.url) && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-teal-600" /> ID Proof
                    </h3>
                    <div className="space-y-2">
                      <InfoRow label="ID Type" value={selectedEnquiry.idProofType} />
                      {selectedEnquiry.idImage?.url && (
                        <a href={selectedEnquiry.idImage.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-slate-200">
                          <img src={selectedEnquiry.idImage.url} alt="ID Proof" className="h-48 w-full object-cover" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" /> Payment Info
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Payment Type" value={getPaymentTypeLabel(selectedEnquiry)} />
                    <InfoRow label="Total Amount" value={formatCurrency(selectedEnquiry.totalAmount)} />
                    <InfoRow label="Advance Amount" value={formatCurrency(selectedEnquiry.advanceAmount)} />
                    <InfoRow label="Other Amount" value={formatCurrency(selectedEnquiry.otherAmount)} />
                    <InfoRow label="Amount To Pay" value={formatCurrency(selectedEnquiry.amountToPay)} />
                    <InfoRow label="Expected Total" value={formatCurrency(getExpectedAmount(selectedEnquiry))} />
                    <InfoRow label="Remaining Amount" value={formatCurrency(getRemainingAmount(selectedEnquiry))} />
                    <InfoRow label="Currency" value={selectedEnquiry.currency} />
                  </div>
                </div>

                {/* Notes */}
                {(selectedEnquiry.message || selectedEnquiry.adminNote) && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-amber-500" /> Notes
                    </h3>
                    <div className="space-y-3">
                      {selectedEnquiry.message && (
                        <div className="bg-teal-50 border border-teal-100 rounded-lg p-3">
                          <p className="text-sm text-slate-700 italic leading-relaxed">{selectedEnquiry.message}</p>
                        </div>
                      )}
                      <textarea
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        placeholder="Add a private note about this booking..."
                        rows={3}
                        className="w-full text-sm border border-slate-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-400 bg-amber-50/40"
                      />
                      <div className="flex justify-end">
                        <Button size="sm" onClick={saveNote} disabled={savingNote}
                          className="h-8 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold">
                          {savingNote ? "Saving..." : "Save Note"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
// ─── Sub-components ────────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-slate-500 font-medium min-w-[110px] flex-shrink-0 mt-0.5">{label}:</span>
      <span className="text-xs text-slate-800 font-semibold">{value}</span>
    </div>
  );
};

const EnquirySkeleton = () => (
  <div>
    <div className="h-10 bg-slate-50 border-b border-slate-200" />
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-slate-100">
        <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 bg-slate-200 rounded animate-pulse w-28" />
            <div className="h-2.5 bg-slate-100 rounded animate-pulse w-36" />
          </div>
        </div>
        <div className="h-3.5 bg-slate-200 rounded animate-pulse w-24" />
        <div className="h-3.5 bg-slate-200 rounded animate-pulse w-32" />
        <div className="h-3.5 bg-slate-200 rounded animate-pulse w-20" />
        <div className="h-3.5 bg-slate-200 rounded animate-pulse w-20" />
        <div className="h-7 bg-slate-200 rounded-lg animate-pulse w-28" />
        <div className="flex gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-slate-200 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-slate-200 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default PropertyBooking;