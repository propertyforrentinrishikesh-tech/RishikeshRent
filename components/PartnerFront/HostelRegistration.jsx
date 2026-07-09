"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Trash2Icon, UploadIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const HostelRegistration = ({ initialData }) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [responseData, setResponseData] = useState(null);

    const [propertyTypes, setPropertyTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingData(true);
                // Fetch property types
                try {
                    const propResponse = await fetch("/api/property/propertyType");
                    if (propResponse.ok) {
                        const propData = await propResponse.json();
                        if (Array.isArray(propData)) setPropertyTypes(propData);
                        else if (propData && propData.success && Array.isArray(propData.data)) setPropertyTypes(propData.data);
                    }
                } catch (error) {
                    console.error("Error fetching property types:", error);
                }

                // Fetch locations
                try {
                    const locResponse = await fetch("/api/property/createLocation");
                    if (locResponse.ok) {
                        const locData = await locResponse.json();
                        if (Array.isArray(locData)) setLocations(locData);
                        else if (locData && locData.success && Array.isArray(locData.data)) setLocations(locData.data);
                    }
                } catch (error) {
                    console.error("Error fetching location types:", error);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);
    const [formData, setFormData] = useState({
        // Step 1
        propertyName: initialData?.propertyName || '',
        contactNumber: initialData?.contactNumber || '',
        email: initialData?.email || '',
        locationType: '',
        propertyFor: '',
        propertyType: '',
        address1: '',
        address2: '',
        address3: '',
        address4: '',
        landmark: '',

        // Step 2
        primaryImage: { url: '', key: '' },
        outsideBuilding: { url: '', key: '' },
        roomImage: { url: '', key: '' },
        bathroomImage: { url: '', key: '' },
        otherImage: { url: '', key: '' },

        // Step 3
        monthlyRent: '',
        securityDeposit: '',
        totalSecurityDepositAmount: '',
        availability: '',
        specialNote: '',

        // Step 4
        amenities: {
            water: false, electricity: false, internet: false, stairs: false,
            roomOnly: false, preFixSingleBed: false, sharingBathroom: false, kitchen: false,
            roomAlmirah: false, rooftopTerraceAccess: false, parking: false, balcony: false,
            lift: false, guestsMax3: false, preFixDoubleBed: false, privateBathroom: false,
            bathroomGeyser: false, kitchenGeyser: false, chair: false, outdoorSeating: false,
        },
    });

    const [uploadingImage, setUploadingImage] = useState(null);
    const fileInputRefs = {
        primaryImage: useRef(null),
        outsideBuilding: useRef(null),
        roomImage: useRef(null),
        bathroomImage: useRef(null),
        otherImage: useRef(null),
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };
            
            // Auto calculate total security deposit if rent or deposit months change
            if (name === 'monthlyRent' || name === 'securityDeposit') {
                const rent = parseFloat(name === 'monthlyRent' ? value : prev.monthlyRent) || 0;
                const months = parseFloat(name === 'securityDeposit' ? value : prev.securityDeposit) || 0;
                updated.totalSecurityDepositAmount = (rent * months).toString();
            }
            
            return updated;
        });
    };

    const handleAmenityChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [name]: checked
            }
        }));
    };

    const handleImageChange = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(fieldName);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: { url: data.url, key: data.key || '' }
                }));
                toast.success('Image uploaded successfully!');
            } else {
                toast.error('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            toast.error('Upload error: ' + err.message);
        }
        setUploadingImage(null);
    };

    const handleDeleteImage = (fieldName) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: { url: '', key: '' }
        }));
    };

    const validateStep1 = () => {
        if (!formData.propertyName) { toast.error("Property Name is required"); return false; }
        if (!formData.contactNumber) { toast.error("Contact Number is required"); return false; }
        if (!formData.locationType) { toast.error("location Type is required"); return false; }
        if (!formData.propertyFor) { toast.error("Property For is required"); return false; }
        if (!formData.propertyType) { toast.error("Property Type is required"); return false; }
        if (!formData.address1) { toast.error("At least one Address line is required"); return false; }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.primaryImage.url) { toast.error("Primary Image is required"); return false; }
        return true;
    };

    const validateStep3 = () => {
        if (!formData.monthlyRent) { toast.error("Monthly Rent is required"); return false; }
        return true;
    };
   

    const handleNextStep = (current) => {
        if (current === 1 && !validateStep1()) return;
        if (current === 2 && !validateStep2()) return;
        if (current === 3 && !validateStep3()) return;
        setCurrentStep(current + 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Map form data to PropertyDetails schema
            const mappedData = {
                propertyName: formData.propertyName,
                propertyType: formData.propertyType,
                propertyFor: formData.propertyFor,
                locationType: formData.locationType,
                contactAddress: [formData.address1, formData.address2, formData.address3, formData.address4].filter(Boolean).join(', '),
                landMarkDetails: formData.landmark,
                contactNumbers: formData.contactNumber ? [formData.contactNumber] : [],
                emailAddresses: formData.email ? [formData.email] : [],
                rentPrice: Number(formData.monthlyRent) || 0,
                securityDeposit: {
                    required: !!formData.securityDeposit,
                    months: formData.securityDeposit,
                    amount: formData.totalSecurityDepositAmount
                },
                propertyAvailableFrom: formData.availability,
                mainImage: formData.primaryImage?.url ? formData.primaryImage : { 
                    url: "https://placehold.co/600x400/png?text=No+Image", 
                    key: "placeholder" 
                },
                galleryImages: [formData.outsideBuilding, formData.roomImage, formData.bathroomImage, formData.otherImage].filter(img => img && img.url),
                amenities: Object.keys(formData.amenities || {}).filter(key => formData.amenities[key]),
                highlights: formData.specialNote ? [formData.specialNote] : [],
                status: "Pending", // Add default status
                // Keep raw data just in case the API or frontend component NewArrivalBooking expects them
                rawFormData: formData 
            };

            const res = await fetch('/api/property/newarrival', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mappedData)
            });
            const data = await res.json();
            if (res.ok) {
                setResponseData(data.data);
                setShowThankYou(true);
            } else {
                toast.error(data.error || 'Submission failed');
            }
        } catch (err) {
            toast.error('An error occurred during submission');
        }
        setIsSubmitting(false);
    };

    // UI Helper for sidebar tabs
    const tabs = [
        { id: 1, label: 'Basic Detail' },
        { id: 2, label: 'Gallery' },
        { id: 3, label: 'Monthly Rent' },
        { id: 4, label: 'Essential Amenities' },
    ];

    const renderImageUploader = (fieldName, label) => (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-gray-100 pb-4">
            <label className="font-semibold text-gray-800 sm:w-1/3">{label}</label>
            <div className="flex-1 flex flex-col gap-2">
                {!formData[fieldName].url ? (
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, fieldName)}
                            ref={fileInputRefs[fieldName]}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRefs[fieldName].current?.click()}
                            className="w-full text-left px-4 py-2 border border-gray-300 rounded-full text-gray-400 bg-white hover:bg-gray-50 flex justify-between items-center"
                            disabled={uploadingImage === fieldName}
                        >
                            {uploadingImage === fieldName ? 'Uploading...' : 'Upload Here'}
                            <UploadIcon className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="relative w-full max-w-[200px] h-[100px] border border-gray-200 rounded-lg overflow-hidden group">
                        <Image src={formData[fieldName].url} alt={label} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={() => handleDeleteImage(fieldName)}
                                className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50"
                            >
                                <Trash2Icon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="mb-8 border-b-2 border-gray-200 pb-2 inline-block">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Property Information</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="flex flex-col border-2 border-black rounded-lg overflow-hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`px-4 py-3 text-left font-semibold text-sm border-b border-gray-700 last:border-b-0
                                    ${currentStep === tab.id ? 'bg-black text-white' : 'bg-black text-white/70 hover:bg-gray-900'}`}
                                onClick={() => {
                                    // Let users navigate back easily, but strict navigation forward
                                    if (tab.id < currentStep) setCurrentStep(tab.id);
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white">
                    {currentStep === 1 && (
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Property Name</label>
                                <Input name="propertyName" value={formData.propertyName} onChange={handleInputChange} placeholder="Name of your property" className="flex-1 rounded-full border-gray-300 focus-visible:ring-orange-500" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Contact Number</label>
                                <Input name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="+91 XXXXXXXXXX" className="flex-1 rounded-full border-gray-300 focus-visible:ring-orange-500" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Email Address</label>
                                <Input name="email" value={formData.email} onChange={handleInputChange} disabled className="flex-1 rounded-full border-gray-300 bg-gray-100 text-gray-600" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Select Location</label>
                                <Select value={formData.locationType} onValueChange={(value) => handleInputChange({ target: { name: 'locationType', value } })}>
                                    <SelectTrigger className="flex-1 rounded-full border-gray-300 focus:ring-orange-500 h-10 px-4">
                                        <SelectValue placeholder="Select Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations?.map((loc) => (
                                            <SelectItem key={loc._id || loc.id} value={loc.locationType}>{loc.locationType || " "}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Property For</label>
                                <Select value={formData.propertyFor} onValueChange={(value) => handleInputChange({ target: { name: 'propertyFor', value } })}>
                                    <SelectTrigger className="flex-1 rounded-full border-gray-300 focus:ring-orange-500 h-10 px-4">
                                        <SelectValue placeholder="Select Property For" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="residential">Residential</SelectItem>
                                        <SelectItem value="commercial">Commercial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Property Type</label>
                                <Select value={formData.propertyType} onValueChange={(value) => handleInputChange({ target: { name: 'propertyType', value } })}>
                                    <SelectTrigger className="flex-1 rounded-full border-gray-300 focus:ring-orange-500 h-10 px-4">
                                        <SelectValue placeholder="Select Property Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyTypes?.map((prop) => (
                                            <SelectItem key={prop._id || prop.id} value={prop.propertyType || prop.name}>{prop.propertyType || prop.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <label className="font-semibold text-gray-800 sm:w-1/3 mt-2">Type Address</label>
                                <div className="flex-1 space-y-3">
                                    <Input name="address1" value={formData.address1} onChange={handleInputChange} placeholder="Address Line 1" className="w-full rounded-full border-gray-300 focus-visible:ring-orange-500 text-sm" />
                                    <Input name="address2" value={formData.address2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full rounded-full border-gray-300 focus-visible:ring-orange-500 text-sm" />
                                    <Input name="address3" value={formData.address3} onChange={handleInputChange} placeholder="Address Line 3" className="w-full rounded-full border-gray-300 focus-visible:ring-orange-500 text-sm" />
                                    <Input name="address4" value={formData.address4} onChange={handleInputChange} placeholder="City, State, Zip" className="w-full rounded-full border-gray-300 focus-visible:ring-orange-500 text-sm" />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Any Landmark</label>
                                <Input name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Landmark" className="flex-1 rounded-full border-gray-300 focus-visible:ring-orange-500 text-sm" />
                            </div>

                            <div className="pt-8">
                                <Button onClick={() => handleNextStep(1)} className="w-full sm:w-auto px-10 py-6 bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold rounded-lg shadow-md transition-colors uppercase text-sm tracking-wide">
                                    proceed for next step
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4 max-w-2xl">
                            {renderImageUploader('primaryImage', 'Primary image')}
                            {renderImageUploader('outsideBuilding', 'Outside building')}
                            {renderImageUploader('roomImage', 'Room / Other Image')}
                            {renderImageUploader('bathroomImage', 'Bathroom Image')}
                            {renderImageUploader('otherImage', 'Any Others Image')}

                            <p className="text-xs font-semibold text-gray-800 mt-6 max-w-md">
                                immediate priority, To ensure your property is well-understood, your images should tell a story. Use this checklist to capture the best angles
                            </p>

                            <div className="pt-8">
                                <Button onClick={() => handleNextStep(2)} className="w-full sm:w-auto px-10 py-6 bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold rounded-lg shadow-md transition-colors uppercase text-sm tracking-wide">
                                    proceed for next step
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Monthly Rent</label>
                                <Input name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} placeholder="₹ Amount" className="flex-1 rounded-full border-gray-300 focus-visible:ring-orange-500 text-sm" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Any Security Deposit</label>
                                <div className="flex-1 flex gap-2">
                                    <Select value={formData.securityDeposit} onValueChange={(value) => handleInputChange({ target: { name: 'securityDeposit', value } })}>
                                        <SelectTrigger className="flex-1 rounded-full border-gray-300 focus:ring-orange-500 h-10 px-4 text-sm text-gray-500">
                                            <SelectValue placeholder="No Of Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...Array(12)].map((_, i) => (
                                                <SelectItem key={i+1} value={(i+1).toString()}>{i+1} Month{i > 0 ? 's' : ''}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {formData.totalSecurityDepositAmount && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <label className="font-semibold text-gray-800 sm:w-1/3">Total Deposit Amount</label>
                                    <Input name="totalSecurityDepositAmount" value={formData.totalSecurityDepositAmount} readOnly className="flex-1 rounded-full border-gray-300 bg-gray-50 text-sm text-gray-700 font-bold" />
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Availability</label>
                                <Input type="date" name="availability" value={formData.availability} onChange={handleInputChange} className="flex-1 rounded-full border-gray-300 focus-visible:ring-orange-500 text-sm text-gray-500" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <label className="font-semibold text-gray-800 sm:w-1/3">Any Special Note</label>
                                <Input name="specialNote" value={formData.specialNote} onChange={handleInputChange} placeholder="Type Here" className="flex-1 rounded-full border-gray-300 focus-visible:ring-orange-500 text-sm" />
                            </div>

                            <div className="mt-8 space-y-4 pl-0 sm:pl-[33%]">
                                <div className="flex gap-3">
                                    <p className="text-xs font-bold text-gray-900 leading-tight">
                                        We are looking for a minimum 03 To 06 -month commitment. <br />
                                        Credit and background checks will be required.*
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <p className="text-xs font-bold text-gray-900 leading-tight">
                                        We are looking for a minimum 11-month commitment. Credit and <br />
                                        background checks will be required.*
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8">
                                <Button onClick={() => handleNextStep(3)} className="w-full sm:w-auto px-10 py-6 bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold rounded-lg shadow-md transition-colors uppercase text-sm tracking-wide">
                                    proceed for next step
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm font-semibold text-gray-900">
                                {[
                                    { id: 'water', label: 'Water' },
                                    { id: 'parking', label: 'Parking' },
                                    { id: 'electricity', label: 'Electricity' },
                                    { id: 'balcony', label: 'Balcony' },
                                    { id: 'internet', label: 'Internet' },
                                    { id: 'lift', label: 'Lift' },
                                    { id: 'stairs', label: 'Stairs' },
                                    { id: 'guestsMax3', label: '2 guests | Max - 3' },
                                    { id: 'roomOnly', label: 'Room Only' },
                                    { id: 'preFixDoubleBed', label: 'Pre Fix Double Bed' },
                                    { id: 'preFixSingleBed', label: 'Pre Fix Single Bed' },
                                    { id: 'privateBathroom', label: 'Private Bathroom' },
                                    { id: 'sharingBathroom', label: 'Sharing Bathroom' },
                                    { id: 'bathroomGeyser', label: 'Bathroom geyser' },
                                    { id: 'kitchen', label: 'Kitchen' },
                                    { id: 'kitchenGeyser', label: 'Kitchen geyser' },
                                    { id: 'roomAlmirah', label: 'Room Almirah' },
                                    { id: 'chair', label: 'Chair' },
                                    { id: 'rooftopTerraceAccess', label: 'Rooftop Terrace Access' },
                                    { id: 'outdoorSeating', label: 'Outdoor Seating' },
                                ].map((item) => (
                                    <label key={item.id} className="flex justify-between items-center cursor-pointer">
                                        <span>{item.label}</span>
                                        <Checkbox
                                            checked={formData.amenities[item.id]}
                                            onCheckedChange={(checked) => handleAmenityChange({ target: { name: item.id, checked } })}
                                            className="w-5 h-5 border-gray-400"
                                        />
                                    </label>
                                ))}
                            </div>

                            <div className="pt-6 space-y-5 border-t border-gray-100">
                                <div className="flex gap-4">
                                    <p className="text-[11px] font-bold text-gray-900 leading-snug max-w-md">
                                        We offer a welcoming and private stay for couples. Enjoy a
                                        hassle-free check-in experience with valid identification.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <p className="text-[11px] font-bold text-gray-900 leading-snug max-w-md">
                                        We love pets as much as you do! Our property is proudly pet-friendly,
                                        so you don't have to leave your furry family members behind. Please
                                        let us know at the time of booking if you plan to bring your pet so we
                                        can ensure the space is ready for both of you.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-10 py-6 bg-[#ff6b00] hover:bg-[#e66000] disabled:bg-gray-400 text-white font-bold rounded-lg shadow-md transition-colors uppercase text-sm tracking-wide"
                                >
                                    {isSubmitting ? 'Submitting...' : 'proceed for final step'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Thank You Modal */}
            {showThankYou && (
                <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[#ff6b00] text-white p-8 md:p-5 rounded-xl max-w-xl w-full border-2 border-white/20 shadow-2xl relative">
                        <h2 className="text-2xl font-mono mb-8">Thank you for submitting your property!</h2>

                        <div className="space-y-2 mb-8 text-md font-bold text-black">
                            <p>Name Of Property: <span className="font-normal text-white">{responseData?.propertyName}</span></p>
                            <p>Case ID Number : <span className="font-normal text-white">{responseData?.caseIdNumber}</span></p>
                            <p>Property Contact Number : <span className="font-normal text-white">{responseData?.contactNumber}</span></p>
                        </div>

                        <div className="space-y-6 text-md font-bold mb-10 max-w-lg leading-snug">
                            <p>We have received your details and our team is currently reviewing them. We will be in touch with you shortly with an update.</p>
                            <p>Thank you for your patience while we get everything ready for you.</p>
                        </div>

                        <button
                            onClick={() => router.push('/')}
                            className="bg-white text-black font-bold text-sm py-2 px-8 rounded-md shadow-md hover:bg-gray-100 transition-colors"
                        >
                            Go Back To Website
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HostelRegistration;