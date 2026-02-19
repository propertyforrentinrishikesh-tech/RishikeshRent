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
      const response = await fetch("/api/hotels/createGali", {
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
        const updatedBanners = await fetch("/api/hotels/createGali").then((res) =>
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
      const response = await fetch("/api/hotels/createGali", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Gali deleted successfully");

        // Update list and sync parent state
        const updatedBanners = await fetch("/api/hotels/createGali").then((res) =>
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
      const response = await fetch('/api/hotels/createGali', {
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
    <div className="max-w-5xl mx-auto w-full">
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
                subLocationType: "", // reset sub when main changes
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
              Status
            </TableHead>
            <TableHead className="border border-black text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {galis.length > 0 ? (
            // Sort by Location -> SubLocation -> GaliName
            galis.map((gali, index) => (
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
                  <div className="flex items-center justify-center w-full gap-2">
                    <Switch
                      id={`status-${gali._id}`}
                      checked={gali.isActive}
                      onCheckedChange={(checked) => handleStatusChange(gali._id, checked)}
                    />
                    <Label htmlFor={`status-${gali._id}`} className="cursor-pointer">
                      {gali.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
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
                No Gali types found
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

export default CreateGali;
