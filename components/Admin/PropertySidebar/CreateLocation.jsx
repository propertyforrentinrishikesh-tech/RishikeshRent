"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { Switch } from "@/components/ui/switch";
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CreatePropertyType = ({
  locationType = [],
  setLocationType,

}) => {
  const [showDeleteModalLocation, setShowDeleteModalLocation] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);
  const [locations, setLocations] = useState([]);
  const [editLocation, setEditLocation] = useState(null);
  const [formDataLocation, setFormDataLocation] = useState({
    locationType: "",
  });
  useEffect(() => {
    setLocations(locationType || []);
  }, [locationType]);

  const handleInputChangeForLocation = (e) => {
    const { name, value } = e.target;
    setFormDataLocation((prev) => ({
      ...prev,
      [name]: value || "", // Ensure we never set undefined
    }));
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
      const response = await fetch("/api/property/createLocation", {
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

        // Refresh list and sync parent state
        const updatedBanners = await fetch("/api/property/createLocation").then((res) =>
          res.json(),
        );
        setLocations(updatedBanners);
        setLocationType(updatedBanners);

        // Reset form
        setFormDataLocation({
          locationType: "",
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEditForLocation = (banner) => {
    setEditLocation(banner._id);
    // console.log(banner)
    setFormDataLocation({
      locationType: banner.locationType,
    });
  };

  const handleDeleteForLocation = async (id) => {
    try {
      const response = await fetch("/api/property/createLocation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Location deleted successfully");

        // Update list and sync parent state
        const updatedBanners = await fetch("/api/property/createLocation").then((res) =>
          res.json(),
        );
        setLocations(updatedBanners);
        setLocationType(updatedBanners);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  const confirmDeleteForLocation = async () => {
    if (locationToDelete) {
      await handleDeleteForLocation(locationToDelete);
      setLocationToDelete(null);
      setShowDeleteModalLocation(false);
    }
  };

  const cancelDeleteForLocation = () => {
    setShowDeleteModalLocation(false);
    setLocationToDelete(null);
  };

  const handleStatusChange = async (id, isActive) => {
    // Optimistically update local state
    setLocations((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isActive } : p))
    );

    try {
      const response = await fetch('/api/property/createLocation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Sync with server response
      setLocations((prev) =>
        prev.map((p) => (p._id === data._id ? data : p))
      );
      toast.success(`Status updated to ${isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      // Revert optimistic update on failure
      setLocations((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !isActive } : p))
      );
      toast.error(`Failed to update status: ${error.message}`);
    }
  };
  return (
    <div className="max-w-5xl mx-auto w-full">
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
              Status
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
                {/* Status */}
                <TableCell className="border border-black text-center">
                  <div className="flex items-center justify-center w-full gap-2">
                    <Switch
                      id={`status-${location._id}`}
                      checked={location.isActive}
                      onCheckedChange={(checked) => handleStatusChange(location._id, checked)}
                    />
                    <Label htmlFor={`status-${location._id}`} className="cursor-pointer">
                      {location.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
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

    </div>
  );
};

export default CreatePropertyType;
