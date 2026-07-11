"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Trash2Icon, UploadIcon, Building2, Wallet, ListChecks } from 'lucide-react';
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
    const [selectedPropertyCategory, setSelectedPropertyCategory] = useState(null);

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
        completeRoomImages: { url: '', key: '' },
        bedImages: { url: '', key: '' },

        // Step 3
        monthlyRent: '',
        rentBasis: 'Monthly', // Added for PG Room
        securityDeposit: '',
        totalSecurityDepositAmount: '',
        availability: '',
        specialNote: '',
        agreements: {
            monthBasisAlso: false,
            commitment03To06: false,
            commitment11: false,
            couplesWelcome: false,
            petFriendly: false,
        },

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
        completeRoomImages: useRef(null),
        bedImages: useRef(null),
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
                [name]: checked,
            },
        }));
    };

    const handleAgreementChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            agreements: {
                ...prev.agreements,
                [name]: checked,
            },
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
                propertyCategory: selectedPropertyCategory,
                propertyName: formData.propertyName,
                propertyType: formData.propertyType,
                propertyFor: formData.propertyFor,
                locationType: formData.locationType,
                contactAddress: [formData.address1, formData.address2, formData.address3, formData.address4].filter(Boolean).join(', '),
                landMarkDetails: formData.landmark,
                contactNumbers: formData.contactNumber ? [formData.contactNumber] : [],
                emailAddresses: formData.email ? [formData.email] : [],
                rentPrice: Number(formData.monthlyRent) || 0,
                rentBasis: formData.rentBasis,
                securityDeposit: {
                    required: !!formData.securityDeposit,
                    months: formData.securityDeposit,
                    amount: formData.rentBasis === 'Per Day' ? null : formData.totalSecurityDepositAmount
                },
                propertyAvailableFrom: formData.availability,
                petAllowed: formData.agreements.petFriendly ? "allowed" : "not_allowed",
                couplesAllowed: formData.agreements.couplesWelcome,
                monthBasisAlso: formData.agreements.monthBasisAlso,
                commitment03To06: formData.agreements.commitment03To06,
                commitment11: formData.agreements.commitment11,
                mainImage: formData.primaryImage?.url ? formData.primaryImage : {
                    url: "https://placehold.co/600x400/png?text=No+Image",
                    key: "placeholder"
                },
                galleryImages: [
                    formData.outsideBuilding, 
                    formData.roomImage, 
                    formData.bathroomImage, 
                    formData.otherImage,
                    ...(selectedPropertyCategory === 'pg-hostel' ? [formData.completeRoomImages, formData.bedImages] : [])
                ].filter(img => img && img.url),
                amenities: Object.keys(formData.amenities || {}).filter(key => formData.amenities[key]),
                highlights: formData.specialNote ? [formData.specialNote] : [],
                status: "Pending", // Add default status
                propertyStyle: selectedPropertyCategory === 'pg-hostel' ? 'hostel_pg_style_only' : 'home_style_only',
                // Keep raw data just in case the API or frontend component NewArrivalBooking expects them
                rawFormData: {
                    ...formData,
                    selectedPropertyCategory
                }
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
        { id: 1, label: 'Basic Detail', icon: <Building2 className="w-4 h-4" /> },
        { id: 2, label: 'Gallery', icon: <Image as="svg" className="w-4 h-4" /> },
        { id: 3, label: 'Monthly Rent', icon: <Wallet className="w-4 h-4" /> },
        { id: 4, label: 'Essential Amenities', icon: <ListChecks className="w-4 h-4" /> },
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
                            className="w-full text-left px-5 py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 bg-slate-50 hover:bg-slate-100 hover:border-blue-400 flex justify-between items-center transition-all group"
                            disabled={uploadingImage === fieldName}
                        >
                            <span className="font-medium group-hover:text-blue-600 transition-colors">
                                {uploadingImage === fieldName ? 'Uploading...' : 'Click to Upload Image'}
                            </span>
                            <UploadIcon className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
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
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            {!selectedPropertyCategory ? (
                <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-in fade-in zoom-in-95 duration-500">
                    <div className="text-center space-y-4">
                        <h1 className="text-xl md:text-xl font-extrabold text-slate-900 tracking-tight">Rental Income Submission</h1>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">Select Your Property</h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-16 w-full max-w-3xl relative">
                        {/* Center Divider Line */}
                        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-1 bg-slate-800 transform -translate-x-1/2"></div>

                        {/* Home Rental Card */}
                        <div className="flex-1 flex flex-col items-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-500 group">
                            <div className="flex items-center justify-center w-40 h-40 mb-6 text-7xl bg-orange-50 rounded-full group-hover:scale-110 transition-transform">
                                🏠
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center group-hover:text-orange-500 transition-colors">Home Rental</h3>
                            <Button
                                onClick={() => setSelectedPropertyCategory('home-rental')}
                                className="w-full max-w-[200px] h-14 bg-[#ff5e00] hover:bg-[#e65500] text-white text-xl font-bold rounded-full shadow-lg transition-transform active:scale-95"
                            >
                                Select
                            </Button>
                        </div>

                        {/* PG / Hostel Card */}
                        <div className="flex-1 flex flex-col items-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-500 group">
                            <div className="flex items-center justify-center w-40 h-40 mb-6 text-7xl bg-orange-50 rounded-full group-hover:scale-110 transition-transform">
                                🛏️
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center group-hover:text-orange-500 transition-colors">PG / Hostel</h3>
                            <Button
                                onClick={() => setSelectedPropertyCategory('pg-hostel')}
                                className="w-full max-w-[200px] h-14 bg-[#ff5e00] hover:bg-[#e65500] text-white text-xl font-bold rounded-full shadow-lg transition-transform active:scale-95"
                            >
                                Select
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-lg md:text-2xl font-bold text-slate-900">Property Information</h1>
                            <p className="text-slate-500 mt-2">Registering as <span className="font-semibold text-orange-600">{selectedPropertyCategory}</span></p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedPropertyCategory(null)}
                            className="rounded-full font-medium"
                        >
                            Change Property Type
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <div className="flex flex-col gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        className={`px-5 py-4 text-left font-semibold text-sm rounded-xl transition-all border-2
                                    ${currentStep === tab.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50'}`}
                                        onClick={() => {
                                            // Let users navigate back easily, but strict navigation forward
                                            if (tab.id < currentStep) setCurrentStep(tab.id);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${currentStep === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                                                {tab.id}
                                            </span>
                                            {tab.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 bg-white p-4">
                            {currentStep === 1 && (
                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Property Name</label>
                                        <Input name="propertyName" value={formData.propertyName} onChange={handleInputChange} placeholder="Name of your property" className="flex-1 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Contact Number</label>
                                        <Input name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="+91 XXXXXXXXXX" className="flex-1 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Email Address</label>
                                        <Input name="email" value={formData.email} onChange={handleInputChange} disabled className="flex-1 h-12 rounded-xl border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed" />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Select Location</label>
                                        <Select value={formData.locationType} onValueChange={(value) => handleInputChange({ target: { name: 'locationType', value } })}>
                                            <SelectTrigger className="flex-1 h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all px-4">
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
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Property For</label>
                                        <Select value={formData.propertyFor} onValueChange={(value) => handleInputChange({ target: { name: 'propertyFor', value } })}>
                                            <SelectTrigger className="flex-1 h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all px-4">
                                                <SelectValue placeholder="Select Property For" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="residential">Residential</SelectItem>
                                                <SelectItem value="commercial">Commercial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Property Type</label>
                                        <Select value={formData.propertyType} onValueChange={(value) => handleInputChange({ target: { name: 'propertyType', value } })}>
                                            <SelectTrigger className="flex-1 h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all px-4">
                                                <SelectValue placeholder="Select Property Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {propertyTypes?.map((prop) => (
                                                    <SelectItem key={prop._id || prop.id} value={prop.propertyType || prop.name}>{prop.propertyType || prop.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                                        <label className="font-semibold text-slate-700 sm:w-1/3 mt-3">Property Address</label>
                                        <div className="flex-1 space-y-3">
                                            <Input name="address1" value={formData.address1} onChange={handleInputChange} placeholder="Address Line 1" className="w-full h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                            <Input name="address2" value={formData.address2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                            <Input name="address3" value={formData.address3} onChange={handleInputChange} placeholder="Address Line 3" className="w-full h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                            <Input name="address4" value={formData.address4} onChange={handleInputChange} placeholder="City, State, Zip" className="w-full h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Any Landmark</label>
                                        <Input name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Landmark" className="flex-1 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                    </div>

                                    <div className="pt-8">
                                        <Button onClick={() => handleNextStep(1)} className="w-full sm:w-auto px-10 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wide active:scale-95">
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
                                    
                                    {selectedPropertyCategory === 'pg-hostel' && (
                                        <>
                                            {renderImageUploader('completeRoomImages', 'Complete room images')}
                                            {renderImageUploader('bedImages', 'Bed images')}
                                        </>
                                    )}
                                    
                                    {renderImageUploader('otherImage', 'Any Others Image')}

                                    <p className="text-xs font-semibold text-gray-800 mt-6 max-w-md">
                                        immediate priority, To ensure your property is well-understood, your images should tell a story. Use this checklist to capture the best angles
                                    </p>

                                    <div className="pt-8">
                                        <Button onClick={() => handleNextStep(2)} className="w-full sm:w-auto px-10 h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-wide active:scale-95">
                                            proceed for next step
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6 max-w-2xl">
                                    {selectedPropertyCategory === 'pg-hostel' && (
                                        <h3 className="text-xl font-bold text-slate-800 pb-2 border-b border-slate-200">Bed Or Per Person Rent / Fee Detail</h3>
                                    )}
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">
                                            {selectedPropertyCategory === 'pg-hostel' ? 'Monthly Rent Per Bed' : 'Monthly Rent'}
                                        </label>
                                        <div className="flex-1 flex gap-2">
                                            <Input name="monthlyRent" value={formData.monthlyRent} onChange={handleInputChange} placeholder="Type Here" className="w-full h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                            {selectedPropertyCategory === 'pg-hostel' && (
                                                <Select value={formData.rentBasis} onValueChange={(value) => handleInputChange({ target: { name: 'rentBasis', value } })}>
                                                    <SelectTrigger className="w-40 h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all px-4">
                                                        <SelectValue placeholder="Basis" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Monthly">Monthly Basis</SelectItem>
                                                        <SelectItem value="Per Day">Per Day Basis</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3 pt-3">Any Security Deposit</label>
                                        <div className="flex-1 space-y-4">
                                            <Select value={formData.securityDeposit} onValueChange={(value) => handleInputChange({ target: { name: 'securityDeposit', value } })}>
                                                <SelectTrigger className="w-full h-12 rounded-xl border-slate-200 focus:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all px-4">
                                                    <SelectValue placeholder="No Of Month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[...Array(12)].map((_, i) => (
                                                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1} Month{i > 0 ? 's' : ''}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            
                                            {formData.rentBasis !== 'Per Day' && formData.securityDeposit && (
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-sm text-slate-500 font-medium">Total Deposit Amount (Auto Calculated)</span>
                                                    <Input name="totalSecurityDepositAmount" value={formData.totalSecurityDepositAmount} readOnly className="w-full h-12 rounded-xl border-orange-200 focus-visible:ring-orange-500 bg-orange-50/50 text-orange-800 font-bold" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Availability</label>
                                        <Input type="date" name="availability" value={formData.availability} onChange={handleInputChange} className="flex-1 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <label className="font-semibold text-slate-700 sm:w-1/3">Any Special Note</label>
                                        <Input name="specialNote" value={formData.specialNote} onChange={handleInputChange} placeholder="Type Here" className="flex-1 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50 hover:bg-white transition-all" />
                                    </div>

                                    <div className="pt-6 space-y-4">
                                        <label className="flex items-start gap-4 p-4 border-b border-slate-100 cursor-pointer group">
                                            <Checkbox checked={formData.agreements.monthBasisAlso} onCheckedChange={(checked) => handleAgreementChange({ target: { name: 'monthBasisAlso', checked } })} className="w-6 h-6 mt-1 border-slate-300 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700" />
                                            <span className="text-sm font-bold text-slate-800 leading-tight">Available for Month Basis Also .<br/><span className="font-normal text-slate-600">Credit and background checks will be required."</span></span>
                                        </label>
                                        <label className="flex items-start gap-4 p-4 border-b border-slate-100 cursor-pointer group">
                                            <Checkbox checked={formData.agreements.commitment03To06} onCheckedChange={(checked) => handleAgreementChange({ target: { name: 'commitment03To06', checked } })} className="w-6 h-6 mt-1 border-slate-300 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700" />
                                            <span className="text-sm font-bold text-slate-800 leading-tight">We are looking for a minimum 03 To 06 -month commitment.<br/><span className="font-normal text-slate-600">Credit and background checks will be required."</span></span>
                                        </label>
                                        <label className="flex items-start gap-4 p-4 border-b border-slate-100 cursor-pointer group">
                                            <Checkbox checked={formData.agreements.commitment11} onCheckedChange={(checked) => handleAgreementChange({ target: { name: 'commitment11', checked } })} className="w-6 h-6 mt-1 border-slate-300 data-[state=checked]:bg-slate-700 data-[state=checked]:border-slate-700" />
                                            <span className="text-sm font-bold text-slate-800 leading-tight">We are looking for a minimum 11-month commitment. Credit and<br/><span className="font-normal text-slate-600">background checks will be required."</span></span>
                                        </label>
                                    </div>

                                    <div className="pt-8">
                                        <Button onClick={() => handleNextStep(3)} className="w-full sm:w-auto px-10 h-14 bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-wide active:scale-95 text-lg">
                                            proceed for next step
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {[
                                            { id: 'water', label: '24/7 Water' },
                                            { id: 'electricity', label: '24/7 Electricity' },
                                            { id: 'internet', label: 'High Speed Internet' },
                                            { id: 'stairs', label: 'Stairs' },
                                            { id: 'roomOnly', label: 'Room Only' },
                                            { id: 'preFixSingleBed', label: 'Pre-Fix Single Bed' },
                                            { id: 'sharingBathroom', label: 'Sharing Bathroom' },
                                            { id: 'kitchen', label: 'Kitchen' },
                                            { id: 'roomAlmirah', label: 'Room Almirah' },
                                            { id: 'parking', label: 'Parking Available' },
                                            { id: 'balcony', label: 'Balcony' },
                                            { id: 'lift', label: 'Lift/Elevator' },
                                            { id: 'guestsMax3', label: 'Max 3 Guests Allowed' },
                                            { id: 'preFixDoubleBed', label: 'Pre-Fix Double Bed' },
                                            { id: 'privateBathroom', label: 'Private Bathroom' },
                                            { id: 'bathroomGeyser', label: 'Bathroom Geyser' },
                                            { id: 'kitchenGeyser', label: 'Kitchen Geyser' },
                                            { id: 'chair', label: 'Working Desk/Chair' },
                                            { id: 'rooftopTerraceAccess', label: 'Rooftop Access' },
                                            { id: 'outdoorSeating', label: 'Outdoor Seating' },
                                        ].map((item) => (
                                            <label key={item.id} className={`flex justify-between items-center cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.amenities[item.id] ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                                <span className={`text-sm font-medium ${formData.amenities[item.id] ? 'text-blue-700' : 'text-slate-600'}`}>{item.label}</span>
                                                <Checkbox
                                                    checked={formData.amenities[item.id]}
                                                    onCheckedChange={(checked) => handleAmenityChange({ target: { name: item.id, checked } })}
                                                    className="w-5 h-5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded"
                                                />
                                            </label>
                                        ))}
                                    </div>

                                    <div className="pt-8 space-y-4">
                                        <label className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${formData.agreements.couplesWelcome ? 'border-orange-500 bg-orange-50' : 'border-orange-100 bg-white hover:border-orange-200'}`}>
                                            <Checkbox
                                                checked={formData.agreements.couplesWelcome}
                                                onCheckedChange={(checked) => handleAgreementChange({ target: { name: 'couplesWelcome', checked } })}
                                                className="w-6 h-6 mt-1 border-orange-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 rounded"
                                            />
                                            <p className={`text-sm font-medium leading-relaxed ${formData.agreements.couplesWelcome ? 'text-orange-900' : 'text-slate-600'}`}>
                                                We offer a welcoming and private stay for couples. Enjoy a
                                                hassle-free check-in experience with valid identification.
                                            </p>
                                        </label>
                                        
                                        <label className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${formData.agreements.petFriendly ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-100 bg-white hover:border-emerald-200'}`}>
                                            <Checkbox
                                                checked={formData.agreements.petFriendly}
                                                onCheckedChange={(checked) => handleAgreementChange({ target: { name: 'petFriendly', checked } })}
                                                className="w-6 h-6 mt-1 border-emerald-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 rounded"
                                            />
                                            <p className={`text-sm font-medium leading-relaxed ${formData.agreements.petFriendly ? 'text-emerald-900' : 'text-slate-600'}`}>
                                                We love pets as much as you do! Our property is proudly pet-friendly,
                                                so you don't have to leave your furry family members behind. Please
                                                let us know at the time of booking if you plan to bring your pet.
                                            </p>
                                        </label>
                                    </div>

                                    <div className="pt-8 flex justify-end">
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto px-12 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 tracking-wide"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thank You Modal */}
                    {showThankYou && (
                        <div className="fixed inset-0 bg-slate-900/40 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-100 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                                {/* Decorative Top Banner */}
                                <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                                <div className="p-8 md:p-10 flex flex-col items-center text-center">
                                    {/* Success Icon */}
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>

                                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Registration Submitted!</h2>
                                    <p className="text-slate-500 mb-8 max-w-md">
                                        Thank you for submitting your {selectedPropertyCategory === 'pg-hostel' ? 'pg-hostel' : 'home-rental'}. Our team is reviewing the details and will be in touch shortly.
                                    </p>

                                    {/* Property Details Card */}
                                    <div className="w-full bg-slate-50 rounded-2xl p-6 text-left space-y-3 mb-8 border border-slate-100">
                                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                            <span className="text-slate-500 font-medium text-sm">Property Type</span>
                                            <span className=" font-bold text-orange-600">{selectedPropertyCategory}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                            <span className="text-slate-500 font-medium text-sm">Property Name</span>
                                            <span className="text-slate-900 font-bold">{responseData?.propertyName}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                            <span className="text-slate-500 font-medium text-sm">Case ID Number</span>
                                            <span className="text-slate-900 font-bold font-mono">{responseData?.caseIdNumber}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium text-sm">Contact Number</span>
                                            <span className="text-slate-900 font-bold">{responseData?.contactNumber}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push('/')}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-xl shadow-lg transition-all active:scale-95"
                                    >
                                        Go Back To Website
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
};

export default HostelRegistration;