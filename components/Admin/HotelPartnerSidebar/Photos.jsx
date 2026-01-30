'use client';
import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ChevronDown, ChevronUp, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import toast from 'react-hot-toast';
import Image from 'next/image';

const Photos = ({ propertyData, onDataUpdate }) => {
    const [roomImages, setRoomImages] = useState([]);
    const [propertyImages, setPropertyImages] = useState({
        primary: [],
        exterior: [],
        interior: [],
        reception: [],
        restaurant: [],
        parking: [],
        other: []
    });
    const [expandedRooms, setExpandedRooms] = useState({});
    const [expandedPropertySections, setExpandedPropertySections] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploadingStates, setUploadingStates] = useState({});

    useEffect(() => {
        if (propertyData) {
            // Initialize room images from propertyData
            setRoomImages(propertyData.roomImages || []);

            // Initialize property images from propertyData
            setPropertyImages(propertyData.propertyImages || {
                primary: [],
                exterior: [],
                interior: [],
                reception: [],
                restaurant: [],
                parking: [],
                other: []
            });
        }
    }, [propertyData]);

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/cloudinary', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (res.ok && data.url) {
            return { url: data.url, key: data.key || '' };
        } else {
            throw new Error(data.error || 'Upload failed');
        }
    };

    const handleRoomImageAdd = async (roomIndex, imageType, files) => {
        if (!files || files.length === 0) return;

        const uploadKey = `room-${roomIndex}-${imageType}`;
        setUploadingStates(prev => ({ ...prev, [uploadKey]: true }));

        try {
            const uploadedImages = [];

            for (const file of Array.from(files)) {
                try {
                    const imageData = await uploadImageToCloudinary(file);
                    uploadedImages.push(imageData);
                } catch (error) {
                    console.error('Upload error:', error);
                    toast.error(`Failed to upload ${file.name}`);
                }
            }

            if (uploadedImages.length > 0) {
                setRoomImages(prev => {
                    const updated = [...prev];
                    const roomEntry = updated.find(r => r.roomIndex === roomIndex);

                    if (roomEntry) {
                        if (!roomEntry[imageType]) {
                            roomEntry[imageType] = [];
                        }
                        roomEntry[imageType] = [...roomEntry[imageType], ...uploadedImages];
                    } else {
                        updated.push({
                            roomIndex,
                            primaryImage: imageType === 'primaryImage' ? uploadedImages : [],
                            roomImage: imageType === 'roomImage' ? uploadedImages : [],
                            bathroomImage: imageType === 'bathroomImage' ? uploadedImages : []
                        });
                    }

                    return updated;
                });

                toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);
            }
        } finally {
            setUploadingStates(prev => ({ ...prev, [uploadKey]: false }));
        }
    };

    const handlePropertyImageAdd = async (category, files) => {
        if (!files || files.length === 0) return;

        const uploadKey = `property-${category}`;
        setUploadingStates(prev => ({ ...prev, [uploadKey]: true }));

        try {
            const uploadedImages = [];

            for (const file of Array.from(files)) {
                try {
                    const imageData = await uploadImageToCloudinary(file);
                    uploadedImages.push(imageData);
                } catch (error) {
                    console.error('Upload error:', error);
                    toast.error(`Failed to upload ${file.name}`);
                }
            }

            if (uploadedImages.length > 0) {
                setPropertyImages(prev => ({
                    ...prev,
                    [category]: [...(prev[category] || []), ...uploadedImages]
                }));

                toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);
            }
        } finally {
            setUploadingStates(prev => ({ ...prev, [uploadKey]: false }));
        }
    };

    const handleDeleteRoomImage = async (roomIndex, imageType, imageKey) => {
        try {
            // Delete from Cloudinary
            const res = await fetch('/api/cloudinary', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicId: imageKey })
            });

            if (res.ok) {
                // Remove from state
                setRoomImages(prev => {
                    const updated = [...prev];
                    const roomEntry = updated.find(r => r.roomIndex === roomIndex);

                    if (roomEntry && roomEntry[imageType]) {
                        roomEntry[imageType] = roomEntry[imageType].filter(img => img.key !== imageKey);
                    }

                    return updated;
                });

                toast.success('Image deleted successfully');
            } else {
                toast.error('Failed to delete image from cloud');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete image');
        }
    };

    const handleDeletePropertyImage = async (category, imageKey) => {
        try {
            // Delete from Cloudinary
            const res = await fetch('/api/cloudinary', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicId: imageKey })
            });

            if (res.ok) {
                // Remove from state
                setPropertyImages(prev => ({
                    ...prev,
                    [category]: prev[category].filter(img => img.key !== imageKey)
                }));

                toast.success('Image deleted successfully');
            } else {
                toast.error('Failed to delete image from cloud');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete image');
        }
    };

    const handleSave = async () => {
        if (!propertyData?._id) {
            toast.error('Property ID not found');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/updatePhoto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId: propertyData._id.$oid || propertyData._id,
                    roomImages,
                    propertyImages
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Images updated successfully');
                // Refresh property data from database
                if (onDataUpdate) {
                    await onDataUpdate();
                }
            } else {
                toast.error(data.message || 'Failed to update images');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save images');
        } finally {
            setSaving(false);
        }
    };

    const toggleRoomAccordion = (roomIndex) => {
        setExpandedRooms(prev => ({
            ...prev,
            [roomIndex]: !prev[roomIndex]
        }));
    };

    const togglePropertyAccordion = (section) => {
        setExpandedPropertySections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const ImagePreviewBox = ({ image, onDelete }) => (
        <div className="relative group w-32 h-32 border-2 border-yellow-400 rounded-lg overflow-hidden bg-gray-50">
            <Image
                width={100}
                height={100}
                src={image.url}
                alt="Preview"
                loading='lazy'
                className="w-full h-full object-cover"
            />
            <button
                onClick={() => onDelete(image.key)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                type="button"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );

    const UploadButton = ({ onChange, multiple = true, uploading = false }) => (
        <label className={`w-32 h-32 border-2 border-dashed border-cyan-400 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? (
                <>
                    <Loader2 className="text-cyan-500 mb-2 animate-spin" size={24} />
                    <span className="text-xs text-cyan-600 font-medium">Uploading...</span>
                </>
            ) : (
                <>
                    <Upload className="text-cyan-500 mb-2" size={24} />
                    <span className="text-xs text-cyan-600 font-medium">Upload</span>
                </>
            )}
            <input
                type="file"
                multiple={multiple}
                accept="image/*"
                onChange={onChange}
                className="hidden"
                disabled={uploading || saving}
            />
        </label>
    );

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Photo Management</h1>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                {/* Room Images Section */}
                <Card className="mb-6 p-6 bg-white shadow-lg">
                    <h2 className="text-2xl font-bold text-cyan-600 mb-4 flex items-center">
                        <ImageIcon className="mr-2" />
                        Room Photos
                    </h2>

                    {roomImages.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No room images found</p>
                    ) : (
                        <div className="space-y-4">
                            {roomImages.map((room, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Accordion Header */}
                                    <button
                                        onClick={() => toggleRoomAccordion(room.roomIndex)}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold flex items-center justify-between hover:from-cyan-600 hover:to-cyan-700 transition-all"
                                        type="button"
                                    >
                                        <span>Room {room.roomIndex + 1} - {propertyData?.rooms?.[room.roomIndex]?.roomType || 'Room'}</span>
                                        {expandedRooms[room.roomIndex] ? <ChevronUp /> : <ChevronDown />}
                                    </button>

                                    {/* Accordion Content */}
                                    {expandedRooms[room.roomIndex] && (
                                        <div className="p-4 bg-gray-50 space-y-6">
                                            {/* Primary Images */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Primary Images</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {room.primaryImage?.map((img, idx) => (
                                                        <ImagePreviewBox
                                                            key={img.key || idx}
                                                            image={img}
                                                            onDelete={(key) => handleDeleteRoomImage(room.roomIndex, 'primaryImage', key)}
                                                        />
                                                    ))}
                                                    <UploadButton
                                                        onChange={(e) => handleRoomImageAdd(room.roomIndex, 'primaryImage', e.target.files)}
                                                        uploading={uploadingStates[`room-${room.roomIndex}-primaryImage`]}
                                                    />
                                                </div>
                                            </div>

                                            {/* Room Images */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Room Images</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {room.roomImage?.map((img, idx) => (
                                                        <ImagePreviewBox
                                                            key={img.key || idx}
                                                            image={img}
                                                            onDelete={(key) => handleDeleteRoomImage(room.roomIndex, 'roomImage', key)}
                                                        />
                                                    ))}
                                                    <UploadButton
                                                        onChange={(e) => handleRoomImageAdd(room.roomIndex, 'roomImage', e.target.files)}
                                                        uploading={uploadingStates[`room-${room.roomIndex}-roomImage`]}
                                                    />
                                                </div>
                                            </div>

                                            {/* Bathroom Images */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Bathroom Images</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {room.bathroomImage?.map((img, idx) => (
                                                        <ImagePreviewBox
                                                            key={img.key || idx}
                                                            image={img}
                                                            onDelete={(key) => handleDeleteRoomImage(room.roomIndex, 'bathroomImage', key)}
                                                        />
                                                    ))}
                                                    <UploadButton
                                                        onChange={(e) => handleRoomImageAdd(room.roomIndex, 'bathroomImage', e.target.files)}
                                                        uploading={uploadingStates[`room-${room.roomIndex}-bathroomImage`]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Property Images Section */}
                <Card className="p-6 bg-white shadow-lg">
                    <h2 className="text-2xl font-bold text-cyan-600 mb-4 flex items-center">
                        <ImageIcon className="mr-2" />
                        Property Photos
                    </h2>

                    <div className="space-y-4">
                        {Object.entries(propertyImages).map(([category, images]) => (
                            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Accordion Header */}
                                <button
                                    onClick={() => togglePropertyAccordion(category)}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center justify-between hover:from-orange-600 hover:to-orange-700 transition-all capitalize"
                                    type="button"
                                >
                                    <span>{category.replace(/([A-Z])/g, ' $1').trim()} Images ({images.length})</span>
                                    {expandedPropertySections[category] ? <ChevronUp /> : <ChevronDown />}
                                </button>

                                {/* Accordion Content */}
                                {expandedPropertySections[category] && (
                                    <div className="p-4 bg-gray-50">
                                        <div className="flex flex-wrap gap-3">
                                            {images.map((img, idx) => (
                                                <ImagePreviewBox
                                                    key={img.key || idx}
                                                    image={img}
                                                    onDelete={(key) => handleDeletePropertyImage(category, key)}
                                                />
                                            ))}
                                            <UploadButton
                                                onChange={(e) => handlePropertyImageAdd(category, e.target.files)}
                                                uploading={uploadingStates[`property-${category}`]}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Save Button at Bottom */}
                <div className="mt-6 flex justify-center">
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 text-lg flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save size={24} />
                                Save All Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Photos;
