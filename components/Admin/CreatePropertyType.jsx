"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import toast from "react-hot-toast";

import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef } from "react";
import { UploadIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CreatePropertyType = ({
  propertyTypes = [],
  locationType = [],
  subLocationType = [],
  galiType = [],
  setPropertyTypes,
  setLocationType,
  setSubLocationType,
  setGaliType,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteModalLocation, setShowDeleteModalLocation] = useState(false);
  const [showDeleteModalSubLocation, setShowDeleteModalSubLocation] = useState(false);
  const [showDeleteModalForGali, setShowDeleteModalForGali] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [subLocationToDelete, setSubLocationToDelete] = useState(null);
  const [galiToDelete, setGaliToDelete] = useState(null);
  const [locations, setLocations] = useState([]);
  const [subLocations, setSubLocations] = useState([]);
  const [galis, setGalis] = useState([]);
  // Use props instead of local state
  const [properties, setProperties] = useState(propertyTypes);
  const [editProperty, setEditProperty] = useState(null);
  const [editLocation, setEditLocation] = useState(null);
  const [editSubLocation, setEditSubLocation] = useState(null);
  const [editGali, setEditGali] = useState(null);
  const [formData, setFormData] = useState({
    propertyType: "",
    order: 1,
  });
  const [formDataLocation, setFormDataLocation] = useState({
    locationType: "",
    subLocationType: "",
    order: 1,
  });
  const [formDataSubLocation, setFormDataSubLocation] = useState({
    locationType: "",
    subLocationType: "",
    order: 1,
  });
  const [formDataGali, setFormDataGali] = useState({
    locationType: "",
    subLocationType: "",
    galiName: "",
    order: 1,
  });
  // New state for fetched sub-locations
  const [filteredSubLocations, setFilteredSubLocations] = useState([]);

  // Fetch sub-locations when main location changes in Gali form
  useEffect(() => {
    const fetchSubLocations = async () => {
      if (!formDataGali.locationType) {
        setFilteredSubLocations([]);
        return;
      }
      try {
        const res = await fetch("/api/createSubLocation");
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter(item => item.locationType === formDataGali.locationType);
          setFilteredSubLocations(filtered);
        }
      } catch (error) {
        console.error("Failed to fetch sub locations", error);
      }
    };
    fetchSubLocations();
  }, [formDataGali.locationType]);


  // Set initial form data order based on props
  useEffect(() => {
    if (propertyTypes?.length > 0) {
      const highestOrder = Math.max(...propertyTypes.map((b) => b.order || 0));
      setFormData((prev) => ({ ...prev, order: highestOrder + 1 }));
      setProperties(propertyTypes);
    }
    if (locationType?.length > 0) {
      const highestOrder = Math.max(...locationType.map((b) => b.order || 0));
      setFormDataLocation((prev) => ({ ...prev, order: highestOrder + 1 }));
      setLocations(locationType);
    }
    if (subLocationType?.length > 0) {
      const highestOrder = Math.max(...subLocationType.map((b) => b.order || 0));
      setFormDataSubLocation((prev) => ({ ...prev, order: highestOrder + 1 }));
      setSubLocations(subLocationType);
    }
    if (galiType?.length > 0) {
      const highestOrder = Math.max(...galiType.map((b) => b.order || 0));
      setFormDataGali((prev) => ({ ...prev, order: highestOrder + 1 }));
      setGalis(galiType);
    }
  }, [propertyTypes, locationType, subLocationType]);

  const handleInputChangeForProperty = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "", // Ensure we never set undefined
    }));
  };

  const handleInputChangeForLocation = (e) => {
    const { name, value } = e.target;
    setFormDataLocation((prev) => ({
      ...prev,
      [name]: value || "", // Ensure we never set undefined
    }));
  };

  const handleInputChangeForSubLocation = (e) => {
    const { name, value } = e.target;
    setFormDataSubLocation((prev) => ({
      ...prev,
      [name]: value || "", // Ensure we never set undefined
    }));
  };
  const handleInputChangeForGali = (e) => {
    const { name, value } = e.target;
    setFormDataGali((prev) => ({
      ...prev,
      [name]: value || "", // Ensure we never set undefined
    }));
  };

  const handleSubmitForProperty = async (e) => {
    if (!formData.propertyType) {
      toast.error("Property Type is required");
      return;
    }
    e.preventDefault();
    const isDuplicate = properties.some(
      (property) =>
        property.propertyType.toLowerCase() ===
        formData.propertyType.trim().toLowerCase() &&
        (!editProperty || property._id !== editProperty), // Skip current item when editing
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
        toast.success(
          `Property Type ${editProperty ? "updated" : "added"} successfully`,
        );
        setEditProperty(null);

        // Refresh banner list
        const updatedBanners = await fetch("/api/createProperty").then((res) =>
          res.json(),
        );
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
    const isDuplicate = locations.some(
      (location) =>
        location.locationType.toLowerCase() ===
        formDataLocation.locationType.trim().toLowerCase() &&
        (!editLocation || location._id !== editLocation), // Skip current item when editing
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
        toast.success(
          `Location ${editLocation ? "updated" : "added"} successfully`,
        );
        setEditLocation(null);

        // Refresh banner list
        const updatedBanners = await fetch("/api/createLocation").then((res) =>
          res.json(),
        );
        setLocations(updatedBanners);

        // Reset form
        setFormDataLocation({
          locationType: "",
          subLocationType: "",
          order: updatedBanners.length + 1,
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleSubmitforSubLocationType = async (e) => {
    if (!formDataSubLocation.subLocationType) {
      toast.error("Sub Location Type is required");
      return;
    }
    e.preventDefault();
    // Check for duplicates within the same Location
    const isDuplicate = subLocations.some(
      (subLocation) =>
        subLocation.subLocationType.toLowerCase() ===
        formDataSubLocation.subLocationType.trim().toLowerCase() &&
        subLocation.locationType === formDataSubLocation.locationType &&
        (!editSubLocation || subLocation._id !== editSubLocation)
    );

    if (isDuplicate) {
      toast.error("This Sub Location already exists in the selected Main Location.");
      return;
    }
    try {
      const method = editSubLocation ? "PATCH" : "POST";
      // Compose payload with coupon details
      const payload = {
        ...formDataSubLocation,
        id: editSubLocation,
      };
      const response = await fetch("/api/createSubLocation", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Sub Location ${editSubLocation ? "updated" : "added"} successfully`,
        );
        setEditSubLocation(null);

        // Refresh banner list
        const updatedBanners = await fetch("/api/createSubLocation").then((res) =>
          res.json(),
        );
        setSubLocationType(updatedBanners);

        // Reset form
        setFormDataSubLocation({
          locationType: "",
          subLocationType: "",
          order: updatedBanners.length + 1,
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleSubmitforGali = async (e) => {
    if (!formDataGali.galiName) {
      toast.error("Gali Name is required");
      return;
    }
    e.preventDefault();
    // Check for duplicates within the same Location AND Sub Location
    const isDuplicate = galis.some(
      (gali) =>
        gali.galiName.toLowerCase() === formDataGali.galiName.trim().toLowerCase() &&
        gali.locationType === formDataGali.locationType &&
        gali.subLocationType === formDataGali.subLocationType &&
        (!editGali || gali._id !== editGali)
    );

    if (isDuplicate) {
      toast.error("This Gali already exists in the selected Location and Sub Location.");
      return;
    }
    try {
      const method = editGali ? "PATCH" : "POST";
      // Compose payload with coupon details
      const payload = {
        ...formDataGali,
        id: editGali,
      };
      const response = await fetch("/api/createGali", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Gali Name ${editGali ? "updated" : "added"} successfully`,
        );
        setEditGali(null);

        // Refresh banner list
        const updatedBanners = await fetch("/api/createGali").then((res) =>
          res.json(),
        );
        setGalis(updatedBanners);

        // Reset form
        setFormDataGali({
          galiName: "",
          locationType: "",
          subLocationType: "",
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
  const handleEditForSubLocation = (banner) => {
    setEditSubLocation(banner._id);
    // console.log(banner)
    setFormDataSubLocation({
      locationType: banner.locationType,
      subLocationType: banner.subLocationType,
      order: banner.order,
    });
  };
  const handleEditForGali = (banner) => {
    setEditGali(banner._id);
    // console.log(banner)
    setFormDataGali({
      galiName: banner.galiName,
      locationType: banner.locationType,
      subLocationType: banner.subLocationType,
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
        const updatedBanners = await fetch("/api/createProperty").then((res) =>
          res.json(),
        );
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
        const updatedBanners = await fetch("/api/createLocation").then((res) =>
          res.json(),
        );
        setLocations(updatedBanners);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleDeleteForSubLocation = async (id) => {
    try {
      const response = await fetch("/api/createSubLocation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Sub Location deleted successfully");

        setSubLocations((prev) => prev.filter((banner) => banner._id !== id));

        // Update order numbers
        const updatedBanners = await fetch("/api/createSubLocation").then((res) =>
          res.json(),
        );
        setSubLocations(updatedBanners);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleDeleteForGali = async (id) => {
    try {
      const response = await fetch("/api/createGali", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Gali deleted successfully");

        setGalis((prev) => prev.filter((banner) => banner._id !== id));

        // Update order numbers
        const updatedBanners = await fetch("/api/createGali").then((res) =>
          res.json(),
        );
        setGalis(updatedBanners);
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
  const confirmDeleteForSubLocation = async () => {
    if (subLocationToDelete) {
      await handleDeleteForSubLocation(subLocationToDelete);
      setSubLocationToDelete(null);
      setShowDeleteModalSubLocation(false);
    }
  };
  const confirmDeleteForGali = async () => {
    if (galiToDelete) {
      await handleDeleteForGali(galiToDelete);
      setGaliToDelete(null);
      setShowDeleteModalForGali(false);
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
  const cancelDeleteForSubLocation = () => {
    setShowDeleteModalSubLocation(false);
    setSubLocationToDelete(null);
  };
  const cancelDeleteForGali = () => {
    setShowDeleteModalForGali(false);
    setGaliToDelete(null);
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">
        {editProperty ? "Edit Property Type" : "Add New Property Type"}
      </h2>
      <form
        onSubmit={handleSubmitForProperty}
        className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-black"
      >
        <div>
          <Label>Property Type</Label>
          <Input
            name="propertyType"
            className="border border-black"
            placeholder="Enter property type"
            type="text"
            value={formData.propertyType}
            onChange={handleInputChangeForProperty}
          />
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
                  order:
                    properties.length > 0
                      ? Math.max(...properties.map((b) => b.order)) + 1
                      : 1,
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
            <TableHead className="border border-black text-center">
              Order
            </TableHead>
            <TableHead className="border border-black text-center">
              Property Type
            </TableHead>
            <TableHead className="border border-black text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.length > 0 ? (
            properties.map((property, index) => (
              <TableRow key={property._id} className="border border-black">
                <TableCell className="border border-black text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {property.propertyType}
                </TableCell>
                <TableCell className="border border-black text-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditForProperty(property)}
                    className="mr-2 "
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setPropertyToDelete(property._id);
                    }}
                    variant="destructive"
                  >
                    <Trash2Icon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="5" className="text-center py-4">
                No property types found
              </TableCell>
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
            <Button variant="secondary" onClick={cancelDeleteForProperty}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteForProperty}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <hr className="my-6 border border-gray-400" />

      {/* Location Type */}
      <h2 className="text-2xl font-bold my-6">
        {editLocation ? "Edit Location Type" : "Add New Location Type"}
      </h2>
      <form
        onSubmit={handleSubmitforLocation}
        className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-black"
      >
        <div>
          <Label>Location Type</Label>
          <Input
            name="locationType"
            className="border border-black"
            placeholder="Enter location type"
            type="text"
            value={formDataLocation.locationType || ""}
            onChange={handleInputChangeForLocation}
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
            {editLocation
              ? "Update Location Type"
              : "Add Location Type"}
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
                  order:
                    locations.length > 0
                      ? Math.max(...locations.map((b) => b.order)) + 1
                      : 1,
                });
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4">
        Existing Location Type
      </h2>
      <Table className="border border-black">
        <TableHeader>
          <TableRow className="border border-black">
            <TableHead className="border border-black text-center">
              Order
            </TableHead>
            <TableHead className="border border-black text-center">
              Location Type
            </TableHead>
            <TableHead className="border border-black text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.length > 0 ? (
            locations.map((location, index) => (
              <TableRow key={location._id} className="border border-black">
                <TableCell className="border border-black text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="border border-black text-center">
                  {location.locationType}
                </TableCell>
                <TableCell className="border border-black text-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditForLocation(location)}
                    className="mr-2 "
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => {
                      setShowDeleteModalLocation(true);
                      setLocationToDelete(location._id);
                    }}
                    variant="destructive"
                  >
                    <Trash2Icon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border border-black">
              <TableCell colSpan="5" className="text-center py-4">
                No location types found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteModalLocation}
        onOpenChange={setShowDeleteModalLocation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location Type</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this location type?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={cancelDeleteForLocation}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteForLocation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <hr className="my-6 border border-gray-400" />

      {/* sub location Type */}
      <h2 className="text-2xl font-bold my-6">
        {editLocation ? "Edit Sub Location Type" : "Add New Sub Location Type"}
      </h2>
      <form
        onSubmit={handleSubmitforSubLocationType}
        className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-black"
      >
        <div>
          <Label>Select Main Destination </Label>
          <Select
            value={formDataSubLocation.locationType}
            onValueChange={(value) =>
              setFormDataSubLocation((prev) => ({
                ...prev,
                locationType: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Main Destination" />
            </SelectTrigger>
            <SelectContent>
              {locations.filter(location => location.locationType && location.locationType.trim() !== '').map((location) => (
                <SelectItem key={location.locationType} value={location.locationType}>
                  {location.locationType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Type Sub Destination</Label>
          <Input
            name="subLocationType"
            className="border border-black"
            placeholder="Enter location type"
            type="text"
            value={formDataSubLocation.subLocationType || ""}
            onChange={handleInputChangeForSubLocation}
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
            {editSubLocation
              ? "Update Sub Location Type"
              : "Add Sub Location Type"}
          </Button>
          {editSubLocation && (
            <Button
              type="button"
              variant="outline"
              className="bg-gray-300 hover:bg-gray-200 text-black"
              onClick={() => {
                setEditSubLocation(null);
                setFormDataSubLocation({
                  locationType: "",
                  subLocationType: "",
                  order:
                    locations.length > 0
                      ? Math.max(...locations.map((b) => b.order)) + 1
                      : 1,
                });
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4">
        Existing Sub Location Type
      </h2>
      <Table className="border border-black">
        <TableHeader>
          <TableRow className="border border-black">
            <TableHead className="border border-black text-center">
              Order
            </TableHead>
            <TableHead className="border border-black text-center">
              Location Type
            </TableHead>
            <TableHead className="border border-black text-center">
              Sub Location Type
            </TableHead>
            <TableHead className="border border-black text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subLocations.length > 0 ? (
            // Sort by Location Type, then Sub Location Type
            [...subLocations]
              .sort((a, b) =>
                a.locationType.localeCompare(b.locationType) ||
                a.subLocationType.localeCompare(b.subLocationType)
              )
              .map((subLocation, index) => (
                <TableRow key={subLocation._id} className="border border-black">
                  <TableCell className="border border-black text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    {subLocation.locationType}
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    {subLocation.subLocationType}
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditForSubLocation(subLocation)}
                      className="mr-2 "
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => {
                        setShowDeleteModalSubLocation(true);
                        setSubLocationToDelete(subLocation._id);
                      }}
                      variant="destructive"
                    >
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow className="border border-black">
              <TableCell colSpan="5" className="text-center py-4">
                No location types found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteModalSubLocation}
        onOpenChange={setShowDeleteModalSubLocation}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sub Location Type</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this sub location type?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={cancelDeleteForSubLocation}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteForSubLocation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <hr className="my-6 border border-gray-400" />
      {/* add new gali/ mohalla location type */}
      <h2 className="text-2xl font-bold my-6">
        {editGali
          ? "Edit Gali/ Mohalla Location Type"
          : "Add New Gali/ Mohalla Location Type"}
      </h2>
      <form
        onSubmit={handleSubmitforGali}
        className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-black"
      >
        <div>
          <Label>Select Main Destination </Label>
          <Select
            value={formDataGali.locationType || ""}
            onValueChange={(value) =>
              setFormDataGali((prev) => ({
                ...prev,
                locationType: value,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location type" />
            </SelectTrigger>
            <SelectContent>
              {locations.filter(location => location.locationType && location.locationType.trim() !== '').map((location) => (
                <SelectItem key={location._id} value={location.locationType}>
                  {location.locationType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Select Sub Destination </Label>
          <Select
            value={formDataGali.subLocationType || ""}
            onValueChange={(value) =>
              setFormDataGali((prev) => ({
                ...prev,
                subLocationType: value,
              }))
            }
            disabled={!formDataGali.locationType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Sub Location type" />
            </SelectTrigger>
            <SelectContent>
              {filteredSubLocations
                .filter(
                  (subLoc) =>
                    subLoc.subLocationType &&
                    subLoc.subLocationType.trim() !== ""
                )
                .map((subLoc) => (
                  <SelectItem
                    key={subLoc._id}
                    value={subLoc.subLocationType}
                  >
                    {subLoc.subLocationType}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Type 3rd (Gali /Mohalla) Destination</Label>
          <Input
            name="galiName"
            className="border border-black"
            placeholder="Enter location type"
            type="text"
            value={formDataGali.galiName || ""}
            onChange={handleInputChangeForGali}
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
            {editGali
              ? "Update Gali/ Mohalla Location Type"
              : "Add Gali/ Mohalla Location Type"}
          </Button>
          {editGali && (
            <Button
              type="button"
              variant="outline"
              className="bg-gray-300 hover:bg-gray-200 text-black"
              onClick={() => {
                setEditGali(null);
                setFormDataGali({
                  locationType: "",
                  subLocationType: "",
                  galiName: "",
                  order:
                    locations.length > 0
                      ? Math.max(...locations.map((b) => b.order)) + 1
                      : 1,
                });
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4">
        Existing Gali/ Mohalla Location Type
      </h2>
      <Table className="border border-black">
        <TableHeader>
          <TableRow className="border border-black">
            <TableHead className="border border-black text-center">
              Order
            </TableHead>
            <TableHead className="border border-black text-center">
              Location Type
            </TableHead>
            <TableHead className="border border-black text-center">
              Sub Location Type
            </TableHead>
            <TableHead className="border border-black text-center">
              Gali/ Mohalla
            </TableHead>
            <TableHead className="border border-black text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {galis.length > 0 ? (
            // Sort by Location -> SubLocation -> GaliName
            [...galis]
              .sort((a, b) =>
                a.locationType.localeCompare(b.locationType) ||
                a.subLocationType.localeCompare(b.subLocationType) ||
                a.galiName.localeCompare(b.galiName)
              )
              .map((gali, index) => (
                <TableRow key={gali._id} className="border border-black">
                  <TableCell className="border border-black text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    {gali.locationType}
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    {gali.subLocationType}
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    {gali.galiName}
                  </TableCell>
                  <TableCell className="border border-black text-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditForGali(gali)}
                      className="mr-2 "
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => {
                        setShowDeleteModalForGali(true);
                        setGaliToDelete(gali._id);
                      }}
                      variant="destructive"
                    >
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
          ) : (
            <TableRow className="border border-black">
              <TableCell colSpan="5" className="text-center py-4">
                No location types found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteModalForGali}
        onOpenChange={setShowDeleteModalForGali}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location Type</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this location type?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={cancelDeleteForGali}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteForGali}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePropertyType;
