"use client"
import React, { useState, useEffect } from 'react'
import { Edit, Trash, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'

const Restrictions = ({ propertyData }) => {
    const [commissionRate, setCommissionRate] = useState(15)
    const [notes, setNotes] = useState('')
    const [commissionRates, setCommissionRates] = useState([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    // Edit/Delete States
    const [editingRate, setEditingRate] = useState(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [rateToDelete, setRateToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    // Fetch commission rates
    useEffect(() => {
        if (propertyData?._id) {
            fetchCommissionRates()
        }
    }, [propertyData])

    const fetchCommissionRates = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/commission-rates?propertyId=${propertyData._id}`)
            const data = await response.json()

            if (data.success) {
                setCommissionRates(data.data)
            } else {
                toast.error(data.message || 'Failed to fetch commission rates')
            }
        } catch (error) {
            console.error('Error fetching commission rates:', error)
            toast.error('Failed to fetch commission rates')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!propertyData?._id) {
            toast.error('Property data not found')
            return
        }

        setSaving(true)
        try {
            const rateData = {
                propertyId: propertyData._id,
                rate: commissionRate,
                effectiveDate: new Date().toISOString(), // Set to current date automatically
                notes
            }

            // Add rateId if editing
            if (editingRate) {
                rateData.rateId = editingRate._id
            }

            const url = '/api/commission-rates'
            const method = editingRate ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rateData)
            })

            const data = await response.json()

            if (data.success) {
                toast.success(editingRate ? 'Commission rate updated!' : 'Commission rate saved!')
                resetForm()
                fetchCommissionRates()
            } else {
                toast.error(data.message || 'Failed to save commission rate')
            }
        } catch (error) {
            console.error('Error saving commission rate:', error)
            toast.error('Failed to save commission rate')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (rate) => {
        setEditingRate(rate)
        setCommissionRate(rate.rate)
        setNotes(rate.notes || '')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEdit = () => {
        resetForm()
    }

    const resetForm = () => {
        setCommissionRate(15)
        setNotes('')
        setEditingRate(null)
    }

    const openDeleteDialog = (rate) => {
        setRateToDelete(rate)
        setShowDeleteDialog(true)
    }

    const cancelDelete = () => {
        setRateToDelete(null)
        setShowDeleteDialog(false)
    }

    const confirmDelete = async () => {
        if (!rateToDelete) return

        setDeleting(true)
        try {
            const response = await fetch(`/api/commission-rates?rateId=${rateToDelete._id}&propertyId=${propertyData._id}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (data.success) {
                toast.success('Commission rate deleted successfully!')
                fetchCommissionRates()
                cancelDelete()
            } else {
                toast.error(data.message || 'Failed to delete commission rate')
            }
        } catch (error) {
            console.error('Error deleting commission rate:', error)
            toast.error('Failed to delete commission rate')
        } finally {
            setDeleting(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white">OTA Commission Rate</h1>
                <p className="text-orange-100 mt-2">Set and manage your commission rates</p>
            </div>

            {/* Edit Mode Indicator */}
            {editingRate && (
                <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-blue-600" />
                            <span className="text-blue-800 font-bold">
                                Editing Commission Rate: {editingRate.rate}%
                            </span>
                        </div>
                        <Button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Form Card */}
            <Card className="shadow-lg border-2 border-indigo-200">
                <CardContent className="p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Set OTA Commission Rate</h2>
                        <p className="text-sm text-gray-600 mt-1">Significant fees (10-30%) for bookings</p>
                    </div>

                    {/* Slider Section */}
                    <div className="space-y-4">
                        {/* Rate Display */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-3xl font-bold text-gray-900">{commissionRate}%</span>
                            <div className="flex gap-2">
                                <span className="text-sm text-gray-600">Based</span>
                                <span className="text-sm text-gray-600">High Growth</span>
                            </div>
                        </div>

                        {/* Slider */}
                        <div className="relative">
                            <input
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                value={commissionRate}
                                onChange={(e) => setCommissionRate(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(commissionRate / 30) * 100}%, #e5e7eb ${(commissionRate / 30) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                            {/* Slider Labels */}
                            <div className="flex justify-between mt-2">
                                <span className="text-sm font-bold text-gray-700">0%</span>
                                <span className="text-sm font-bold text-gray-700">15%</span>
                                <span className="text-sm font-bold text-gray-700">30%</span>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Notes (Optional)
                            </Label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes about this rate..."
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Save Button */}
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full h-14 text-xl bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg transition-all"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                                    {editingRate ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                editingRate ? 'Update' : 'Save'
                            )}
                        </Button>

                        {/* Cancel Edit Button */}
                        {editingRate && (
                            <Button
                                type="button"
                                onClick={cancelEdit}
                                disabled={saving}
                                className="w-full h-14 text-xl bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-full shadow-lg transition-all"
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </div>

                    {/* Information Section */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-bold text-gray-900 mb-2">
                            Typical Commission Ranges:
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li><strong>Major:</strong> Often 15% - 25%, with preferred placements costing more.</li>
                            <li><strong>Domestic/Local Agents:</strong> Around 7% - 10%.</li>
                            <li><strong>Boutique/Independent Hotels:</strong> Negotiable, often around 10-20%.</li>
                            <li><strong>Luxury Properties:</strong> 8% - 15%, can be negotiated.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Commission Log Table */}
            <div className="space-y-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-white">Commission Log Rate</h2>
                </div>

                {/* Table */}
                <Card className="shadow-lg">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-orange-400">
                                        <th className="p-4 text-left font-bold text-gray-900 border-r-2 border-white">
                                            Update Date
                                        </th>
                                        <th className="p-4 text-center font-bold text-gray-900 border-r-2 border-white">
                                            Value
                                        </th>
                                        <th className="p-4 text-center font-bold text-gray-900 border-r-2 border-white">
                                            %
                                        </th>
                                        <th className="p-4 text-center font-bold text-gray-900">
                                            <Edit className="h-5 w-5 inline mr-1" /> Edit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center">
                                                <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500" />
                                            </td>
                                        </tr>
                                    ) : commissionRates.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="p-8 text-center text-gray-500">
                                                No commission rates found. Add your first rate above!
                                            </td>
                                        </tr>
                                    ) : (
                                        commissionRates.map((rate, index) => (
                                            <tr
                                                key={rate._id}
                                                className={index % 2 === 0 ? 'bg-orange-200' : 'bg-orange-100'}
                                            >
                                                <td className="p-4 border-r border-gray-300 font-semibold">
                                                    {formatDate(rate.effectiveDate)}
                                                </td>
                                                <td className="p-4 text-center border-r border-gray-300 font-bold text-lg">
                                                    {rate.rate}
                                                </td>
                                                <td className="p-4 text-center border-r border-gray-300 font-bold text-lg">
                                                    {rate.rate}%
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(rate)}
                                                            className="p-2 bg-orange-500 rounded transition-colors flex items-center gap-2 text-white font-bold cursor-pointer px-2 py-1 border border-black"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-5 w-5 text-white" />Edit
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteDialog(rate)}
                                                            className="p-2 bg-red-500 hover:text-white rounded transition-colors flex items-center gap-2 text-white font-bold cursor-pointer px-2 py-1 border border-black"
                                                            title="Delete"
                                                        >
                                                            <Trash className="h-5 w-5 text-white" />Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Commission Rate</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this commission rate? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {rateToDelete && (
                        <div className="py-4">
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Rate:</strong> {rateToDelete.rate}%
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Effective Date:</strong> {formatDate(rateToDelete.effectiveDate)}
                            </p>
                            {rateToDelete.notes && (
                                <p className="text-sm text-gray-600">
                                    <strong>Notes:</strong> {rateToDelete.notes}
                                </p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            onClick={cancelDelete}
                            variant="outline"
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Custom Slider Styles */}
            <style jsx>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #10b981;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #10b981;
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    )
}

export default Restrictions
