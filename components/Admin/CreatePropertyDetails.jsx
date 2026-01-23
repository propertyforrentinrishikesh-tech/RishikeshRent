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
const CreatePropertyDetails = ({ propertyTypes = [], locationType = [] }) => {
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
    const [activeTab, setActiveTab] = useState('youtube');
    const [editingProperty, setEditingProperty] = useState(null);
    const [brokerOrOwner, setBrokerOrOwner] = useState('broker'); // Track broker or owner selection
    const [formData, setFormData] = useState({
        propertyType: "",
        mainImage: { url: "", key: "", loading: false },
        galleryImages: [],
        video: { type: "upload", file: null, youtubeLink: "" },
        locationType: "",
        contactAddress: "",
        brokerName: "",
        ownerName: "",
        contactNumbers: [""],
        rentPrice: "",
        maxRentPrice: "",
        propertyName: "",
        highlights: [],
        propertyFor: "",
        isAvailable: true,
        isTrending: false,
        isActive: true,
        propertyNameSlug: ""
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
                        locationType: locationType[0]?.locationType || ""
                    };
                }
                return prev;
            });
        }
    }, [propertyTypes, locationType]);

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
                contactNumbers: formData.contactNumbers
                    .map(num => num ? num.trim() : '')
                    .filter(num => num !== ''),
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
            locationType: "",
            contactAddress: "",
            brokerName: "",
            ownerName: "",
            contactNumbers: [""],
            rentPrice: "",
            maxRentPrice: "",
            propertyName: "",
            propertyFor: "",
            isTrending: false,
            highlights: []
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
            video: videoData,
            locationType: property.locationType || "",
            contactAddress: property.contactAddress || "",
            brokerName: property.brokerName || "",
            ownerName: property.ownerName || "",
            contactNumbers: property.contactNumbers?.length ? [...property.contactNumbers] : [""],
            rentPrice: property.rentPrice || "",
            maxRentPrice: property.maxRentPrice || "",
            propertyName: property.propertyName || "",
            highlights: property.highlights?.length ? [...property.highlights] : [""],
            propertyFor: property.propertyFor || "",
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
                    <Label>Property Type</Label>
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
                <div className="w-full">
                    <Label>Property Name</Label>
                    <Input
                        className="bg-white border border-black rounded-md p-2"
                        name="propertyName"
                        value={formData.propertyName}
                        onChange={handleChange}
                        placeholder="Enter Property Name"
                    />
                </div>

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

                {/* Update the gallery images section */}
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
                {/* Video Section */}
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

                {/* Address */}
                <div className="space-y-2">
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

                <hr className="my-6" />

                {/* Broker Info */}
                <div className="space-y-4">
                    <h3 className="text-xl font-medium underline"> Broker / Owner Information</h3>
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
                        <div className="space-y-2 w-full">

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
                    </div>
                    <div className="space-y-2">
                        <Label>Contact Numbers</Label>
                        {formData.contactNumbers.map((number, index) => (
                            <div key={index} className="flex gap-2">
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
                            placeholder="Enter Rent Price"
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

export default CreatePropertyDetails;