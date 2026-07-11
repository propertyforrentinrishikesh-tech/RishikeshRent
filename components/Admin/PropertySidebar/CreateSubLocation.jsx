"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import toast from "react-hot-toast";

import { PencilIcon, Trash2Icon } from "lucide-react";
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
  locationType = [],
}) => {
  const [showDeleteModalSubLocation, setShowDeleteModalSubLocation] = useState(false);
  const [subLocationToDelete, setSubLocationToDelete] = useState(null);
  const [subLocations, setSubLocations] = useState([]);
  const [editSubLocation, setEditSubLocation] = useState(null);
  const [formDataSubLocation, setFormDataSubLocation] = useState({
    locationType: "",
    subLocationType: "",
  });

  useEffect(() => {
    setSubLocations(subLocationType || []);
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
      const response = await fetch("/api/property/createSubLocation", {
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

        // Refresh list and sync parent state
        const updatedBanners = await fetch("/api/property/createSubLocation").then((res) =>
          res.json(),
        );
        setSubLocations(updatedBanners);
        setSubLocationType(updatedBanners);

        // Reset form
        setFormDataSubLocation({
          locationType: "",
          subLocationType: "",
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
    });
  };
  const handleDeleteForSubLocation = async (id) => {
    try {
      const response = await fetch("/api/property/createSubLocation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Sub Location deleted successfully");

        // Update list and sync parent state
        const updatedBanners = await fetch("/api/property/createSubLocation").then((res) =>
          res.json(),
        );
        setSubLocations(updatedBanners);
        setSubLocationType(updatedBanners);
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
  const handleStatusChangeSubLocation = async (id, isActive) => {
    // Optimistically update local state
    setSubLocations((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isActive } : p))
    );

    try {
      const response = await fetch('/api/property/createSubLocation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Sync with server response
      setSubLocations((prev) =>
        prev.map((p) => (p._id === data._id ? data : p))
      );
      toast.success(`Status updated to ${isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      // Revert optimistic update on failure
      setSubLocations((prev) =>
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
            {editSubLocation ? "Edit Sub Location Type" : "Add New Sub Location Type"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {editSubLocation ? "Update the details of the selected sub location." : "Create a new sub location."}
          </p>
        </div>

        <form
          onSubmit={handleSubmitforSubLocationType}
          className="p-6 md:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Select Main Destination</Label>
              <Select
                value={formDataSubLocation.locationType}
                onValueChange={(value) =>
                  setFormDataSubLocation((prev) => ({
                    ...prev,
                    locationType: value,
                  }))
                }
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-blue-500">
                  <SelectValue placeholder="Select Main Destination" />
                </SelectTrigger>
                <SelectContent>
                  {locationType
                    .filter((loc) => loc.locationType && loc.locationType.trim() !== '')
                    .map((loc) => (
                      <SelectItem key={loc._id || loc.locationType} value={loc.locationType}>
                        {loc.locationType}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Sub Destination Type</Label>
              <Input
                name="subLocationType"
                className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                placeholder="Enter sub location type"
                type="text"
                value={formDataSubLocation.subLocationType || ""}
                onChange={handleInputChangeForSubLocation}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-sm transition-all font-medium">
              {editSubLocation ? "Update Sub Location Type" : "Add Sub Location Type"}
            </Button>
            {editSubLocation && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-11 px-8 text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50"
                onClick={() => {
                  setEditSubLocation(null);
                  setFormDataSubLocation({
                    locationType: "",
                    subLocationType: "",
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
            <h2 className="text-xl font-bold text-slate-800">Existing Sub Location Types</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and view all sub locations.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {subLocations.length} Sub Locations
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-center w-24 text-slate-600 font-semibold">Order</TableHead>
                <TableHead className="text-slate-600 font-semibold">Location Type</TableHead>
                <TableHead className="text-slate-600 font-semibold">Sub Location Type</TableHead>
                <TableHead className="text-center text-slate-600 font-semibold">Status</TableHead>
                <TableHead className="text-center text-slate-600 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subLocations.length > 0 ? (
                subLocations.map((subLocation, index) => (
                  <TableRow key={subLocation._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center text-slate-500 font-medium">#{index + 1}</TableCell>
                    <TableCell className="font-medium text-slate-900">{subLocation.locationType}</TableCell>
                    <TableCell className="font-medium text-slate-900">{subLocation.subLocationType}</TableCell>
                    {/* Status */}
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          id={`status-${subLocation._id}`}
                          checked={subLocation.isActive}
                          onCheckedChange={(checked) => handleStatusChangeSubLocation(subLocation._id, checked)}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <Label htmlFor={`status-${subLocation._id}`} className={`text-sm cursor-pointer ${subLocation.isActive ? 'text-green-700 font-medium' : 'text-slate-500'}`}>
                          {subLocation.isActive ? 'Active' : 'Inactive'}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditForSubLocation(subLocation)}
                          className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setShowDeleteModalSubLocation(true);
                            setSubLocationToDelete(subLocation._id);
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
                  <TableCell colSpan="5" className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p>No sub location types found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
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
