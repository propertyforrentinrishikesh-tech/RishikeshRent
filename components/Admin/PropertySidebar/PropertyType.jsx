"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { PencilIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const PropertyType = ({
  propertyTypes = [],
  setPropertyTypes,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [properties, setProperties] = useState(propertyTypes);
  const [editProperty, setEditProperty] = useState(null);
  const [formData, setFormData] = useState({
    propertyType: "",
  });
  // console.log(propertyTypes)
  useEffect(() => {
    setProperties(propertyTypes || []);
  }, [propertyTypes]);

  const handleInputChangeForProperty = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
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
      const response = await fetch("/api/property/propertyType", {
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

        // Refresh list and sync parent state
        const updatedBanners = await fetch("/api/property/propertyType").then((res) =>
          res.json(),
        );
        setProperties(updatedBanners);
        setPropertyTypes(updatedBanners);

        // Reset form
        setFormData({
          propertyType: "",
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
    });
  };

  const handleDeleteForProperty = async (id) => {
    try {
      const response = await fetch("/api/property/propertyType", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Property Type deleted successfully");
        // Re-fetch and sync both local and parent state
        const updatedBanners = await fetch("/api/property/propertyType").then((res) =>
          res.json(),
        );
        setProperties(updatedBanners);
        setPropertyTypes(updatedBanners);
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

  const cancelDeleteForProperty = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };
  const handleStatusChange = async (id, isActive) => {
    // Optimistically update local state
    setProperties((prev) =>
      prev.map((p) => (p._id === id ? { ...p, isActive } : p))
    );

    try {
      const response = await fetch('/api/property/propertyType', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      // Sync with server response
      setProperties((prev) =>
        prev.map((p) => (p._id === data._id ? data : p))
      );
      toast.success(`Status updated to ${isActive ? 'Active' : 'Inactive'}`);
    } catch (error) {
      // Revert optimistic update on failure
      setProperties((prev) =>
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
            {editProperty ? "Edit Property Type" : "Add New Property Type"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {editProperty ? "Update the details of the selected property type." : "Create a new property type classification."}
          </p>
        </div>

        <form
          onSubmit={handleSubmitForProperty}
          className="p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2 max-w-xl">
            <Label className="text-slate-700 font-medium">Property Type</Label>
            <Input
              name="propertyType"
              className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
              placeholder="Enter property type (e.g. Apartment, Villa)"
              type="text"
              value={formData.propertyType}
              onChange={handleInputChangeForProperty}
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-sm transition-all font-medium">
              {editProperty ? "Update Property Type" : "Add Property Type"}
            </Button>
            {editProperty && (
              <Button
                type="button"
                variant="outline"
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 rounded-xl h-11 px-6 shadow-sm transition-all"
                onClick={() => {
                  setEditProperty(null);
                  setFormData({
                    propertyType: "",
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
            <h2 className="text-xl font-bold text-slate-800">Existing Property Types</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and view all property classifications.</p>
          </div>
          <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {properties.length} Types
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-center w-24 text-slate-600 font-semibold">
                  Order
                </TableHead>
                <TableHead className="text-slate-600 font-semibold">
                  Property Type
                </TableHead>
                <TableHead className="text-center text-slate-600 font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-center text-slate-600 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length > 0 ? (
                properties.map((property, index) => (
                  <TableRow key={property._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-center text-slate-500 font-medium">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {property.propertyType}
                    </TableCell>
                {/* Status */}
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Switch
                      id={`status-${property._id}`}
                      checked={property.isActive}
                      onCheckedChange={(checked) => handleStatusChange(property._id, checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <Label htmlFor={`status-${property._id}`} className={`text-sm cursor-pointer ${property.isActive ? 'text-green-700 font-medium' : 'text-slate-500'}`}>
                      {property.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditForProperty(property)}
                      className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setPropertyToDelete(property._id);
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
                  <p>No property types found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-800">Delete Property Type</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600 mt-2">Are you sure you want to delete this property type? This action cannot be undone.</p>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <Button variant="outline" className="rounded-xl" onClick={cancelDeleteForProperty}>
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-xl shadow-sm" onClick={confirmDeleteForProperty}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyType;
