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
} from "@/components/ui/select";
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

const CreateSubLocation = ({
  subLocationType = [],
  setSubLocationType,
}) => {
  const [showDeleteModalSubLocation, setShowDeleteModalSubLocation] = useState(false);
  const [subLocationToDelete, setSubLocationToDelete] = useState(null);
  const [subLocations, setSubLocations] = useState([]);
  const [editSubLocation, setEditSubLocation] = useState(null);
  const [formDataSubLocation, setFormDataSubLocation] = useState({
    locationType: "",
    subLocationType: "",
    order: 1,
  });

  // Set initial form data order based on props
  useEffect(() => {
    if (subLocationType?.length > 0) {
      const highestOrder = Math.max(...subLocationType.map((b) => b.order || 0));
      setFormDataSubLocation((prev) => ({ ...prev, order: highestOrder + 1 }));
      setSubLocations(subLocationType);
    }
  }, [subLocationType]);


  const handleInputChangeForSubLocation = (e) => {
    const { name, value } = e.target;
    setFormDataSubLocation((prev) => ({
      ...prev,
      [name]: value || "", // Ensure we never set undefined
    }));
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
  const handleEditForSubLocation = (banner) => {
    setEditSubLocation(banner._id);
    // console.log(banner)
    setFormDataSubLocation({
      locationType: banner.locationType,
      subLocationType: banner.subLocationType,
      order: banner.order,
    });
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
  const confirmDeleteForSubLocation = async () => {
    if (subLocationToDelete) {
      await handleDeleteForSubLocation(subLocationToDelete);
      setSubLocationToDelete(null);
      setShowDeleteModalSubLocation(false);
    }
  };

  const cancelDeleteForSubLocation = () => {
    setShowDeleteModalSubLocation(false);
    setSubLocationToDelete(null);
  };


  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* sub location Type */}
      <h2 className="text-2xl font-bold my-6">
        {editSubLocation ? "Edit Sub Location Type" : "Add New Sub Location Type"}
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
            {/* <SelectContent>
              {locations.filter(location => location.locationType && location.locationType.trim() !== '').map((location) => (
                <SelectItem key={location.locationType} value={location.locationType}>
                  {location.locationType}
                </SelectItem>
              ))}
            </SelectContent> */}
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
    </div>
  );
};

export default CreateSubLocation;
