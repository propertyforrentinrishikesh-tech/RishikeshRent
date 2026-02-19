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
  console.log(propertyTypes)
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
      const response = await fetch("/api/hotels/propertyType", {
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
        const updatedBanners = await fetch("/api/hotels/propertyType").then((res) =>
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
      const response = await fetch("/api/hotels/propertyType", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Property Type deleted successfully");
        // Re-fetch and sync both local and parent state
        const updatedBanners = await fetch("/api/hotels/propertyType").then((res) =>
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
      const response = await fetch('/api/hotels/propertyType', {
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
              Status
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
                {/* Status */}
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Switch
                      id={`status-${property._id}`}
                      checked={property.isActive}
                      onCheckedChange={(checked) => handleStatusChange(property._id, checked)}
                    />
                    <Label htmlFor={`status-${property._id}`} className="cursor-pointer">
                      {property.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
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
    </div>
  );
};

export default PropertyType;
