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
    subLocationType: "",
    order: 1,
  });
  // New state for fetched sub-locations
  const [filteredSubLocations, setFilteredSubLocations] = useState([]);

  // Fetch sub-locations when main location changes in Gali form
//   useEffect(() => {
//     const fetchSubLocations = async () => {
//       if (!formDataGali.locationType) {
//         setFilteredSubLocations([]);
//         return;
//       }
//       try {
//         const res = await fetch("/api/createSubLocation");
//         if (res.ok) {
//           const data = await res.json();
//           const filtered = data.filter(item => item.locationType === formDataGali.locationType);
//           setFilteredSubLocations(filtered);
//         }
//       } catch (error) {
//         console.error("Failed to fetch sub locations", error);
//       }
//     };
//     fetchSubLocations();
//   }, [formDataGali.locationType]);


  // Set initial form data order based on props
  useEffect(() => {
    if (locationType?.length > 0) {
      const highestOrder = Math.max(...locationType.map((b) => b.order || 0));
      setFormDataLocation((prev) => ({ ...prev, order: highestOrder + 1 }));
      setLocations(locationType);
    }
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

  const handleEditForLocation = (banner) => {
    setEditLocation(banner._id);
    // console.log(banner)
    setFormDataLocation({
      locationType: banner.locationType,
      order: banner.order,
    });
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

    </div>
  );
};

export default CreatePropertyType;
