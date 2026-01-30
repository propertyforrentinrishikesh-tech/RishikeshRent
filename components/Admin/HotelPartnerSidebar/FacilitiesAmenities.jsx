'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Save, Plus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

const STANDARD_AMENITIES = {
    bathroomItems: {
        bathTub: 'Bath tub',
        bidet: 'Bidet',
        freeToiletries: 'Free toiletries',
        hairdryer: 'Hairdryer',
        bathrobe: 'Bathrobe',
        shower: 'Shower',
        slippers: 'Slippers',
        toilet: 'Toilet'
    },
    roomFacilities: { // General
        airConditioning: 'Air conditioning',
        clothesRack: 'Clothes rack',
        fan: 'Fan',
        heater: 'Heater',
        ironingFacilities: 'Ironing facilities',
        mosquitoNet: 'Mosquito net',
        privateEntrance: 'Private entrance',
        sofa: 'Sofa',
        soundproofing: 'Soundproofing',
        tile: 'Tile/Marble floor',
        towels: 'Towels',
        extraLongBeds: 'Extra long beds (> 2 metres)'
    },
    outdoorViews: {
        balcony: 'Balcony',
        terrace: 'Terrace',
        cityView: 'City view',
        gardenView: 'Garden view',
        mountainView: 'Mountain view',
        riverView: 'River view'
    },
    foodDrink: {
        electricKettle: 'Electric kettle',
        teaCoffeeMaker: 'Tea/Coffee maker',
        bottledWater: 'Bottled water',
        diningTable: 'Dining table',
        minibar: 'Minibar'
    }
};

