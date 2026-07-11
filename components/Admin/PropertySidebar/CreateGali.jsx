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
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast";

import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const CreateGali = ({
  propertyTypes = [],
  locationType = [],
  subLocationType = [],
  galiType = [],
  setPropertyTypes,
  setLocationType,
  setSubLocationType,
  setGaliType,
}) => {
  const [showDeleteModalForGali, setShowDeleteModalForGali] = useState(false);

  const [galiToDelete, setGaliToDelete] = useState(null);
  const [locations, setLocations] = useState([]);

  const [galis, setGalis] = useState([]);

  const [editGali, setEditGali] = useState(null);
  const [formDataGali, setFormDataGali] = useState({
    locationType: "",
    subLocationType: "",
    galiName: "",
  });

  useEffect(() => {
    setGalis(galiType || []);
  }, [galiType]);

  useEffect(() => {
    setLocations(locationType || []);
  }, [locationType]);

  // Derived: sub-locations filtered by selected main location
  const filteredSubLocations = subLocationType.filter(
    (sub) => sub.locationType === formDataGali.locationType && sub.subLocationType?.trim() !== ""
  );

  const handleInputChangeForGali = (e) => {
    const { name, value } = e.target;
    setFormDataGali((prev) => ({
      ...prev,
      [name]: value || "", // Ensure we never set undefined
    }));
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
        gali.galiType === formDataGali.galiType &&
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
      const response = await fetch("/api/property/createGali", {
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

        // Refresh list and sync parent state
        const updatedBanners = await fetch("/api/property/createGali").then((res) =>
          res.json(),
        );
        setGalis(updatedBanners);
        setGaliType(updatedBanners);

        // Reset form
        setFormDataGali({
          galiName: "",
          locationType: "",
          subLocationType: "",
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
  const handleEditForGali = (banner) => {
    setEditGali(banner._id);
    // console.log(banner)
    setFormDataGali({
      galiName: banner.galiName,
      locationType: banner.locationType,
      subLocationType: banner.subLocationType,
    });
  };

  const handleDeleteForGali = async (id) => {
    try {
      const response = await fetch("/api/property/createGali", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Gali deleted successfully");

        // Update list and sync parent state
        const updatedBanners = await fetch("/api/property/createGali").then((res) =>
          res.json(),
        );
        setGalis(updatedBanners);
        setGaliType(updatedBanners);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const confirmDeleteForGali = async () => {
    if (galiToDelete) {
      await handleDeleteForGali(galiToDelete);
      setGaliToDelete(null);
      setShowDeleteModalForGali(false);
    }
  };
  const cancelDeleteForGali = () => {
    setShowDeleteModalForGali(false);
    setGaliToDelete(null);
  };

  const handleStatusChange = async (id, isActive) => {
    setGalis((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isActive } : p))
    );

    try {
      const response = await fetch('/api/property/createGali', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Sync with server response
      setGalis((prev) =>
        prev.map((p) => (p._id === data._id ? data : p))
      );
      toast.success(`Status updated to ${isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      // Revert optimistic update on failure
      setGalis((prev) =>
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
            {editGali ? "Edit Gali/ Mohalla Location Type" : "Add New Gali/ Mohalla Location Type"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {editGali ? "Update the details of the selected gali/mohalla." : "Create a new gali/mohalla."}
          </p>
        </div>

        <form
          onSubmit={handleSubmitforGali}
          className="p-6 md:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Select Main Destination</Label>
              <Select
                value={formDataGali.locationType || ""}
                onValueChange={(value) =>
                  setFormDataGali((prev) => ({
                    ...prev,
                    locationType: value,
                    subLocationType: "", // reset sub when main changes
                  }))
                }
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-blue-500">
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
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Select Sub Destination</Label>
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
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-blue-500">
                  <SelectValue placeholder="Select Sub Location type" />
                </SelectTrigger>
                <SelectContent>
                  {/* Fallback: show current value if not in filtered list (e.g. editing old data) */}
                  {formDataGali.subLocationType &&
                    !filteredSubLocations.some(
                      (s) => s.subLocationType === formDataGali.subLocationType
                    ) && (
                      <SelectItem value={formDataGali.subLocationType}>
                        {formDataGali.subLocationType}
                      </SelectItem>
                    )}
                  {filteredSubLocations.map((subLoc) => (
                    <SelectItem key={subLoc._id} value={subLoc.subLocationType}>
                      {subLoc.subLocationType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Type 3rd (Gali /Mohalla) Destination</Label>
              <Input
                name="galiName"
                className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                placeholder="Enter location type"
                type="text"
                value={formDataGali.galiName || ""}
                onChange={handleInputChangeForGali}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-sm transition-all font-medium">
              {editGali ? "Update Gali/ Mohalla Location Type" : "Add Gali/ Mohalla Location Type"}
            </Button>
            {editGali && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl h-11 px-8 text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50"
                onClick={() => {
                  setEditGali(null);
                  setFormDataGali({
                    locationType: "",
                    subLocationType: "",
                    galiName: "",
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
            <h2 className="text-xl font-bold text-slate-800">Existing Gali/ Mohalla Location Types</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and view all galis/mohallas.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {galis.length} Galis
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-center w-24 text-slate-600 font-semibold">Order</TableHead>
                <TableHead className="text-slate-600 font-semibold">Location Type</TableHead>
                <TableHead className="text-slate-600 font-semibold">Sub Location Type</TableHead>
                <TableHead className="text-slate-600 font-semibold">Gali/ Mohalla</TableHead>
                <TableHead className="text-center text-slate-600 font-semibold">Status</TableHead>
                <TableHead className="text-center text-slate-600 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galis.length > 0 ? (
                // Sort by Location -> SubLocation -> GaliName
                galis.map((gali, index) => (
                  <TableRow key={gali._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center text-slate-500 font-medium">#{index + 1}</TableCell>
                    <TableCell className="font-medium text-slate-900">{gali.locationType}</TableCell>
                    <TableCell className="font-medium text-slate-900">{gali.subLocationType}</TableCell>
                    <TableCell className="font-medium text-slate-900">{gali.galiName}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          id={`status-${gali._id}`}
                          checked={gali.isActive}
                          onCheckedChange={(checked) => handleStatusChange(gali._id, checked)}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <Label htmlFor={`status-${gali._id}`} className={`text-sm cursor-pointer ${gali.isActive ? 'text-green-700 font-medium' : 'text-slate-500'}`}>
                          {gali.isActive ? 'Active' : 'Inactive'}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditForGali(gali)}
                          className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setShowDeleteModalForGali(true);
                            setGaliToDelete(gali._id);
                          }}
                          className="h-9 w-9 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p>No Gali types found</p>
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
        open={showDeleteModalForGali}
        onOpenChange={setShowDeleteModalForGali}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-800">Delete Location Type</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600 mt-2">Are you sure you want to delete this location type?</p>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <Button variant="outline" className="rounded-xl" onClick={cancelDeleteForGali}>
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-xl shadow-sm" onClick={confirmDeleteForGali}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateGali;
