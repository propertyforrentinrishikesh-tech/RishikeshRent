"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { Calendar, Mail, MessageSquare, ScanSearch, Trash2, ChevronLeft, ChevronRight, PhoneCall, Filter, Inbox } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const ContactPageEnquiry = () => {
    const [allEnquiry, setAllEnquiry] = useState([])
    const [filteredEnquiry, setFilteredEnquiry] = useState([])
    const [selectedEnquiry, setSelectedEnquiry] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedMonth, setSelectedMonth] = useState('all')
    const [loading, setLoading] = useState(true)
    const itemsPerPage = 10

    const [typeFilter, setTypeFilter] = useState('all');
    
    useEffect(() => {
        const fetchEnquiries = async () => {
            setLoading(true)
            try {
                const url = typeFilter === 'all' ? '/api/contactPageEnquiry' : `/api/contactPageEnquiry?type=${typeFilter}`;
                const response = await fetch(url);
                let data = await response.json();
                
                // Handle different response formats
                if (Array.isArray(data)) {
                    // If data is already an array, use it as is
                    setAllEnquiry(data);
                    setFilteredEnquiry(data);
                } else if (data && typeof data === 'object') {
                    // If data is an object, convert it to an array of its values
                    const dataArray = Object.values(data);
                    setAllEnquiry(dataArray);
                    setFilteredEnquiry(dataArray);
                } else {
                    // If data is not in expected format, set to empty array
                    console.warn('Unexpected API response format:', data);
                    setAllEnquiry([]);
                    setFilteredEnquiry([]);
                }
            } catch (error) {
                console.error('Error fetching enquiries:', error);
                toast.error("Failed to load enquiries", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
                setAllEnquiry([]);
                setFilteredEnquiry([]);
            } finally {
                setLoading(false)
            }
        }
        fetchEnquiries();
    }, [typeFilter]);

    // Group enquiries by month
    const groupByMonth = (enquiries) => {
        const months = {}
        if (!Array.isArray(enquiries)) {
            return months
        }
        enquiries.forEach(enquiry => {
            const date = new Date(enquiry.createdAt)
            const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`
            if (!months[monthYear]) {
                months[monthYear] = []
            }
            months[monthYear].push(enquiry)
        })
        return months
    }

    const monthGroups = groupByMonth(allEnquiry)

    // Filter enquiries by selected month
    useEffect(() => {
        if (selectedMonth === 'all') {
            setFilteredEnquiry(allEnquiry)
            setCurrentPage(1)
        } else {
            const filtered = monthGroups[selectedMonth] || []
            setFilteredEnquiry(filtered)
            setCurrentPage(1)
        }
    }, [selectedMonth, allEnquiry])

    // Pagination logic
    const totalPages = Math.ceil(filteredEnquiry.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredEnquiry.slice(indexOfFirstItem, indexOfLastItem)

    const handleView = (enquiry) => {
        setSelectedEnquiry(enquiry)
        setIsOpen(true)
    }
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24 mt-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Enquiries & Contacts</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and view all incoming enquiries from the contact page and product queries.</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden h-full">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Inbox className="w-5 h-5 text-slate-400" />
                                    <CardTitle className="text-lg font-semibold text-slate-800">All Enquiries</CardTitle>
                                    <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                                        {filteredEnquiry.length} Total
                                    </Badge>
                                </div>
                                <CardDescription className="text-slate-500 mt-1">Review and manage user submissions.</CardDescription>
                            </div>
                            
                            {/* Type & Month Filter */}
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[140px] h-9 border-slate-200 bg-white rounded-xl text-sm">
                                            <SelectValue placeholder="All Plans" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Plans</SelectItem>
                                            <SelectItem value="Yoga Retreat">Yoga Retreat</SelectItem>
                                            <SelectItem value="Meditation">Meditation</SelectItem>
                                            <SelectItem value="Wellness">Wellness</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="w-[160px] h-9 border-slate-200 bg-white rounded-xl text-sm">
                                            <SelectValue placeholder="All Months" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Months</SelectItem>
                                            {Object.keys(monthGroups).map((month) => (
                                                <SelectItem key={month} value={month}>{month}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                        <TableRow className="hover:bg-transparent border-0">
                                            <TableHead className="text-slate-500 font-medium h-12 pl-6 w-[140px]">Date</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12">User Details</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12">Plan & Guests</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12 max-w-[300px]">Message Snippet</TableHead>
                                            <TableHead className="text-slate-500 font-medium text-right pr-6 h-12 w-28">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={i} className="border-b border-slate-50">
                                                    <TableCell className="pl-6 py-4">
                                                        <Skeleton className="h-4 w-[100px] rounded-md" />
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col gap-2">
                                                            <Skeleton className="h-5 w-[140px] rounded-md" />
                                                            <Skeleton className="h-4 w-[180px] rounded-md" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex flex-col gap-2">
                                                            <Skeleton className="h-5 w-[80px] rounded-full" />
                                                            <Skeleton className="h-4 w-[120px] rounded-md" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Skeleton className="h-8 w-full rounded-md" />
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4">
                                                        <Skeleton className="h-9 w-20 rounded-xl ml-auto" />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : currentItems.length > 0 ? currentItems.map((enquiry) => (
                                            <TableRow key={enquiry._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                                                <TableCell className="pl-6 py-4 align-top text-sm text-slate-600 whitespace-nowrap">
                                                    {new Date(enquiry.createdAt).toLocaleDateString('en-In', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </TableCell>
                                                <TableCell className="py-4 align-top">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-slate-800">{enquiry.name}</span>
                                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {enquiry.email}</span>
                                                            <span className="flex items-center gap-1"><PhoneCall className="w-3 h-3" /> +91 {enquiry.phone}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 align-top">
                                                    <div className="flex flex-col gap-2 items-start">
                                                        <Badge variant="outline" className="capitalize bg-slate-50 text-slate-700 border-slate-200">
                                                            {enquiry.plan || 'General'}
                                                        </Badge>
                                                        <span className="text-xs text-slate-500 truncate max-w-[150px]" title={enquiry.guests}>
                                                            {enquiry.guests || '1 guest'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 align-top max-w-[300px]">
                                                    <p className="text-sm text-slate-600 line-clamp-2 italic">
                                                        "{enquiry.message}"
                                                    </p>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4 align-top">
                                                    <Button 
                                                        onClick={() => handleView(enquiry)} 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                                                    >
                                                        <ScanSearch className="w-4 h-4 mr-2" /> View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-32 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                                        <Inbox className="w-8 h-8 mb-2 text-slate-300" />
                                                        <p>No enquiries found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            
                            {/* Pagination */}
                            {filteredEnquiry.length > itemsPerPage && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                                    <div className="text-sm text-slate-500">
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEnquiry.length)} of {filteredEnquiry.length} entries
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="h-9 border-slate-200 text-slate-600 rounded-xl"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                                        </Button>
                                        <div className="flex items-center px-2 text-sm font-medium text-slate-700">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="h-9 border-slate-200 text-slate-600 rounded-xl"
                                        >
                                            Next <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Enquiry Details Dialog */}
            {isOpen && selectedEnquiry && (
                <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
                    <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
                        <DialogHeader className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                            <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                <Inbox className="w-5 h-5 text-blue-600" />
                                Enquiry Details
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Personal and Contact Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedEnquiry.name}</h2>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(selectedEnquiry.createdAt).toLocaleDateString('en-In', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(selectedEnquiry.createdAt).toLocaleTimeString('en-In', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan of Interest</span>
                                            <Badge className="w-fit capitalize bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-3 py-1">{selectedEnquiry.plan || 'Not Specified'}</Badge>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Guests</span>
                                            <span className="text-slate-800 font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{selectedEnquiry.guests || '1 guest'}</span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preferred Start Date</span>
                                            <span className="text-slate-700">{selectedEnquiry.date ? new Date(selectedEnquiry.date).toLocaleDateString() : 'Flexible / Not specified'}</span>
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Information</span>
                                            
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                                                    <Mail className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <a href={`mailto:${selectedEnquiry.email}`} className="hover:text-blue-600 transition-colors font-medium">{selectedEnquiry.email}</a>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 text-slate-700 mt-2">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                                                    <PhoneCall className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <a href={`tel:${selectedEnquiry.phone}`} className="hover:text-blue-600 transition-colors font-medium">+91 {selectedEnquiry.phone}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right: Question/Message */}
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        User Message
                                    </h3>
                                    <div className="flex-1 bg-blue-50/50 rounded-2xl border border-blue-100 p-5 shadow-inner">
                                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[15px] italic">
                                            "{selectedEnquiry.message}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl border-slate-200 text-slate-700 hover:bg-white w-full sm:w-auto h-11 px-8">
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default ContactPageEnquiry