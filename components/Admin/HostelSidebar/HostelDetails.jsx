"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, X, Upload, RefreshCw, UploadCloud, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Trash2, Edit } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import EmailOTPVerification from '@/components/EmailOTPVerification';
import DeclarationForm from '@/components/DeclarationForm';
// import MSG91OTPVerification from '@/components/MSG91OTPVerification'; // Commented out for testing
const HostelDetails = () => {
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [locationType, setLocationType] = useState([]);
    const [subLocationType, setSubLocationType] = useState([]);
    const [galiType, setGaliType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [propertyDetails, setPropertyDetails] = useState([]);
    const [videoUploading, setVideoUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [retryAttempt, setRetryAttempt] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [type, setType] = useState("")
    const [unit, setUnit] = useState(null)
    const videoRef = useRef(null);
    const mainImageRef = useRef(null);
    const galleryImagesRef = useRef(null);
    const aadharImageRef = useRef(null);
    const panImageRef = useRef(null);
    const electricityBillImageRef = useRef(null);

    const [activeTab, setActiveTab] = useState('youtube');
    const [editingProperty, setEditingProperty] = useState(null);
    const [brokerOrOwner, setBrokerOrOwner] = useState('broker');

    // Modal states for custom amenities
    const [isFurnishedAmenityModalOpen, setIsFurnishedAmenityModalOpen] = useState(false);
    const [furnishedAmenityInput, setFurnishedAmenityInput] = useState('');
    const [isBathroomAmenityModalOpen, setIsBathroomAmenityModalOpen] = useState(false);
    const [bathroomAmenityInput, setBathroomAmenityInput] = useState('');
    const [isTenantTypeModalOpen, setIsTenantTypeModalOpen] = useState(false);
    const [tenantTypeInput, setTenantTypeInput] = useState('');
    const [isParkingAmenityModalOpen, setIsParkingAmenityModalOpen] = useState(false);
    const [parkingAmenityInput, setParkingAmenityInput] = useState('');
    const [isParkingStyleModalOpen, setIsParkingStyleModalOpen] = useState(false);
    const [parkingStyleInput, setParkingStyleInput] = useState('');
    const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
    const [isVerificationMethodModalOpen, setIsVerificationMethodModalOpen] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState(''); // 'mobile' or 'email'
    const [showDeclarationForm, setShowDeclarationForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        propertyType: "",
        mainImage: { url: "", key: "", loading: false },
        galleryImages: [],
        video: { type: "upload", file: null, youtubeLink: "" },
        aadharImage: { url: "", key: "", loading: false },
        panImage: { url: "", key: "", loading: false },
        electricityBillImage: { url: "", key: "", loading: false },
        locationType: "",
        subLocationType: "",
        galiType: "",
        contactAddress: "",
        landMarkDetails: "", // Added missing field
        googleLocation: "", // Added missing field
        brokerName: "",
        ownerName: "",
        sonDaughterWifeOf: "", // Added missing field
        contactNumbers: [""],
        emailAddresses: [""],
        aadharCardNumber: "",
        panCardNumber: "",
        rentPrice: "",
        maxRentPrice: "",
        propertyName: "",
        propertyForRentLocatedOn: "", // Added missing field
        propertyFacingDirection: "", // Added missing field
        highlights: [],
        propertyFor: "",
        isAvailable: true,
        isTrending: false,
        isActive: true,
        propertyNameSlug: "",
        electricityCharges: { include: null, amount: '', type: '' },
        waterCharges: { include: null, amount: '', type: '' },
        securityDeposit: { required: null, amount: '', months: '' },
        maintenanceCharges: { required: null, amount: '', basis: '' },
        // New detailed property information fields
        propertyStyle: "",
        propertyStyleOption: "",
        bedSize: "",
        apartmentSize: "",
        tenantType: "",
        sizeInFeet: "",
        sizeInMeter: "",
        sizeUnit: "", // Added missing field for unit selection
        sizeLength: "", // Added missing field
        sizeWidth: "", // Added missing field
        numberOfBedrooms: "",
        numberOfBathrooms: 0, // Changed to number
        numberOfRooms: 0, // Added missing field
        furnishingStatus: "",
        amenities: [],
        bathroomStyle: "",
        bathroomType: "", // Added missing field
        parkingStyle: "",
        parkingAvailable: "", // Added missing field
        parkingType: "", // Added missing field
        roomStyle: "",
        petAllowed: "",
        smokingAllowed: "",
        familyAllowed: false,
        familyMembers: "2", // Default to 2
        vegetarianOnly: false,
        nonVegetarianAllowed: false,
        alcoholAllowed: "",
        lateNightEntryTime: "",
        availableFrom: "",
        minimumStay: "",
        detailFor: "",
        powerBackup: "",
        powerBackupType: "",
        powerBackupAvailable: null, // Added missing field
        powerBackupSources: { inverter: false, generator: false }, // Added missing field
        powerBackupCharge: null, // Added missing field
        floor: "",
        balcony: false,
        rooftop: false,
        wheelchair: false,
        housekeeping: false,
        roomAmenities: [],
        bathroomFeatures: [],
        cctv: "",
        cctvLocation: "",
        checkIn: "",
        checkOut: "",
        customBathroomAmenities: [],
        customFurnishedAmenitiesLabels: {},
        furnishedAmenities: [],
        // New comprehensive property detail fields
        lift: "",
        cctvFeatures: [],
        parkingAmenities: [],
        customParkingAmenities: [],
        parkingStyleOptions: [],
        customParkingStyles: [],
        lateNightTimeIn: "",
        lateNightTimeOut: "",
        roomStyleOptions: [],
        petShelter: "",
        muslimFamilyAllowed: "",
        nonVegAllowed: "",
        inRoomPartyAllowed: "",
        outsideVisitorAllowed: "",
        prohibitedGoods: "",
        visitorEntry: "",
        photographsVideos: "",
        priorNotice: "",
        priorNoticeTime: "",
        propertyAvailableFrom: "",
        minimumStayAllow: "",
        tenantTypeAllowed: [],
        customTenantTypes: [],
        stayAllowOnlyFor: "", // Added missing field

    });
    const [available, setAvailable] = useState(null)
    const [charge, setCharge] = useState(null)
    const [sources, setSources] = useState({
        inverter: false,
        generator: false
    })
    const UnitSelector = () => (
        <div className="border border-gray-400 rounded-md p-2 flex gap-4 pt-2 bg-white">

            {/* Square Foot */}
            <div className="flex items-center gap-2">
                <Checkbox
                    checked={unit === "sqft"}
                    onCheckedChange={() => {
                        const newUnit = unit === "sqft" ? null : "sqft";
                        setUnit(newUnit);
                        setFormData(prev => ({ ...prev, sizeUnit: newUnit || "" }));
                    }}
                />
                <Label>Square Foot</Label>
            </div>

            {/* Meter */}
            <div className="flex items-center gap-2 ">
                <Checkbox
                    checked={unit === "meter"}
                    onCheckedChange={() => {
                        const newUnit = unit === "meter" ? null : "meter";
                        setUnit(newUnit);
                        setFormData(prev => ({ ...prev, sizeUnit: newUnit || "" }));
                    }}
                />
                <Label>In Meter</Label>
            </div>
        </div>
    )

    const SizeInputs = () => (
        <div className="grid grid-cols-2 gap-3 bg-white border border-gray-400 p-4 rounded-md ">
            <Input
                placeholder="Length"
                type="number"
                disabled={!unit}
                value={formData.sizeLength}
                onChange={(e) => setFormData(prev => ({ ...prev, sizeLength: e.target.value }))}
            />
            <Input
                placeholder="Width"
                type="number"
                disabled={!unit}
                value={formData.sizeWidth}
                onChange={(e) => setFormData(prev => ({ ...prev, sizeWidth: e.target.value }))}
            />
        </div>
    )
    const normalizeSelectValue = (value) => (value || '').toString().trim().toLowerCase();

    const getCanonicalSubLocationValue = (value, selectedLocationType = '') => {
        const normalizedValue = normalizeSelectValue(value);
        const match = subLocationType.find(item =>
            normalizeSelectValue(item.locationType) === normalizeSelectValue(selectedLocationType) &&
            normalizeSelectValue(item.subLocationType) === normalizedValue
        );
        return match?.subLocationType || (value || '');
    };

    const getCanonicalGaliValue = (value, selectedLocationType = '', selectedSubLocationType = '') => {
        const normalizedValue = normalizeSelectValue(value);
        const match = galiType.find(item =>
            normalizeSelectValue(item.locationType) === normalizeSelectValue(selectedLocationType) &&
            normalizeSelectValue(item.subLocationType) === normalizeSelectValue(selectedSubLocationType) &&
            normalizeSelectValue(item.galiName) === normalizedValue
        );
        return match?.galiName || (value || '');
    };
    const fetchPropertyDetails = async () => {
        try {
            const response = await fetch("/api/property/propertyDetails?limit=10&status=Approved&propertyCategory=pg-hostel");
            const data = await response.json();
            setPropertyDetails(data.data);
        } catch (error) {
            toast.error("Failed to fetch hostel details");
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [
                    propResponse,
                    locResponse,
                    subLocResponse,
                    galiResponse,
                ] = await Promise.all([
                    fetch("/api/property/propertyType"),
                    fetch("/api/property/createLocation"),
                    fetch("/api/property/createSubLocation"),
                    fetch("/api/property/createGali"),
                ]);

                const [
                    propData,
                    locData,
                    subLocData,
                    galiData,
                ] = await Promise.all([
                    propResponse.json(),
                    locResponse.json(),
                    subLocResponse.json(),
                    galiResponse.json(),
                ]);

                setPropertyTypes(propData);
                setLocationType(locData);
                setSubLocationType(subLocData);
                setGaliType(galiData);

            } catch (error) {
                console.error(error);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchPropertyDetails();
    }, []);

    useEffect(() => {
        if (propertyTypes.length > 0 && locationType.length > 0) {
            setFormData(prev => {
                // Only update if the property type is not already set
                if (!prev.propertyType && propertyTypes[0]?.propertyType) {
                    return {
                        ...prev,
                        propertyType: propertyTypes[0].propertyType,
                        locationType: locationType[0]?.locationType || "",
                        subLocationType: subLocationType[0]?.subLocationType || "",
                        galiType: galiType[0]?.galiType || ""
                    };
                }
                return prev;
            });
        }
    }, [propertyTypes, locationType, subLocationType, galiType]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "aadharCardNumber" && value.length > 12) {
            toast.error("Aadhar Card Number cannot exceed 12 digits");
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Update property status
    const updatePropertyStatus = async (id, updates) => {
        try {
            const response = await fetch(`/api/property/propertyDetails?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to update Hostels');
            }

            if (responseData.success) {
                toast.success('Hostels updated successfully');
                fetchPropertyDetails(); // Refresh the list
                return responseData.data; // Return the updated Hostels
            } else {
                throw new Error(responseData.error || 'Failed to update Hostels');
            }
        } catch (error) {
            console.error('Error updating Hostels:', { error, message: error.message });
            toast.error(error.message || 'Failed to update Hostels');
            throw error; // Re-throw to be caught by the calling function
        }
    };

    // Toggle isAvailable status
    const toggleAvailable = async (property) => {
        try {
            await updatePropertyStatus(property._id, {
                isActive: !property.isActive
            });
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    // Toggle isTrending status
    const toggleTrending = async (property) => {
        try {
            await updatePropertyStatus(property._id, {
                isTrending: !property.isTrending
            });
            // Refresh the property details after update
            fetchPropertyDetails();
            toast.success(`Hostels ${!property.isTrending ? 'added to' : 'removed from'} trending`);
        } catch (error) {
            console.error('Error toggling trending status:', error);
            toast.error('Failed to update trending status');
        }
    };

    // Update handleMainImageUpload
    const handleMainImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            mainImage: { ...prev.mainImage, loading: true }
        }));

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
                    mainImage: {
                        url: data.url,
                        key: data.key || '',
                        loading: false
                    }
                }));
                toast.success('Hostel image uploaded successfully!');
            } else {
                console.error('Cloudinary upload failed:', data.error || 'Unknown error');
                setFormData(prev => ({
                    ...prev,
                    mainImage: { ...prev.mainImage, loading: false }
                }));
            }
        } catch (err) {
            console.error('Cloudinary upload error:', err.message);
            setFormData(prev => ({
                ...prev,
                mainImage: { ...prev.mainImage, loading: false }
            }));
        }
    };
    const handleAadharImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            aadharImage: { ...prev.aadharImage, loading: true }
        }));

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
                    aadharImage: {
                        url: data.url,
                        key: data.key || '',
                        loading: false
                    }
                }));
                toast.success('Aadhar image uploaded successfully!');
            } else {
                console.error('Cloudinary upload failed:', data.error || 'Unknown error');
                setFormData(prev => ({
                    ...prev,
                    aadharImage: { ...prev.aadharImage, loading: false }
                }));
            }
        } catch (err) {
            console.error('Cloudinary upload error:', err.message);
            setFormData(prev => ({
                ...prev,
                aadharImage: { ...prev.aadharImage, loading: false }
            }));
        }
    };
    const handlePanImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            panImage: { ...prev.panImage, loading: true }
        }));

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
                    panImage: {
                        url: data.url,
                        key: data.key || '',
                        loading: false
                    }
                }));
                toast.success('Pan image uploaded successfully!');
            } else {
                console.error('Cloudinary upload failed:', data.error || 'Unknown error');
                setFormData(prev => ({
                    ...prev,
                    panImage: { ...prev.panImage, loading: false }
                }));
            }
        } catch (err) {
            console.error('Cloudinary upload error:', err.message);
            setFormData(prev => ({
                ...prev,
                panImage: { ...prev.panImage, loading: false }
            }));
        }
    };
    const handleElectricityBillImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({
            ...prev,
            electricityBillImage: { ...prev.electricityBillImage, loading: true }
        }));

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
                    electricityBillImage: {
                        url: data.url,
                        key: data.key || '',
                        loading: false
                    }
                }));
                toast.success('Electricity bill image uploaded successfully!');
            } else {
                console.error('Cloudinary upload failed:', data.error || 'Unknown error');
                setFormData(prev => ({
                    ...prev,
                    electricityBillImage: { ...prev.electricityBillImage, loading: false }
                }));
            }
        } catch (err) {
            console.error('Cloudinary upload error:', err.message);
            setFormData(prev => ({
                ...prev,
                electricityBillImage: { ...prev.electricityBillImage, loading: false }
            }));
        }
    };
    const removePanCardNumber = () => {
        setFormData(prev => ({
            ...prev,
            panImage: { ...prev.panImage, url: '', key: '', loading: false }
        }));
    };
    const removeAadharCardNumber = () => {
        setFormData(prev => ({
            ...prev,
            aadharImage: { ...prev.aadharImage, url: '', key: '', loading: false }
        }));
    };
    const removeElectricityBillImage = () => {
        setFormData(prev => ({
            ...prev,
            electricityBillImage: { ...prev.electricityBillImage, url: '', key: '', loading: false }
        }));
    };

    // Update handleGalleryUpload
    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            key: '',
            loading: true
        }));

        // Add new images to the gallery
        setFormData(prev => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...newImages]
        }));

        // Upload each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            try {
                const res = await fetch('/api/cloudinary', {
                    method: 'POST',
                    body: formDataUpload
                });
                const data = await res.json();

                if (res.ok && data.url) {
                    setFormData(prev => {
                        const updatedImages = [...prev.galleryImages];
                        const index = updatedImages.findIndex(img => img.file === file);
                        if (index !== -1) {
                            updatedImages[index] = {
                                ...updatedImages[index],
                                url: data.url,
                                key: data.key || '',
                                loading: false
                            };
                        }
                        return { ...prev, galleryImages: updatedImages };
                    });
                    toast.success('Gallery image uploaded successfully!');
                }
            } catch (err) {
                console.error('Error uploading image:', err);
                // Remove the failed upload
                setFormData(prev => ({
                    ...prev,
                    galleryImages: prev.galleryImages.filter(img => img.file !== file)
                }));
            }
        }
    };

    // Add this utility function at the top of your component, with other utility functions
    const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
        try {
            const response = await fetch('/api/cloudinary', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    publicId,
                    resourceType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete from Cloudinary');
            }

            return data;
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
            throw error;
        }
    };

    // Handle video upload with retry logic
    const handleVideoChange = async (e, retryCount = 0) => {
        const MAX_RETRIES = 3;
        const RETRY_DELAY = 2000; // 2 seconds

        // Make sure we have files
        if (!e?.target?.files?.[0]) {
            console.error('No file selected or invalid event');
            return;
        }

        const file = e.target.files[0];
        if (!file) return;

        // Check if it's a video file
        if (!file.type.startsWith('video/')) {
            toast.error('Please upload a valid video file');
            return;
        }

        // Check file size (e.g., 50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
            toast.error('Video file is too large. Maximum size is 50MB');
            return;
        }

        setVideoUploading(true);
        setUploadProgress(0);
        setUploadError(null); // Clear any previous error
        if (retryCount === 0) {
            setRetryAttempt(0);
        } else {
            setRetryAttempt(retryCount);
        }
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

            const response = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // If there was a previous video, delete it from Cloudinary
            if (formData.video?.file?.key) {
                try {
                    await deleteFromCloudinary(formData.video.file.key, 'video');
                } catch (err) {
                    console.error('Error deleting old video:', err);
                    // Continue even if deletion fails
                }
            }

            setFormData(prev => ({
                ...prev,
                video: {
                    type: 'upload',
                    file: {
                        url: data.secure_url || data.url,
                        key: data.public_id || data.key,
                        name: file.name,
                        type: file.type,
                        size: file.size
                    },
                    youtubeLink: ''
                }
            }));
            setActiveTab('upload'); // Ensure we're on the upload tab
            toast.success('Video uploaded successfully!');

        } catch (error) {
            console.error('Video upload error:', error);

            // Handle different types of errors
            if (error.name === 'AbortError') {
                toast.error('Video upload timed out. Please try again with a smaller file.');
            } else if (error.message.includes('ECONNRESET') || error.message.includes('network') || error.message.includes('fetch')) {
                // Network-related errors - attempt retry
                if (retryCount < MAX_RETRIES) {
                    toast.error(`Upload failed due to network error. Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);

                    setTimeout(() => {
                        // Reset the file input and retry
                        const newEvent = {
                            target: {
                                files: [file]
                            }
                        };
                        handleVideoChange(newEvent, retryCount + 1);
                    }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff

                    return; // Don't reset loading state yet
                } else {
                    toast.error(`Video upload failed after ${MAX_RETRIES} attempts. Please check your internet connection and try again.`);
                }
            } else {
                toast.error(`Video upload failed: ${error.message || 'Unknown error'}`);
            }
        } finally {
            // Reset loading state unless we're retrying
            setVideoUploading(false);
            setUploadProgress(0);
            setRetryAttempt(0);
            // Reset the file input to allow re-uploading the same file
            if (e.target) {
                e.target.value = '';
            }
        }
    };

    const removeMainImage = async () => {
        try {
            // If there's a key (Cloudinary public ID), delete the file from Cloudinary
            if (formData.mainImage.key) {
                await deleteFromCloudinary(formData.mainImage.key, 'image');
            }

            setFormData(prev => ({
                ...prev,
                mainImage: { url: "", key: "", loading: false }
            }));

            if (mainImageRef.current) {
                mainImageRef.current.value = '';
            }
            toast.success('Main image removed successfully!');
        } catch (error) {
            console.error('Error removing main image:', error);
            toast.error('Failed to remove main image');
        }
    };

    const removeVideo = async () => {
        try {
            // If there's a video with a key (Cloudinary public ID), delete it
            if (formData.video?.file?.key) {
                try {
                    await deleteFromCloudinary(formData.video.file.key, 'video');
                } catch (error) {
                    console.error('Error removing video:', error);
                    toast.error('Failed to remove video');
                }

            }

            setFormData(prev => ({
                ...prev,
                video: { type: 'upload', file: null, youtubeLink: '' }
            }));

            // Reset upload states
            setVideoUploading(false);
            setUploadProgress(0);
            setRetryAttempt(0);

            if (videoRef.current) {
                videoRef.current.value = '';
            }
            toast.success('Video removed successfully!');
        } catch (error) {
            console.error('Error removing video:', error);
            toast.error('Failed to remove video');
        }
    };

    // Update the gallery image removal
    const removeGalleryImage = async (index) => {
        try {
            const imageToRemove = formData.galleryImages[index];

            // If the image has a key (Cloudinary public ID), delete it
            if (imageToRemove.key) {
                await deleteFromCloudinary(imageToRemove.key, 'image');
            }

            setFormData(prev => {
                const newImages = [...prev.galleryImages];
                newImages.splice(index, 1);
                return { ...prev, galleryImages: newImages };
            });
            toast.success('Gallery image removed successfully!');
        } catch (error) {
            console.error('Error removing gallery image:', error);
            toast.error('Failed to remove gallery image');
        }
    };

    // Handle contact number changes
    const handleContactNumberChange = (index, value) => {
        if (value.length > 10) {
            toast.error("Contact Number cannot exceed 10 digits");
            return;
        }
        const newContactNumbers = [...formData.contactNumbers];
        newContactNumbers[index] = value;
        setFormData(prev => ({ ...prev, contactNumbers: newContactNumbers }));
    };
    const handleEmailChange = (index, value) => {
        const newEmailAddresses = [...formData.emailAddresses];
        newEmailAddresses[index] = value;
        setFormData(prev => ({ ...prev, emailAddresses: newEmailAddresses }));
    };

    const getYouTubeId = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : '';
    };

    const addHighlight = () => {
        setFormData(prev => ({
            ...prev,
            highlights: [...(prev.highlights || []), '']
        }));
    };

    const handleHighlightChange = (index, value) => {
        const newHighlights = [...(formData.highlights || [])];
        newHighlights[index] = value;

        // Remove the last empty highlight if there are multiple empty ones
        if (newHighlights.length > 1 &&
            index === newHighlights.length - 2 &&
            value === '' &&
            newHighlights[newHighlights.length - 1] === '') {
            newHighlights.pop();
        }

        setFormData(prev => ({
            ...prev,
            highlights: newHighlights
        }));
    };

    const removeHighlight = (index) => {
        const newHighlights = formData.highlights.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };
    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '')
            .replace(/\-+/g, '-');
    }
    const handleSubmit = async (e, signatureData = null) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ============= VALIDATION SECTION =============

            // 1. Property Type Validation
            if (!formData.propertyType) {
                throw new Error('Please select a Hostels type');
            }

            const selectedPropertyType = propertyTypes.find(type => type.propertyType === formData.propertyType);
            if (!selectedPropertyType) {
                throw new Error('Please select a valid Hostels type');
            }

            // 2. Property Name Validation
            if (!formData.propertyName || formData.propertyName.trim() === '') {
                throw new Error('Hostels name is required');
            }

            // 3. Location Validation
            if (!formData.locationType) {
                throw new Error('Location type is required');
            }

            if (
                (formData.propertyStyle === 'hostel_pg_style_only' || formData.propertyStyle === 'apartment_pg_only') &&
                !formData.propertyStyleOption
            ) {
                throw new Error('Please select a hostels style option');
            }

            // 4. Main Image Validation
            if (!formData.mainImage?.url) {
                throw new Error('Main image is required');
            }

            // 5. Contact Number Validation
            const validContactNumbers = formData.contactNumbers
                .map(num => num ? num.trim() : '')
                .filter(num => num !== '');

            if (validContactNumbers.length === 0) {
                throw new Error('At least one contact number is required');
            }

            // 6. Rent Price Validation
            if (!formData.rentPrice || formData.rentPrice <= 0) {
                throw new Error('Valid rent price is required');
            }

            // 7. Owner/Broker Name Validation
            if (!formData.ownerName && !formData.brokerName) {
                throw new Error('Either owner name or broker name is required');
            }

            // ============= DATA PREPARATION SECTION =============

            // Get selected location types
            const selectedLocationType = locationType.find(loc => loc.locationType === formData.locationType);
            const selectedSubLocationType = subLocationType.find(subLoc => subLoc.subLocationType === formData.subLocationType);
            const selectedGaliType = galiType.find(gali => gali.galiType === formData.galiType);

            // Transform video data to match database schema
            let videoData = {};
            if (formData.video?.type === 'upload' && formData.video?.file) {
                videoData = {
                    type: 'upload',
                    url: formData.video.file.url,
                    key: formData.video.file.key
                };
            } else if (formData.video?.type === 'youtube' && formData.video?.youtubeLink) {
                videoData = {
                    type: 'youtube',
                    youtubeLink: formData.video.youtubeLink
                };
            }

            // Filter and clean email addresses
            const validEmailAddresses = formData.emailAddresses
                .map(email => email ? email.trim() : '')
                .filter(email => email !== '');

            // Prepare the data to be submitted
            const formDataToSubmit = {
                ...formData,
                propertyNameSlug: slugify(formData.propertyName),
                // Ensure we're using the exact property type from the selected type
                propertyType: selectedPropertyType.propertyType,
                locationType: selectedLocationType?.locationType || formData.locationType,
                subLocationType: selectedSubLocationType?.subLocationType || formData.subLocationType,
                galiType: selectedGaliType?.galiType || formData.galiType,
                contactNumbers: validContactNumbers,
                emailAddresses: validEmailAddresses,
                video: Object.keys(videoData).length > 0 ? videoData : undefined,
                // Ensure numeric fields are numbers
                rentPrice: Number(formData.rentPrice),
                maxRentPrice: formData.maxRentPrice ? Number(formData.maxRentPrice) : undefined,
                numberOfRooms: Number(formData.numberOfRooms) || 0,
                numberOfBathrooms: Number(formData.numberOfBathrooms) || 0,
                propertyStyleOption: formData.propertyStyle === 'hostel_pg_style_only' || formData.propertyStyle === 'apartment_pg_only'
                    ? formData.propertyStyleOption
                    : '',
                bedSize: formData.propertyStyle === 'hostel_pg_style_only' ? formData.bedSize : '',
                apartmentSize: formData.propertyStyle === 'apartment_pg_only' ? formData.apartmentSize : '',
                // Add signature data if provided from declaration form
                ...(signatureData && {
                    signatureUrl: signatureData.signatureUrl,
                    verificationDate: signatureData.verificationDate,
                    declarationAccepted: true
                })
            };


            // ============= API SUBMISSION SECTION =============

            let response;
            if (editingProperty) {
                // Update existing property
                response = await fetch(`/api/property/propertyDetails?id=${editingProperty._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataToSubmit)
                });
            } else {
                // Create new property
                response = await fetch('/api/property/propertyDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataToSubmit)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                // Handle validation errors from API
                if (data.validationErrors) {
                    const errorMessages = data.validationErrors
                        .map(err => `${err.field}: ${err.message}`)
                        .join(', ');
                    throw new Error(errorMessages);
                }
                throw new Error(data.error || 'Failed to save hostel details');
            }

            // Show success message
            toast.success(editingProperty ? 'Hostel updated successfully!' : 'Hostel created successfully!');


            // Reset form and refresh data
            resetForm();
            await fetchPropertyDetails();
            setEditingProperty(null);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.message || 'Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            propertyType: "",
            mainImage: { url: "", key: "", loading: false },
            galleryImages: [],
            video: { type: "upload", file: null, youtubeLink: "" },
            aadharImage: { url: "", key: "", loading: false },
            panImage: { url: "", key: "", loading: false },
            electricityBillImage: { url: "", key: "", loading: false },
            locationType: "",
            subLocationType: "",
            galiType: "",
            contactAddress: "",
            landMarkDetails: "", // Added missing field
            googleLocation: "", // Added missing field
            brokerName: "",
            ownerName: "",
            sonDaughterWifeOf: "", // Added missing field
            contactNumbers: [""],
            emailAddresses: [""],
            aadharCardNumber: "",
            panCardNumber: "",
            rentPrice: "",
            maxRentPrice: "",
            propertyName: "",
            propertyForRentLocatedOn: "", // Added missing field
            propertyFacingDirection: "", // Added missing field
            highlights: [],
            propertyFor: "",
            isAvailable: true,
            isTrending: false,
            isActive: true,
            propertyNameSlug: "",
            electricityCharges: { include: null, amount: '', type: '' },
            waterCharges: { include: null, amount: '', type: '' },
            securityDeposit: { required: null, amount: '', months: '' },
            maintenanceCharges: { required: null, amount: '', basis: '' },
            // New detailed property information fields
            propertyStyle: "",
            propertyStyleOption: "",
            bedSize: "",
            apartmentSize: "",
            tenantType: "",
            sizeInFeet: "",
            sizeInMeter: "",
            sizeUnit: "", // Added missing field for unit selection
            sizeLength: "", // Added missing field
            sizeWidth: "", // Added missing field
            numberOfBedrooms: "",
            numberOfBathrooms: 0, // Changed to number
            numberOfRooms: 0, // Added missing field
            furnishingStatus: "",
            amenities: [],
            bathroomStyle: "",
            bathroomType: "", // Added missing field
            parkingStyle: "",
            parkingAvailable: "", // Added missing field
            parkingType: "", // Added missing field
            roomStyle: "",
            petAllowed: "",
            smokingAllowed: "",
            familyAllowed: false,
            familyMembers: "2", // Default to 2
            vegetarianOnly: false,
            nonVegetarianAllowed: false,
            alcoholAllowed: "",
            lateNightEntryTime: "",
            availableFrom: "",
            minimumStay: "",
            detailFor: "",
            powerBackup: "",
            powerBackupType: "",
            powerBackupAvailable: null, // Added missing field
            powerBackupSources: { inverter: false, generator: false }, // Added missing field
            powerBackupCharge: null, // Added missing field
            floor: "",
            balcony: false,
            rooftop: false,
            wheelchair: false,
            housekeeping: false,
            roomAmenities: [],
            bathroomFeatures: [],
            cctv: "",
            cctvLocation: "",
            checkIn: "",
            checkOut: "",
            customBathroomAmenities: [],
            customFurnishedAmenitiesLabels: {},
            furnishedAmenities: [],
            // New comprehensive property detail fields
            lift: "",
            cctvFeatures: [],
            parkingAmenities: [],
            customParkingAmenities: [],
            parkingStyleOptions: [],
            customParkingStyles: [],
            lateNightTimeIn: "",
            lateNightTimeOut: "",
            roomStyleOptions: [],
            petShelter: "",
            muslimFamilyAllowed: "",
            nonVegAllowed: "",
            inRoomPartyAllowed: "",
            outsideVisitorAllowed: "",
            prohibitedGoods: "",
            visitorEntry: "",
            photographsVideos: "",
            priorNotice: "",
            priorNoticeTime: "",
            propertyAvailableFrom: "",
            minimumStayAllow: "",
            tenantTypeAllowed: [],
            customTenantTypes: [],
            stayAllowOnlyFor: "", // Added missing field

        });

        // Reset all upload states
        setVideoUploading(false);
        setUploadProgress(0);
        setRetryAttempt(0);
        setUploadError(null);
        setActiveTab('upload'); // Reset to upload tab
        setEditingProperty(null);
        setBrokerOrOwner('broker'); // Reset to broker

        // Clear file inputs
        if (mainImageRef.current) {
            mainImageRef.current.value = '';
        }
        if (galleryImagesRef.current) {
            galleryImagesRef.current.value = '';
        }
        if (videoRef.current) {
            videoRef.current.value = '';
        }
    };

    const handleEdit = (property) => {
        // Transform video data from database format to form format
        let videoData = { type: "upload", file: null, youtubeLink: "" };

        if (property.video) {
            if (property.video.type === 'upload' && property.video.url) {
                // Database stores video as { type: 'upload', url: '...', key: '...' }
                // Form expects { type: 'upload', file: { url: '...', key: '...' }, youtubeLink: '' }
                videoData = {
                    type: 'upload',
                    file: {
                        url: property.video.url,
                        key: property.video.key || '',
                        name: 'Existing Video',
                        type: 'video/*',
                        size: 0
                    },
                    youtubeLink: ''
                };
            } else if (property.video.type === 'youtube' && property.video.youtubeLink) {
                videoData = {
                    type: 'youtube',
                    file: null,
                    youtubeLink: property.video.youtubeLink
                };
            }
        }

        setFormData({
            propertyType: property.propertyType || "",
            mainImage: property.mainImage || { url: "", key: "", loading: false },
            galleryImages: property.galleryImages || [],
            aadharImage: property.aadharImage || { url: "", key: "", loading: false },
            panImage: property.panImage || { url: "", key: "", loading: false },
            electricityBillImage: property.electricityBillImage || { url: "", key: "", loading: false },
            video: videoData,
            locationType: property.locationType || "",
            subLocationType: getCanonicalSubLocationValue(property.subLocationType, property.locationType),
            galiType: getCanonicalGaliValue(property.galiType, property.locationType, property.subLocationType),
            contactAddress: property.contactAddress || "",
            landMarkDetails: property.landMarkDetails || "",
            googleLocation: property.googleLocation || "",
            brokerName: property.brokerName || "",
            ownerName: property.ownerName || "",
            sonDaughterWifeOf: property.sonDaughterWifeOf || "",
            contactNumbers: property.contactNumbers?.length ? [...property.contactNumbers] : [""],
            emailAddresses: property.emailAddresses?.length ? [...property.emailAddresses] : [""],
            rentPrice: property.rentPrice || "",
            maxRentPrice: property.maxRentPrice || "",
            propertyName: property.propertyName || "",
            propertyForRentLocatedOn: property.propertyForRentLocatedOn || "", // Added missing field
            propertyFacingDirection: property.propertyFacingDirection || "", // Added missing field
            highlights: property.highlights?.length ? [...property.highlights] : [""],
            aadharCardNumber: property.aadharCardNumber || "",
            panCardNumber: property.panCardNumber || "",
            electricityCharges: property.electricityCharges || { include: null, amount: '', type: '' },
            waterCharges: property.waterCharges || { include: null, amount: '', type: '' },
            securityDeposit: property.securityDeposit || { required: null, amount: '', months: '' },
            maintenanceCharges: property.maintenanceCharges || { required: null, amount: '', basis: '' },
            propertyFor: property.propertyFor || "",
            isAvailable: property.isAvailable !== undefined ? property.isAvailable : true,
            isTrending: property.isTrending !== undefined ? property.isTrending : false,
            isActive: property.isActive !== undefined ? property.isActive : true,
            propertyNameSlug: property.propertyNameSlug || "",
            // New detailed property information fields
            propertyStyle: property.propertyStyle || "",
            propertyStyleOption: property.propertyStyleOption || "",
            bedSize: property.bedSize || "",
            apartmentSize: property.apartmentSize || "",
            tenantType: property.tenantType || "",
            sizeInFeet: property.sizeInFeet || "",
            sizeInMeter: property.sizeInMeter || "",
            sizeUnit: property.sizeUnit || "", // Added missing field
            sizeLength: property.sizeLength || "", // Added missing field
            sizeWidth: property.sizeWidth || "", // Added missing field
            numberOfBedrooms: property.numberOfBedrooms || "",
            numberOfBathrooms: property.numberOfBathrooms || 0,
            numberOfRooms: property.numberOfRooms || 0, // Added missing field
            furnishingStatus: property.furnishingStatus || "",
            amenities: property.amenities || [],
            bathroomStyle: property.bathroomStyle || "",
            bathroomType: property.bathroomType || "", // Added missing field
            parkingStyle: property.parkingStyle || "",
            parkingAvailable: property.parkingAvailable || "", // Added missing field
            parkingType: property.parkingType || "", // Added missing field
            roomStyle: property.roomStyle || "",
            petAllowed: property.petAllowed || "",
            smokingAllowed: property.smokingAllowed || "",
            familyAllowed: property.familyAllowed || false,
            familyMembers: property.familyMembers || "2", // Default to "2" if missing, or use property value
            vegetarianOnly: property.vegetarianOnly || false,
            nonVegetarianAllowed: property.nonVegetarianAllowed || false,
            alcoholAllowed: property.alcoholAllowed || "",
            lateNightEntryTime: property.lateNightEntryTime || "",
            availableFrom: property.availableFrom || "",
            minimumStay: property.minimumStay || "",
            detailFor: property.detailFor || "",
            powerBackup: property.powerBackup || "",
            powerBackupType: property.powerBackupType || "",
            powerBackupAvailable: property.powerBackupAvailable ?? null, // Added missing field
            powerBackupSources: property.powerBackupSources || { inverter: false, generator: false }, // Added missing field
            powerBackupCharge: property.powerBackupCharge ?? null, // Added missing field
            floor: property.floor || "",
            balcony: property.balcony || false,
            rooftop: property.rooftop || false,
            wheelchair: property.wheelchair || false,
            housekeeping: property.housekeeping || false,
            roomAmenities: property.roomAmenities || [],
            bathroomFeatures: property.bathroomFeatures || [],
            cctv: property.cctv || "",
            cctvLocation: property.cctvLocation || "",
            checkIn: property.checkIn || "",
            checkOut: property.checkOut || "",
            customBathroomAmenities: property.customBathroomAmenities || [],
            customFurnishedAmenitiesLabels: property.customFurnishedAmenitiesLabels || {},
            furnishedAmenities: property.furnishedAmenities || [],
            // New comprehensive property detail fields
            lift: property.lift || "",
            cctvFeatures: property.cctvFeatures || [],
            parkingAmenities: property.parkingAmenities || [],
            customParkingAmenities: property.customParkingAmenities || [],
            parkingStyleOptions: property.parkingStyleOptions || [],
            customParkingStyles: property.customParkingStyles || [],
            lateNightTimeIn: property.lateNightTimeIn || "",
            lateNightTimeOut: property.lateNightTimeOut || "",
            roomStyleOptions: property.roomStyleOptions || [],
            petShelter: property.petShelter || "",
            muslimFamilyAllowed: property.muslimFamilyAllowed || "",
            nonVegAllowed: property.nonVegAllowed || "",
            inRoomPartyAllowed: property.inRoomPartyAllowed || "",
            outsideVisitorAllowed: property.outsideVisitorAllowed || "",
            prohibitedGoods: property.prohibitedGoods || "",
            visitorEntry: property.visitorEntry || "",
            photographsVideos: property.photographsVideos || "",
            priorNotice: property.priorNotice || "",
            priorNoticeTime: property.priorNoticeTime || "",
            propertyAvailableFrom: property.propertyAvailableFrom || "",
            minimumStayAllow: property.minimumStayAllow || "",
            tenantTypeAllowed: property.tenantTypeAllowed || [],
            customTenantTypes: property.customTenantTypes || [],
            stayAllowOnlyFor: property.stayAllowOnlyFor || "", // Added missing field

        });

        // Set broker or owner based on which field has data
        if (property.ownerName) {
            setBrokerOrOwner('owner');
        } else {
            setBrokerOrOwner('broker');
        }

        // Set the correct active tab based on video type
        if (videoData.type === 'youtube' && videoData.youtubeLink) {
            setActiveTab('youtube');
        } else if (videoData.type === 'upload' && videoData.file) {
            setActiveTab('upload');
        } else {
            setActiveTab('upload'); // Default to upload tab
        }

        setEditingProperty(property);
        // Scroll to form
        document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        const property = propertyDetails.find(p => p._id === id);
        setPropertyToDelete(property);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!propertyToDelete) return;
        setDeletingId(propertyToDelete._id);

        try {
            const response = await fetch(`/api/property/propertyDetails?id=${propertyToDelete._id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete Hostels');
            }

            // Refresh the properties list
            setPropertyDetails(propertyDetails.filter(property => property._id !== propertyToDelete._id));
            toast.success('Hostels deleted successfully');
        } catch (error) {
            console.error('Error deleting Hostels:', error);
            toast.error(error.message || 'Failed to delete Hostels');
        } finally {
            setIsDeleteDialogOpen(false);
            setPropertyToDelete(null);
            setDeletingId(null);
        }
    };
    return (
        <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-slate-800">Add New Hostel</h1>
                    <p className="text-sm text-slate-500 mt-1">Enter the details below to list a new hostel.</p>
                </div>

            <form onSubmit={handleSubmit} id="property-form" className="p-6 md:p-8 space-y-8 bg-white">
                {/* Property Be Like Select */}
                <div className="space-y-2">
                    <Label>Hostels Be Like</Label>
                    <Select
                        value={formData.propertyFor}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, propertyFor: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Hostels Be Like" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Property Type Select */}
                <div className="space-y-2">
                    <Label>Property Type (Property Information)</Label>
                    <Select
                        value={formData.propertyType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Hostels type" />
                        </SelectTrigger>
                        <SelectContent>
                            {propertyTypes.map((type, index) => (
                                <SelectItem key={index + 1} value={type.propertyType}>
                                    {type.propertyType}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Location Select */}
                <div className="space-y-2">
                    <Label>Location</Label>
                    <Select
                        value={formData.locationType}
                        onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            locationType: value,
                            subLocationType: "", // reset sub when main changes
                            galiType: "",        // reset gali too
                        }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locationType.map((location, index) => (
                                <SelectItem key={index + 1} value={location.locationType}>
                                    {location.locationType}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Sub Location Select */}
                <div className="space-y-2">
                    <Label>Sub Location</Label>
                    <Select
                        value={formData.subLocationType}
                        onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            subLocationType: value,
                            galiType: "", // reset gali when sub changes
                        }))}
                        disabled={!formData.locationType}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={formData.locationType ? "Select sub location" : "Select location first"} />
                        </SelectTrigger>
                        <SelectContent>
                            {formData.subLocationType && !subLocationType.some(sub =>
                                normalizeSelectValue(sub.locationType) === normalizeSelectValue(formData.locationType) &&
                                normalizeSelectValue(sub.subLocationType) === normalizeSelectValue(formData.subLocationType)
                            ) && (
                                    <SelectItem value={formData.subLocationType} className="hidden">
                                        {formData.subLocationType}
                                    </SelectItem>
                                )}
                            {subLocationType
                                .filter(sub =>
                                    normalizeSelectValue(sub.locationType) === normalizeSelectValue(formData.locationType) &&
                                    sub.subLocationType?.trim() !== ""
                                )
                                .map((location, index) => (
                                    <SelectItem key={index + 1} value={location.subLocationType}>
                                        {location.subLocationType}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Gali Location Select */}
                <div className="space-y-2">
                    <Label>Gali Location / society/ colony/ Ward Number Details</Label>
                    <Select
                        value={formData.galiType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, galiType: value }))}
                        disabled={!formData.subLocationType}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={formData.subLocationType ? "Select gali location" : "Select sub location first"} />
                        </SelectTrigger>
                        <SelectContent>
                            {formData.galiType && !galiType.some(gali =>
                                normalizeSelectValue(gali.locationType) === normalizeSelectValue(formData.locationType) &&
                                normalizeSelectValue(gali.subLocationType) === normalizeSelectValue(formData.subLocationType) &&
                                normalizeSelectValue(gali.galiName) === normalizeSelectValue(formData.galiType)
                            ) && (
                                    <SelectItem value={formData.galiType} className="hidden">
                                        {formData.galiType}
                                    </SelectItem>
                                )}
                            {galiType
                                .filter(gali =>
                                    normalizeSelectValue(gali.locationType) === normalizeSelectValue(formData.locationType) &&
                                    normalizeSelectValue(gali.subLocationType) === normalizeSelectValue(formData.subLocationType) &&
                                    gali.galiName?.trim() !== ""
                                )
                                .map((location, index) => (
                                    <SelectItem key={index + 1} value={location.galiName}>
                                        {location.galiName}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Address */}
                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                        <div className="w-full">
                            <Label>Address</Label>
                            <Textarea
                                className="bg-white border border-black rounded-md p-2"
                                name="contactAddress"
                                value={formData.contactAddress || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter Hostels address"
                            />
                        </div>
                        <div className="w-full">
                            <Label>LandMark Details</Label>
                            <Textarea
                                className="bg-white border border-black rounded-md p-2"
                                name="landMarkDetails"
                                value={formData.landMarkDetails || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter Hostels address"
                            />
                        </div>
                    </div>
                </div>
                {/* Google Location */}
                <div className="space-y-2">
                    <Label>Google Location</Label>
                    <Input
                        className="bg-white border border-black rounded-md p-2"
                        name="googleLocation"
                        value={formData.googleLocation}
                        onChange={handleChange}
                        placeholder="Enter Google Location"
                    />
                </div>
                <hr className="my-4 border border-gray-300" />
                {/* Property Video Section */}
                <div className="space-y-2">
                    <Label>Hostels Video</Label>
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => {
                            setActiveTab(value);
                            if (value === 'youtube' && formData.video?.file) {
                                setFormData(prev => ({
                                    ...prev,
                                    video: { type: 'youtube', file: null, youtubeLink: '' }
                                }));
                            }
                        }}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload" className="border border-black">Upload Video</TabsTrigger>
                            <TabsTrigger value="youtube" className="border border-black">YouTube Link</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upload" className="pt-4 space-y-4">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleVideoChange(e); // Pass the event object directly
                                    }
                                    e.target.value = ''; // Reset the input to allow re-uploading the same file
                                }}
                                className="hidden"
                                ref={videoRef}
                                id="video-upload-input"
                                disabled={videoUploading}
                            />
                            {!formData.video?.file ? (
                                <div 
                                    onClick={() => !videoUploading && videoRef.current && videoRef.current.click()}
                                    className={`border-2 border-dashed rounded-2xl h-[240px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors w-full max-w-[320px]
                                        ${videoUploading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                                >
                                    {videoUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm font-medium text-slate-600">
                                                {retryAttempt > 0 ? `Retry attempt ${retryAttempt}...` : 'Uploading video...'}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                <UploadCloud className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="text-center px-4">
                                                <p className="text-sm font-medium text-slate-700">Upload Video</p>
                                                <p className="text-xs text-slate-500 mt-1">MP4, WebM up to 50MB</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="relative w-full max-w-[480px] h-auto rounded-2xl overflow-hidden bg-slate-900 group border border-slate-200">
                                    <video
                                        src={formData.video.file.url}
                                        controls
                                        className="w-full h-auto max-h-[320px] object-contain"
                                    />
                                    <div className="absolute top-3 right-3 flex items-center justify-end z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                removeVideo();
                                                setActiveTab('youtube');
                                            }}
                                            className="w-10 h-10 rounded-full shadow-lg"
                                            disabled={videoUploading}
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute top-3 left-3 z-10 bg-black/60 px-2 py-1 rounded-md text-xs text-white max-w-[80%] truncate shadow-sm">
                                        {formData.video.file.name} ({(formData.video.file.size / (1024 * 1024)).toFixed(2)} MB)
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="youtube" className="pt-4 space-y-4">
                            <Input
                                type="text"
                                className="bg-white border border-black rounded-md p-2"
                                placeholder="Enter YouTube video URL"
                                value={formData.video?.youtubeLink || ''}
                                onChange={(e) => {
                                    const youtubeLink = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        video: {
                                            type: 'youtube',
                                            youtubeLink,
                                            file: null
                                        }
                                    }));
                                    setActiveTab('youtube'); // Ensure we're on the youtube tab
                                }}

                            />
                            {formData.video?.youtubeLink && (
                                <div className="mt-2">
                                    <div className="aspect-video w-full">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${getYouTubeId(formData.video.youtubeLink)}`}
                                            className="w-full h-full rounded"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
                <hr className="my-4 border border-gray-300" />
                {/* Broker Info */}
                <div className="space-y-4">
                    <h3 className="text-xl font-medium underline"> Broker / Owner / Hostels Information</h3>
                    <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">

                        {/* Property Name */}
                        <div className="w-full md:w-[50%]">
                            <Label>Hostel Name</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="propertyName"
                                value={formData.propertyName}
                                onChange={handleChange}
                                placeholder="Enter Hostel Name"
                            />
                        </div>
                        <div className="w-full md:w-[25%]">
                            <Label>Hostels For Rent Located On</Label>
                            <Select
                                value={formData.propertyForRentLocatedOn}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, propertyForRentLocatedOn: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Hostels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ground">Ground Floor</SelectItem>
                                    <SelectItem value="first">First Floor</SelectItem>
                                    <SelectItem value="second">Second Floor</SelectItem>
                                    <SelectItem value="third">Third Floor</SelectItem>
                                    <SelectItem value="fourth">Fourth Floor</SelectItem>
                                    <SelectItem value="fifth">Fifth Floor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-[25%]">
                            <Label>Hostels Facing Direction</Label>
                            <Select
                                value={formData.propertyFacingDirection}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, propertyFacingDirection: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Property" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="north">North: Ideal for business Owners</SelectItem>
                                    <SelectItem value="south">South:Suitable For Professional</SelectItem>
                                    <SelectItem value="east">East:Ideal for Health and Vitality</SelectItem>
                                    <SelectItem value="west">West:Good For Stability</SelectItem>
                                    <SelectItem value="northeast">Notheast:Peace & Spiritual Growth</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Main Property Image */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-600 ml-1">Main Hostels Image</Label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            className="hidden"
                            ref={mainImageRef}
                            id="main-image-input"
                            disabled={formData.mainImage.loading}
                        />
                        {!formData.mainImage.url ? (
                            <div 
                                onClick={() => !formData.mainImage.loading && mainImageRef.current && mainImageRef.current.click()}
                                className={`border-2 border-dashed rounded-2xl h-[240px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors w-full max-w-[320px]
                                    ${formData.mainImage.loading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                            >
                                {formData.mainImage.loading ? (
                                    <>
                                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm font-medium text-slate-600">Uploading...</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                            <UploadCloud className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="text-center px-4">
                                            <p className="text-sm font-medium text-slate-700">Upload Image</p>
                                            <p className="text-xs text-slate-500 mt-1">Recommended: Horizontal format</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="relative w-full max-w-[320px] h-[240px] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                <Image
                                    src={formData.mainImage.url}
                                    alt="Main Hostels preview"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={removeMainImage}
                                        className="w-12 h-12 rounded-full shadow-lg"
                                    >
                                        <Trash2Icon className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* gallery images */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-600 ml-1">Gallery Images</Label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleGalleryUpload}
                            className="hidden"
                            ref={galleryImagesRef}
                            id="gallery-images-input"
                            disabled={loading}
                        />
                        <div className="flex flex-wrap gap-4 mt-2">
                            {/* Upload Trigger Block */}
                            <div 
                                onClick={() => !loading && galleryImagesRef.current && galleryImagesRef.current.click()}
                                className={`border-2 border-dashed rounded-2xl h-[160px] w-full max-w-[160px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
                                    ${loading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
                                    <UploadCloud className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="text-center px-2">
                                    <p className="text-xs font-medium text-slate-700">Add Images</p>
                                </div>
                            </div>

                            {/* Uploaded Images */}
                            {formData.galleryImages.map((img, index) => (
                                <div key={index} className="relative w-full max-w-[160px] h-[160px] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                    <Image
                                        src={img.url}
                                        alt={`Gallery ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {img.loading && (
                                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeGalleryImage(index)}
                                            className="w-10 h-10 rounded-full shadow-lg"
                                            disabled={img.loading}
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Broker or Owner Name */}
                    <div className="flex flex-col xl:flex-row xl:flex-nowrap gap-2 w-full">
                        {/* Select Type */}
                        <div className="space-y-2 w-full xl:w-48">
                            <Label>Select Type</Label>
                            <Select
                                value={brokerOrOwner}
                                onValueChange={(value) => {
                                    setBrokerOrOwner(value);
                                    if (value === 'broker') {
                                        setFormData(prev => ({ ...prev, ownerName: "" }));
                                    } else {
                                        setFormData(prev => ({ ...prev, brokerName: "" }));
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Broker / Owner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="broker">Broker</SelectItem>
                                    <SelectItem value="owner">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-2 w-full">
                            {brokerOrOwner === 'broker' ? (
                                <>
                                    <Label>Broker Name</Label>
                                    <Input
                                        className="bg-white border border-black rounded-md p-2 w-full"
                                        name="brokerName"
                                        value={formData.brokerName}
                                        onChange={handleChange}
                                        placeholder="Enter broker name"
                                    />
                                </>
                            ) : (
                                <>
                                    <Label>Owner Name</Label>
                                    <Input
                                        className="bg-white border border-black rounded-md p-2 w-full"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        placeholder="Enter owner name"
                                    />
                                </>
                            )}
                        </div>

                        {/* Relation */}
                        <div className="space-y-2 w-full">
                            <Label>Son / Daughter / Wife Of</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2 w-full"
                                name="sonDaughterWifeOf"
                                value={formData.sonDaughterWifeOf}
                                onChange={handleChange}
                                placeholder="Enter Name"
                            />
                        </div>

                    </div>

                    {/* ============= SECTION 8: PROPERTY STYLE ============= */}
                    <div className="border-t border-b border-gray-400 p-4 space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Hostels Style</h3>
                        <div className="space-y-2">
                            <Label>Select Hostels Style</Label>
                            <Select
                                value={formData.propertyStyle}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    propertyStyle: value,
                                    propertyStyleOption: value === prev.propertyStyle ? prev.propertyStyleOption : '',
                                    bedSize: value === 'hostel_pg_style_only' ? prev.bedSize : '',
                                    apartmentSize: value === 'apartment_pg_only' ? prev.apartmentSize : ''
                                }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select here" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="room_style_only">Room Style Only</SelectItem>
                                    <SelectItem value="home_style_only">Home Style Only</SelectItem>
                                    <SelectItem value="hostel_pg_style_only">Hostel / PG Style Only</SelectItem>
                                    <SelectItem value="apartment_pg_only">Apartment / PG Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.propertyStyle === 'hostel_pg_style_only' && (
                            <div className="space-y-2">
                                <Label>Select Bed</Label>
                                <Select
                                    value={formData.propertyStyleOption}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, propertyStyleOption: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Bed" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="double_bed_room">Double Bed Room</SelectItem>
                                        <SelectItem value="single_bed_room">1 Single Bed Room</SelectItem>
                                        <SelectItem value="2_bed_twin_room">2 Bed Twin Room</SelectItem>
                                        <SelectItem value="3_bed_twin_room">3 Bed Twin Room</SelectItem>
                                        <SelectItem value="4_bed_twin_room">4 Bed Twin Room</SelectItem>
                                        <SelectItem value="5_bed_twin_room">5 Bed Twin Room</SelectItem>
                                        <SelectItem value="6_bed_twin_room">6 Bed Twin Room</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {formData.propertyStyle === 'apartment_pg_only' && (
                            <div className="space-y-2">
                                <Label>Select Apartment</Label>
                                <Select
                                    value={formData.propertyStyleOption}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, propertyStyleOption: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Apartment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1_bhk_apartment">1 BHK Apartment</SelectItem>
                                        <SelectItem value="2_bhk_apartment">2 BHK Apartment</SelectItem>
                                        <SelectItem value="3_bhk_apartment">3 BHK Apartment</SelectItem>
                                        <SelectItem value="4_bhk_apartment">4 BHK Apartment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-5 w-full">
                        <div className="w-full">
                            <Label>Minimum Rent Amount</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="rentPrice"
                                type="number"
                                value={formData.rentPrice}
                                onChange={handleChange}
                                placeholder="Enter Minimum Rent Price"
                            />
                        </div>
                        <div className="w-full">
                            <Label>Maximum Rent Amount</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="maxRentPrice"
                                type="number"
                                value={formData.maxRentPrice}
                                onChange={handleChange}
                                placeholder="Enter Maximum Rent Price"
                            />
                        </div>
                    </div>



                    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">

                        <div className="w-full">
                            <Label>Aadhar Card Number</Label>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <Input
                                    className="bg-white border border-black rounded-md p-2 w-full"
                                    name="aadharCardNumber"
                                    value={formData.aadharCardNumber}
                                    onChange={handleChange}
                                    placeholder="Enter Aadhar Card Number"
                                    maxLength={12}
                                />
                                <div className="flex flex-col gap-3 mt-4 w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAadharImageUpload}
                                        className="hidden"
                                        ref={aadharImageRef}
                                        id="aadhar-image-input"
                                        disabled={formData.aadharImage.loading}
                                    />
                                    {!formData.aadharImage.url ? (
                                        <div 
                                            onClick={() => !formData.aadharImage.loading && aadharImageRef.current && aadharImageRef.current.click()}
                                            className={`border-2 border-dashed rounded-2xl h-[160px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors w-full max-w-[240px]
                                                ${formData.aadharImage.loading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                                        >
                                            {formData.aadharImage.loading ? (
                                                <>
                                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-xs font-medium text-slate-600">Uploading...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
                                                        <UploadCloud className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="text-center px-2">
                                                        <p className="text-xs font-medium text-slate-700">Upload Aadhar</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative w-full max-w-[240px] h-[160px] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                            <Image
                                                src={formData.aadharImage.url}
                                                alt="Aadhar Card preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={removeAadharCardNumber}
                                                    className="w-10 h-10 rounded-full shadow-lg"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <Label>Pan Card Number</Label>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <Input
                                    className="bg-white border border-black rounded-md p-2 w-full"
                                    name="panCardNumber"
                                    value={formData.panCardNumber}
                                    onChange={handleChange}
                                    placeholder="Enter Pan Card Number"
                                />
                                <div className="flex flex-col gap-3 mt-4 w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePanImageUpload}
                                        className="hidden"
                                        ref={panImageRef}
                                        id="pan-image-input"
                                        disabled={formData.panImage.loading}
                                    />
                                    {!formData.panImage.url ? (
                                        <div 
                                            onClick={() => !formData.panImage.loading && panImageRef.current && panImageRef.current.click()}
                                            className={`border-2 border-dashed rounded-2xl h-[160px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors w-full max-w-[240px]
                                                ${formData.panImage.loading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                                        >
                                            {formData.panImage.loading ? (
                                                <>
                                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-xs font-medium text-slate-600">Uploading...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
                                                        <UploadCloud className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="text-center px-2">
                                                        <p className="text-xs font-medium text-slate-700">Upload PAN</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative w-full max-w-[240px] h-[160px] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                            <Image
                                                src={formData.panImage.url}
                                                alt="PAN Card preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={removePanCardNumber}
                                                    className="w-10 h-10 rounded-full shadow-lg"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                        <div className="flex-1 w-full">
                            <Label>Contact Numbers</Label>
                            {formData.contactNumbers.map((number, index) => (
                                <div key={index} className="flex gap-2 pb-1">
                                    <Input
                                        className="bg-white border border-black rounded-md p-2 w-full"
                                        type="number"
                                        value={number || ''}  // Changed from formData.contactNumbers to just number
                                        onChange={(e) => handleContactNumberChange(index, e.target.value)}
                                        placeholder={`Contact ${index + 1}`}
                                        maxLength={10}
                                    />
                                    {formData.contactNumbers.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => {
                                                const newNumbers = formData.contactNumbers.filter((_, i) => i !== index);
                                                setFormData(prev => ({ ...prev, contactNumbers: newNumbers }));
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        contactNumbers: [...prev.contactNumbers, '']
                                    }));
                                }}
                                className="mt-2"
                            >
                                + Add Another Number
                            </Button>
                        </div>
                        <div className="flex-1 w-full">
                            <Label>Email Address</Label>
                            {formData.emailAddresses.map((number, index) => (
                                <div key={index} className="flex gap-2 pb-1">
                                    <Input
                                        className="bg-white border border-black rounded-md p-2 w-full"
                                        type="email"
                                        value={number || ''}  // Changed from formData.contactNumbers to just number
                                        onChange={(e) => handleEmailChange(index, e.target.value)}
                                        placeholder={`Email ${index + 1}`}
                                    />
                                    {formData.emailAddresses.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => {
                                                const newNumbers = formData.emailAddresses.filter((_, i) => i !== index);
                                                setFormData(prev => ({ ...prev, emailAddresses: newNumbers }));
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        emailAddresses: [...prev.emailAddresses, '']
                                    }));
                                }}
                                className="mt-2"
                            >
                                + Add Another Email
                            </Button>
                        </div>
                    </div>
                    {/* Copy of Electricity Image */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-600 ml-1">Copy Of Electricity Bill</Label>
                        <div className="flex flex-col gap-3 w-full">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleElectricityBillImageUpload}
                                className="hidden"
                                ref={electricityBillImageRef}
                                id="electricity-bill-image-input"
                                disabled={formData.electricityBillImage.loading}
                            />
                            {!formData.electricityBillImage.url ? (
                                <div 
                                    onClick={() => !formData.electricityBillImage.loading && electricityBillImageRef.current && electricityBillImageRef.current.click()}
                                    className={`border-2 border-dashed rounded-2xl h-[160px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors w-full max-w-[240px]
                                        ${formData.electricityBillImage.loading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                                >
                                    {formData.electricityBillImage.loading ? (
                                        <>
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-xs font-medium text-slate-600">Uploading...</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
                                                <UploadCloud className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div className="text-center px-2">
                                                <p className="text-xs font-medium text-slate-700">Upload Bill</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="relative w-full max-w-[240px] h-[160px] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                    <Image
                                        src={formData.electricityBillImage.url}
                                        alt="Electricity Bill preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={removeElectricityBillImage}
                                            className="w-10 h-10 rounded-full shadow-lg"
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-gray-500"> To Finalize your Hostels listing on www.kagpremiumhomes.com, providing a copy fo Electiricty Bill is a critical step. While your Sale Deed proves you bougt the house, the Electricity Bill proves you are in active possession of it.</p>

                    </div>
                </div>
                {/* Electricity Charges */}
                <div className="space-y-3">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Label className="font-semibold">Electricity Charges</Label>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="electricityInclude"
                                checked={formData.electricityCharges?.include || false}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    electricityCharges: {
                                        ...prev.electricityCharges,
                                        include: e.target.checked,
                                        amount: e.target.checked ? prev.electricityCharges?.amount || '' : '',
                                        type: e.target.checked ? prev.electricityCharges?.type || '' : ''
                                    }
                                }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="electricityInclude" className="cursor-pointer">Include</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="electricityNotInclude"
                                checked={formData.electricityCharges?.include === false}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    electricityCharges: {
                                        ...prev.electricityCharges,
                                        include: !e.target.checked,
                                        amount: '',
                                        type: ''
                                    }
                                }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="electricityNotInclude" className="cursor-pointer">Not Include</label>
                        </div>
                    </div>

                    {formData.electricityCharges?.include && (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 ml-0 md:ml-6 mt-2">
                            <Label>If Yes Include So How Much Amount</Label>
                            <Select
                                value={formData.electricityCharges?.type || ''}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    electricityCharges: { ...prev.electricityCharges, type: value }
                                }))}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Type Amount" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fix">1: Fix</SelectItem>
                                    <SelectItem value="regular">2: Regular</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                className="bg-white border border-black rounded-md p-2 flex-1"
                                name="electricityAmount"
                                type="number"
                                value={formData.electricityCharges?.amount || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    electricityCharges: { ...prev.electricityCharges, amount: e.target.value }
                                }))}
                                placeholder="Enter Amount"
                            />
                        </div>
                    )}
                </div>

                {/* Water Charges */}
                <div className="space-y-3">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Label className="font-semibold">Water Charges</Label>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="waterInclude"
                                checked={formData.waterCharges?.include || false}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    waterCharges: {
                                        ...prev.waterCharges,
                                        include: e.target.checked,
                                        amount: e.target.checked ? prev.waterCharges?.amount || '' : '',
                                        type: e.target.checked ? prev.waterCharges?.type || '' : ''
                                    }
                                }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="waterInclude" className="cursor-pointer">Include</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="waterNotInclude"
                                checked={formData.waterCharges?.include === false}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    waterCharges: {
                                        ...prev.waterCharges,
                                        include: !e.target.checked,
                                        amount: '',
                                        type: ''
                                    }
                                }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="waterNotInclude" className="cursor-pointer">Not Include</label>
                        </div>
                    </div>

                    {formData.waterCharges?.include && (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 ml-0 md:ml-6 mt-2">
                            <Label>If Yes Include So How Much Amount</Label>
                            <Select
                                value={formData.waterCharges?.type || ''}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    waterCharges: { ...prev.waterCharges, type: value }
                                }))}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Type Amount" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fix">1: Fix</SelectItem>
                                    <SelectItem value="regular">2: Regular</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                className="bg-white border border-black rounded-md p-2 flex-1"
                                name="waterAmount"
                                type="number"
                                value={formData.waterCharges?.amount || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    waterCharges: { ...prev.waterCharges, amount: e.target.value }
                                }))}
                                placeholder="Enter Amount"
                            />
                        </div>
                    )}
                </div>

                {/* Security Deposit Amount */}
                <div className="space-y-3">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Label className="font-semibold">Security Deposit Amount</Label>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="securityYes"
                                checked={formData.securityDeposit?.required || false}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    securityDeposit: {
                                        ...prev.securityDeposit,
                                        required: e.target.checked,
                                        amount: e.target.checked ? prev.securityDeposit?.amount || '' : '',
                                        months: e.target.checked ? prev.securityDeposit?.months || '' : ''
                                    }
                                }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="securityYes" className="cursor-pointer">Yes</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="securityNo"
                                checked={formData.securityDeposit?.required === false}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    securityDeposit: {
                                        ...prev.securityDeposit,
                                        required: !e.target.checked,
                                        amount: '',
                                        months: ''
                                    }
                                }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="securityNo" className="cursor-pointer">No</label>
                        </div>
                    </div>

                    {formData.securityDeposit?.required && (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 ml-0 md:ml-6 mt-2">
                            <Label>If Yes So How Much Amount And Number Of Month</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2 flex-1"
                                name="securityAmount"
                                type="number"
                                value={formData.securityDeposit?.amount || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    securityDeposit: { ...prev.securityDeposit, amount: e.target.value }
                                }))}
                                placeholder="Type Amount"
                            />
                            <Select
                                value={formData.securityDeposit?.months}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, securityDeposit: { ...prev.securityDeposit, months: value } }))}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Number Of Month Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 Month</SelectItem>
                                    <SelectItem value="2">2 Month</SelectItem>
                                    <SelectItem value="3">3 Month</SelectItem>
                                    <SelectItem value="4">4 Month</SelectItem>
                                    <SelectItem value="5">5 Month</SelectItem>
                                    <SelectItem value="6">6 Month</SelectItem>
                                    <SelectItem value="7">7 Month</SelectItem>
                                    <SelectItem value="8">8 Month</SelectItem>
                                    <SelectItem value="9">9 Month</SelectItem>
                                    <SelectItem value="10">10 Month</SelectItem>
                                    <SelectItem value="11">11 Month</SelectItem>
                                    <SelectItem value="12">12 Month</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Property Maintenance Charges */}
                <div className="space-y-3">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Label className="font-semibold">Hostels Maintenance Charges</Label>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="maintenanceYes"
                                checked={formData.maintenanceCharges?.required || false}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    maintenanceCharges: {
                                        ...prev.maintenanceCharges,
                                        required: e.target.checked,
                                        amount: e.target.checked ? prev.maintenanceCharges?.amount || '' : '',
                                        basis: e.target.checked ? prev.maintenanceCharges?.basis || '' : ''
                                    }
                                }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="maintenanceYes" className="cursor-pointer">Yes</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="maintenanceNo"
                                checked={formData.maintenanceCharges?.required === false}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    maintenanceCharges: {
                                        ...prev.maintenanceCharges,
                                        required: !e.target.checked,
                                        amount: '',
                                        basis: ''
                                    }
                                }))}
                                className="w-4 h-4"
                            />
                            <label htmlFor="maintenanceNo" className="cursor-pointer">No</label>
                        </div>
                    </div>

                    {formData.maintenanceCharges?.required && (
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 ml-0 md:ml-6 mt-2">
                            <Label>If Yes So How Much Amount</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2 flex-1"
                                name="maintenanceAmount"
                                type="number"
                                value={formData.maintenanceCharges?.amount || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    maintenanceCharges: { ...prev.maintenanceCharges, amount: e.target.value }
                                }))}
                                placeholder="Type Amount"
                            />
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="monthBasis"
                                        name="maintenanceBasis"
                                        checked={formData.maintenanceCharges?.basis === 'month'}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            maintenanceCharges: { ...prev.maintenanceCharges, basis: 'month' }
                                        }))}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="monthBasis" className="cursor-pointer">Month Basis</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="yearBasis"
                                        name="maintenanceBasis"
                                        checked={formData.maintenanceCharges?.basis === 'year'}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            maintenanceCharges: { ...prev.maintenanceCharges, basis: 'year' }
                                        }))}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="yearBasis" className="cursor-pointer">Year Basis</label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Property Info */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Hostels Highlights</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="p-2 text-md bg-red-500 text-white hover:bg-red-600"
                            onClick={addHighlight}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Highlight
                        </Button>
                    </div>

                    {/* Always show at least one input field */}
                    {(formData.highlights?.length === 0 ? [''] : formData.highlights || []).map((highlight, index, array) => (
                        <div key={index} className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                            <Input
                                className="bg-white border border-black rounded-md p-2 w-full md:flex-1"
                                value={highlight || ''}
                                onChange={(e) => handleHighlightChange(index, e.target.value)}
                                placeholder={`Highlight ${index + 1}`}
                            />
                            {/* Show remove button if there's more than one highlight or if it's not the only empty one */}
                            {(array.length > 1 || (array.length === 1 && array[0] !== '')) && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeHighlight(index)}
                                    className="flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                <hr className="my-6 border border-gray-300" />

                {/* Number Of Familty Memeber Allow */}
                <div className="space-y-2">
                    <Label>Number of Family Members Allow (Min - 2)</Label>
                    <Input
                        type="number"
                        value={formData.familyMembers}
                        placeholder="Enter number of family members allow"
                        min="2"
                        onChange={(e) => setFormData(prev => ({ ...prev, familyMembers: e.target.value }))}
                        className="bg-white border border-black rounded-md p-2"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex flex-col xl:flex-row items-start gap-5">
                        <div className="w-full xl:w-auto">
                            <h2 className="font-semibold text-lg">Tenant Type Allow</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {["Single", "Couple", "Married", "Bachelor", "Job Person", "Boys Only", "Girls Only", "Student", "All Religion", "Govt Retired"].map((type, index) => (
                                    <label key={index} className="flex gap-2 items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.tenantTypeAllowed?.includes(type) || false}
                                            onChange={(e) => {
                                                const current = formData.tenantTypeAllowed || [];
                                                if (e.target.checked) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        tenantTypeAllowed: [...current, type]
                                                    }));
                                                } else {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        tenantTypeAllowed: current.filter(t => t !== type)
                                                    }));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">{type}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Custom Tenant Types */}
                            {formData.customTenantTypes && formData.customTenantTypes.length > 0 && (
                                <div className="space-y-2 mt-4">
                                    <Label className="text-sm font-semibold text-blue-600">Custom Tenant Types:</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {formData.customTenantTypes.map((type, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.tenantTypeAllowed?.includes(`custom_${type}`) || false}
                                                        onChange={(e) => {
                                                            const current = formData.tenantTypeAllowed || [];
                                                            const customKey = `custom_${type}`;
                                                            if (e.target.checked) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    tenantTypeAllowed: [...current, customKey]
                                                                }));
                                                            } else {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    tenantTypeAllowed: current.filter(t => t !== customKey)
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">{type}</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            customTenantTypes: prev.customTenantTypes.filter((_, i) => i !== index),
                                                            tenantTypeAllowed: (prev.tenantTypeAllowed || []).filter(t => t !== `custom_${type}`)
                                                        }));
                                                        toast.success('Custom tenant type removed!');
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Remove this custom amenity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white mt-3"
                                onClick={() => setIsTenantTypeModalOpen(true)}
                            >
                                Add More
                            </Button>

                        </div>
                        <div className="flex-1 w-full">
                            <Label>Stay Allow Only For</Label>
                            <Select
                                value={formData.stayAllowOnlyFor}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, stayAllowOnlyFor: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="study">Only Allow For Study</SelectItem>
                                    <SelectItem value="business">For Business Purpose Too</SelectItem>
                                    <SelectItem value="meeting">Allow For Stay & Public Meeting</SelectItem>
                                    <SelectItem value="commercial">Stay And Commercial Activities OK</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border border-gray-300" />

                {/* property Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 space-x-0">
                    {/* SELECT TYPE */}
                    <div>
                        <Label>Detail For What</Label>
                        <Select
                            value={type}
                            onValueChange={(val) => {
                                setType(val);
                                setUnit(null);
                                setFormData(prev => ({ ...prev, detailFor: val, sizeUnit: "" }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="entire">Entire Property</SelectItem>
                                <SelectItem value="room">Room Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ENTIRE PROPERTY */}
                    {type === "entire" && (
                        <div className="rounded-xl p-4 space-y-3">
                            <Label className="font-semibold">Property Size</Label>
                            {UnitSelector()}
                            {SizeInputs()}
                        </div>
                    )}

                    {/* ROOM */}
                    {type === "room" && (
                        <div className="rounded-xl p-4 space-y-3">
                            <Label className="font-semibold">Room Size</Label>
                            {UnitSelector()}
                            {SizeInputs()}
                        </div>
                    )}
                </div>



                {/* PowerBackUp Facility */}
                <div className="rounded-xl p-2 space-y-2">

                    <Label className="font-semibold">Powerbackup Facility</Label>

                    {/* AVAILABLE */}
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">

                        <span className="text-sm font-medium">Available</span>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={available === true}
                                onCheckedChange={() => {
                                    setAvailable(true);
                                    setFormData(prev => ({ ...prev, powerBackupAvailable: true }));
                                }}
                            />
                            <Label>Yes</Label>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={available === false}
                                onCheckedChange={() => {
                                    setAvailable(false);
                                    setCharge(null);
                                    setSources({ inverter: false, generator: false });
                                    setFormData(prev => ({
                                        ...prev,
                                        powerBackupAvailable: false,
                                        powerBackupSources: { inverter: false, generator: false },
                                        powerBackupCharge: null
                                    }));
                                }}
                            />
                            <Label>No</Label>
                        </div>
                    </div>
                    {/* IF YES SECTION */}
                    {available === true && (
                        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
                            {/* SOURCES */}
                            <div className="flex flex-wrap gap-4 items-center">

                                <span className="text-sm font-medium">If Yes</span>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={sources.inverter}
                                        onCheckedChange={(val) => {
                                            const newSources = { ...sources, inverter: !!val };
                                            setSources(newSources);
                                            setFormData(prev => ({ ...prev, powerBackupSources: newSources }));
                                        }}
                                    />
                                    <Label>Inverter</Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={sources.generator}
                                        onCheckedChange={(val) => {
                                            const newSources = { ...sources, generator: !!val };
                                            setSources(newSources);
                                            setFormData(prev => ({ ...prev, powerBackupSources: newSources }));
                                        }}
                                    />
                                    <Label>Generator</Label>
                                </div>
                            </div>

                            {/* CHARGE */}
                            <div className="flex flex-wrap gap-4 items-center">

                                <span className="text-sm font-bold px-2">Charge</span>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={charge === true}
                                        onCheckedChange={() => {
                                            setCharge(true);
                                            setFormData(prev => ({ ...prev, powerBackupCharge: true }));
                                        }}
                                    />
                                    <Label>Yes</Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={charge === false}
                                        onCheckedChange={() => {
                                            setCharge(false);
                                            setFormData(prev => ({ ...prev, powerBackupCharge: false }));
                                        }}
                                    />
                                    <Label>No</Label>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
                <hr className="my-6 border border-gray-300" />

                <div className="space-y-4">
                    {/* ============= SECTION 1: NUMBER OF ROOMS ============= */}
                    <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Number Of Room</h3>

                        {/* Room Counter */}
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    numberOfRooms: Math.max(0, (prev.numberOfRooms || 0) - 1)
                                }))}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-l-full"
                            >
                                -
                            </Button>
                            <div className="bg-blue-600 text-white px-8 py-2 min-w-[80px] text-center font-semibold">
                                {formData.numberOfRooms || 0}
                            </div>
                            <Button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    numberOfRooms: (prev.numberOfRooms || 0) + 1
                                }))}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-full"
                            >
                                +
                            </Button>
                        </div>

                        {/* Room Amenities */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-semibold">Room Amenities</Label>
                            </div>

                            {/* Basic Room Amenities Array */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { value: 'balcony', label: 'Balcony Available' },
                                    { value: 'window', label: 'Window Available' },
                                    { value: 'rooftop', label: 'Rooftop Access' },
                                    { value: 'wheelchair', label: 'Wheelchair Accessible' },
                                    { value: 'housekeeping', label: 'Housekeeping' }
                                ].map((amenity) => (
                                    <label key={amenity.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.roomAmenities?.includes(amenity.value) || false}
                                            onChange={(e) => {
                                                const current = formData.roomAmenities || [];
                                                if (e.target.checked) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        roomAmenities: [...current, amenity.value]
                                                    }));
                                                } else {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        roomAmenities: current.filter(a => a !== amenity.value)
                                                    }));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">{amenity.label}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Furnished/Non-Furnished Radio Buttons (Same Line) */}
                            <div className="flex w-full flex-row md:flex-row justify-between md:justify-start items-center gap-6 my-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="furnishingStatus"
                                        checked={formData.furnishingStatus === 'furnished'}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            furnishingStatus: 'furnished',
                                            furnishedAmenities: []
                                        }))}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-semibold">Furnished</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="furnishingStatus"
                                        checked={formData.furnishingStatus === 'non_furnished'}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            furnishingStatus: 'non_furnished',
                                            furnishedAmenities: []
                                        }))}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-semibold">Non Furnished</span>
                                </label>
                            </div>

                            {/* If Furnished Section with Parent-Child Amenities */}
                            {formData.furnishingStatus === 'furnished' && (
                                <div className="space-y-4 mt-4">
                                    <Label className="font-semibold">If Furnished Please Choose Room Amenities</Label>

                                    {/* Parent Amenities with Sub-Amenities */}
                                    <div className="space-y-4">
                                        {/* Wi-Fi Parent with Sub-Amenities */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.furnishedAmenities?.includes('wifi') || false}
                                                    onChange={(e) => {
                                                        const current = formData.furnishedAmenities || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                furnishedAmenities: [...current, 'wifi']
                                                            }));
                                                        } else {
                                                            // Remove wifi and its sub-amenities
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                furnishedAmenities: current.filter(a =>
                                                                    !['wifi', 'wifi_basic', 'wifi_highspeed'].includes(a)
                                                                )
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm font-semibold">Wi-Fi</span>
                                            </label>

                                            {/* Wi-Fi Sub-Amenities */}
                                            {formData.furnishedAmenities?.includes('wifi') && (
                                                <div className="ml-6 flex flex-wrap gap-3">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.furnishedAmenities?.includes('wifi_basic') || false}
                                                            onChange={(e) => {
                                                                const current = formData.furnishedAmenities || [];
                                                                if (e.target.checked) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: [...current, 'wifi_basic']
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: current.filter(a => a !== 'wifi_basic')
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Basic (may cost extra)</span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.furnishedAmenities?.includes('wifi_highspeed') || false}
                                                            onChange={(e) => {
                                                                const current = formData.furnishedAmenities || [];
                                                                if (e.target.checked) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: [...current, 'wifi_highspeed']
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: current.filter(a => a !== 'wifi_highspeed')
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">High-speed (Free)</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {/* Other Standalone Amenities */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { value: 'bed_bedding', label: 'Bed & Bedding' },
                                                { value: 'linens', label: 'Linens' },
                                                { value: 'extra_pillow', label: 'Extra Pillow' },
                                                { value: 'no_bed_bedding', label: 'No Bed & Bedding' }
                                            ].map((amenity) => (
                                                <label key={amenity.value} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.furnishedAmenities?.includes(amenity.value) || false}
                                                        onChange={(e) => {
                                                            const current = formData.furnishedAmenities || [];
                                                            if (e.target.checked) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    furnishedAmenities: [...current, amenity.value]
                                                                }));
                                                            } else {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    furnishedAmenities: current.filter(a => a !== amenity.value)
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm">{amenity.label}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* Flat-screen TV Parent with Sub-Amenities */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.furnishedAmenities?.includes('tv') || false}
                                                    onChange={(e) => {
                                                        const current = formData.furnishedAmenities || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                furnishedAmenities: [...current, 'tv']
                                                            }));
                                                        } else {
                                                            // Remove TV and its sub-amenities
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                furnishedAmenities: current.filter(a =>
                                                                    !['tv', 'tv_cable', 'tv_free', 'tv_chargeable'].includes(a)
                                                                )
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm font-semibold">Flat-screen TV</span>
                                            </label>

                                            {/* TV Sub-Amenities */}
                                            {formData.furnishedAmenities?.includes('tv') && (
                                                <div className="ml-6 flex flex-wrap gap-3">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.furnishedAmenities?.includes('tv_cable') || false}
                                                            onChange={(e) => {
                                                                const current = formData.furnishedAmenities || [];
                                                                if (e.target.checked) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: [...current, 'tv_cable']
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: current.filter(a => a !== 'tv_cable')
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">With cable</span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.furnishedAmenities?.includes('tv_free') || false}
                                                            onChange={(e) => {
                                                                const current = formData.furnishedAmenities || [];
                                                                if (e.target.checked) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: [...current, 'tv_free']
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: current.filter(a => a !== 'tv_free')
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Free</span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.furnishedAmenities?.includes('tv_chargeable') || false}
                                                            onChange={(e) => {
                                                                const current = formData.furnishedAmenities || [];
                                                                if (e.target.checked) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: [...current, 'tv_chargeable']
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: current.filter(a => a !== 'tv_chargeable')
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Chargeable</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {/* More Standalone Amenities */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {[
                                                { value: 'ac', label: 'Air condition' },
                                                { value: 'water_cooler', label: 'Water Cooler' },
                                                { value: 'heating', label: 'Heating Facilities' },
                                                { value: 'ceiling_fan', label: 'Ceiling Fan' },
                                                { value: 'iron', label: 'Iron and ironing board' },
                                                { value: 'hairdryer', label: 'Hairdryer' },
                                                { value: 'desk', label: 'Desk/workspace' },
                                                { value: 'chair', label: 'Chair' },
                                                { value: 'water_bottles', label: 'Complimentary Water Bottles' }
                                            ].map((amenity) => (
                                                <label key={amenity.value} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.furnishedAmenities?.includes(amenity.value) || false}
                                                        onChange={(e) => {
                                                            const current = formData.furnishedAmenities || [];
                                                            if (e.target.checked) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    furnishedAmenities: [...current, amenity.value]
                                                                }));
                                                            } else {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    furnishedAmenities: current.filter(a => a !== amenity.value)
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm">{amenity.label}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* Room Almirah Parent with Sub-Amenities */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.furnishedAmenities?.includes('almirah') || false}
                                                    onChange={(e) => {
                                                        const current = formData.furnishedAmenities || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                furnishedAmenities: [...current, 'almirah']
                                                            }));
                                                        } else {
                                                            // Remove almirah and its sub-amenities
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                furnishedAmenities: current.filter(a =>
                                                                    !['almirah', 'almirah_movable', 'almirah_fixed'].includes(a)
                                                                )
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm font-semibold">Room Almirah</span>
                                            </label>

                                            {/* Almirah Sub-Amenities */}
                                            {formData.furnishedAmenities?.includes('almirah') && (
                                                <div className="ml-6 flex flex-wrap gap-3">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.furnishedAmenities?.includes('almirah_movable') || false}
                                                            onChange={(e) => {
                                                                const current = formData.furnishedAmenities || [];
                                                                if (e.target.checked) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: [...current, 'almirah_movable']
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: current.filter(a => a !== 'almirah_movable')
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Movable Almirah</span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.furnishedAmenities?.includes('almirah_fixed') || false}
                                                            onChange={(e) => {
                                                                const current = formData.furnishedAmenities || [];
                                                                if (e.target.checked) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: [...current, 'almirah_fixed']
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        furnishedAmenities: current.filter(a => a !== 'almirah_fixed')
                                                                    }));
                                                                }
                                                            }}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Fix On Wall</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom Furnished Amenities as Checkboxes */}
                                    {formData.customFurnishedAmenitiesLabels && Object.keys(formData.customFurnishedAmenitiesLabels).length > 0 && (
                                        <div className="space-y-2 mt-4">
                                            <Label className="text-sm font-semibold text-blue-600">Custom Amenities:</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {Object.entries(formData.customFurnishedAmenitiesLabels || {}).map(([key, label]) => (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.furnishedAmenities?.includes(key) || false}
                                                                onChange={(e) => {
                                                                    const current = formData.furnishedAmenities || [];
                                                                    if (e.target.checked) {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            furnishedAmenities: [...current, key]
                                                                        }));
                                                                    } else {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            furnishedAmenities: current.filter(a => a !== key)
                                                                        }));
                                                                    }
                                                                }}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">{label}</span>
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => {
                                                                    const newLabels = { ...prev.customFurnishedAmenitiesLabels };
                                                                    delete newLabels[key];
                                                                    return {
                                                                        ...prev,
                                                                        furnishedAmenities: (prev.furnishedAmenities || []).filter(a => a !== key),
                                                                        customFurnishedAmenitiesLabels: newLabels
                                                                    };
                                                                });
                                                                toast.success('Custom amenity removed!');
                                                            }}
                                                            className="text-red-500 hover:text-red-700"
                                                            title="Remove this custom amenity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="button"
                                        className="bg-blue-600 hover:bg-blue-700 text-white mt-3"
                                        onClick={() => setIsFurnishedAmenityModalOpen(true)}
                                    >
                                        Add More
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ============= SECTION 2: NUMBER OF BATHROOMS ============= */}
                    <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Number Of Bathroom</h3>

                        {/* Bathroom Counter */}
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    numberOfBathrooms: Math.max(0, (prev.numberOfBathrooms || 0) - 1)
                                }))}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-l-full"
                            >
                                -
                            </Button>
                            <div className="bg-blue-600 text-white px-8 py-2 min-w-[80px] text-center font-semibold">
                                {formData.numberOfBathrooms || 0}
                            </div>
                            <Button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    numberOfBathrooms: (prev.numberOfBathrooms || 0) + 1
                                }))}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-full"
                            >
                                +
                            </Button>

                            <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
                                onClick={() => setIsBathroomAmenityModalOpen(true)}
                            >
                                Add More
                            </Button>
                        </div>

                        {/* Custom Bathroom Amenities as Checkboxes */}
                        {formData.customBathroomAmenities && formData.customBathroomAmenities.length > 0 && (
                            <div className="space-y-2 mt-4">
                                <Label className="text-sm font-semibold text-blue-600">Custom Bathroom Amenities:</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {formData.customBathroomAmenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bathroomFeatures?.includes(`custom_${amenity}`) || false}
                                                    onChange={(e) => {
                                                        const current = formData.bathroomFeatures || [];
                                                        const customKey = `custom_${amenity}`;
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: [...current, customKey]
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: current.filter(a => a !== customKey)
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">{amenity}</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        customBathroomAmenities: prev.customBathroomAmenities.filter((_, i) => i !== index),
                                                        bathroomFeatures: (prev.bathroomFeatures || []).filter(a => a !== `custom_${amenity}`)
                                                    }));
                                                    toast.success('Custom bathroom amenity removed!');
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                                title="Remove this custom amenity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bathroom Type */}
                        <div className="space-y-3">
                            <Label className="font-semibold">Bathroom Type</Label>
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="bathroomType"
                                        checked={formData.bathroomType === 'indian'}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            bathroomType: 'indian'
                                        }))}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Indian Style</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="bathroomType"
                                        checked={formData.bathroomType === 'western'}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            bathroomType: 'western'
                                        }))}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Western Toilet</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="bathroomType"
                                        checked={formData.bathroomType === 'both'}
                                        onChange={() => setFormData(prev => ({
                                            ...prev,
                                            bathroomType: 'both'
                                        }))}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Both Style Toilet</span>
                                </label>
                            </div>
                        </div>

                        {/* Bathroom Amenities */}
                        <div className="space-y-3">
                            <Label className="font-semibold">Bathroom Amenities</Label>

                            {/* Basic Bathroom Amenities - Grid Layout */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {/* Bathroom Toiletries */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.bathroomFeatures?.includes('toiletries') || false}
                                        onChange={(e) => {
                                            const current = formData.bathroomFeatures || [];
                                            if (e.target.checked) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    bathroomFeatures: [...current, 'toiletries']
                                                }));
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    bathroomFeatures: current.filter(a => a !== 'toiletries')
                                                }));
                                            }
                                        }}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Bathroom Toiletries</span>
                                </label>
                            </div>

                            {/* Parent Amenities with Sub-options */}
                            <div className="space-y-4 mt-4">
                                {/* 1. LAUNDRY SERVICE - Parent with sub-amenities */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.bathroomFeatures?.includes('laundry') || false}
                                            onChange={(e) => {
                                                const current = formData.bathroomFeatures || [];
                                                if (e.target.checked) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        bathroomFeatures: [...current, 'laundry']
                                                    }));
                                                } else {
                                                    // Remove parent and all sub-amenities
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        bathroomFeatures: current.filter(a =>
                                                            a !== 'laundry' &&
                                                            a !== 'laundry_free' &&
                                                            a !== 'laundry_chargeable'
                                                        )
                                                    }));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-semibold">Laundry Service</span>
                                    </label>

                                    {/* Laundry Sub-amenities - Only show if parent is checked */}
                                    {formData.bathroomFeatures?.includes('laundry') && (
                                        <div className="ml-6 flex flex-wrap gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bathroomFeatures?.includes('laundry_free') || false}
                                                    onChange={(e) => {
                                                        const current = formData.bathroomFeatures || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: [...current, 'laundry_free']
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: current.filter(a => a !== 'laundry_free')
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Free</span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bathroomFeatures?.includes('laundry_chargeable') || false}
                                                    onChange={(e) => {
                                                        const current = formData.bathroomFeatures || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: [...current, 'laundry_chargeable']
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: current.filter(a => a !== 'laundry_chargeable')
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Chargeable</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* 2. BATHROOM GEYSER - Parent with sub-amenities */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.bathroomFeatures?.includes('geyser') || false}
                                            onChange={(e) => {
                                                const current = formData.bathroomFeatures || [];
                                                if (e.target.checked) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        bathroomFeatures: [...current, 'geyser']
                                                    }));
                                                } else {
                                                    // Remove parent and all sub-amenities
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        bathroomFeatures: current.filter(a =>
                                                            a !== 'geyser' &&
                                                            a !== 'geyser_electric' &&
                                                            a !== 'geyser_gas'
                                                        )
                                                    }));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-semibold">Bathroom Geyser</span>
                                    </label>

                                    {/* Geyser Sub-amenities - Only show if parent is checked */}
                                    {formData.bathroomFeatures?.includes('geyser') && (
                                        <div className="ml-6 flex flex-wrap gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bathroomFeatures?.includes('bathroom_shower') || false}
                                                    onChange={(e) => {
                                                        const current = formData.bathroomFeatures || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: [...current, 'bathroom_shower']
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: current.filter(a => a !== 'bathroom_shower')
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">BathRoom Shower</span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bathroomFeatures?.includes('water_supply_govt') || false}
                                                    onChange={(e) => {
                                                        const current = formData.bathroomFeatures || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: [...current, 'water_supply_govt']
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: current.filter(a => a !== 'water_supply_govt')
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Water Supply Govt</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* 3. SHARING STYLE - Parent with sub-amenities */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.bathroomFeatures?.includes('sharing') || false}
                                            onChange={(e) => {
                                                const current = formData.bathroomFeatures || [];
                                                if (e.target.checked) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        bathroomFeatures: [...current, 'sharing']
                                                    }));
                                                } else {
                                                    // Remove parent and all sub-amenities
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        bathroomFeatures: current.filter(a =>
                                                            a !== 'sharing' &&
                                                            a !== 'sharing_private' &&
                                                            a !== 'sharing_in_room' &&
                                                            a !== 'sharing_outside_room'
                                                        )
                                                    }));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-semibold">Sharing Style</span>
                                    </label>

                                    {/* Sharing Style Sub-amenities - Only show if parent is checked */}
                                    {formData.bathroomFeatures?.includes('sharing') && (
                                        <div className="ml-6 flex gap-4 flex-wrap">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bathroomFeatures?.includes('sharing_private') || false}
                                                    onChange={(e) => {
                                                        const current = formData.bathroomFeatures || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: [...current, 'sharing_private']
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: current.filter(a => a !== 'sharing_private')
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Private</span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bathroomFeatures?.includes('sharing_in_room') || false}
                                                    onChange={(e) => {
                                                        const current = formData.bathroomFeatures || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: [...current, 'sharing_in_room']
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: current.filter(a => a !== 'sharing_in_room')
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">In Room</span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.bathroomFeatures?.includes('sharing_outside_room') || false}
                                                    onChange={(e) => {
                                                        const current = formData.bathroomFeatures || [];
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: [...current, 'sharing_outside_room']
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                bathroomFeatures: current.filter(a => a !== 'sharing_outside_room')
                                                            }));
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Outside Room</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* ============= SECTION 3: LIFT - ELEVATOR ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-2">
                    <h3 className="text-lg font-semibold mb-4">Lift - Elevator</h3>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="lift"
                                checked={formData.lift === 'accessible'}
                                onChange={() => setFormData(prev => ({ ...prev, lift: 'accessible' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Accessible</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="lift"
                                checked={formData.lift === 'non_accessible'}
                                onChange={() => setFormData(prev => ({ ...prev, lift: 'non_accessible' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Non Accessible</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 4: CCTV CAMERA ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">CCTV Camera</h3>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="cctvCamera"
                                checked={formData.cctvFeatures?.includes('yes') || false}
                                onChange={() => {
                                    // Set to 'yes' and keep any existing sub-amenities
                                    setFormData(prev => ({
                                        ...prev,
                                        cctvFeatures: ['yes', ...(prev.cctvFeatures || []).filter(a => a !== 'no' && a !== 'yes')]
                                    }));
                                }}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-semibold">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="cctvCamera"
                                checked={formData.cctvFeatures?.includes('no') || false}
                                onChange={() => {
                                    // Set to 'no' and clear all sub-amenities
                                    setFormData(prev => ({
                                        ...prev,
                                        cctvFeatures: ['no']
                                    }));
                                }}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>

                    {/* CCTV Sub-amenities - Only show when Yes is checked */}
                    {formData.cctvFeatures?.includes('yes') && (
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.cctvFeatures?.includes('in_complete_property') || false}
                                    onChange={(e) => {
                                        const current = formData.cctvFeatures || [];
                                        if (e.target.checked) {
                                            setFormData(prev => ({ ...prev, cctvFeatures: [...current, 'in_complete_property'] }));
                                        } else {
                                            setFormData(prev => ({ ...prev, cctvFeatures: current.filter(a => a !== 'in_complete_property') }));
                                        }
                                    }}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">In Complete Property</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.cctvFeatures?.includes('in_front_of_main_gate') || false}
                                    onChange={(e) => {
                                        const current = formData.cctvFeatures || [];
                                        if (e.target.checked) {
                                            setFormData(prev => ({ ...prev, cctvFeatures: [...current, 'in_front_of_main_gate'] }));
                                        } else {
                                            setFormData(prev => ({ ...prev, cctvFeatures: current.filter(a => a !== 'in_front_of_main_gate') }));
                                        }
                                    }}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">In Front Of Main Gate</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* ============= SECTION 5: PARKING ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Parking</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="parking"
                                checked={formData.parkingAmenities?.includes('yes') || false}
                                onChange={() => {
                                    // Set to 'yes' and keep any existing sub-amenities
                                    setFormData(prev => ({
                                        ...prev,
                                        parkingAmenities: ['yes', ...(prev.parkingAmenities || []).filter(a => a !== 'no' && a !== 'yes')]
                                    }));
                                }}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-semibold">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="parking"
                                checked={formData.parkingAmenities?.includes('no') || false}
                                onChange={() => {
                                    // Set to 'no' and clear all sub-amenities
                                    setFormData(prev => ({
                                        ...prev,
                                        parkingAmenities: ['no']
                                    }));
                                }}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>

                    {/* Parking Sub-amenities - Only show when Yes is checked */}
                    {formData.parkingAmenities?.includes('yes') && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {['free_inhouse', 'not_reserved', 'paid_reserved', 'open', 'outside_premises'].map((item) => (
                                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.parkingAmenities?.includes(item) || false}
                                            onChange={(e) => {
                                                const current = formData.parkingAmenities || [];
                                                if (e.target.checked) {
                                                    setFormData(prev => ({ ...prev, parkingAmenities: [...current, item] }));
                                                } else {
                                                    setFormData(prev => ({ ...prev, parkingAmenities: current.filter(a => a !== item) }));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded capitalize">{item.replace(/_/g, ' ')}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Custom Parking Amenities */}
                            {formData.customParkingAmenities && formData.customParkingAmenities.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-blue-600">Custom Parking Amenities:</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {formData.customParkingAmenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.parkingAmenities?.includes(`custom_parking_${amenity}`) || false}
                                                        onChange={(e) => {
                                                            const current = formData.parkingAmenities || [];
                                                            const customKey = `custom_parking_${amenity}`;
                                                            if (e.target.checked) {
                                                                setFormData(prev => ({ ...prev, parkingAmenities: [...current, customKey] }));
                                                            } else {
                                                                setFormData(prev => ({ ...prev, parkingAmenities: current.filter(a => a !== customKey) }));
                                                            }
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">{amenity}</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            customParkingAmenities: prev.customParkingAmenities.filter((_, i) => i !== index),
                                                            parkingAmenities: (prev.parkingAmenities || []).filter(a => a !== `custom_parking_${amenity}`)
                                                        }));
                                                        toast.success('Custom parking amenity removed!');
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white ml-6"
                                onClick={() => setIsParkingAmenityModalOpen(true)}
                            >
                                Add More
                            </Button>
                        </>
                    )}
                </div>

                {/* ============= SECTION 6: PARKING STYLE ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Parking Style</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="parkingStyle"
                                checked={formData.parkingStyleOptions?.includes('yes') || false}
                                onChange={() => {
                                    // Set to 'yes' and keep any existing sub-options
                                    setFormData(prev => ({
                                        ...prev,
                                        parkingStyleOptions: ['yes', ...(prev.parkingStyleOptions || []).filter(a => a !== 'no' && a !== 'yes')]
                                    }));
                                }}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-semibold">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="parkingStyle"
                                checked={formData.parkingStyleOptions?.includes('no') || false}
                                onChange={() => {
                                    // Set to 'no' and clear all sub-options
                                    setFormData(prev => ({
                                        ...prev,
                                        parkingStyleOptions: ['no']
                                    }));
                                }}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">No</span>
                        </label>
                    </div>

                    {/* Parking Style Sub-options - Only show when Yes is checked */}
                    {formData.parkingStyleOptions?.includes('yes') && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {['two_wheeler', 'four_wheeler', '1_max_capacity_two_wheeler', '1_max_capacity_four_wheeler', '2_max_capacity_two_wheeler', '2_max_capacity_four_wheeler'].map((item) => (
                                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.parkingStyleOptions?.includes(item) || false}
                                            onChange={(e) => {
                                                const current = formData.parkingStyleOptions || [];
                                                if (e.target.checked) {
                                                    setFormData(prev => ({ ...prev, parkingStyleOptions: [...current, item] }));
                                                } else {
                                                    setFormData(prev => ({ ...prev, parkingStyleOptions: current.filter(a => a !== item) }));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded capitalize">{item.replace(/_/g, ' ')}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Custom Parking Styles */}
                            {formData.customParkingStyles && formData.customParkingStyles.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-blue-600">Custom Parking Styles:</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {formData.customParkingStyles.map((style, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.parkingStyleOptions?.includes(`custom_style_${style}`) || false}
                                                        onChange={(e) => {
                                                            const current = formData.parkingStyleOptions || [];
                                                            const customKey = `custom_style_${style}`;
                                                            if (e.target.checked) {
                                                                setFormData(prev => ({ ...prev, parkingStyleOptions: [...current, customKey] }));
                                                            } else {
                                                                setFormData(prev => ({ ...prev, parkingStyleOptions: current.filter(a => a !== customKey) }));
                                                            }
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">{style}</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            customParkingStyles: prev.customParkingStyles.filter((_, i) => i !== index),
                                                            parkingStyleOptions: (prev.parkingStyleOptions || []).filter(a => a !== `custom_style_${style}`)
                                                        }));
                                                        toast.success('Custom parking style removed!');
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white ml-6"
                                onClick={() => setIsParkingStyleModalOpen(true)}
                            >
                                Add More
                            </Button>
                        </>
                    )}
                </div>

                {/* ============= SECTION 7: LATE NIGHT ENTRY TIME ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Late Night Entry Time</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Select Time In</Label>
                            <Input
                                type="time"
                                value={formData.lateNightTimeIn || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, lateNightTimeIn: e.target.value }))}
                                className="bg-white border border-gray-400 rounded-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Select Time Out</Label>
                            <Input
                                type="time"
                                value={formData.lateNightTimeOut || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, lateNightTimeOut: e.target.value }))}
                                className="bg-white border border-gray-400 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* ============= SECTION 9: ROOM STYLE ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Room Style</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['interconnected_room', 'separated_room_style', 'new_developed', 'old_already_age'].map((item) => (
                            <label key={item} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.roomStyleOptions?.includes(item) || false}
                                    onChange={(e) => {
                                        const current = formData.roomStyleOptions || [];
                                        if (e.target.checked) {
                                            setFormData(prev => ({ ...prev, roomStyleOptions: [...current, item] }));
                                        } else {
                                            setFormData(prev => ({ ...prev, roomStyleOptions: current.filter(a => a !== item) }));
                                        }
                                    }}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm capitalize">{item.replace(/_/g, ' ')}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* ============= SECTION 9: PET REQUIREMENT ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Pet Requirement</h3>
                    <div className="space-y-3">
                        <div className="flex md:flex-row gap-4 md:gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="petAllowed"
                                    checked={formData.petAllowed === 'allowed'}
                                    onChange={() => setFormData(prev => ({ ...prev, petAllowed: 'allowed' }))}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Allowed</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="petAllowed"
                                    checked={formData.petAllowed === 'not_allowed'}
                                    onChange={() => setFormData(prev => ({ ...prev, petAllowed: 'not_allowed' }))}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Not Allowed</span>
                            </label>
                        </div>

                        {/* Pet Shelter Sub-option */}
                        {formData.petAllowed === 'allowed' && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">If allowed then pet shelter Available</Label>
                                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="petShelter"
                                            checked={formData.petShelter === 'yes'}
                                            onChange={() => setFormData(prev => ({ ...prev, petShelter: 'yes' }))}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="petShelter"
                                            checked={formData.petShelter === 'no'}
                                            onChange={() => setFormData(prev => ({ ...prev, petShelter: 'no' }))}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm bg-pink-500 text-white px-2 py-1 rounded">No</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ============= SECTION 10: SMOKING ALLOWED ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Smoking Allowed</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="smokingAllowed"
                                checked={formData.smokingAllowed === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, smokingAllowed: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="smokingAllowed"
                                checked={formData.smokingAllowed === 'not_allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, smokingAllowed: 'not_allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Not Allowed</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 11: MUSLIM FAMILY ALLOWED ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Muslim Family Allowed</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="muslimFamilyAllowed"
                                checked={formData.muslimFamilyAllowed === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, muslimFamilyAllowed: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="muslimFamilyAllowed"
                                checked={formData.muslimFamilyAllowed === 'not_allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, muslimFamilyAllowed: 'not_allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Not Allowed</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 12: NON VEGETARIAN FOOD ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Non Vegetarian Food</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="nonVegAllowed"
                                checked={formData.nonVegAllowed === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, nonVegAllowed: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="nonVegAllowed"
                                checked={formData.nonVegAllowed === 'not_allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, nonVegAllowed: 'not_allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Not Allowed</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 13: ALCOHOL ALLOWED ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Alcohol Allowed</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="alcoholAllowed"
                                checked={formData.alcoholAllowed === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, alcoholAllowed: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="alcoholAllowed"
                                checked={formData.alcoholAllowed === 'not_allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, alcoholAllowed: 'not_allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Not Allowed</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 14: IN ROOM PARTY ALLOWED ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">In Room Party Allowed</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="inRoomPartyAllowed"
                                checked={formData.inRoomPartyAllowed === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, inRoomPartyAllowed: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="inRoomPartyAllowed"
                                checked={formData.inRoomPartyAllowed === 'not_allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, inRoomPartyAllowed: 'not_allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Not Allowed</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 15: OUTSIDE VISITOR ALLOWED ============= */}
            <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Outside Visitor Allowed</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="outsideVisitorAllowed"
                                checked={formData.outsideVisitorAllowed === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, outsideVisitorAllowed: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="outsideVisitorAllowed"
                                checked={formData.outsideVisitorAllowed === 'not_allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, outsideVisitorAllowed: 'not_allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Not Allowed</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 16: PROHIBITED GOODS ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Prohibited goods, or objectionable materials</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="prohibitedGoods"
                                checked={formData.prohibitedGoods === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, prohibitedGoods: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="prohibitedGoods"
                                checked={formData.prohibitedGoods === 'not_allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, prohibitedGoods: 'not_allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Not Allowed</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 17: VISITOR ENTRY TO GUEST ROOMS ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Visitor entry to guest rooms</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="visitorEntry"
                                checked={formData.visitorEntry === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, visitorEntry: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="visitorEntry"
                                checked={formData.visitorEntry === 'strictly_prohibited'}
                                onChange={() => setFormData(prev => ({ ...prev, visitorEntry: 'strictly_prohibited' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Strictly Prohibited</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 18: PHOTOGRAPHS AND VIDEOS ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Photographs and videos</h3>
                    <div className="flex md:flex-row gap-4 md:gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="photographsVideos"
                                checked={formData.photographsVideos === 'allowed'}
                                onChange={() => setFormData(prev => ({ ...prev, photographsVideos: 'allowed' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Allowed</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="photographsVideos"
                                checked={formData.photographsVideos === 'strictly_prohibited'}
                                onChange={() => setFormData(prev => ({ ...prev, photographsVideos: 'strictly_prohibited' }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Strictly Prohibited</span>
                        </label>
                    </div>
                </div>

                {/* ============= SECTION 19: PRIOR NOTICE ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Prior Notice</h3>
                    <div className="space-y-3">
                        <div className="flex md:flex-row gap-4 md:gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="priorNotice"
                                    checked={formData.priorNotice === 'yes'}
                                    onChange={() => setFormData(prev => ({ ...prev, priorNotice: 'yes' }))}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="priorNotice"
                                    checked={formData.priorNotice === 'no'}
                                    onChange={() => setFormData(prev => ({ ...prev, priorNotice: 'no' }))}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">No</span>
                            </label>
                        </div>

                        {/* If Yes - Time/Days selector */}
                        {formData.priorNotice === 'yes' && (
                            <div className="ml-6 space-y-2">
                                <Label>Select Time Or Days</Label>
                                <Select
                                    value={formData.priorNoticeTime || ''}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, priorNoticeTime: value }))}
                                >
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select Months" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1_months">1 Month</SelectItem>
                                        <SelectItem value="2_months">2 Months</SelectItem>
                                        <SelectItem value="3_months">3 Months</SelectItem>
                                        <SelectItem value="4_months">4 Months</SelectItem>
                                        <SelectItem value="5_months">5 Months</SelectItem>
                                        <SelectItem value="6_months">6 Months</SelectItem>
                                        <SelectItem value="7_months">7 Months</SelectItem>
                                        <SelectItem value="8_months">8 Months</SelectItem>
                                        <SelectItem value="9_months">9 Months</SelectItem>
                                        <SelectItem value="10_months">10 Months</SelectItem>
                                        <SelectItem value="11_months">11 Months</SelectItem>
                                        <SelectItem value="12_months">12 Months</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>

                {/* ============= SECTION 20: PROPERTY AVAILABLE FROM ============= */}
                <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Property Available From</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Select Date</Label>
                            <Input
                                type="date"
                                value={formData.propertyAvailableFrom || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, propertyAvailableFrom: e.target.value }))}
                                className="bg-white border border-gray-400 rounded-md"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Minimum Stay Allow</Label>
                            <Select
                                value={formData.minimumStayAllow || ''}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, minimumStayAllow: value }))}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select Number Of Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                                        <SelectItem key={month} value={`${month}_month${month > 1 ? 's' : ''}`}>
                                            {month} Month{month > 1 ? 's' : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <hr className="my-6" />
                <div className="flex justify-start gap-4">
                    {/* ================= SUBMIT ================= */}

                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <Button
                            type={editingProperty ? 'submit' : 'button'}
                            className="flex-1 rounded-xl h-12 text-lg font-medium shadow-sm transition-all bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={!editingProperty ? () => {
                                // Validate that broker contact number OR email is entered
                                const hasValidPhone = formData.contactNumbers && formData.contactNumbers[0] && formData.contactNumbers[0].length === 10;
                                const hasValidEmail = formData.emailAddresses && formData.emailAddresses[0] && formData.emailAddresses[0].includes('@');

                                if (!hasValidPhone && !hasValidEmail) {
                                    toast.error('Please enter either a valid 10-digit contact number or email address!');
                                    return;
                                }

                                // Open verification method selection modal
                                setIsVerificationMethodModalOpen(true);
                            } : undefined}
                        >
                            {editingProperty ? 'Update Property' : 'Get OTP For Final Approval'}
                        </Button>

                        {editingProperty && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                className="rounded-xl h-12 px-8 font-medium shadow-sm transition-all border-red-500 text-red-600 hover:bg-red-50"
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                </div>
            </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Registered Hostels</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage and view all your registered hostels</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader className="bg-slate-50 border-b border-slate-100">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-center w-24 text-slate-600 font-semibold">Image</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Broker / Owner Name</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Property Type</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Location Type</TableHead>
                                <TableHead className="text-slate-600 font-semibold text-center">Price</TableHead>
                                <TableHead className="text-center text-slate-600 font-semibold">Is Available</TableHead>
                                <TableHead className="text-center text-slate-600 font-semibold">Is Trending</TableHead>
                                <TableHead className="text-center text-slate-600 font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {Array.isArray(propertyDetails) && propertyDetails.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No properties found
                                </TableCell>
                            </TableRow>
                        ) : (
                            propertyDetails.map((property) => (
                                <TableRow key={property._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="text-center font-medium">
                                        {property.mainImage?.url ? (
                                            <div className="flex justify-center">
                                                <Image
                                                    height={100}
                                                    width={100}
                                                    src={property.mainImage.url}
                                                    alt={property.propertyName}
                                                    loading='lazy'
                                                    className="h-16 w-16 object-cover rounded-xl shadow-sm border border-slate-200"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex justify-center">
                                                <div className="h-16 w-16 bg-slate-100 rounded-xl border border-slate-200" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900 text-center">{property.brokerName || property.ownerName}</TableCell>
                                    <TableCell className="text-slate-600 text-center">{property.propertyType}</TableCell>
                                    <TableCell className="text-slate-600 text-center">{property.locationType}</TableCell>
                                    <TableCell className="font-bold text-emerald-600 text-center text-lg">₹{property.rentPrice?.toLocaleString()}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={property.isActive}
                                                onCheckedChange={() => toggleAvailable(property)}
                                                className="data-[state=checked]:bg-blue-600"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={property.isTrending}
                                                onCheckedChange={() => toggleTrending(property)}
                                                className="data-[state=checked]:bg-amber-500"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(property)}
                                                className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setPropertyToDelete(property);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                                className="h-9 w-9 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            </div>


            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the hostel "{propertyToDelete?.propertyName}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setPropertyToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Delete Hostels
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Custom Furnished Amenity Modal */}
            <Dialog open={isFurnishedAmenityModalOpen} onOpenChange={setIsFurnishedAmenityModalOpen} >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Custom Furnished Amenity</DialogTitle>
                        <DialogDescription>
                            Add a new custom amenity for furnished rooms. It will be added to your local list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter amenity name..."
                                value={furnishedAmenityInput}
                                onChange={(e) => setFurnishedAmenityInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && furnishedAmenityInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            furnishedAmenities: [
                                                ...(prev.furnishedAmenities || []),
                                                `custom_${furnishedAmenityInput.trim().toLowerCase().replace(/\s+/g, '_')}`
                                            ],
                                            customFurnishedAmenitiesLabels: {
                                                ...(prev.customFurnishedAmenitiesLabels || {}),
                                                [`custom_${furnishedAmenityInput.trim().toLowerCase().replace(/\s+/g, '_')}`]: furnishedAmenityInput.trim()
                                            }
                                        }));
                                        toast.success('Furnished amenity added!');
                                        setFurnishedAmenityInput('');
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (furnishedAmenityInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            furnishedAmenities: [
                                                ...(prev.furnishedAmenities || []),
                                                `custom_${furnishedAmenityInput.trim().toLowerCase().replace(/\s+/g, '_')}`
                                            ],
                                            customFurnishedAmenitiesLabels: {
                                                ...(prev.customFurnishedAmenitiesLabels || {}),
                                                [`custom_${furnishedAmenityInput.trim().toLowerCase().replace(/\s+/g, '_')}`]: furnishedAmenityInput.trim()
                                            }
                                        }));
                                        toast.success('Furnished amenity added!');
                                        setFurnishedAmenityInput('');
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Add
                            </Button>
                        </div>

                        {/* Display custom amenities */}
                        {formData.customFurnishedAmenitiesLabels && Object.keys(formData.customFurnishedAmenitiesLabels).length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Custom Amenities:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(formData.customFurnishedAmenitiesLabels || {}).map(([key, label]) => (
                                        <div
                                            key={key}
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                        >
                                            <span className="text-sm">{label}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => {
                                                        const newLabels = { ...prev.customFurnishedAmenitiesLabels };
                                                        delete newLabels[key];
                                                        return {
                                                            ...prev,
                                                            furnishedAmenities: (prev.furnishedAmenities || []).filter(a => a !== key),
                                                            customFurnishedAmenitiesLabels: newLabels
                                                        };
                                                    });
                                                    toast.success('Amenity removed!');
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsFurnishedAmenityModalOpen(false);
                                setFurnishedAmenityInput('');
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Custom Bathroom Amenity Modal */}
            <Dialog open={isBathroomAmenityModalOpen} onOpenChange={setIsBathroomAmenityModalOpen} >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Custom Bathroom Amenity</DialogTitle>
                        <DialogDescription>
                            Add a new custom amenity for bathrooms. It will be added to your local list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter amenity name..."
                                value={bathroomAmenityInput}
                                onChange={(e) => setBathroomAmenityInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && bathroomAmenityInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            customBathroomAmenities: [
                                                ...(prev.customBathroomAmenities || []),
                                                bathroomAmenityInput.trim()
                                            ]
                                        }));
                                        toast.success('Bathroom amenity added!');
                                        setBathroomAmenityInput('');
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (bathroomAmenityInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            customBathroomAmenities: [
                                                ...(prev.customBathroomAmenities || []),
                                                bathroomAmenityInput.trim()
                                            ]
                                        }));
                                        toast.success('Bathroom amenity added!');
                                        setBathroomAmenityInput('');
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Add
                            </Button>
                        </div>

                        {/* Display custom bathroom amenities */}
                        {formData.customBathroomAmenities && formData.customBathroomAmenities.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Custom Amenities:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.customBathroomAmenities.map((amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                        >
                                            <span className="text-sm">{amenity}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        customBathroomAmenities: prev.customBathroomAmenities.filter((_, i) => i !== index)
                                                    }));
                                                    toast.success('Amenity removed!');
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsBathroomAmenityModalOpen(false);
                                setBathroomAmenityInput('');
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Custom Tenant Type Modal */}
            <Dialog open={isTenantTypeModalOpen} onOpenChange={setIsTenantTypeModalOpen} >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Custom Tenant Type</DialogTitle>
                        <DialogDescription>
                            Add a new custom tenant type. It will be added to your local list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter tenant type name..."
                                value={tenantTypeInput}
                                onChange={(e) => setTenantTypeInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && tenantTypeInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            customTenantTypes: [
                                                ...(prev.customTenantTypes || []),
                                                tenantTypeInput.trim()
                                            ]
                                        }));
                                        toast.success('Tenant type added!');
                                        setTenantTypeInput('');
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (tenantTypeInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            customTenantTypes: [
                                                ...(prev.customTenantTypes || []),
                                                tenantTypeInput.trim()
                                            ]
                                        }));
                                        toast.success('Tenant type added!');
                                        setTenantTypeInput('');
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>

                        {/* Display custom tenant types */}
                        {formData.customTenantTypes && formData.customTenantTypes.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Custom Tenant Types:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.customTenantTypes.map((type, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                        >
                                            <span className="text-sm">{type}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        customTenantTypes: prev.customTenantTypes.filter((_, i) => i !== index),
                                                        tenantTypeAllowed: (prev.tenantTypeAllowed || []).filter(t => t !== `custom_${type}`)
                                                    }));
                                                    toast.success('Tenant type removed!');
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsTenantTypeModalOpen(false);
                                setTenantTypeInput('');
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Custom Parking Amenity Modal */}
            <Dialog open={isParkingAmenityModalOpen} onOpenChange={setIsParkingAmenityModalOpen} >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Custom Parking Amenity</DialogTitle>
                        <DialogDescription>
                            Add a new custom parking amenity. It will be added to your local list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter parking amenity name..."
                                value={parkingAmenityInput}
                                onChange={(e) => setParkingAmenityInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && parkingAmenityInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            customParkingAmenities: [
                                                ...(prev.customParkingAmenities || []),
                                                parkingAmenityInput.trim()
                                            ]
                                        }));
                                        toast.success('Parking amenity added!');
                                        setParkingAmenityInput('');
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (parkingAmenityInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            customParkingAmenities: [
                                                ...(prev.customParkingAmenities || []),
                                                parkingAmenityInput.trim()
                                            ]
                                        }));
                                        toast.success('Parking amenity added!');
                                        setParkingAmenityInput('');
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>

                        {/* Display custom parking amenities */}
                        {formData.customParkingAmenities && formData.customParkingAmenities.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Custom Parking Amenities:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.customParkingAmenities.map((amenity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                        >
                                            <span className="text-sm">{amenity}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        customParkingAmenities: prev.customParkingAmenities.filter((_, i) => i !== index),
                                                        parkingAmenities: (prev.parkingAmenities || []).filter(a => a !== `custom_parking_${amenity}`)
                                                    }));
                                                    toast.success('Parking amenity removed!');
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsParkingAmenityModalOpen(false);
                                setParkingAmenityInput('');
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Custom Parking Style Modal */}
            <Dialog open={isParkingStyleModalOpen} onOpenChange={setIsParkingStyleModalOpen} >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Custom Parking Style</DialogTitle>
                        <DialogDescription>
                            Add a new custom parking style. It will be added to your local list.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter parking style name..."
                                value={parkingStyleInput}
                                onChange={(e) => setParkingStyleInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && parkingStyleInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            customParkingStyles: [
                                                ...(prev.customParkingStyles || []),
                                                parkingStyleInput.trim()
                                            ]
                                        }));
                                        toast.success('Parking style added!');
                                        setParkingStyleInput('');
                                    }
                                }}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (parkingStyleInput.trim()) {
                                        setFormData(prev => ({
                                            ...prev,
                                            customParkingStyles: [
                                                ...(prev.customParkingStyles || []),
                                                parkingStyleInput.trim()
                                            ]
                                        }));
                                        toast.success('Parking style added!');
                                        setParkingStyleInput('');
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>

                        {/* Display custom parking styles */}
                        {formData.customParkingStyles && formData.customParkingStyles.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Custom Parking Styles:</Label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.customParkingStyles.map((style, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                        >
                                            <span className="text-sm">{style}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        customParkingStyles: prev.customParkingStyles.filter((_, i) => i !== index),
                                                        parkingStyleOptions: (prev.parkingStyleOptions || []).filter(a => a !== `custom_style_${style}`)
                                                    }));
                                                    toast.success('Parking style removed!');
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsParkingStyleModalOpen(false);
                                setParkingStyleInput('');
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Verification Method Selection Modal */}
            <Dialog open={isVerificationMethodModalOpen} onOpenChange={setIsVerificationMethodModalOpen} >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Choose Verification Method</DialogTitle>
                        <DialogDescription>
                            Select how you want to receive your OTP for final approval
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-center py-4">
                        <Button
                            variant="outline"
                            className="h-32 w-full max-w-sm flex flex-col items-center justify-center gap-3 hover:bg-green-50 hover:border-green-500 transition-all"
                            onClick={() => {
                                if (!formData.emailAddresses || !formData.emailAddresses[0] || !formData.emailAddresses[0].includes('@')) {
                                    toast.error('Please enter a valid email address first!');
                                    return;
                                }
                                setVerificationMethod('email');
                                setIsVerificationMethodModalOpen(false);
                                setIsOTPModalOpen(true);
                            }}
                            disabled={!formData.emailAddresses || !formData.emailAddresses[0] || !formData.emailAddresses[0].includes('@')}
                        >
                            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div className="text-center">
                                <div className="font-semibold">Email OTP</div>
                                <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                    {formData.emailAddresses?.[0] || 'No email entered'}
                                </div>
                            </div>
                        </Button>
                    </div>

                    <div className="text-xs text-center text-gray-500">
                        OTP will be sent to your email address for verification
                    </div>
                </DialogContent>
            </Dialog>

            {/* OTP Verification Modal (Dynamic based on method) */}
            <Dialog open={isOTPModalOpen} onOpenChange={setIsOTPModalOpen} >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Verify Email Address
                        </DialogTitle>
                        <DialogDescription>
                            An OTP will be sent to your email address for verification.
                        </DialogDescription>
                    </DialogHeader>

                    {verificationMethod === 'email' ? (
                        <EmailOTPVerification
                            email={formData.emailAddresses?.[0] || ''}
                            onVerificationSuccess={(userData) => {
                                toast.success('Email verified successfully!');
                                setIsOTPModalOpen(false);
                                setVerificationMethod('');

                                // Show declaration form after verification
                                setShowDeclarationForm(true);
                            }}
                        />
                    ) : null}
                </DialogContent>
            </Dialog>

            {/* Declaration Form Modal */}
            <Dialog open={showDeclarationForm} onOpenChange={setShowDeclarationForm} >
                <DialogHeader className="sr-only">
                    <DialogTitle>Declaration Form</DialogTitle>
                    <DialogDescription>
                        Declaration Form
                    </DialogDescription>
                </DialogHeader>
                <DialogContent
                    className="max-w-5xl max-h-[90vh] overflow-y-auto"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DeclarationForm
                        formData={formData}
                        onSubmit={async (declarationData) => {

                            // Close the declaration modal
                            setShowDeclarationForm(false);

                            // Show submitting message
                            toast.success('Declaration accepted! Submitting Hostels...');

                            // Submit the form with signature data
                            const syntheticEvent = {
                                preventDefault: () => { }
                            };

                            // Call handleSubmit with signature data
                            await handleSubmit(syntheticEvent, declarationData);
                        }}
                        onCancel={() => {
                            setShowDeclarationForm(false);
                            toast.info('Declaration cancelled');
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div >

    );
};

export default HostelDetails;