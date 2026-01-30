'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Loader2, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

const CreateDiscount = ({ propertyData }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            couponCode: '',
            amount: '',
            percentage: '',
            startDate: '',
            endDate: ''
        }
    });

    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Delete Modal State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [discountToDelete, setDiscountToDelete] = useState(null);

    // Edit State
    const [editingDiscount, setEditingDiscount] = useState(null);

    useEffect(() => {
        if (propertyData) {
            fetchDiscounts();
        }
    }, [propertyData]);

    const fetchDiscounts = async () => {
        if (!propertyData?._id) return;
        setLoading(true);
        try {
            const propertyId = propertyData._id.$oid || propertyData._id;
            const response = await fetch(`/api/discounts?propertyId=${propertyId}`);
            const data = await response.json();
            if (data.success) {
                setDiscounts(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
            toast.error('Failed to load discounts');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (discount) => {
        setEditingDiscount(discount);
        setValue('couponCode', discount.couponCode);
        setValue('amount', discount.amount);
        setValue('percentage', discount.percentage);
        // Format dates for input type="date"
        setValue('startDate', new Date(discount.startDate).toISOString().split('T')[0]);
        setValue('endDate', new Date(discount.endDate).toISOString().split('T')[0]);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingDiscount(null);
        reset();
    };

    const onSubmit = async (data) => {
        if (!propertyData?._id) {
            toast.error('Property ID not found');
            return;
        }

        if (!data.amount && !data.percentage) {
            toast.error('Please specify either Amount or Percentage');
            return;
        }

        setSubmitting(true);
        try {
            const propertyId = propertyData._id.$oid || propertyData._id;

            let url = '/api/discounts';
            let method = 'POST';
            let body = {
                propertyId,
                couponCode: data.couponCode,
                amount: data.amount ? parseFloat(data.amount) : null,
                percentage: data.percentage ? parseFloat(data.percentage) : null,
                startDate: data.startDate,
                endDate: data.endDate
            };

            if (editingDiscount) {
                method = 'PUT';
                body.id = editingDiscount._id;
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const result = await response.json();

            if (result.success) {
                toast.success(editingDiscount ? 'Discount updated successfully' : 'Discount created successfully');
                reset();
                setEditingDiscount(null);
                fetchDiscounts();
            } else {
                toast.error(result.message || 'Failed to save discount');
            }
        } catch (error) {
            console.error('Error saving discount:', error);
            toast.error('Failed to save discount');
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteDialog = (discount) => {
        setDiscountToDelete(discount);
        setShowDeleteDialog(true);
    };

    const cancelDelete = () => {
        setDiscountToDelete(null);
        setShowDeleteDialog(false);
    };

    const confirmDelete = async () => {
        if (!discountToDelete) return;

        try {
            const response = await fetch(`/api/discounts?id=${discountToDelete._id}`, {
                method: 'DELETE'
            });
            const result = await response.json();

            if (result.success) {
                toast.success('Discount deleted successfully');
                setDiscounts(prev => prev.filter(d => d._id !== discountToDelete._id));
                setShowDeleteDialog(false);
                setDiscountToDelete(null);
            } else {
                toast.error(result.message || 'Failed to delete');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete discount');
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const response = await fetch('/api/discounts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    isActive: !currentStatus
                })
            });
            const result = await response.json();

            if (result.success) {
                toast.success(`Discount ${!currentStatus ? 'activated' : 'deactivated'}`);
                setDiscounts(prev => prev.map(d =>
                    d._id === id ? { ...d, isActive: !currentStatus } : d
                ));
            }
        } catch (error) {
            console.error('Status update error:', error);
            toast.error('Failed to update status');
        }
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white">{editingDiscount ? 'Edit' : 'Create'} Discount Management</h1>
                <p className="text-white font-semibold mt-2">Set standard pricing for normal booking periods</p>
            </div>
            {/* <div>
                <h1 className="text-3xl font-bold text-gray-900"></h1>
                <p className="text-sm text-gray-600">{editingDiscount ? `Editing ${editingDiscount.couponCode}` : 'For Offer And Increase Sales'}</p>
            </div> */}

            {/* Create Discount Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        {/* Coupon Code and Amount Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="couponCode" className="block text-sm font-semibold text-gray-700 mb-2">
                                    {editingDiscount ? 'Edit Discount Coupon Code' : 'Create Discount Coupon Code'}
                                </Label>
                                <Input
                                    id="couponCode"
                                    type="text"
                                    placeholder="Coupon Code"
                                    {...register('couponCode', { required: 'Coupon Code is required' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 uppercase"
                                />
                                {errors.couponCode && <span className="text-red-500 text-xs">{errors.couponCode.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Amount (INR)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Amount"
                                    {...register('amount', {
                                        onChange: (e) => {
                                            if (e.target.value) setValue('percentage', '');
                                        }
                                    })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                                />
                            </div>
                            <div>
                                <Label htmlFor="percentage" className="block text-sm font-semibold text-gray-700 mb-2">
                                    % Percentage
                                </Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-semibold whitespace-nowrap">Or</span>
                                    <Input
                                        id="percentage"
                                        type="number"
                                        placeholder="% Value"
                                        {...register('percentage', {
                                            onChange: (e) => {
                                                if (e.target.value) setValue('amount', '');
                                            }
                                        })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                                        max="100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date Range Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Coupon Code Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    {...register('startDate', { required: 'Start date is required' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                                {errors.startDate && <span className="text-red-500 text-xs">{errors.startDate.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Coupon Code End Date
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    {...register('endDate', { required: 'End date is required' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                                {errors.endDate && <span className="text-red-500 text-xs">{errors.endDate.message}</span>}
                            </div>
                        </div>

                        {/* Add Data Button */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-full font-semibold text-lg flex items-center gap-2"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : (editingDiscount ? 'Update Discount' : 'Create Discount')}
                            </Button>

                            {editingDiscount && (
                                <Button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-6 rounded-full font-semibold text-lg"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </form>

            {/* Discounts Table */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">View all active, upcoming, and expired discounts.</p>
                    <Button variant="outline" size="sm" onClick={fetchDiscounts} disabled={loading}>
                        <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                <th className="p-4 text-left font-semibold text-gray-700">S.No.</th>
                                <th className="p-4 text-left font-semibold text-gray-700">Coupon Code</th>
                                <th className="p-4 text-left font-semibold text-gray-700">Value</th>
                                <th className="p-4 text-left font-semibold text-gray-700">Date Range</th>
                                <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                                <th className="p-4 text-center font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">Loading discounts...</td>
                                </tr>
                            ) : discounts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No discounts found. Create one above!</td>
                                </tr>
                            ) : (
                                discounts.map((discount, index) => (
                                    <tr
                                        key={discount._id}
                                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${!discount.isActive ? 'bg-gray-50 opacity-75' : 'bg-white'}`}
                                    >
                                        <td className="p-4 text-sm">{index + 1}</td>
                                        <td className="p-4 text-sm font-bold text-blue-600">{discount.couponCode}</td>
                                        <td className="p-4 text-sm">
                                            {discount.amount ? `₹${discount.amount}` : `${discount.percentage}%`}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(discount.startDate).toLocaleDateString()} - <br />
                                            {new Date(discount.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm">
                                            {(() => {
                                                const now = new Date();
                                                const start = new Date(discount.startDate);
                                                const end = new Date(discount.endDate);
                                                // Reset time part for accurate date comparison
                                                now.setHours(0, 0, 0, 0);
                                                start.setHours(0, 0, 0, 0);
                                                end.setHours(0, 0, 0, 0);

                                                let statusLabel = 'Active';
                                                let statusClass = 'bg-green-100 text-green-700';

                                                if (!discount.isActive) {
                                                    statusLabel = 'Inactive';
                                                    statusClass = 'bg-gray-100 text-gray-700';
                                                } else if (now > end) {
                                                    statusLabel = 'Expired';
                                                    statusClass = 'bg-red-100 text-red-700';
                                                } else if (now < start) {
                                                    statusLabel = 'Upcoming';
                                                    statusClass = 'bg-blue-100 text-blue-700';
                                                }

                                                return (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                                                        {statusLabel}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={discount.isActive}
                                                        onChange={() => toggleStatus(discount._id, discount.isActive)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                                </label>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleEdit(discount)}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(discount)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Discount</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-700">
                            Are you sure you want to delete the discount <strong className="text-gray-900">"{discountToDelete?.couponCode}"</strong>?
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={cancelDelete}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateDiscount;
