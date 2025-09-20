"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import toast from "react-hot-toast";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRef } from "react";
import { UploadIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const CreatePropertyType = ({ propertyTypes = [], locationType = [], setPropertyTypes, setLocationType }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteModalLocation, setShowDeleteModalLocation] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [locationToDelete, setLocationToDelete] = useState(null);
    const [locations, setLocations] = useState([]);
    // Use props instead of local state
    const [properties, setProperties] = useState(propertyTypes);
    const [editProperty, setEditProperty] = useState(null);
    const [editLocation, setEditLocation] = useState(null);
    const [formData, setFormData] = useState({
        propertyType: "",  
        order: 1,
    });
    const [formDataLocation, setFormDataLocation] = useState({
        locationType: "", 
        order: 1,
    });

    // Set initial form data order based on props
    useEffect(() => {
        if (propertyTypes?.length > 0) {
            const highestOrder = Math.max(...propertyTypes.map((b) => b.order || 0));
            setFormData(prev => ({ ...prev, order: highestOrder + 1 }));
            setProperties(propertyTypes);
        }
        if (locationType?.length > 0) {
            const highestOrder = Math.max(...locationType.map((b) => b.order || 0));
            setFormDataLocation(prev => ({ ...prev, order: highestOrder + 1 }));
            setLocations(locationType);
        }
    }, [propertyTypes, locationType]);

    const handleInputChangeForProperty = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || ''  // Ensure we never set undefined
        }));
    };

    const handleInputChangeForLocation = (e) => {
        const { name, value } = e.target;
        setFormDataLocation(prev => ({
            ...prev,
            [name]: value || ''  // Ensure we never set undefined
        }));
    };

    const handleSubmitForProperty = async (e) => {
        if (!formData.propertyType) {
            toast.error("Property Type is required");
            return;
        }
        e.preventDefault();
        // Check for duplicate property type (case-insensitive)
        const isDuplicate = properties.some(property =>
            property.propertyType.toLowerCase() === formData.propertyType.trim().toLowerCase() &&
            (!editProperty || property._id !== editProperty) // Skip current item when editing
        );

        if (isDuplicate) {
            toast.error("This property type already exists");
            return;
        }

        try {
            const method = editProperty ? "PATCH" : "POST";
            // Compose payload with coupon details
            const payload = {
                ...formData,
                id: editProperty,
            };
            const response = await fetch("/api/createProperty", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Property Type ${editProperty ? "updated" : "added"} successfully`);
                setEditProperty(null);

                // Refresh banner list
                const updatedBanners = await fetch("/api/createProperty").then((res) => res.json());
                setProperties(updatedBanners);

                // Reset form
                setFormData({
                    propertyType: "",
                    order: updatedBanners.length + 1,
                });

            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };
    const handleSubmitforLocation = async (e) => {
        if (!formDataLocation.locationType) {
            toast.error("Location Type is required");
            return;
        }
        e.preventDefault();
        // Check for duplicate location (case-insensitive)
        const isDuplicate = locations.some(location =>
            location.locationType.toLowerCase() === formDataLocation.locationType.trim().toLowerCase() &&
            (!editLocation || location._id !== editLocation) // Skip current item when editing
        );

        if (isDuplicate) {
            toast.error("This location already exists");
            return;
        }
        try {
            const method = editLocation ? "PATCH" : "POST";
            // Compose payload with coupon details
            const payload = {
                ...formDataLocation,
                id: editLocation,
            };
            const response = await fetch("/api/createLocation", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Location ${editLocation ? "updated" : "added"} successfully`);
                setEditLocation(null);

                // Refresh banner list
                const updatedBanners = await fetch("/api/createLocation").then((res) => res.json());
                setLocations(updatedBanners);

                // Reset form
                setFormDataLocation({
                    locationType: "",
                    order: updatedBanners.length + 1,
                });

            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleEditForProperty = (banner) => {
        setEditProperty(banner._id);
        // console.log(banner)
        setFormData({
            propertyType: banner.propertyType,
            order: banner.order,
        });
    };
    const handleEditForLocation = (banner) => {
        setEditLocation(banner._id);
        // console.log(banner)
        setFormDataLocation({
            locationType: banner.locationType,
            order: banner.order,
        });
    };

    const handleDeleteForProperty = async (id) => {
        try {
            const response = await fetch("/api/createProperty", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Property Type deleted successfully");

                setProperties((prev) => prev.filter((banner) => banner._id !== id));

                // Update order numbers
                const updatedBanners = await fetch("/api/createProperty").then((res) => res.json());
                setProperties(updatedBanners);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };
    const handleDeleteForLocation = async (id) => {
        try {
            const response = await fetch("/api/createLocation", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Location deleted successfully");

                setLocations((prev) => prev.filter((banner) => banner._id !== id));

                // Update order numbers
                const updatedBanners = await fetch("/api/createLocation").then((res) => res.json());
                setLocations(updatedBanners);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };
    const confirmDeleteForProperty = async () => {
        if (propertyToDelete) {
            await handleDeleteForProperty(propertyToDelete);
            setPropertyToDelete(null);
            setShowDeleteModal(false);
        }
    };
    const confirmDeleteForLocation = async () => {
        if (locationToDelete) {
            await handleDeleteForLocation(locationToDelete);
            setLocationToDelete(null);
            setShowDeleteModalLocation(false);
        }
    };

    const cancelDeleteForProperty = () => {
        setShowDeleteModal(false);
        setPropertyToDelete(null);
    };
    const cancelDeleteForLocation = () => {
        setShowDeleteModalLocation(false);
        setLocationToDelete(null);
    };

    return (
        <div className="max-w-5xl mx-auto w-full">
            <h2 className="text-2xl font-bold mb-6">{editProperty ? "Edit Property Type" : "Add New Property Type"}</h2>
            <form onSubmit={handleSubmitForProperty} className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-black">
                <div>
                    <Label>Property Type</Label>
                    <Input name="propertyType" className="border border-black" placeholder="Enter property type" type="text" value={formData.propertyType} onChange={handleInputChangeForProperty} />
                </div>
                <div className="flex gap-3">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                        {editProperty ? "Update Property Type" : "Add Property Type"}
                    </Button>
                    {editProperty && (
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-gray-300 hover:bg-gray-200 text-black"
                            onClick={() => {
                                setEditProperty(null);
                                setFormData({
                                    propertyType: "",
                                    order: properties.length > 0 ? Math.max(...properties.map(b => b.order)) + 1 : 1,
                                });
                            }}
                        >
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </form>


            <h2 className="text-xl font-bold mt-10 mb-4">Existing Property Type</h2>
            <Table className="border border-black">
                <TableHeader>
                    <TableRow>
                        <TableHead className="border border-black text-center">Order</TableHead>
                        <TableHead className="border border-black text-center">Property Type</TableHead>
                        <TableHead className="border border-black text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <TableRow key={property._id} className="border border-black">
                                <TableCell className="border border-black text-center">{property.order}</TableCell>
                                <TableCell className="border border-black text-center">
                                    {property.propertyType}
                                </TableCell>
                                <TableCell className="border border-black text-center">
                                    <Button variant="outline" size="icon" onClick={() => handleEditForProperty(property)} className="mr-2 "><PencilIcon /></Button>
                                    <Button size="icon" onClick={() => { setShowDeleteModal(true); setPropertyToDelete(property._id); }} variant="destructive"><Trash2Icon /></Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="5" className="text-center py-4">No property types found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Property Type</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this property type?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={cancelDeleteForProperty}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDeleteForProperty}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <hr className="my-6 border border-gray-400" />

            {/* Location Type */}
            <h2 className="text-2xl font-bold my-6">{editLocation ? "Edit Location Type" : "Add New Location Type"}</h2>
            <form onSubmit={handleSubmitforLocation} className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-black">
                <div>
                    <Label>Location Type</Label>
                    <Input name="locationType" className="border border-black" placeholder="Enter location type" type="text" value={formDataLocation.locationType || ''} onChange={handleInputChangeForLocation} />
                </div>
                <div className="flex gap-3">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                        {editLocation ? "Update Location Type" : "Add Location Type"}
                    </Button>
                    {editLocation && (
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-gray-300 hover:bg-gray-200 text-black"
                            onClick={() => {
                                setEditLocation(null);
                                setFormDataLocation({
                                    locationType: "",
                                    order: locations.length > 0 ? Math.max(...locations.map(b => b.order)) + 1 : 1,
                                });
                            }}
                        >
                            Cancel Edit
                        </Button>
                    )}
                </div>
            </form>

            <h2 className="text-xl font-bold mt-10 mb-4">Existing Location Type</h2>
            <Table className="border border-black">
                <TableHeader>
                    <TableRow className="border border-black">
                        <TableHead className="border border-black text-center">Order</TableHead>
                        <TableHead className="border border-black text-center">Location Type</TableHead>
                        <TableHead className="border border-black text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {locations.length > 0 ? (
                        locations.map((location) => (
                            <TableRow key={location._id} className="border border-black">
                                <TableCell className="border border-black text-center">{location.order}</TableCell>
                                <TableCell className="border border-black text-center">
                                    {location.locationType}
                                </TableCell>
                                <TableCell className="border border-black text-center">
                                    <Button variant="outline" size="icon" onClick={() => handleEditForLocation(location)} className="mr-2 "><PencilIcon /></Button>
                                    <Button size="icon" onClick={() => { setShowDeleteModalLocation(true); setLocationToDelete(location._id); }} variant="destructive"><Trash2Icon /></Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border border-black">
                            <TableCell colSpan="5" className="text-center py-4">No location types found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteModalLocation} onOpenChange={setShowDeleteModalLocation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Location Type</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this location type?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={cancelDeleteForLocation}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDeleteForLocation}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreatePropertyType