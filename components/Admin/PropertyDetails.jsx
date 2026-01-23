"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Textarea } from "@/components/ui/textarea";
// Add these imports at the top
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2, Edit, X, Plus, Search, Eye } from 'lucide-react';
import Image from 'next/image';
import { Switch } from "@/components/ui/switch";

const PropertyDetails = ({ propertyTypes = [], locationType = [] }) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    propertyType: '',
    locationType: '',
    propertyFor: '',
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  const [brokerOrOwner, setBrokerOrOwner] = useState('broker');
  const [formData, setFormData] = useState({
    propertyType: "",
    mainImage: { url: "", key: "", loading: false },
    galleryImages: [],
    video: { type: "upload", file: null, youtubeLink: "" },
    locationType: "",
    propertyFor: "",
    contactAddress: "",
    brokerName: "",
    ownerName: "",
    contactNumbers: [""],
    rentPrice: "",
    maxRentPrice: "",
    propertyName: "",
    highlights: [],
    isAvailable: true,
    isTrending: false,
    isActive: true,
    propertyNameSlug: ""
  });

  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);
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
        // If there was a previous image, delete it from Cloudinary
        if (formData.mainImage?.key) {
          try {
            await deleteFromCloudinary(formData.mainImage.key);
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }

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
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload image');
      setFormData(prev => ({
        ...prev,
        mainImage: { ...prev.mainImage, loading: false }
      }));
    }
  };

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
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        // Remove the failed upload
        setFormData(prev => ({
          ...prev,
          galleryImages: prev.galleryImages.filter(img => img.file !== file)
        }));
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };
  const handleVideoChange = async (e, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    if (!e?.target?.files?.[0]) {
      console.error('No file selected or invalid event');
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    // 50MB limit
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Video file is too large. Maximum size is 50MB');
      return;
    }

    setVideoUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setRetryAttempt(retryCount);

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

      const response = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formDataUpload,
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
      setActiveTab('upload');
      toast.success('Video uploaded successfully!');

    } catch (error) {
      console.error('Video upload error:', error);

      if (error.name === 'AbortError') {
        toast.error('Video upload timed out. Please try again with a smaller file.');
      } else if ((error.message.includes('ECONNRESET') ||
        error.message.includes('network') ||
        error.message.includes('fetch')) &&
        retryCount < MAX_RETRIES) {

        toast.error(`Upload failed due to network error. Retrying in ${RETRY_DELAY / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);

        setTimeout(() => {
          const newEvent = {
            target: {
              files: [file]
            }
          };
          handleVideoChange(newEvent, retryCount + 1);
        }, RETRY_DELAY);
        return;
      } else {
        toast.error(error.message || 'Failed to upload video');
        setUploadError(error.message || 'Upload failed');
      }
    } finally {
      setVideoUploading(false);
    }
  };
  const removeMainImage = async () => {
    if (formData.mainImage?.key) {
      try {
        await deleteFromCloudinary(formData.mainImage.key);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }
    setFormData(prev => ({
      ...prev,
      mainImage: { url: '', loading: false }
    }));
  };

  const removeGalleryImage = async (index) => {
    const imageToRemove = formData.galleryImages[index];
    if (imageToRemove?.key) {
      try {
        await deleteFromCloudinary(imageToRemove.key);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
      }
    }
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };
  const handleSearch = async () => {
    if (!filters.propertyType && !filters.locationType && !filters.propertyFor) {
      toast.error('Please select at least one filter');
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
      if (filters.locationType) queryParams.append('locationType', filters.locationType);
      if (filters.propertyFor) queryParams.append('propertyFor', filters.propertyFor);
      const response = await fetch(`/api/searchPropertyDetails?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const data = await response.json();
      // console.log(data)
      setSearchResults(data.data || []);
      if (data.data.length === 0) {
        toast('No properties found matching your search criteria', {
          icon: 'ℹ️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.message || 'Failed to search properties');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (propertyId) => {
    // Find the property in the already loaded search results
    const property = searchResults.find(p => p._id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsDialogOpen(true);
    } else {
      toast.error('Property details not found');
    }
  };
  const handleEdit = (propertyId) => {
    const property = searchResults.find(p => p._id === propertyId);
    setEditingProperty(property);

    // Set broker or owner based on which field has data (do this FIRST)
    // Check for non-empty strings, not just truthy values
    if (property.ownerName && property.ownerName.trim() !== '') {
      setBrokerOrOwner('owner');
    } else {
      setBrokerOrOwner('broker');
    }

    // Transform video data from database format to form format
    let videoData = { type: "upload", file: null, youtubeLink: "" };

    if (property.video) {
      if (property.video.type === 'upload' && property.video.url) {
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
      propertyFor: property.propertyFor || "",
      contactAddress: property.contactAddress || "",
      brokerName: property.brokerName || "",
      ownerName: property.ownerName || "",
      contactNumbers: property.contactNumbers?.length ? [...property.contactNumbers] : [""],
      rentPrice: property.rentPrice || "",
      maxRentPrice: property.maxRentPrice || "",
      propertyName: property.propertyName || "",
      highlights: property.highlights?.length ? [...property.highlights] : [""],
      isAvailable: property.isAvailable !== undefined ? property.isAvailable : true,
      isTrending: property.isTrending !== undefined ? property.isTrending : false,
      isActive: property.isActive !== undefined ? property.isActive : true,
      propertyNameSlug: property.propertyNameSlug || ""
    });

    // Set the correct active tab based on video type
    if (videoData.type === 'youtube' && videoData.youtubeLink) {
      setActiveTab('youtube');
    } else if (videoData.type === 'upload' && videoData.file) {
      setActiveTab('upload');
    } else {
      setActiveTab('upload'); // Default to upload tab
    }

    // Scroll to form (if element exists)
    setTimeout(() => {
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDelete = (propertyId) => {
    const property = searchResults.find(p => p._id === propertyId);
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

      // Remove the property from search results
      setSearchResults(searchResults.filter(property => property._id !== propertyToDelete._id));
      toast.success('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error(error.message || 'Failed to delete property');
    } finally {
      setIsDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const extractYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingProperty) return; // Only proceed if we're editing

    try {
      const response = await fetch(`/api/createPropertyDetails?id=${editingProperty._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update property');
      }

      toast.success('Property updated successfully!');

      // Update the property in the list
      setSearchResults(prev =>
        prev.map(p => p._id === editingProperty._id ? data.data : p)
      );

      // Reset form and editing state
      setFormData({
        propertyType: "",
        mainImage: { url: "", key: "", loading: false },
        galleryImages: [],
        video: { type: "upload", file: null, youtubeLink: "" },
        locationType: "",
        propertyFor: "",
        contactAddress: "",
        brokerName: "",
        ownerName: "",
        contactNumbers: [""],
        rentPrice: "",
        maxRentPrice: "",
        propertyName: "",
        highlights: [""],
        isAvailable: true,
        isTrending: false,
        isActive: true,
        propertyNameSlug: ""
      });

      setEditingProperty(null);
      setBrokerOrOwner('broker'); // Reset to broker
      setActiveTab('upload'); // Reset to upload tab

    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(error.message || 'Failed to update property');
    }
  };
  // Handle contact number changes
  const handleContactNumberChange = (index, value) => {
    const newContactNumbers = [...formData.contactNumbers];
    newContactNumbers[index] = value;
    setFormData(prev => ({ ...prev, contactNumbers: newContactNumbers }));
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
        // toast.success('Property updated successfully');
        // fetchPropertyDetails(); // Refresh the list
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
    const newStatus = !property.isActive;
    // Optimistically update the UI
    const updatedProperties = searchResults.map(p =>
      p._id === property._id ? { ...p, isActive: newStatus } : p
    );
    setSearchResults(updatedProperties);

    try {
      await updatePropertyStatus(property._id, {
        isActive: newStatus
      });
      toast.success(`Property marked as ${newStatus ? 'active' : 'inactive'}`);
    } catch (error) {
      // Revert on error
      const revertedProperties = searchResults.map(p =>
        p._id === property._id ? { ...p, isActive: property.isActive } : p
      );
      setSearchResults(revertedProperties);
      console.error('Error toggling availability:', error);
      toast.error('Failed to update property status');
    }
  };
  // Toggle isTrending status
  const toggleTrending = async (property) => {
    const newStatus = !property.isTrending;
    // Optimistically update the UI
    const updatedProperties = searchResults.map(p =>
      p._id === property._id ? { ...p, isTrending: newStatus } : p
    );
    setSearchResults(updatedProperties);

    try {
      await updatePropertyStatus(property._id, {
        isTrending: newStatus
      });
      toast.success(`Property ${newStatus ? 'added to' : 'removed from'} trending`);
    } catch (error) {
      // Revert on error
      const revertedProperties = searchResults.map(p =>
        p._id === property._id ? { ...p, isTrending: property.isTrending } : p
      );
      setSearchResults(revertedProperties);
      console.error('Error toggling trending status:', error);
      toast.error('Failed to update trending status');
    }
  };
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-black">
        <h1 className="text-2xl font-bold mb-6">Search Properties</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Property Type</label>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}
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

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Select
              value={filters.locationType}
              onValueChange={(value) => setFilters(prev => ({ ...prev, locationType: value }))}
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
          <div>
            <label className="block text-sm font-medium mb-1">Property Be Like</label>
            <Select
              value={filters.propertyFor}
              onValueChange={(value) => setFilters(prev => ({ ...prev, propertyFor: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="w-full"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="border rounded-md">
            <Table className="border border-black">
              <TableHeader>
                <TableRow>
                  <TableHead className="border border-black text-black">No</TableHead>
                  <TableHead className="border border-black text-black">Property Name</TableHead>
                  <TableHead className="border border-black text-black">Contact Number</TableHead>
                  <TableHead className="border border-black text-black">is Avaliable</TableHead>
                  <TableHead className="border border-black text-black">is Trending</TableHead>
                  <TableHead className="border border-black text-black">View</TableHead>
                  <TableHead className="border border-black text-black text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {searchResults.length > 0 && (
                <TableBody>
                  {searchResults.map((property, index) => (
                    <TableRow key={property._id}>
                      <TableCell className="border border-black">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium border border-black">
                        {property.propertyName}
                      </TableCell>
                      <TableCell className="border border-black">
                        {property.contactNumbers?.join(', ') || 'N/A'}
                      </TableCell>
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
                      <TableCell className="border border-black mx-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleViewDetails(property._id)}
                          className="text-blue-600 hover:bg-blue-50"
                          title="View Details "
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="border border-black">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(property._id)}
                          title="Edit Property"
                          className="text-green-600 hover:bg-red-50 mx-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(property._id)}
                          title="Delete Property"
                          className="text-red-600 hover:bg-red-50 "
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Property Details</DialogTitle>
            </DialogHeader>
            {selectedProperty && (
              <div className="space-y-6">
                {/* Basic Information Box */}
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><span className="font-medium">Property Name:</span> {selectedProperty.propertyName}</p>
                      <p><span className="font-medium">Property Type:</span> {selectedProperty.propertyType}</p>
                      <p><span className="font-medium">Property Be Like:</span> {selectedProperty.propertyFor}</p>
                      <p><span className="font-medium">Location:</span> {selectedProperty.locationType}</p>
                      <p><span className="font-medium">Minimum Rent Price:</span> ₹{selectedProperty.rentPrice?.toLocaleString()}</p>
                      <p><span className="font-medium">Maximum Rent Price:</span> ₹{selectedProperty.maxRentPrice?.toLocaleString()}</p>
                      <p><span className="font-medium">{selectedProperty.brokerName ? "Broker" : "Owner"} Name:</span> {selectedProperty.brokerName || selectedProperty.ownerName}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium underline">Contact Information</h4>
                      <p><span className="font-medium">Address:</span> {selectedProperty.contactAddress || 'N/A'}</p>
                      <p><span className="font-medium">Contact Numbers:</span> {selectedProperty.contactNumbers?.join(', ') || 'N/A'}</p>
                      <p><span className="font-medium">Property Avaliable:</span> {selectedProperty.isActive ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Trending:</span> {selectedProperty.isTrending ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Main Image Box */}
                {selectedProperty.mainImage?.url && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Main Image</h3>
                    <div className="flex justify-center items-center">
                      <Image
                        height={200}
                        width={200}
                        src={selectedProperty.mainImage.url}
                        alt="Main property"
                        loading='lazy'
                        className="max-w-full h-auto max-h-44 rounded-lg object-contain border"
                      />
                    </div>
                  </div>
                )}
                {/* Gallery Images Box */}
                {selectedProperty.galleryImages?.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Gallery Images</h3>
                    <div className=" flex flex-wrap items-center gap-5 max-h-64 overflow-y-auto">
                      {selectedProperty.galleryImages.map((img, idx) => (
                        <div key={idx} className="w-44 h-32 overflow-hidden">
                          <Image
                            height={200}
                            width={200}
                            src={img.url}
                            alt={`Gallery ${idx + 1}`}
                            loading='lazy'
                            className="w-full h-full object-cover rounded-lg border"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {/* Video Box */}
                {selectedProperty.video?.type === 'upload' && selectedProperty.video?.url && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Property Video</h3>
                    <div className="aspect-video w-full">
                      <video
                        src={selectedProperty.video.url}
                        controls
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {selectedProperty.video?.type === 'youtube' && selectedProperty.video?.youtubeLink && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">YouTube Video</h3>
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(selectedProperty.video.youtubeLink)}`}
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Highlights Box */}
                {selectedProperty.highlights?.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Highlights</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedProperty.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-gray-700 text-wrap">{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

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
      {editingProperty && (
        <div className="mb-8 p-6 border rounded-lg bg-white shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Property</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingProperty(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Copy the form fields from CreatePropertyDetails.jsx here */}
            {/* Property For */}
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

            {/* Property Type */}
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

            {/* Main Image Upload */}
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

            {/* Gallery Images */}
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
              />
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 hover:text-white w-48"
                onClick={() => galleryImagesRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                <span>Select Gallery Images</span>
              </Button>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.galleryImages.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                    <Image
                      src={img.url}
                      alt={`Gallery ${index + 1}`}
                      fill
                      loading='lazy'
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
                      className="absolute top-0.5 right-0.5 bg-white bg-opacity-80 rounded-full p-0.5 hover:bg-red-100"
                      title="Remove image"
                      disabled={img.loading}
                    >
                      <X className="w-3.5 h-3.5 text-red-600" />
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
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      disabled={videoUploading}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('video-upload').click()}
                      disabled={videoUploading}
                    >
                      <Upload className="w-4 h-4" />
                      <span>{videoUploading ? 'Uploading...' : 'Select Video'}</span>
                    </Button>
                    {videoUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    {formData.video?.file?.url && (
                      <div className="mt-2">
                        <video
                          src={formData.video.file.url}
                          controls
                          className="max-w-full h-auto max-h-64 rounded"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 mt-2"
                          onClick={() => {
                            if (formData.video?.file?.key) {
                              deleteFromCloudinary(formData.video.file.key, 'video').catch(console.error);
                            }
                            setFormData(prev => ({
                              ...prev,
                              video: { type: 'upload', file: null, youtubeLink: '' }
                            }));
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Video
                        </Button>
                      </div>
                    )}
                    {uploadError && (
                      <p className="text-sm text-red-600">{uploadError}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="youtube" className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter YouTube video URL"
                      value={formData.video?.youtubeLink || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        video: {
                          ...prev.video,
                          type: 'youtube',
                          youtubeLink: e.target.value,
                          file: null
                        }
                      }))}
                    />
                    {formData.video?.youtubeLink && (
                      <div className="mt-2">
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYoutubeId(formData.video.youtubeLink)}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-64 rounded"
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>
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
              <h3 className="text-xl font-medium underline">Broker / Owner Information</h3>

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
                        value={formData.brokerName || ''}
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
                        value={formData.ownerName || ''}
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


            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProperty(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={formData.mainImage.loading}>
                Update Property
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;