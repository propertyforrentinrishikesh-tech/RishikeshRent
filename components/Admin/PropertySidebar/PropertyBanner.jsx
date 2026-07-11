"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import toast from "react-hot-toast";

import { PencilIcon, Trash2Icon, UploadCloud } from "lucide-react";
import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const PropertyBanner = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);
    const [banners, setBanners] = useState([]);
    const [editBanner, setEditBanner] = useState(null);
    const [formData, setFormData] = useState({
        image: { url: "", key: "" },
    });

    // Fetch banners and determine the next order number
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch("/api/propertyBanner");
                const data = await response.json();
                setBanners(data);
            } catch (error) {
                toast.error("Failed to fetch banners");
            }
        };
        fetchBanners();
    }, []);
    // Cloudinary-style image upload (like AddGallery.jsx)
    const [uploading, setUploading] = useState(false);
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setFormData(prev => ({ ...prev, image: { url: data.url, key: data.key || '' } }));
                toast.success('Image uploaded!');
            } else {
                toast.error('Cloudinary upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            toast.error('Cloudinary upload error: ' + err.message);
        }
        setUploading(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image.url || !formData.image.key) return toast.error("Please upload an image");
        try {
            const method = editBanner ? "PATCH" : "POST";          
            // Compose payload with coupon details
            const payload = {
                ...formData,
                id: editBanner,
            };
            const response = await fetch("/api/propertyBanner", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Banner ${editBanner ? "updated" : "added"} successfully`);
                setEditBanner(null);

                // Refresh banner list
                const updatedBanners = await fetch("/api/propertyBanner").then((res) => res.json());
                setBanners(updatedBanners);

                // Reset form
                setFormData({
                    image: { url: "", key: "" },
                });

            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleEdit = (banner) => {
        setEditBanner(banner._id);
        setFormData({
            image: banner.image,
        });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch("/api/propertyBanner", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Banner deleted successfully");

                setBanners((prev) => prev.filter((banner) => banner._id !== id));

                // Update order numbers
                const updatedBanners = await fetch("/api/propertyBanner").then((res) => res.json());
                setBanners(updatedBanners);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const confirmDelete = async () => {
        if (bannerToDelete) {
            await handleDelete(bannerToDelete);
            setBannerToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setBannerToDelete(null);
    };

    // Remove image from formData only
    const handleDeleteImage = () => {
        setFormData(prev => ({ ...prev, image: { url: '', key: '' } }));
    };


    // Ref for file input
    const fileInputRef = useRef(null);

    return (
        <div className="max-w-5xl mx-auto w-full p-4 md:p-6 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">
                        {editBanner ? "Edit Property Banner" : "Add New Property Banner"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {editBanner ? "Update the selected banner image." : "Upload a new promotional banner for properties."}
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                {/* Banner Image Upload */}
                <div className="space-y-3 max-w-xl">
                    <Label className="text-slate-700 font-medium">Property Image</Label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                        id="banner-image-input"
                    />
                    {!formData.image.url ? (
                        <div 
                            onClick={() => !uploading && fileInputRef.current && fileInputRef.current.click()}
                            className={`border-2 border-dashed rounded-2xl h-[240px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors w-full max-w-[320px]
                                ${uploading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                        >
                            {uploading ? (
                                <>
                                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm font-medium text-slate-600">Uploading...</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                        <UploadCloud className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-center px-4">
                                        <p className="text-sm font-medium text-slate-700">Upload Image</p>
                                        <p className="text-xs text-slate-500 mt-1">Recommended: Horizontal format</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="relative w-full max-w-[320px] h-[240px] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                            <Image
                                src={formData.image.url}
                                alt="Property Image Preview"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={handleDeleteImage}
                                    className="w-12 h-12 rounded-full shadow-lg"
                                >
                                    <Trash2Icon className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-sm transition-all font-medium">
                        {editBanner ? "Update Banner" : "Add Banner"}
                    </Button>
                    {editBanner && (
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 rounded-xl h-11 px-6 shadow-sm transition-all"
                            onClick={() => {
                                setEditBanner(null);
                                setFormData({
                                    image: { url: "", key: "" },
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
                        <h2 className="text-xl font-bold text-slate-800">Existing Banners</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage and view all uploaded property banners.</p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {banners.length} Banners
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50 border-b border-slate-100">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-center w-24 text-slate-600 font-semibold">S.No</TableHead>
                                <TableHead className="text-slate-600 font-semibold">Image</TableHead>
                                <TableHead className="text-center text-slate-600 font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {banners.length > 0 ? (
                                banners.map((banner, index) => (
                                    <TableRow key={banner._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="text-center text-slate-500 font-medium">#{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                                <Image src={banner.image.url} alt="Property Image" fill className="object-cover" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(banner)}
                                                    className="h-9 w-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => { setShowDeleteModal(true); setBannerToDelete(banner._id); }}
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
                                    <TableCell colSpan="3" className="text-center py-12 text-slate-500">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                                                <Image src="/placeholder-image.svg" width={24} height={24} alt="No banners" className="opacity-50" />
                                            </div>
                                            <p>No banners found</p>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Banner</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this banner?</p>
                    <DialogFooter>
                        <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PropertyBanner
