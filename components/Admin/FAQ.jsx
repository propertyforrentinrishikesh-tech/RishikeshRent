"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { PencilIcon, Trash2Icon, LayoutTemplate, HelpCircle, Eye, AlignLeft, Type, Folder } from "lucide-react";

const FAQ = () => {
    const [groupedFaqs, setGroupedFaqs] = useState({});
    const categories = ["General", "Returns", "Gift", "Refunds", "Payments", "Shipping"];
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState(null);
    const [formData, setFormData] = useState({
        question: "", 
        answer: "",
        category: "General",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await fetch("/api/faqs");
                const data = await response.json();
                if (data && typeof data === "object" && !Array.isArray(data)) {
                    setGroupedFaqs(data);
                } else {
                    const emptyGrouped = {};
                    categories.forEach(cat => { emptyGrouped[cat] = [] });
                    setGroupedFaqs(emptyGrouped);
                }
            } catch (error) {
                toast.error("Failed to fetch FAQs", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        };
        fetchFaqs();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.question.trim() || !formData.answer.trim()) {
            return toast.error("Please fill in both question and answer fields", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }

        setSubmitting(true);
        try {
            const method = faqToDelete ? "PATCH" : "POST";
            const payload = {
                ...formData,
                id: faqToDelete,
            };
            const response = await fetch("/api/faqs", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`FAQ ${faqToDelete ? "updated" : "added"} successfully`, { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                setFaqToDelete(null);

                const updatedFaqs = await fetch("/api/faqs").then((res) => res.json());
                setGroupedFaqs(updatedFaqs);

                setFormData({
                    question: "",
                    answer: "",
                    category: "General",
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

    const handleDelete = async (idOrCategory) => {
        try {
            let response;
            if (categories.includes(idOrCategory)) {
                // Delete all in category
                response = await fetch(`/api/faqs?category=${encodeURIComponent(idOrCategory)}`, {
                    method: "DELETE",
                });
            } else {
                // Delete single FAQ
                response = await fetch("/api/faqs", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: idOrCategory }),
                });
            }
            const data = await response.json();

            if (response.ok) {
                toast.success("FAQ deleted successfully", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                const updated = await fetch("/api/faqs").then((res) => res.json());
                setGroupedFaqs(updated);
            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
    };

    const confirmDelete = async () => {
        if (faqToDelete) {
            await handleDelete(faqToDelete);
            setFaqToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setFaqToDelete(null);
    };

    const isEditMode = faqToDelete && !categories.includes(faqToDelete);

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Frequently Asked Questions</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage FAQs and categories to assist your customers.</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Form Section */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    {isEditMode ? "Edit FAQ" : "Add New FAQ"}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500">Provide the question, answer, and select a relevant category.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium text-slate-600 ml-1">Category <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Folder className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                                            <Select
                                                value={formData.category || 'General'}
                                                onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}
                                            >
                                                <SelectTrigger className="w-full h-11 pl-10 rounded-xl border-slate-200 focus:ring-slate-200 focus:border-slate-400 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat} value={cat} className="rounded-lg cursor-pointer hover:bg-slate-50">{cat}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-sm font-medium text-slate-600 ml-1">Question <span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <HelpCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input 
                                                name="question" 
                                                placeholder="e.g. How long does shipping take?" 
                                                value={formData.question || ''} 
                                                onChange={handleInputChange} 
                                                className="h-11 pl-10 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Answer <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                        <textarea
                                            name="answer"
                                            placeholder="Provide a detailed answer here..."
                                            value={formData.answer || ''}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50 outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex flex-wrap items-center justify-end gap-3">
                                    {isEditMode && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setFaqToDelete(null);
                                                setFormData({ question: "", answer: "", category: "General" });
                                            }}
                                            className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                                        >
                                            Cancel Editing
                                        </Button>
                                    )}
                                    <Button type="submit" className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all hover:shadow-md" disabled={submitting}>
                                        {submitting ? "Saving..." : isEditMode ? "Update FAQ" : "Add FAQ"}
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
                                <HelpCircle className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">FAQ Categories</CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 mt-1">Select a category to view and manage its questions.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                        <TableRow className="hover:bg-transparent border-0">
                                            <TableHead className="text-slate-500 font-medium h-12 pl-6">Category Name</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12 text-center w-32">Total FAQs</TableHead>
                                            <TableHead className="text-slate-500 font-medium text-right pr-6 h-12 w-48">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.map((cat) => {
                                            const categoryCount = groupedFaqs[cat] ? groupedFaqs[cat].length : 0;
                                            return (
                                                <TableRow key={cat} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                                    <TableCell className="pl-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                                <Folder className="w-5 h-5" />
                                                            </div>
                                                            <span className="font-semibold text-slate-700">{cat}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center py-4">
                                                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/50">
                                                            {categoryCount} {categoryCount === 1 ? 'item' : 'items'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                onClick={() => { setSelectedCategory(cat); setModalOpen(true); }}
                                                                className="h-9 px-3 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium shadow-none"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2 text-slate-400" />
                                                                View
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                onClick={() => { setFaqToDelete(cat); setShowDeleteModal(true); }}
                                                                className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                                disabled={categoryCount === 0}
                                                            >
                                                                <Trash2Icon className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Modal for showing Q&A of selected category */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="rounded-[24px] p-0 border-slate-100 shadow-xl bg-white max-w-2xl font-sans overflow-hidden">
                    <DialogHeader className="px-6 py-5 border-b border-slate-50 bg-slate-50/50">
                        <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <Folder className="w-5 h-5 text-blue-500" />
                            {selectedCategory} FAQs
                        </DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
                        {(groupedFaqs[selectedCategory] && groupedFaqs[selectedCategory].length > 0) ? (
                            groupedFaqs[selectedCategory].map((faq, index) => (
                                <div key={faq._id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:border-slate-200 transition-colors group relative">
                                    <div className="absolute top-5 right-5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                            onClick={() => {
                                                setFormData({ question: faq.question, answer: faq.answer, category: faq.category });
                                                setFaqToDelete(faq._id);
                                                setModalOpen(false);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        >
                                            <PencilIcon className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            onClick={() => {
                                                setFaqToDelete(faq._id);
                                                setShowDeleteModal(true);
                                                setModalOpen(false);
                                            }}
                                        >
                                            <Trash2Icon className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    <div className="flex gap-4 pr-20">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-sm font-semibold text-slate-500">{index + 1}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-slate-800 leading-snug">{faq.question}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100/50">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <HelpCircle className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-800 mb-1">No FAQs Found</h3>
                                <p className="text-slate-500 text-sm">Add a new question in the {selectedCategory} category to get started.</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="px-6 py-4 border-t border-slate-50 bg-slate-50/50">
                        <Button variant="outline" onClick={() => setModalOpen(false)} className="h-10 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-white font-medium">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="rounded-[24px] p-6 border-slate-100 shadow-xl bg-white max-w-md font-sans gap-0">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-semibold text-slate-800">Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="text-slate-600 mb-6">
                        {categories.includes(faqToDelete) 
                            ? `Are you sure you want to delete ALL questions in the "${faqToDelete}" category? This action cannot be undone.` 
                            : "Are you sure you want to delete this FAQ? This action cannot be undone."}
                    </p>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={cancelDelete} className="h-11 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete} className="h-11 rounded-xl px-6 font-medium">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FAQ;