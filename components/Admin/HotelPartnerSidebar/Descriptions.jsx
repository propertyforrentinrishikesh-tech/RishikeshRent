'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save, Loader2, FileText, Info, Star, MessageCircle, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

const Descriptions = ({ propertyData }) => {
    // Form State
    // We initialize with empty structures
    const [formData, setFormData] = useState({
        rooms: [], // array of { roomIndex, heading, description }
        propertyProfile: { heading: '', description: '' },
        highlights: { heading: '', description: '' },
        specialNote: { heading: '', description: '' },
        howToConnect: { heading: '', description: '' }
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        propertyProfile: true, // Open by default
        highlights: false,
        specialNote: false,
        howToConnect: false
    });
    const [expandedRooms, setExpandedRooms] = useState({});

    // Fetch saved descriptions
    useEffect(() => {
        const fetchDescriptions = async () => {
            if (!propertyData?._id) return;

            try {
                const propertyId = propertyData._id.$oid || propertyData._id;
                const response = await fetch(`/api/descriptions?propertyId=${propertyId}`);
                const result = await response.json();

                if (result.success && result.data) {
                    const savedData = result.data;

                    // Merge saved room data with current property rooms
                    // We need to ensure we have an entry for every room in propertyData
                    const mergedRooms = (propertyData.rooms || []).map((room, index) => {
                        const savedRoom = savedData.rooms?.find(r => r.roomIndex === index);
                        return {
                            roomIndex: index,
                            roomType: room.roomType,
                            heading: savedRoom?.heading || '',
                            description: savedRoom?.description || ''
                        };
                    });

                    setFormData({
                        rooms: mergedRooms,
                        propertyProfile: savedData.propertyProfile || { heading: '', description: '' },
                        highlights: savedData.highlights || { heading: '', description: '' },
                        specialNote: savedData.specialNote || { heading: '', description: '' },
                        howToConnect: savedData.howToConnect || { heading: '', description: '' }
                    });
                } else {
                    // No saved data, just initialize from propertyData
                    const initialRooms = (propertyData.rooms || []).map((room, index) => ({
                        roomIndex: index,
                        roomType: room.roomType,
                        heading: '',
                        description: ''
                    }));

                    setFormData(prev => ({
                        ...prev,
                        rooms: initialRooms
                    }));
                }
            } catch (error) {
                console.error('Error fetching descriptions:', error);
                toast.error('Failed to load descriptions');
            } finally {
                setLoading(false);
            }
        };

        fetchDescriptions();
    }, [propertyData]);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const toggleRoom = (index) => {
        setExpandedRooms(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleRoomChange = (index, field, value) => {
        setFormData(prev => {
            const updatedRooms = [...prev.rooms];
            updatedRooms[index] = {
                ...updatedRooms[index],
                [field]: value
            };
            return {
                ...prev,
                rooms: updatedRooms
            };
        });
    };

    const handleSectionChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        if (!propertyData?._id) {
            toast.error('Property ID missing');
            return;
        }

        setSaving(true);
        try {
            const propertyId = propertyData._id.$oid || propertyData._id;

            const response = await fetch('/api/descriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId,
                    ...formData
                })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Descriptions saved successfully!');
            } else {
                toast.error(result.message || 'Failed to save');
            }

        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save descriptions');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-12 flex justify-center text-gray-500"><Loader2 className="animate-spin mr-2" /> Loading content...</div>;
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 min-h-screen">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white">Descriptions & Content</h1>
                <p className="text-white font-semibold mt-2">Write or edit descriptions and content for your property</p>
            </div>
            <div className="flex items-center justify-end mt-4">

                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 flex items-center gap-2 shadow-sm"
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

            {/* Room Descriptions Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <FileText className="mr-2 text-cyan-500" /> Room Descriptions
                </h2>

                {formData.rooms.length === 0 ? (
                    <Card><CardContent className="p-6 text-center text-gray-500">No rooms found.</CardContent></Card>
                ) : (
                    formData.rooms.map((room, index) => (
                        <Card key={index} className="overflow-hidden border border-cyan-100 shadow-sm">
                            <div
                                className="bg-gradient-to-r from-cyan-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-cyan-100 transition-colors"
                                onClick={() => toggleRoom(index)}
                            >
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-800">{room.roomType}</h3>
                                    <span className="text-xs bg-cyan-200 text-cyan-800 px-2 py-0.5 rounded-full">
                                        Room {index + 1}
                                    </span>
                                </div>
                                {expandedRooms[index] ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                            </div>

                            {expandedRooms[index] && (
                                <CardContent className="p-6 space-y-4 bg-white animate-in slide-in-from-top-2">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Heading</Label>
                                        <Input
                                            value={room.heading}
                                            onChange={(e) => handleRoomChange(index, 'heading', e.target.value)}
                                            placeholder={`e.g. Luxurious ${room.roomType} with City View`}
                                            className="border-gray-300 focus:border-cyan-500"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700 mb-1 block">Description</Label>
                                        <Textarea
                                            value={room.description}
                                            onChange={(e) => handleRoomChange(index, 'description', e.target.value)}
                                            placeholder="Detailed description of the room amenities, view, and atmosphere..."
                                            className="min-h-[120px] border-gray-300 focus:border-cyan-500"
                                        />
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))
                )}
            </div>

            <div className="my-8 border-t border-gray-500"></div>

            {/* Global Property Descriptions */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <Info className="mr-2 text-indigo-500" /> General Property Info
                </h2>

                {/* Property Profile */}
                <div className="border border-indigo-100 rounded-lg overflow-hidden shadow-sm bg-white">
                    <div
                        className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('propertyProfile')}
                    >
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-gray-800">Property Profile</h3>
                        </div>
                        {expandedSections.propertyProfile ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                    </div>

                    {expandedSections.propertyProfile && (
                        <div className="p-6 space-y-4 bg-white border-t border-indigo-50">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-1 block">Heading</Label>
                                <Input
                                    value={formData.propertyProfile.heading}
                                    onChange={(e) => handleSectionChange('propertyProfile', 'heading', e.target.value)}
                                    placeholder="e.g. Welcome to Our Tranquil Riverside Resort"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-1 block">Description</Label>
                                <Textarea
                                    value={formData.propertyProfile.description}
                                    onChange={(e) => handleSectionChange('propertyProfile', 'description', e.target.value)}
                                    placeholder="General overview of the property, location, and vibe..."
                                    className="min-h-[120px]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Highlights */}
                <div className="border border-amber-100 rounded-lg overflow-hidden shadow-sm bg-white">
                    <div
                        className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('highlights')}
                    >
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            <h3 className="font-bold text-gray-800">Property Highlights</h3>
                        </div>
                        {expandedSections.highlights ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                    </div>

                    {expandedSections.highlights && (
                        <div className="p-6 space-y-4 bg-white border-t border-amber-50">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-1 block">Heading</Label>
                                <Input
                                    value={formData.highlights.heading}
                                    onChange={(e) => handleSectionChange('highlights', 'heading', e.target.value)}
                                    placeholder="e.g. Top Reasons to Stay With Us"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-1 block">Description</Label>
                                <Textarea
                                    value={formData.highlights.description}
                                    onChange={(e) => handleSectionChange('highlights', 'description', e.target.value)}
                                    placeholder="List the key features or unique selling points..."
                                    className="min-h-[120px]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Special Note */}
                <div className="border border-purple-100 rounded-lg overflow-hidden shadow-sm bg-white">
                    <div
                        className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('specialNote')}
                    >
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-purple-500" />
                            <h3 className="font-bold text-gray-800">Special Note</h3>
                        </div>
                        {expandedSections.specialNote ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                    </div>

                    {expandedSections.specialNote && (
                        <div className="p-6 space-y-4 bg-white border-t border-purple-50">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-1 block">Heading</Label>
                                <Input
                                    value={formData.specialNote.heading}
                                    onChange={(e) => handleSectionChange('specialNote', 'heading', e.target.value)}
                                    placeholder="e.g. Important Information for Guests"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-1 block">Description</Label>
                                <Textarea
                                    value={formData.specialNote.description}
                                    onChange={(e) => handleSectionChange('specialNote', 'description', e.target.value)}
                                    placeholder="Any special policies, construction notices, or important details..."
                                    className="min-h-[120px]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* How to Connect */}
                <div className="border border-green-100 rounded-lg overflow-hidden shadow-sm bg-white">
                    <div
                        className="bg-gradient-to-r from-green-50 to-white px-6 py-4 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection('howToConnect')}
                    >
                        <div className="flex items-center gap-2">
                            <Link className="w-5 h-5 text-green-500" />
                            <h3 className="font-bold text-gray-800">How to Connect</h3>
                        </div>
                        {expandedSections.howToConnect ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
                    </div>

                    {expandedSections.howToConnect && (
                        <div className="p-6 space-y-4 bg-white border-t border-green-50">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-1 block">Heading</Label>
                                <Input
                                    value={formData.howToConnect.heading}
                                    onChange={(e) => handleSectionChange('howToConnect', 'heading', e.target.value)}
                                    placeholder="e.g. Getting Here & Contact Info"
                                />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold text-gray-700 mb-1 block">Description</Label>
                                <Textarea
                                    value={formData.howToConnect.description}
                                    onChange={(e) => handleSectionChange('howToConnect', 'description', e.target.value)}
                                    placeholder="Directions, transport options, or contact methods..."
                                    className="min-h-[120px]"
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Save Button (Bottom) */}
            <div className="mt-8 flex justify-center pb-8">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 text-lg flex items-center gap-2 shadow-lg"
                >
                    {saving ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>
        </div>
    );
};

export default Descriptions;
