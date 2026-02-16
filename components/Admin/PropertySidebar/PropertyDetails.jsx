"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, X, Upload } from "lucide-react";
import Image from "next/image";
import { Trash2, Edit } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { useRef } from 'react';
import toast from 'react-hot-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
const PropertyDetails = ({ propertyTypes = [], locationType = [], subLocationType = [], galiType = [] }) => {
    const [loading, setLoading] = useState(false);
    const [propertyDetails, setPropertyDetails] = useState([]);
    const [videoUploading, setVideoUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [retryAttempt, setRetryAttempt] = useState(0);
    const [uploadError, setUploadError] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const videoRef = useRef(null);
    const mainImageRef = useRef(null);
    const galleryImagesRef = useRef(null);
    const aadharImageRef = useRef(null);
    const panImageRef = useRef(null);
    const electricityBillImageRef = useRef(null);

    const [activeTab, setActiveTab] = useState('youtube');
    const [editingProperty, setEditingProperty] = useState(null);
    const [brokerOrOwner, setBrokerOrOwner] = useState('broker');
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
        brokerName: "",
        ownerName: "",
        contactNumbers: [""],
        emailAddresses: [""],
        aadharCardNumber: "",
        panCardNumber: "",
        rentPrice: "",
        maxRentPrice: "",
        propertyName: "",
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
        tenantType: "",
        sizeInFeet: "",
        sizeInMeter: "",
        numberOfBedrooms: "",
        numberOfBathrooms: "",
        furnishingStatus: "",
        amenities: [],
        bathroomStyle: "",
        parkingStyle: "",
        roomStyle: "",
        petAllowed: false,
        smokingAllowed: false,
        familyAllowed: false,
        vegetarianOnly: false,
        nonVegetarianAllowed: false,
        alcoholAllowed: false,
        lateNightEntryTime: "",
        availableFrom: "",
        minimumStay: "",
        detailFor: "",
        powerBackup: "",
        powerBackupType: "",
        floor: "",
        balcony: false,
        rooftop: false,
        wheelchair: false,
        housekeeping: false,
        roomAmenities: [],
        bathroomFeatures: [],
        cctv: "",
        cctvLocation: "",
        parkingType: "",
        checkIn: "",
        checkOut: "",

    });

    // console.log(propertyDetails)
    const fetchPropertyDetails = async () => {
        try {
            const response = await fetch("/api/createPropertyDetails?limit=10");
            const data = await response.json();
            // console.log(data)
            setPropertyDetails(data.data);
        } catch (error) {
            toast.error("Failed to fetch property type");
        }
    };
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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Update property status
    const updatePropertyStatus = async (id, updates) => {
        try {
            // console.log('Sending update request with:', { id, updates });
            const response = await fetch(`/api/createPropertyDetails?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            const responseData = await response.json();
            // console.log('Update response:', { status: response.status, data: responseData });

            if (!response.ok) {
                throw new Error(responseData.error || 'Failed to update property');
            }

            if (responseData.success) {
                toast.success('Property updated successfully');
                fetchPropertyDetails(); // Refresh the list
                return responseData.data; // Return the updated property
            } else {
                throw new Error(responseData.error || 'Failed to update property');
            }
        } catch (error) {
            console.error('Error updating property:', { error, message: error.message });
            toast.error(error.message || 'Failed to update property');
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
            toast.success(`Property ${!property.isTrending ? 'added to' : 'removed from'} trending`);
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
                toast.success('Main image uploaded successfully!');
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get the selected property type object
            const selectedPropertyType = propertyTypes.find(type => type.propertyType === formData.propertyType);
            const selectedLocationType = locationType.find(loc => loc.locationType === formData.locationType);
            const selectedSubLocationType = subLocationType.find(subLoc => subLoc.subLocationType === formData.subLocationType);
            const selectedGaliType = galiType.find(gali => gali.galiType === formData.galiType);

            if (!selectedPropertyType) {
                throw new Error('Please select a valid property type');
            }

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

            // Prepare the data to be submitted
            const formDataToSubmit = {
                ...formData,
                propertyNameSlug: slugify(formData.propertyName),
                // Ensure we're using the exact property type from the selected type
                propertyType: selectedPropertyType.propertyType,
                locationType: selectedLocationType?.locationType || formData.locationType,
                subLocationType: selectedSubLocationType?.subLocationType || formData.subLocationType,
                galiType: selectedGaliType?.galiType || formData.galiType,
                contactNumbers: formData.contactNumbers
                    .map(num => num ? num.trim() : '')
                    .filter(num => num !== ''),
                emailAddresses: formData.emailAddresses
                    .map(email => email ? email.trim() : '')
                    .filter(email => email !== ''),
                video: Object.keys(videoData).length > 0 ? videoData : undefined
            };
            // Validate at least one contact number
            if (!formData.contactNumbers || formData.contactNumbers.length === 0) {
                throw new Error('At least one contact number is required');
            }

            // Validate main image
            if (!formData.mainImage?.url) {
                throw new Error('Main image is required');
            }

            let response;
            if (editingProperty) {
                // Update existing property
                response = await fetch(`/api/createPropertyDetails?id=${editingProperty._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataToSubmit)
                });
            } else {
                // Create new property
                response = await fetch('/api/createPropertyDetails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataToSubmit)
                });
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save property details');
            }

            // Show success message
            toast.success(editingProperty ? 'Property updated successfully!' : 'Property created successfully!');

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
            brokerName: "",
            ownerName: "",
            contactNumbers: [""],
            emailAddresses: [""],
            aadharCardNumber: "",
            panCardNumber: "",
            rentPrice: "",
            maxRentPrice: "",
            electricityCharges: { include: null, amount: '', type: '' },
            waterCharges: { include: null, amount: '', type: '' },
            securityDeposit: { required: null, amount: '', months: '' },
            maintenanceCharges: { required: null, amount: '', basis: '' },
            propertyName: "",
            propertyFor: "",
            isTrending: false,
            highlights: [],
            // New detailed property information fields
            tenantType: "",
            sizeInFeet: "",
            sizeInMeter: "",
            numberOfBedrooms: "",
            numberOfBathrooms: "",
            furnishingStatus: "",
            amenities: [],
            bathroomStyle: "",
            parkingStyle: "",
            roomStyle: "",
            petAllowed: false,
            smokingAllowed: false,
            familyAllowed: false,
            vegetarianOnly: false,
            nonVegetarianAllowed: false,
            alcoholAllowed: false,
            lateNightEntryTime: "",
            availableFrom: "",
            minimumStay: "",
            detailFor: "",
            powerBackup: "",
            powerBackupType: "",
            floor: "",
            balcony: false,
            rooftop: false,
            wheelchair: false,
            housekeeping: false,
            roomAmenities: [],
            bathroomFeatures: [],
            cctv: "",
            cctvLocation: "",
            parkingType: "",
            checkIn: "",
            checkOut: "",

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
            subLocationType: property.subLocationType || "",
            galiType: property.galiType || "",
            contactAddress: property.contactAddress || "",
            brokerName: property.brokerName || "",
            ownerName: property.ownerName || "",
            contactNumbers: property.contactNumbers?.length ? [...property.contactNumbers] : [""],
            emailAddresses: property.emailAddresses?.length ? [...property.emailAddresses] : [""],
            rentPrice: property.rentPrice || "",
            maxRentPrice: property.maxRentPrice || "",
            propertyName: property.propertyName || "",
            highlights: property.highlights?.length ? [...property.highlights] : [""],
            aadharCardNumber: property.aadharCardNumber || "",
            panCardNumber: property.panCardNumber || "",
            electricityCharges: { include: null, amount: '', type: '' },
            waterCharges: { include: null, amount: '', type: '' },
            securityDeposit: { required: null, amount: '', months: '' },
            maintenanceCharges: { required: null, amount: '', basis: '' },
            propertyFor: property.propertyFor || "",
            // New detailed property information fields
            tenantType: property.tenantType || "",
            sizeInFeet: property.sizeInFeet || "",
            sizeInMeter: property.sizeInMeter || "",
            numberOfBedrooms: property.numberOfBedrooms || "",
            numberOfBathrooms: property.numberOfBathrooms || "",
            furnishingStatus: property.furnishingStatus || "",
            amenities: property.amenities || [],
            bathroomStyle: property.bathroomStyle || "",
            parkingStyle: property.parkingStyle || "",
            roomStyle: property.roomStyle || "",
            petAllowed: property.petAllowed || false,
            smokingAllowed: property.smokingAllowed || false,
            familyAllowed: property.familyAllowed || false,
            vegetarianOnly: property.vegetarianOnly || false,
            nonVegetarianAllowed: property.nonVegetarianAllowed || false,
            alcoholAllowed: property.alcoholAllowed || false,
            lateNightEntryTime: property.lateNightEntryTime || "",
            availableFrom: property.availableFrom || "",
            minimumStay: property.minimumStay || "",
            detailFor: "",
            powerBackup: "",
            powerBackupType: "",
            floor: "",
            balcony: false,
            rooftop: false,
            wheelchair: false,
            housekeeping: false,
            roomAmenities: [],
            bathroomFeatures: [],
            cctv: "",
            cctvLocation: "",
            parkingType: "",
            checkIn: "",
            checkOut: "",

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

        try {
            const response = await fetch(`/api/createPropertyDetails?id=${propertyToDelete._id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete property');
            }

            // Refresh the properties list
            setPropertyDetails(propertyDetails.filter(property => property._id !== propertyToDelete._id));
            toast.success('Property deleted successfully');
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error(error.message || 'Failed to delete property');
        } finally {
            setIsDeleteDialogOpen(false);
            setPropertyToDelete(null);
        }
    };




    return (
        <div className="container mx-auto p-2">
            <h1 className="text-2xl font-bold mb-6">Add New Property</h1>

            <form onSubmit={handleSubmit} id="property-form" className="space-y-6 border border-black p-4 rounded-md shadow-md  bg-gray-100">
                {/* Property Be Like Select */}
                <div className="space-y-2">
                    <Label>Property Be Like</Label>
                    <Select
                        value={formData.propertyFor}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, propertyFor: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Property Be Like" />
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
                            <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                            {propertyTypes.map((type) => (
                                <SelectItem key={type._id} value={type.propertyType}>
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
                        onValueChange={(value) => setFormData(prev => ({ ...prev, locationType: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locationType.map((location) => (
                                <SelectItem key={location._id} value={location.locationType}>
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
                        onValueChange={(value) => setFormData(prev => ({ ...prev, subLocationType: value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select sub location" />
                        </SelectTrigger>
                        <SelectContent>
                            {subLocationType.map((location) => (
                                <SelectItem key={location._id} value={location.subLocationType}>
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
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select gali location" />
                        </SelectTrigger>
                        <SelectContent>
                            {galiType.map((location) => (
                                <SelectItem key={location._id} value={location.galiName}>
                                    {location.galiName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Address */}
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Label>Address</Label>
                            <Textarea
                                className="bg-white border border-black rounded-md p-2"
                                name="contactAddress"
                                value={formData.contactAddress || ''}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter property address"
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
                                placeholder="Enter property address"
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
                    <Label>Property Video</Label>
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
                            <div className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
                                    onClick={() => {
                                        if (!videoUploading) {
                                            videoRef.current?.click();
                                        }
                                    }}
                                    disabled={videoUploading}
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>
                                        {videoUploading
                                            ? 'Uploading...'
                                            : formData.video?.file
                                                ? 'Change Video'
                                                : 'Select Video'
                                        }
                                    </span>
                                </Button>
                                {videoUploading && (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <div className="text-blue-600 text-sm">
                                            {retryAttempt > 0
                                                ? `Retry attempt ${retryAttempt} of 3...`
                                                : 'Uploading video...'}
                                        </div>
                                    </div>
                                )}
                                {formData.video?.file && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="text-red-500 hover:bg-red-50"
                                        onClick={() => {
                                            removeVideo();
                                            setActiveTab('youtube'); // Switch to YouTube tab when removing video
                                        }}
                                        disabled={videoUploading}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Remove Video
                                    </Button>
                                )}
                            </div>
                            {formData.video?.file?.url && (
                                <div className="mt-2">
                                    <video
                                        src={formData.video.file.url}
                                        controls
                                        className="max-w-full h-auto max-h-64 rounded"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.video.file.name} ({(formData.video.file.size / (1024 * 1024)).toFixed(2)} MB)
                                    </p>
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
                    <h3 className="text-xl font-medium underline"> Broker / Owner Information</h3>
                    <div className="flex gap-5 items-center">

                        {/* Property Name */}
                        <div className="w-[50%]">
                            <Label>Property Name</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="propertyName"
                                value={formData.propertyName}
                                onChange={handleChange}
                                placeholder="Enter Property Name"
                            />
                        </div>
                        <div className="w-[25%]">
                            <Label>Property For Rent Located On</Label>
                            <Select
                                value={formData.propertyForRentLocatedOn}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, propertyForRentLocatedOn: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Property" />
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
                        <div className="w-[25%]">
                            <Label>Property Facing Direction</Label>
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
                    <div className="space-y-2">
                        <Label>Main Property Image</Label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleMainImageUpload}
                                className="hidden"
                                ref={mainImageRef}
                                id="main-image-input"
                                disabled={formData.mainImage.loading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-48"
                                onClick={() => mainImageRef.current?.click()}
                                disabled={formData.mainImage.loading}
                            >
                                <Upload className="w-4 h-4" />
                                <span>{formData.mainImage.loading ? 'Uploading...' : 'Select Main Image'}</span>
                            </Button>
                            {formData.mainImage.loading && (
                                <div className="text-blue-600">Uploading...</div>
                            )}
                        </div>
                        {formData.mainImage.url && (
                            <div className="relative w-48 h-32 mt-2 border rounded overflow-hidden">
                                <Image
                                    src={formData.mainImage.url}
                                    alt="Main property"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeMainImage}
                                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-100"
                                    title="Remove image"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        )}
                    </div>
                    {/* gallery images */}
                    <div className="space-y-2">
                        <Label>Gallery Images</Label>
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
                        <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-48"
                            onClick={() => galleryImagesRef.current?.click()}
                            disabled={loading}
                        >
                            <Upload className="w-4 h-4" />
                            <span>Select Gallery Images</span>
                        </Button>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.galleryImages.map((img, index) => (
                                <div key={index} className="relative w-44 h-44 border rounded overflow-hidden">
                                    <Image
                                        src={img.url}
                                        alt={`Gallery ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {img.loading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <div className="text-white text-xs">Uploading...</div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-100"
                                        title="Remove image"
                                        disabled={img.loading}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Broker or Owner Name */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="space-y-2 w-48">
                            <Label>Select Type</Label>
                            <Select
                                value={brokerOrOwner}
                                onValueChange={(value) => {
                                    setBrokerOrOwner(value);
                                    // Clear the opposite field when switching
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
                        <div className="space-y-2 flex-1">
                            {/* Conditionally show Broker Name or Owner Name input */}
                            {brokerOrOwner === 'broker' ? (
                                <div className="space-y-2">
                                    <Label>Broker Name</Label>
                                    <Input
                                        className="bg-white border border-black rounded-md p-2"
                                        name="brokerName"
                                        value={formData.brokerName}
                                        onChange={handleChange}
                                        placeholder="Enter broker name"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label>Owner Name</Label>
                                    <Input
                                        className="bg-white border border-black rounded-md p-2"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        placeholder="Enter owner name"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 flex-1">
                            <Label>Son / Daughter / Wife Of</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="sonDaughterWifeOf"
                                value={formData.sonDaughterWifeOf}
                                onChange={handleChange}
                                placeholder="Enter Name"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">

                        <div className="">
                            <Label>Aadhar Card Number</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    className="bg-white border border-black rounded-md p-2"
                                    name="aadharCardNumber"
                                    value={formData.aadharCardNumber}
                                    onChange={handleChange}
                                    placeholder="Enter Aadhar Card Number"
                                />
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAadharImageUpload}
                                        className="hidden"
                                        ref={aadharImageRef}
                                        id="aadhar-image-input"
                                        disabled={formData.aadharImage.loading}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-48"
                                        onClick={() => aadharImageRef.current?.click()}
                                        disabled={formData.aadharImage.loading}
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>{formData.aadharImage.loading ? 'Uploading...' : 'Select Aadhar Image'}</span>
                                    </Button>
                                    {formData.aadharImage.loading && (
                                        <div className="text-blue-600">Uploading...</div>
                                    )}
                                </div>
                            </div>
                            {formData.aadharImage.url && (
                                <div className="relative w-48 h-32 mt-2 border rounded overflow-hidden">
                                    <Image
                                        src={formData.aadharImage.url}
                                        alt="Main property"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeAadharCardNumber}
                                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-100"
                                        title="Remove image"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="">
                            <Label>Pan Card Number</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    className="bg-white border border-black rounded-md p-2"
                                    name="panCardNumber"
                                    value={formData.panCardNumber}
                                    onChange={handleChange}
                                    placeholder="Enter Pan Card Number"
                                />
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePanImageUpload}
                                        className="hidden"
                                        ref={panImageRef}
                                        id="pan-image-input"
                                        disabled={formData.panImage.loading}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-48"
                                        onClick={() => panImageRef.current?.click()}
                                        disabled={formData.panImage.loading}
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>{formData.panImage.loading ? 'Uploading...' : 'Select Pan Image'}</span>
                                    </Button>
                                    {formData.panImage.loading && (
                                        <div className="text-blue-600">Uploading...</div>
                                    )}
                                </div>
                            </div>
                            {formData.panCardNumber.url && (
                                <div className="relative w-48 h-32 mt-2 border rounded overflow-hidden">
                                    <Image
                                        src={formData.panCardNumber.url}
                                        alt="Main property"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removePanCardNumber}
                                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-100"
                                        title="Remove image"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex  items-center gap-2">
                        <div className="flex-1">
                            <Label>Contact Numbers</Label>
                            {formData.contactNumbers.map((number, index) => (
                                <div key={index} className="flex gap-2 pb-1">
                                    <Input
                                        className="bg-white border border-black rounded-md p-2"
                                        type="number"
                                        value={number || ''}  // Changed from formData.contactNumbers to just number
                                        onChange={(e) => handleContactNumberChange(index, e.target.value)}
                                        placeholder={`Contact ${index + 1}`}
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
                        <div className="flex-1">
                            <Label>Email Address</Label>
                            {formData.emailAddresses.map((number, index) => (
                                <div key={index} className="flex gap-2 pb-1">
                                    <Input
                                        className="bg-white border border-black rounded-md p-2"
                                        type="number"
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
                    <div className="space-y-2">
                        <Label>Copy Of Electricity Bill</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleElectricityBillImageUpload}
                                    className="hidden"
                                    ref={electricityBillImageRef}
                                    id="electricity-bill-image-input"
                                    disabled={formData.electricityBillImage.loading}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-60"
                                    onClick={() => electricityBillImageRef.current?.click()}
                                    disabled={formData.electricityBillImage.loading}
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>{formData.electricityBillImage.loading ? 'Uploading...' : 'Select Electricity Bill Image'}</span>
                                </Button>
                                {formData.electricityBillImage.loading && (
                                    <div className="text-blue-600">Uploading...</div>
                                )}
                            </div>
                        </div>
                        {formData.electricityBillImage.url && (
                            <div className="relative w-60 h-32 mt-2 border rounded overflow-hidden">
                                <Image
                                    src={formData.electricityBillImage.url}
                                    alt="Main property"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeElectricityBillImage}
                                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-100"
                                    title="Remove image"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        )}
                        <p className="text-sm text-gray-500"> To Finalize your property listing on www.rishikeshrent.com, providing a copy fo Electiricty Bill is a critical step. While your Sale Deed proves you bougt the house, the Electricity Bill proves you are in active possession of it.</p>

                    </div>
                </div>
                <div className="flex items-center gap-5 w-full">
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
                {/* Electricity Charges */}
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-4 ml-6">
                            <Label>If Yes Include So How Much Amount</Label>
                            <Select
                                value={formData.electricityCharges?.type || ''}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    electricityCharges: { ...prev.electricityCharges, type: value }
                                }))}
                            >
                                <SelectTrigger className="w-48">
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
                    <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-4 ml-6">
                            <Label>If Yes Include So How Much Amount</Label>
                            <Select
                                value={formData.waterCharges?.type || ''}
                                onValueChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    waterCharges: { ...prev.waterCharges, type: value }
                                }))}
                            >
                                <SelectTrigger className="w-48">
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
                    <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-4 ml-6">
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
                    <div className="flex items-center gap-4">
                        <Label className="font-semibold">Property Maintenance Charges</Label>
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
                        <div className="flex items-center gap-4 ml-6">
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
                        <Label>Property Highlights</Label>
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
                        <div key={index} className="flex gap-2 items-center">
                            <Input
                                className="bg-white border border-black rounded-md p-2 flex-1"
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
                    <div className="flex items-start gap-2">
                        <div>
                            <h2 className="font-semibold text-lg">Tenant Type Allow</h2>
                            <div className="grid grid-cols-4 gap-2">
                                {["Single", "Couple", "Married", "Bachelor", "Job Person", "Boys Only", "Girls Only", "Student", "All Religion", "Govt Retired"].map(i =>

                                    <label className="flex gap-2">
                                        <input type="checkbox" />
                                        {i}
                                    </label>

                                )}
                            </div>
                            <Button>Add More</Button>

                        </div>
                        <div className="flex-1">
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

                <div className="space-y-4">
                    {/* Property Size */}
                    <div className="flex items-center gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <Label>Size in Feet</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="sizeInFeet"
                                type="number"
                                value={formData.sizeInFeet}
                                onChange={handleChange}
                                placeholder="Enter size in feet"
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <Label>Size in Meter</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="sizeInMeter"
                                type="number"
                                value={formData.sizeInMeter}
                                onChange={handleChange}
                                placeholder="Enter size in meter"
                            />
                        </div>
                    </div>

                    {/* Number of Bedrooms and Bathrooms */}
                    <div className="flex items-center gap-4 w-full">
                        <div className="space-y-2 w-full">
                            <Label>Number of Bedrooms</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="numberOfBedrooms"
                                type="number"
                                value={formData.numberOfBedrooms}
                                onChange={handleChange}
                                placeholder="Enter number of bedrooms"
                            />
                        </div>
                        <div className="space-y-2 w-full">
                            <Label>Number of Bathrooms</Label>
                            <Input
                                className="bg-white border border-black rounded-md p-2"
                                name="numberOfBathrooms"
                                type="number"
                                value={formData.numberOfBathrooms}
                                onChange={handleChange}
                                placeholder="Enter number of bathrooms"
                            />
                        </div>
                    </div>

                    {/* Furnishing Status */}
                    <div className="space-y-2">
                        <Label>Furnishing Status</Label>
                        <Select
                            value={formData.furnishingStatus}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, furnishingStatus: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select furnishing status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="furnished">Furnished</SelectItem>
                                <SelectItem value="semi_furnished">Semi Furnished</SelectItem>
                                <SelectItem value="non_furnished">Non Furnished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-2">
                        <Label>Amenities (Select all that apply)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white border border-black rounded-md p-4">
                            {[
                                { value: 'wifi', label: 'Wi-Fi' },
                                { value: 'ac', label: 'Air Conditioner' },
                                { value: 'parking', label: 'Parking' },
                                { value: 'lift', label: 'Lift/Elevator' },
                                { value: 'power_backup', label: 'Power Backup' },
                                { value: 'security', label: '24/7 Security' },
                                { value: 'gym', label: 'Gym' },
                                { value: 'swimming_pool', label: 'Swimming Pool' },
                                { value: 'garden', label: 'Garden' },
                                { value: 'water_supply', label: '24/7 Water Supply' },
                                { value: 'cctv', label: 'CCTV' },
                                { value: 'fire_safety', label: 'Fire Safety' }
                            ].map((amenity) => (
                                <div key={amenity.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={amenity.value}
                                        checked={formData.amenities?.includes(amenity.value) || false}
                                        onChange={(e) => {
                                            const currentAmenities = formData.amenities || [];
                                            if (e.target.checked) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    amenities: [...currentAmenities, amenity.value]
                                                }));
                                            } else {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    amenities: currentAmenities.filter(a => a !== amenity.value)
                                                }));
                                            }
                                        }}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor={amenity.value} className="text-sm cursor-pointer">
                                        {amenity.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bathroom Style */}
                    <div className="space-y-2">
                        <Label>Bathroom Style</Label>
                        <Select
                            value={formData.bathroomStyle}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, bathroomStyle: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select bathroom style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="indian">Indian Style</SelectItem>
                                <SelectItem value="western">Western Toilet</SelectItem>
                                <SelectItem value="both">Both Style Toilet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Parking Style */}
                    <div className="space-y-2">
                        <Label>Parking Style</Label>
                        <Select
                            value={formData.parkingStyle}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, parkingStyle: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select parking style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                                <SelectItem value="four_wheeler">Four Wheeler</SelectItem>
                                <SelectItem value="both_wheeler">Both Wheeler</SelectItem>
                                <SelectItem value="no_parking">No Parking</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Room Style */}
                    <div className="space-y-2">
                        <Label>Room Style</Label>
                        <Select
                            value={formData.roomStyle}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, roomStyle: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select room style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="interconnected">Interconnected Room</SelectItem>
                                <SelectItem value="separated">Separated Room Style</SelectItem>
                                <SelectItem value="new_developed">New Developed</SelectItem>
                                <SelectItem value="old_already_built">Old Already Built</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Property Policies */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Property Policies</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-black rounded-md p-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="petAllowed" className="cursor-pointer">Pet Allowed</Label>
                                <Switch
                                    id="petAllowed"
                                    checked={formData.petAllowed || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, petAllowed: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="smokingAllowed" className="cursor-pointer">Smoking Allowed</Label>
                                <Switch
                                    id="smokingAllowed"
                                    checked={formData.smokingAllowed || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, smokingAllowed: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="familyAllowed" className="cursor-pointer">Family Allowed</Label>
                                <Switch
                                    id="familyAllowed"
                                    checked={formData.familyAllowed || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, familyAllowed: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="vegetarianOnly" className="cursor-pointer">Vegetarian Only</Label>
                                <Switch
                                    id="vegetarianOnly"
                                    checked={formData.vegetarianOnly || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vegetarianOnly: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="nonVegetarianAllowed" className="cursor-pointer">Non-Vegetarian Allowed</Label>
                                <Switch
                                    id="nonVegetarianAllowed"
                                    checked={formData.nonVegetarianAllowed || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, nonVegetarianAllowed: checked }))}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="alcoholAllowed" className="cursor-pointer">Alcohol Allowed</Label>
                                <Switch
                                    id="alcoholAllowed"
                                    checked={formData.alcoholAllowed || false}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, alcoholAllowed: checked }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Late Night Entry Time */}
                    <div className="space-y-2">
                        <Label>Late Night Entry Time</Label>
                        <Input
                            className="bg-white border border-black rounded-md p-2"
                            name="lateNightEntryTime"
                            type="time"
                            value={formData.lateNightEntryTime}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Availability */}
                    <div className="space-y-2">
                        <Label>Property Available From</Label>
                        <Input
                            className="bg-white border border-black rounded-md p-2"
                            name="availableFrom"
                            type="date"
                            value={formData.availableFrom}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Minimum Stay Duration */}
                    <div className="space-y-2">
                        <Label>Minimum Stay Duration</Label>
                        <Select
                            value={formData.minimumStay}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, minimumStay: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select minimum stay" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select_time_in">Select Time In</SelectItem>
                                <SelectItem value="1_month">1 Month</SelectItem>
                                <SelectItem value="3_months">3 Months</SelectItem>
                                <SelectItem value="6_months">6 Months</SelectItem>
                                <SelectItem value="1_year">1 Year</SelectItem>
                                <SelectItem value="check_in_check_out">Check In Check Out</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <hr className="my-6" />

                <div className="flex justify-start gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading
                            ? 'Saving...'
                            : editingProperty
                                ? 'Update Property'
                                : 'Save Property'
                        }
                    </Button>
                    {editingProperty && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                            disabled={loading}
                            className="border-red-500 text-red-600 hover:bg-red-50"
                        >
                            Cancel Edit
                        </Button>
                    )}
                </div>


                <div className="max-w-6xl mx-auto p-6 space-y-6">


                    {/* ================= PROPERTY DETAILS ================= */}

                    <div className="border p-5 rounded-lg space-y-6">

                        <h2 className="font-semibold text-lg">Property Detail</h2>

                        {/* Purpose */}
                        <div className="grid grid-cols-3 gap-4">

                            <Select><SelectTrigger><SelectValue placeholder="Detail For What" /></SelectTrigger></Select>

                            <Input placeholder="Property Size Sqft" />
                            <Input placeholder="Room Size" />

                        </div>

                        {/* Backup */}
                        <div className="flex items-center gap-5">
                            <span>Power Backup</span>
                            <Switch />
                            <span>Inverter</span>
                            <Switch />
                            <span>Generator</span>
                            <Switch />
                        </div>

                        {/* Rooms */}
                        <div className="grid grid-cols-3 gap-4">
                            <Input placeholder="Number of Room" />
                            <Input placeholder="Number of Bedroom" />
                            <Input placeholder="Number of Bathroom" />
                        </div>

                        {/* Amenities */}
                        <div className="space-y-2">
                            <Label>Room Amenities</Label>
                            <div className="grid grid-cols-4 gap-3">

                                {["WiFi", "AC", "Bed", "TV", "Fridge", "Fan", "Desk", "Chair", "Iron", "Hair Dryer"].map(a =>

                                    <label className="flex gap-2">
                                        <input type="checkbox" />
                                        {a}
                                    </label>

                                )}

                            </div>
                        </div>

                        {/* Bathroom */}
                        <div className="space-y-2">
                            <Label>Bathroom Type</Label>
                            <div className="flex gap-6">

                                <label><input type="radio" name="bath" />Indian</label>
                                <label><input type="radio" name="bath" />Western</label>
                                <label><input type="radio" name="bath" />Both</label>

                            </div>
                        </div>

                        {/* Parking */}
                        <div className="space-y-2">
                            <Label>Parking</Label>
                            <div className="flex gap-6">
                                <label><input type="radio" name="park" />Free</label>
                                <label><input type="radio" name="park" />Reserved</label>
                                <label><input type="radio" name="park" />Paid</label>
                            </div>
                        </div>

                        {/* Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input type="time" />
                            <Input type="time" />
                        </div>

                    </div>

                    {/* ================= POLICIES ================= */}

                    <div className="border p-5 rounded-lg space-y-4">

                        <h2 className="font-semibold text-lg">Policies</h2>

                        <div className="grid grid-cols-3 gap-4">

                            {[
                                "Pet Allowed",
                                "Smoking Allowed",
                                "Family Allowed",
                                "Veg Only",
                                "Non Veg Allowed",
                                "Alcohol Allowed"
                            ].map(p =>

                                <div className="flex justify-between border p-2 rounded">
                                    <span>{p}</span>
                                    <Switch />
                                </div>

                            )}

                        </div>

                    </div>

                    {/* ================= AVAILABILITY ================= */}

                    <div className="border p-5 rounded-lg space-y-4">

                        <h2 className="font-semibold text-lg">Availability</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <Input type="date" />
                            <Select><SelectTrigger><SelectValue placeholder="Minimum Stay" /></SelectTrigger></Select>
                        </div>

                    </div>

                    {/* ================= SUBMIT ================= */}

                    <Button className="w-full text-lg bg-blue-600 hover:bg-blue-700">
                        Get OTP For Final Approval
                    </Button>

                </div>



            </form>
            <h2 className="text-2xl font-bold mt-10 mb-4">Existing Properties Details</h2>
            <Table className="border border-black p-2">
                <TableHeader>
                    <TableRow className="bg-gray-200 border border-black">
                        <TableHead className="border border-black text-center">Image</TableHead>
                        <TableHead className="border border-black text-center">Broker / Owner Name</TableHead>
                        <TableHead className="border border-black text-center">Property Type</TableHead>
                        <TableHead className="border border-black text-center">Location Type</TableHead>
                        <TableHead className="border border-black text-center">Price</TableHead>
                        <TableHead className="border border-black text-center">Is Available</TableHead>
                        <TableHead className="border border-black text-center">Is Trending</TableHead>
                        <TableHead className="border border-black text-center">Actions</TableHead>
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
                            <TableRow key={property._id}>
                                <TableCell className="border border-black flex items-center justify-center">
                                    {property.mainImage?.url ? (
                                        <Image
                                            height={100}
                                            width={100}
                                            src={property.mainImage.url}
                                            alt={property.propertyName}
                                            loading='lazy'
                                            className="h-16 w-16 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 bg-gray-200 rounded" />
                                    )}
                                </TableCell>
                                <TableCell className="font-medium border border-black text-center">{property.brokerName || property.ownerName}</TableCell>
                                <TableCell className="border border-black text-center">{property.propertyType}</TableCell>
                                <TableCell className="border border-black text-center">{property.locationType}</TableCell>
                                <TableCell className="border border-black text-center">₹{property.rentPrice?.toLocaleString()}</TableCell>
                                <TableCell className="border border-black text-center">
                                    <div className="flex justify-center">
                                        <Switch
                                            checked={property.isActive}
                                            onCheckedChange={() => toggleAvailable(property)}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="border border-black text-center">
                                    <div className="flex justify-center">
                                        <Switch
                                            checked={property.isTrending}
                                            onCheckedChange={() => toggleTrending(property)}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="text-center border border-black">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-blue-600 hover:bg-blue-50 px-10 py-2 border"
                                        onClick={() => handleEdit(property)}
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-red-600 hover:bg-red-50 px-10 py-2 border"
                                        onClick={() => handleDelete(property._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the property "{propertyToDelete?.propertyName}"? This action cannot be undone.
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
                            Delete Property
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default PropertyDetails;