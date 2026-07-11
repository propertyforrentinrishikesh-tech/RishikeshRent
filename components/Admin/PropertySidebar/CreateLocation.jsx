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
    <div className="max-w-5xl mx-auto w-full p-4 md:p-6 space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {editLocation ? "Edit Location Type" : "Add New Location Type"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {editLocation ? "Update the details of the selected location." : "Create a new location."}
          </p>
        </div>

        <form
          onSubmit={handleSubmitforLocation}
          className="p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2 max-w-xl">
            <Label className="text-slate-700 font-medium">Location Type</Label>
            <Input
              name="locationType"
              className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
              placeholder="Enter location type"
              type="text"
              value={formDataLocation.locationType || ""}
              onChange={handleInputChangeForLocation}
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-sm transition-all font-medium">
              {editLocation ? "Update Location Type" : "Add Location Type"}
            </Button>
            {editLocation && (
              <Button
                type="button"
                variant="outline"
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 rounded-xl h-11 px-6 shadow-sm transition-all"
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
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Existing Location Types</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and view all locations.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {locations.length} Locations
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-center w-24 text-slate-600 font-semibold">Order</TableHead>
                <TableHead className="text-slate-600 font-semibold">Location Type</TableHead>
                <TableHead className="text-center text-slate-600 font-semibold">Status</TableHead>
                <TableHead className="text-center text-slate-600 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length > 0 ? (
                locations.map((location, index) => (
                  <TableRow key={location._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center text-slate-500 font-medium">#{index + 1}</TableCell>
                    <TableCell className="font-medium text-slate-900">{location.locationType}</TableCell>
                    {/* Status */}
                    {/* Status */}
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          id={`status-${location._id}`}
                          checked={location.isActive}
                          onCheckedChange={(checked) => handleStatusChange(location._id, checked)}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <Label htmlFor={`status-${location._id}`} className={`text-sm cursor-pointer ${location.isActive ? 'text-green-700 font-medium' : 'text-slate-500'}`}>
                          {location.isActive ? 'Active' : 'Inactive'}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditForLocation(location)}
                          className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setShowDeleteModalLocation(true);
                            setLocationToDelete(location._id);
                          }}
                          className="h-9 w-9 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                          title="Delete"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p>No location types found</p>
                      </div>
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
<Dialog open={showDeleteModalLocation} onOpenChange={setShowDeleteModalLocation}>
  <DialogContent className="sm:max-w-md rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-xl text-slate-800">Delete Location Type</DialogTitle>
    </DialogHeader>
    <p className="text-slate-600 mt-2">Are you sure you want to delete this location type? This action cannot be undone.</p>
    <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
      <Button variant="outline" className="rounded-xl" onClick={cancelDeleteForLocation}>
        Cancel
      </Button>
      <Button variant="destructive" className="rounded-xl shadow-sm" onClick={confirmDeleteForLocation}>
        Yes, Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div >
  );
};

export default CreatePropertyType;
