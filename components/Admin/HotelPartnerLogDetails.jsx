"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import bcrypt from 'bcryptjs';
import { Search, Eye, X } from "lucide-react";
import { FileText, Building2, User, MapPin, Banknote } from "lucide-react";
// Helper component for consistent info rows
function InfoRow({ label, value }) {
    return (
        <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500 font-medium">{label}:</span>
            <span className="col-span-2">{value}</span>
        </div>
    );
}

function DocumentPreview({ url, label }) {
    const [isOpen, setIsOpen] = useState(false);
    const fileType = url?.split(".").pop()?.toLowerCase();
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileType);
    const isPdf = fileType === "pdf";

    return (
        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
            <div className="aspect-video relative cursor-pointer" onClick={() => setIsOpen(true)}>
                {isImage ? (
                    <img
                        src={url}
                        alt={label}
                        className="w-full h-full object-cover"
                    />
                ) : isPdf ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <FileText className="h-16 w-16 text-gray-400" />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <FileText className="h-16 w-16 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="p-2 bg-gray-50 border-t">
                <p className="text-xs font-medium text-gray-700 text-center">{label}</p>
            </div>

            {/* Full-size Modal - Higher z-index to appear above main modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center border-b p-4">
                            <h3 className="text-lg font-medium">{label}</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-4 max-h-[70vh] overflow-auto">
                            {isImage ? (
                                <img
                                    src={url}
                                    alt={label}
                                    className="max-w-full max-h-[65vh] mx-auto"
                                />
                            ) : isPdf ? (
                                <div className="w-full h-[65vh]">
                                    <iframe
                                        src={url}
                                        className="w-full h-full border-0"
                                        title={label}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8">
                                    <FileText className="h-20 w-20 text-gray-400 mb-4" />
                                    <p className="mb-4">
                                        Preview not available for this file type
                                    </p>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Download {label}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const HotelPartnerLogDetails = ({ partnerDetails }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
    const [generatedCredentials, setGeneratedCredentials] = useState({
        username: "",
        password: "",
        hotelCode: "",
    });

    if (!partnerDetails) {
        return (
            <div className="text-center py-8">Loading hotel log details..</div>
        );
    }

    const filteredPartners = partnerDetails.filter((partner) => {
        const matchesSearch =
            partner.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.ownerContact?.includes(searchTerm) ||
            partner.ownerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || partner.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleView = (partner) => {
        setSelectedPartner(partner);
        setIsViewOpen(true);
    };

    // Function to generate username from business name
    const generateUsername = (businessName) => {
        return (
            businessName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "") // Remove special characters
                .substring(0, 12) + Math.floor(Math.random() * 1000)
        );
    };

    // Function to generate random password
    const generatePassword = () => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$";
        let password = "";
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };
    const generateHotelCode = () => {
        const letters = Math.random().toString(36).substring(2, 4).toUpperCase(); // 2 letters
        const numbers = Math.floor(10 + Math.random() * 90); // 2 digits
        return `RISH${letters}${numbers}`;
    };


    const handleStatusChange = async (id, newStatus, partner = null) => {
        // If status is being changed to approved, show credentials modal
        if (newStatus === "approved" && partner) {
            const username = generateUsername(partner.ownerName);
            const password = generatePassword();
            const hotelCode = generateHotelCode();

            setGeneratedCredentials({ username, password, hotelCode });
            setIsCredentialsModalOpen(true);
            setSelectedPartner(partner);
            return;
        }

        const loadingToast = toast.loading('Updating status...');

        try {
            const response = await fetch("/api/addPropertyRegistration", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    status: newStatus,
                    ...(newStatus === "approved" && generatedCredentials.username && {
                        partnerUsername: generatedCredentials.username,
                        partnerPassword: generatedCredentials.password,
                        hotelCode: generatedCredentials.hotelCode,
                    }),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            // Dismiss loading toast and show success message
            toast.dismiss(loadingToast);
            toast.success(`Status updated to ${newStatus}`);

            // Refresh after a short delay to show success message
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.dismiss(loadingToast);
            toast.error(error.message || 'Failed to update status');
        }
    };

    const handleApproveWithCredentials = async () => {
        if (!selectedPartner) return;

        const loadingToast = toast.loading('Approving vendor...');

        try {
            const plainPassword = generatedCredentials.password || generatePassword();
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            const hotelCode = generatedCredentials.hotelCode;
            // First update the partner status
            const updateResponse = await fetch("/api/addPropertyRegistration", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: selectedPartner._id,
                    status: "approved",
                    partnerUsername: generatedCredentials.username,
                    partnerPassword: hashedPassword, // Save hashed password
                    partnerPasswordPlain: plainPassword, // Save plain text password
                    hotelCode: hotelCode,
                }),
            });

            if (!updateResponse.ok) {
                throw new Error("Failed to update status");
            }

            // Send email with credentials
            const emailResponse = await fetch('/api/brevo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: selectedPartner.ownerEmail,
                    subject: 'Your Hotel Property Has Been Approved',
                    htmlContent: `<!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Vendor Account Approved</title>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { text-align: center; margin-bottom: 30px; }
                  .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
                  .credentials { background: #fff; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; margin: 20px 0; }
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #4CAF50;
                      color: white !important;
                      text-decoration: none;
                      border-radius: 5px;
                      margin: 15px 0;
                  }
                  .footer { margin-top: 30px; font-size: 12px; color: #777; text-align: center; }
              </style>
          </head>
          <body>
              <div class="header">
                  <h2>Welcome to RishikeshRent Vendor Portal</h2>
              </div>
              
              <div class="content">
                  <p>Dear ${selectedPartner.ownerName},</p>
                  
                  <p>We are pleased to inform you that your vendor application has been approved. You can now access your vendor dashboard using the credentials below:</p>
                  
                  <div class="credentials">
                      <p><strong>Website URL:</strong> <a href="https://rishikeshrent.com/vendor/login">https://rishikeshrent.com/vendor/login</a></p>
                      <p><strong>Hotel Code:</strong> ${generatedCredentials.hotelCode}</p>
                      <p><strong>Username:</strong> ${generatedCredentials.username}</p>
                      <p><strong>Password:</strong> ${plainPassword}</p>
                  </div>                  
                  <div style="text-align: center;">
                      <a href="https://rishikeshrent.com/vendor/login" class="button">Access Vendor Dashboard</a>
                  </div>
                  
                  <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                  
                  <p>Best regards,<br>Rishikesh Rent Team</p>
              </div>
              
              <div class="footer">
                  <p>This is an automated message, please do not reply to this email.</p>
                  <p>© ${new Date().getFullYear()} RishikeshRent.com. All rights reserved.</p>
              </div>
          </body>
          </html>`
                })
            });

            if (!emailResponse.ok) {
                console.error('Failed to send email, but vendor was approved');
                // Continue even if email fails since the approval was successful
            }

            setIsCredentialsModalOpen(false);
            setGeneratedCredentials({ username: "", password: "", hotelCode: "" });
            setSelectedPartner(null);

            // Dismiss loading toast and show success message
            toast.dismiss(loadingToast);
            toast.success('Vendor approved and credentials sent via email');

            // Refresh after a short delay to show success message
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || 'An error occurred while approving the vendor');
        }
    };
    return (
        <div className="space-y-4">
            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by business name,email, mobile, or GST..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Partner Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Property Name</TableHead>
                            <TableHead>Property Type</TableHead>
                            <TableHead>Property Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPartners.length > 0 ? (
                            filteredPartners.map((partner, index) => (
                                <TableRow key={partner._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        {partner.propertyName}
                                    </TableCell>
                                    <TableCell>{partner.propertyType}</TableCell>
                                    <TableCell>{partner.hotelCode || "N/A"}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${partner.status === "approved"
                                                ? "bg-green-100 text-green-800"
                                                : partner.status === "rejected"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {partner.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="flex items-center justify-center gap-2 ">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(partner)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" /> View
                                        </Button>
                                        <Select
                                            value={partner.status}
                                            onValueChange={(newStatus) =>
                                                handleStatusChange(partner._id, newStatus, partner)
                                            }
                                        >
                                            <SelectTrigger className="w-[100px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    No partner applications found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View Modal */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    {selectedPartner && (
                        <div className="space-y-6">
                            {/* Header */}
                            <DialogHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <DialogTitle className="text-3xl font-bold text-gray-900">
                                            {selectedPartner.propertyName}
                                        </DialogTitle>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Registered on: {new Date(selectedPartner.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                                        <span className="text-sm font-medium">Status:</span>
                                        <span
                                            className={`px-3 py-1 text-xs font-bold rounded-full ${selectedPartner.status === "approved"
                                                ? "bg-green-100 text-green-800"
                                                : selectedPartner.status === "rejected"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {selectedPartner.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </DialogHeader>

                            {/* Property Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Category</p>
                                    <p className="text-lg font-bold text-gray-900 capitalize">{selectedPartner.category}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Property Type</p>
                                    <p className="text-lg font-bold text-gray-900 uppercase">{selectedPartner.propertyType}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Star Rating</p>
                                    <p className="text-lg font-bold text-gray-900">{selectedPartner.starRating} ⭐</p>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                {/* Property Details */}
                                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-blue-500 flex items-center">
                                        <Building2 className="h-6 w-6 mr-2 text-blue-600" />
                                        Property Details
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <InfoRow label="Official Name" value={selectedPartner.officialPropertyName || "N/A"} />
                                        <InfoRow label="Ownership Type" value={selectedPartner.ownershipType || "N/A"} />
                                        <InfoRow label="Chain Property" value={selectedPartner.isChainProperty === "true" ? "Yes" : "No"} />
                                        {selectedPartner.isChainProperty === "true" && (
                                            <InfoRow label="Chain Name" value={selectedPartner.chainName || "N/A"} />
                                        )}
                                        {selectedPartner.furnishingStatus && (
                                            <InfoRow label="Furnishing" value={selectedPartner.furnishingStatus} />
                                        )}
                                        <InfoRow label="Rooms" value={selectedPartner.numberOfRooms || "N/A"} />
                                        <InfoRow label="Floors" value={selectedPartner.numberOfFloors || "N/A"} />

                                        {/* Home-specific fields */}
                                        {selectedPartner.category === 'homes' && selectedPartner.homeListingType && (
                                            <InfoRow label="Home Listing Type" value={selectedPartner.homeListingType === 'one' ? 'One Property' : 'Multiple Properties'} />
                                        )}

                                        {/* Alternative-specific fields */}
                                        {selectedPartner.category === 'alternative' && (
                                            <>
                                                {selectedPartner.alternativeSubtype && (
                                                    <InfoRow label="Alternative Subtype" value={selectedPartner.alternativeSubtype.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
                                                )}
                                                {selectedPartner.alternativeBookingType && (
                                                    <InfoRow label="Booking Type" value={selectedPartner.alternativeBookingType === 'entire-place' ? 'Entire Place' : 'Private Room'} />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Location Details */}
                                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-green-500 flex items-center">
                                        <MapPin className="h-6 w-6 mr-2 text-green-600" />
                                        Location
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <InfoRow label="Address Line 1" value={selectedPartner.addressLine1 || "N/A"} />
                                        <InfoRow label="Address Line 2" value={selectedPartner.addressLine2 || "N/A"} />
                                        <InfoRow label="Apartment/Floor" value={selectedPartner.apartmentOrFloor || "N/A"} />
                                        <InfoRow label="City" value={selectedPartner.city || "N/A"} />
                                        <InfoRow label="PIN Code" value={selectedPartner.pinCode || "N/A"} />
                                        <InfoRow label="Google Location" value={selectedPartner.googleLocationCode || "N/A"} />
                                    </div>
                                </div>

                                {/* Owner Information */}
                                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-purple-500 flex items-center">
                                        <User className="h-6 w-6 mr-2 text-purple-600" />
                                        Owner Information
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <InfoRow label="Owner Name" value={selectedPartner.ownerName || "N/A"} />
                                        <InfoRow label="Email" value={selectedPartner.ownerEmail || "N/A"} />
                                        <InfoRow label="Contact" value={selectedPartner.ownerContact || "N/A"} />
                                        <InfoRow label="Aadhaar Number" value={selectedPartner.aadhaarNumber || "N/A"} />
                                        <InfoRow label="Official Email" value={selectedPartner.officialEmail || "N/A"} />
                                        <InfoRow label="Official Contact" value={selectedPartner.officialContact || "N/A"} />
                                        <InfoRow label="Alternative Contact" value={selectedPartner.alternativeContact || "N/A"} />
                                    </div>
                                </div>

                                {/* Bank Details */}
                                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-orange-500 flex items-center">
                                        <Banknote className="h-6 w-6 mr-2 text-orange-600" />
                                        Bank Details
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <InfoRow label="Account Holder" value={selectedPartner.accountHolderName || "N/A"} />
                                        <InfoRow label="Account Number" value={selectedPartner.accountNumber || "N/A"} />
                                        <InfoRow label="IFSC Code" value={selectedPartner.ifscCode || "N/A"} />
                                        <InfoRow label="Bank Address" value={selectedPartner.bankAddress || "N/A"} />
                                        <InfoRow label="PAN Number" value={selectedPartner.propertyPanNumber || "N/A"} />
                                        <InfoRow label="GST Number" value={selectedPartner.gstNumber || "N/A"} />
                                    </div>
                                </div>
                            </div>

                            {/* Facilities & Services */}
                            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-teal-500 flex items-center">
                                    <FileText className="h-6 w-6 mr-2 text-teal-600" />
                                    Facilities & Services
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Facilities */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Facilities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPartner.facilities && selectedPartner.facilities.length > 0 ? (
                                                selectedPartner.facilities.map((facility, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        {facility}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">No facilities listed</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Languages Spoken</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPartner.languagesSpoken && selectedPartner.languagesSpoken.length > 0 ? (
                                                selectedPartner.languagesSpoken.map((lang, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                        {lang}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 text-sm">No languages listed</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Breakfast */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Breakfast Service</h4>
                                        <div className="space-y-2 text-sm">
                                            <InfoRow label="Serves Breakfast" value={selectedPartner.servesBreakfast ? "Yes" : "No"} />
                                            {selectedPartner.servesBreakfast && (
                                                <>
                                                    <InfoRow label="Included" value={selectedPartner.breakfastIncluded ? "Yes" : "No"} />
                                                    {selectedPartner.breakfastTypes && selectedPartner.breakfastTypes.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {selectedPartner.breakfastTypes.map((type, idx) => (
                                                                <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                                                    {type}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Parking */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Parking</h4>
                                        <div className="space-y-2 text-sm">
                                            <InfoRow label="Available" value={selectedPartner.parkingAvailable || "N/A"} />
                                            {selectedPartner.parkingAvailable === "paid" && (
                                                <>
                                                    <InfoRow label="Cost" value={`₹${selectedPartner.parkingCost} ${selectedPartner.parkingCostPeriod}`} />
                                                    <InfoRow label="Type" value={selectedPartner.parkingType || "N/A"} />
                                                    <InfoRow label="Location" value={selectedPartner.parkingLocation || "N/A"} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* House Rules */}
                            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-red-500">
                                    House Rules
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <InfoRow label="Check-in From" value={selectedPartner.checkInFrom || "N/A"} />
                                    <InfoRow label="Check-in Until" value={selectedPartner.checkInUntil || "N/A"} />
                                    <InfoRow label="Check-out From" value={selectedPartner.checkOutFrom || "N/A"} />
                                    <InfoRow label="Check-out Until" value={selectedPartner.checkOutUntil || "N/A"} />
                                    <InfoRow label="Children Allowed" value={selectedPartner.allowChildren ? "Yes" : "No"} />
                                    <InfoRow label="Pets Allowed" value={selectedPartner.allowPets || "No"} />
                                </div>
                            </div>

                            {/* Rooms */}
                            {selectedPartner.rooms && selectedPartner.rooms.length > 0 && (
                                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-indigo-500">
                                        Rooms ({selectedPartner.rooms.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedPartner.rooms.map((room, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <h4 className="font-bold text-gray-900 mb-2">{room.roomType}</h4>
                                                <div className="space-y-1 text-sm">
                                                    <InfoRow label="Number of Rooms" value={room.numberOfRooms} />
                                                    <InfoRow label="Max Guests" value={room.maxGuests} />
                                                    <InfoRow label="Room Size" value={`${room.roomSize} sq ft`} />
                                                    <InfoRow label="Price/Night" value={`₹${room.pricePerNight}`} />
                                                    <InfoRow label="Private Bathroom" value={room.privateBathroom ? "Yes" : "No"} />
                                                    <InfoRow label="Smoking" value={room.smokingAllowed ? "Allowed" : "Not Allowed"} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Property Images */}
                            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-pink-500">
                                    Property Images
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Object.entries(selectedPartner.propertyImages || {}).map(([category, images]) => (
                                        images && images.length > 0 && images.map((img, idx) => (
                                            <DocumentPreview
                                                key={`${category}-${idx}`}
                                                url={img.url}
                                                label={`${category.replace('-', ' ')} ${idx + 1}`}
                                            />
                                        ))
                                    ))}
                                </div>
                            </div>

                            {/* Documents */}
                            {/* Documents */}
                            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-cyan-500">
                                    Documents
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[
                                        { field: 'profilePhoto', label: 'Profile Photo' },
                                        { field: 'propertyPanDocument', label: 'PAN Document' },
                                        { field: 'gstDocument', label: 'GST Document' },
                                        { field: 'cancelledCheque', label: 'Cancelled Cheque' },
                                    ].map(({ field, label }) => (
                                        selectedPartner[field]?.url && (
                                            <DocumentPreview
                                                key={field}
                                                url={selectedPartner[field].url}
                                                label={label}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-200">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsViewOpen(false)}
                                    className="min-w-[120px]"
                                >
                                    Close
                                </Button>
                                <Button
                                    variant={selectedPartner.status === "rejected" ? "outline" : "destructive"}
                                    onClick={() => {
                                        handleStatusChange(
                                            selectedPartner._id,
                                            selectedPartner.status === "rejected" ? "pending" : "rejected"
                                        );
                                        setIsViewOpen(false);
                                    }}
                                    className="min-w-[120px]"
                                >
                                    {selectedPartner.status === "rejected" ? "Mark as Pending" : "Reject"}
                                </Button>
                                {selectedPartner.status !== "approved" && (
                                    <Button
                                        onClick={() => {
                                            handleStatusChange(selectedPartner._id, "approved", selectedPartner);
                                            setIsViewOpen(false);
                                        }}
                                        className="min-w-[120px] bg-green-600 hover:bg-green-700"
                                    >
                                        Approve
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Credentials Modal */}
            <Dialog
                open={isCredentialsModalOpen}
                onOpenChange={setIsCredentialsModalOpen}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-green-600">
                            Partner Approved!
                        </DialogTitle>
                        <p className="text-sm text-gray-600 mt-2">
                            Auto-generated login credentials for the partner
                        </p>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={generatedCredentials.username}
                                    readOnly
                                    className="bg-gray-50 font-mono"
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(generatedCredentials.username)
                                    }
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={generatedCredentials.password}
                                    readOnly
                                    className="bg-gray-50 font-mono"
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(generatedCredentials.password)
                                    }
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Hotel Code
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={generatedCredentials.hotelCode}
                                    readOnly
                                    className="bg-gray-50 font-mono"
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(generatedCredentials.hotelCode)
                                    }
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-blue-800">
                                <strong>Note:</strong> Please save these credentials securely.
                                Share them with the partner through a secure channel.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsCredentialsModalOpen(false);
                                setGeneratedCredentials({ username: "", password: "", hotelCode: "" });
                                setSelectedPartner(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApproveWithCredentials}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Confirm Approval
                        </Button>
                    </div>


                </DialogContent>
            </Dialog>
        </div >
    );
};

export default HotelPartnerLogDetails;
