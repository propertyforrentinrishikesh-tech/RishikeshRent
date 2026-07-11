"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import toast from "react-hot-toast";
import { PencilIcon, Trash2Icon, Type, Newspaper, Calendar, AlignLeft, ListOrdered, FileImage, Image as ImageIcon } from "lucide-react";

const News = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);
    const [banners, setBanners] = useState([]);
    const [editBanner, setEditBanner] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        description: "",
        image: { url: "", key: "" },
        order: 1,
    });

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch("/api/addNews");
                const data = await response.json();
                setBanners(data);

                if (data.length > 0) {
                    const highestOrder = Math.max(...data.map((b) => b.order));
                    setFormData((prev) => ({ ...prev, order: highestOrder + 1 }));
                }
            } catch (error) {
                toast.error("Failed to fetch banners", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        };
        fetchBanners();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                toast.success('Image uploaded successfully!', { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
            } else {
                toast.error('Cloudinary upload failed: ' + (data.error || 'Unknown error'), { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (err) {
            toast.error('Cloudinary upload error: ' + err.message, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.date || !formData.description.trim()) {
            return toast.error("Please fill in all required fields", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
        
        if (!formData.image.url || !formData.image.key) {
            return toast.error("Please upload an image", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }

        setSubmitting(true);
        try {
            const method = editBanner ? "PATCH" : "POST";
            const response = await fetch("/api/addNews", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, id: editBanner }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`News ${editBanner ? "updated" : "added"} successfully`, { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                setEditBanner(null);

                const updatedBanners = await fetch("/api/addNews").then((res) => res.json());
                setBanners(updatedBanners);

                setFormData({
                    title: "",
                    date: "",
                    description: "",
                    order: updatedBanners.length > 0 ? Math.max(...updatedBanners.map(b => b.order)) + 1 : 1,
                    image: { url: "", key: "" },
                });
            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (banner) => {
        setEditBanner(banner._id);
        setFormData({
            title: banner.title,
            date: banner.date,
            description: banner.description,
            order: banner.order,
            image: banner.image,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch("/api/addNews", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("News deleted successfully", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                const updatedBanners = await fetch("/api/addNews").then((res) => res.json());
                setBanners(updatedBanners);
            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
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

    const handleDeleteImage = () => {
        setFormData(prev => ({ ...prev, image: { url: '', key: '' } }));
    };

    const fileInputRef = useRef(null);

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">News & Announcements</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage news articles, announcements, and updates for your users.</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Form Section */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <Newspaper className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    {editBanner ? "Edit News Article" : "Add New Article"}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500">Provide the details and an image for the news article.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload */}
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Article Image <span className="text-red-500">*</span></Label>
                                    <div className="mt-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            ref={fileInputRef}
                                            className="hidden"
                                        />
                                        
                                        {!formData.image.url ? (
                                            <div 
                                                onClick={() => !uploading && fileInputRef.current?.click()}
                                                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all ${uploading ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 cursor-pointer'}`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${uploading ? 'bg-slate-100' : 'bg-blue-50 text-blue-600'}`}>
                                                    {uploading ? (
                                                        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-slate-700">
                                                        {uploading ? 'Uploading image...' : 'Click to upload image'}
                                                    </p>
                                                    {!uploading && (
                                                        <p className="text-xs text-slate-500 mt-1">Recommended: 16:9 ratio, High resolution</p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-slate-100 shadow-sm group aspect-[16/9]">
                                                <Image
                                                    src={formData.image.url}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                                <Button
                                                    type="button"
                                                    onClick={handleDeleteImage}
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-3 right-3 h-8 w-8 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium text-slate-600 ml-1">Title <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                name="title" 
                                                placeholder="e.g. New Product Launch!" 
                                                value={formData.title} 
                                                onChange={handleInputChange} 
                                                className="h-11 pl-10 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium text-slate-600 ml-1">Date <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                name="date" 
                                                type="date"
                                                value={formData.date} 
                                                onChange={handleInputChange} 
                                                className="h-11 pl-10 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50 text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Description <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                        <Textarea
                                            name="description"
                                            placeholder="Write the full news article content here..."
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={5}
                                            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50 outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2 max-w-xs">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Display Order</Label>
                                    <div className="relative">
                                        <ListOrdered className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input 
                                            name="order" 
                                            type="number" 
                                            value={formData.order} 
                                            readOnly 
                                            className="h-11 pl-10 rounded-xl border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex flex-wrap items-center justify-end gap-3">
                                    {editBanner && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setEditBanner(null);
                                                setFormData({
                                                    title: "",
                                                    date: "",
                                                    description: "",
                                                    order: banners.length > 0 ? Math.max(...banners.map(b => b.order)) + 1 : 1,
                                                    image: { url: "", key: "" },
                                                });
                                            }}
                                            className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                                        >
                                            Cancel Editing
                                        </Button>
                                    )}
                                    <Button type="submit" className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all hover:shadow-md" disabled={submitting || uploading}>
                                        {submitting ? "Saving..." : editBanner ? "Update Article" : "Publish Article"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Section */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden h-full">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <FileImage className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">Published News</CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 mt-1">Manage your existing news articles and announcements.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                        <TableRow className="hover:bg-transparent border-0">
                                            <TableHead className="text-slate-500 font-medium h-12 pl-6 w-32">Image</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12">Article Details</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12 text-center w-24">Order</TableHead>
                                            <TableHead className="text-slate-500 font-medium text-right pr-6 h-12 w-32">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {banners.length > 0 ? (
                                            banners.map((banner) => (
                                                <TableRow key={banner._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                                    <TableCell className="pl-6 py-4 align-top">
                                                        <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                                                            {banner.image?.url ? (
                                                                <Image 
                                                                    src={banner.image.url} 
                                                                    alt={banner.title || "News image"} 
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <ImageIcon className="w-6 h-6 text-slate-300" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 align-top">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-slate-800">{banner.title}</span>
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                                                    {banner.date}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-500 line-clamp-2 max-w-xl">
                                                                {banner.description}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center py-4 align-top">
                                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 text-slate-600 text-sm font-medium border border-slate-100">
                                                            {banner.order}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4 align-top">
                                                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                onClick={() => handleEdit(banner)}
                                                                className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                onClick={() => { setShowDeleteModal(true); setBannerToDelete(banner._id); }}
                                                                className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                            >
                                                                <Trash2Icon className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-32 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                                        <Newspaper className="w-8 h-8 mb-2 text-slate-300" />
                                                        <p>No news articles found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="rounded-[24px] p-6 border-slate-100 shadow-xl bg-white max-w-md font-sans gap-0">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-semibold text-slate-800">Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-slate-600 mb-6">Are you sure you want to delete this news article? This action cannot be undone.</p>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={cancelDelete} className="h-11 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete} className="h-11 rounded-xl px-6 font-medium">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default News;