const FacilitiesAmenities = ({ propertyData, onDataUpdate }) => {
    const [roomsData, setRoomsData] = useState([]);
    const [propertyFacilities, setPropertyFacilities] = useState([]);
    const [expandedRooms, setExpandedRooms] = useState({});
    const [saving, setSaving] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModalContext, setActiveModalContext] = useState(null); // { type: 'room' | 'property', roomIndex: number, category: string }
    const [customAmenityName, setCustomAmenityName] = useState('');

    useEffect(() => {
        if (propertyData) {
            // Initialize Room Data
            if (propertyData.rooms && Array.isArray(propertyData.rooms)) {
                // Ensure each room has the arrays initialized
                const initializedRooms = propertyData.rooms.map(room => ({
                    ...room,
                    bathroomItems: room.bathroomItems || [],
                    roomFacilities: room.roomFacilities || [],
                    outdoorViews: room.outdoorViews || [],
                    foodDrink: room.foodDrink || []
                }));
                setRoomsData(initializedRooms);

                // Expand the first room by default if exists
                if (initializedRooms.length > 0) {
                    setExpandedRooms({ 0: true });
                }
            }

            // Initialize Property Facilities
            setPropertyFacilities(propertyData.facilities || []);
        }
    }, [propertyData]);

    const toggleRoomAccordion = (index) => {
        setExpandedRooms(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleRoomAmenityToggle = (roomIndex, category, amenityLabel) => {
        setRoomsData(prev => {
            const updated = [...prev];
            const room = { ...updated[roomIndex] };
            const currentList = room[category] || [];

            if (currentList.includes(amenityLabel)) {
                room[category] = currentList.filter(item => item !== amenityLabel);
            } else {
                room[category] = [...currentList, amenityLabel];
            }

            updated[roomIndex] = room;
            return updated;
        });
    };

    const handlePropertyFacilityToggle = (facility) => {
        setPropertyFacilities(prev => {
            if (prev.includes(facility)) {
                return prev.filter(f => f !== facility);
            }
            return [...prev, facility];
        });
    };

    const openAddModal = (context) => {
        setActiveModalContext(context);
        setCustomAmenityName('');
        setIsModalOpen(true);
    };

    const handleAddCustomAmenity = () => {
        if (!customAmenityName.trim()) return;
        const name = customAmenityName.trim();

        if (activeModalContext.type === 'room') {
            const { roomIndex, category } = activeModalContext;
            // Add to room data checking if exists
            setRoomsData(prev => {
                const updated = [...prev];
                const room = updated[roomIndex];
                if (!room[category].includes(name)) {
                    room[category] = [...room[category], name];
                    toast.success(`Added "${name}"`);
                } else {
                    toast.error('Amenity already exists');
                }
                return updated;
            });
        }
        // Handle property facilities if we add a section for that later

        setIsModalOpen(false);
    };

    const handleRemoveCustomAmenity = (roomIndex, category, amenity) => {
        setRoomsData(prev => {
            const updated = [...prev];
            const room = { ...updated[roomIndex] };
            room[category] = room[category].filter(item => item !== amenity);
            updated[roomIndex] = room;
            return updated;
        });
    };

    const handleSave = async () => {
        if (!propertyData?._id) {
            toast.error('Property ID missing');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/updateAmenities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId: propertyData._id.$oid || propertyData._id,
                    facilities: propertyFacilities,
                    rooms: roomsData
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Amenities updated successfully!');
                if (onDataUpdate) onDataUpdate();
            } else {
                toast.error(data.message || 'Failed to update');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save amenities');
        } finally {
            setSaving(false);
        }
    };

    // Helper to render a section of checkboxes
    const renderAmenitySection = (title, categoryKey, roomIndex, roomDataKey) => {
        const standardOptions = Object.values(STANDARD_AMENITIES[categoryKey] || {});
        const currentSelected = roomsData[roomIndex]?.[roomDataKey] || [];

        // Find custom items that are in selected but not in standard options
        const customItems = currentSelected.filter(item => !standardOptions.includes(item));

        return (
            <div className="space-y-3 mb-6">
                <Label className="text-base font-semibold text-gray-700 flex justify-between items-center">
                    {title}
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Standard Options */}
                    {standardOptions.map((label) => (
                        <div key={label} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${roomIndex}-${categoryKey}-${label}`}
                                checked={currentSelected.includes(label)}
                                onCheckedChange={() => handleRoomAmenityToggle(roomIndex, roomDataKey, label)}
                            />
                            <label
                                htmlFor={`${roomIndex}-${categoryKey}-${label}`}
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                {label}
                            </label>
                        </div>
                    ))}

                    {/* Custom Items */}
                    {customItems.map((label) => (
                        <div key={label} className="flex items-center space-x-2 bg-blue-50 p-2 rounded border border-blue-200">
                            <Checkbox
                                id={`${roomIndex}-${categoryKey}-${label}`}
                                checked={true}
                                onCheckedChange={() => handleRemoveCustomAmenity(roomIndex, roomDataKey, label)}
                                className="data-[state=checked]:bg-blue-600"
                            />
                            <label
                                htmlFor={`${roomIndex}-${categoryKey}-${label}`}
                                className="text-sm font-medium leading-none cursor-pointer flex-1"
                            >
                                {label} (Custom)
                            </label>
                            <button
                                onClick={() => handleRemoveCustomAmenity(roomIndex, roomDataKey, label)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openAddModal({ type: 'room', roomIndex, category: roomDataKey })}
                    className="mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                    <Plus size={16} className="mr-1" /> Add Custom Amenity
                </Button>
            </div>
        );
    };

    if (!propertyData) {
        return <div className="p-8 text-center text-gray-500">Loading property data...</div>;
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Facilities & Amenities</h1>
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

            {/* Rooms Section */}
            <div className="space-y-4">
                {roomsData.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-gray-500">
                            No rooms found. Please add rooms in the property registration first.
                        </CardContent>
                    </Card>
                ) : (
                    roomsData.map((room, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <button
                                onClick={() => toggleRoomAccordion(index)}
                                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold flex items-center justify-between hover:from-cyan-600 hover:to-cyan-700 transition-all"
                                type="button"
                            >
                                <span className="text-lg">
                                    {room.roomType}
                                    <span className="text-cyan-100 text-sm ml-2 font-normal">
                                        ({room.numberOfRooms} units)
                                    </span>
                                </span>
                                {expandedRooms[index] ? <ChevronUp /> : <ChevronDown />}
                            </button>

                            {expandedRooms[index] && (
                                <div className="p-6 bg-white space-y-8 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {renderAmenitySection("Bathroom Items", 'bathroomItems', index, 'bathroomItems')}
                                    <hr className="border-gray-100" />
                                    {renderAmenitySection("General Amenities", 'roomFacilities', index, 'roomFacilities')}
                                    <hr className="border-gray-100" />
                                    {renderAmenitySection("Outdoor and Views", 'outdoorViews', index, 'outdoorViews')}
                                    <hr className="border-gray-100" />
                                    {renderAmenitySection("Food and Drink", 'foodDrink', index, 'foodDrink')}
                                </div>
                            )}
                        </div>
                    ))
                )}
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

            {/* Add Custom Amenity Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Custom Amenity</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="custom-amenity" className="mb-2 block">Amenity Name</Label>
                        <Input
                            id="custom-amenity"
                            value={customAmenityName}
                            onChange={(e) => setCustomAmenityName(e.target.value)}
                            placeholder="e.g. Smart Mirror, Jacuzzi"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAmenity()}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddCustomAmenity}>Add Amenity</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FacilitiesAmenities;
