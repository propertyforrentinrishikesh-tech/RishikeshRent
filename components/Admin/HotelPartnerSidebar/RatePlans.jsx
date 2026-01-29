"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Minus, Edit, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import toast from 'react-hot-toast'

const RatePlans = ({ propertyData }) => {
    // Form States
    const [planName, setPlanName] = useState('')
    const [selectedPlans, setSelectedPlans] = useState({
        ep: false,
        cp: false,
        map: false,
        ap: false
    })
    const [numberOfDays, setNumberOfDays] = useState(0)

    // UI States
    const [ratePlans, setRatePlans] = useState([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [editingPlan, setEditingPlan] = useState(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [planToDelete, setPlanToDelete] = useState(null)

    // Fetch rate plans on component mount
    useEffect(() => {
        if (propertyData?._id) {
            fetchRatePlans()
        }
    }, [propertyData])

    const fetchRatePlans = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/rate-plans?propertyId=${propertyData._id}`
            )
            const data = await response.json()

            if (data.success) {
                setRatePlans(data.data)
            }
        } catch (error) {
            console.error('Error fetching rate plans:', error)
            toast.error('Failed to fetch rate plans')
        } finally {
            setLoading(false)
        }
    }

    const togglePlan = (plan) => {
        setSelectedPlans(prev => ({
            ...prev,
            [plan]: !prev[plan]
        }))
    }

    const incrementDays = () => {
        setNumberOfDays(prev => prev + 1)
    }

    const decrementDays = () => {
        setNumberOfDays(prev => Math.max(0, prev - 1))
    }

    const resetForm = () => {
        setPlanName('')
        setSelectedPlans({ ep: false, cp: false, map: false, ap: false })
        setNumberOfDays(0)
        setEditingPlan(null)
    }

    const handleEdit = (plan) => {
        setPlanName(plan.planName)
        setSelectedPlans(plan.planTypes)
        setNumberOfDays(plan.numberOfDays)
        setEditingPlan(plan)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const openDeleteDialog = (plan) => {
        setPlanToDelete(plan)
        setShowDeleteDialog(true)
    }

    const cancelDelete = () => {
        setPlanToDelete(null)
        setShowDeleteDialog(false)
    }

    const confirmDelete = async () => {
        if (!planToDelete) return

        try {
            const response = await fetch(
                `/api/rate-plans?planId=${planToDelete._id}&propertyId=${propertyData._id}`,
                { method: 'DELETE' }
            )
            const data = await response.json()

            if (data.success) {
                toast.success('Rate plan deleted successfully')
                fetchRatePlans()
                setShowDeleteDialog(false)
                setPlanToDelete(null)
            } else {
                toast.error(data.message || 'Failed to delete rate plan')
            }
        } catch (error) {
            console.error('Error deleting rate plan:', error)
            toast.error('Failed to delete rate plan')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!planName.trim()) {
            toast.error('Please enter a plan name')
            return
        }

        const hasSelectedPlan = selectedPlans.ep || selectedPlans.cp ||
            selectedPlans.map || selectedPlans.ap

        if (!hasSelectedPlan) {
            toast.error('Please select at least one plan type (EP, CP, MAP, or AP)')
            return
        }

        setSaving(true)
        try {
            const planData = {
                propertyId: propertyData._id,
                planName: planName.trim(),
                planTypes: selectedPlans,
                numberOfDays,
                createdBy: propertyData._id
            }

            let response
            if (editingPlan) {
                // Update existing plan
                response = await fetch('/api/rate-plans', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...planData,
                        planId: editingPlan._id,
                        updatedBy: propertyData._id
                    })
                })
            } else {
                // Create new plan
                response = await fetch('/api/rate-plans', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(planData)
                })
            }

            const data = await response.json()

            if (data.success) {
                toast.success(editingPlan ? 'Rate plan updated successfully' : 'Rate plan created successfully')
                resetForm()
                fetchRatePlans()
            } else {
                toast.error(data.message || 'Failed to save rate plan')
            }
        } catch (error) {
            console.error('Error saving rate plan:', error)
            toast.error('Failed to save rate plan')
        } finally {
            setSaving(false)
        }
    }

    const getSelectedPlanTypesText = (planTypes) => {
        const types = []
        if (planTypes.ep) types.push('EP')
        if (planTypes.cp) types.push('CP')
        if (planTypes.map) types.push('MAP')
        if (planTypes.ap) types.push('AP')
        return types.join(', ') || '-'
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white">Rate Plans Management</h1>
                <p className="text-teal-100 mt-2">Create and manage promotional packages for your property</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Create Plan / Package Section */}
                <Card className="shadow-md border-2 border-teal-200">
                    <CardContent className="p-6 space-y-4">
                        <div className="bg-teal-500 p-4 rounded-lg">
                            <h2 className="text-xl font-bold text-white">
                                {editingPlan ? 'Edit Plan / Package' : 'Create Plan / Package'}
                            </h2>
                            <p className="text-sm text-teal-100">
                                Define promotional packages with specific meal plans and duration
                            </p>
                        </div>

                        {/* Plan Name Input */}
                        <div>
                            <Label htmlFor="planName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Plan / Package Name *
                            </Label>
                            <Input
                                id="planName"
                                type="text"
                                placeholder="e.g., Weekend Getaway, Honeymoon Package"
                                value={planName}
                                onChange={(e) => setPlanName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        {/* Plan Based On Type */}
                        <div>
                            <div className="bg-teal-100 p-3 rounded-lg mb-3 border-2 border-teal-300">
                                <h3 className="font-bold text-teal-900">Plan Based On Type *</h3>
                                <p className="text-xs text-teal-700">Select the meal plans included in this package</p>
                            </div>

                            {/* Plan Type Buttons */}
                            <div className="grid grid-cols-4 gap-3">
                                <button
                                    type="button"
                                    onClick={() => togglePlan('ep')}
                                    className={`py-3 px-4 rounded-lg font-bold transition-all ${selectedPlans.ep
                                        ? 'bg-teal-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    EP (Room Only)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => togglePlan('cp')}
                                    className={`py-3 px-4 rounded-lg font-bold transition-all ${selectedPlans.cp
                                        ? 'bg-teal-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    CP (+ Breakfast)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => togglePlan('map')}
                                    className={`py-3 px-4 rounded-lg font-bold transition-all ${selectedPlans.map
                                        ? 'bg-teal-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    MAP (B+D)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => togglePlan('ap')}
                                    className={`py-3 px-4 rounded-lg font-bold transition-all ${selectedPlans.ap
                                        ? 'bg-teal-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    AP (All Meals)
                                </button>
                            </div>
                        </div>

                        {/* Number Of Days Counter */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Minimum Number of Days
                            </Label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={decrementDays}
                                    className="w-16 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors shadow-md"
                                >
                                    <Minus className="h-5 w-5" />
                                </button>
                                <div className="flex-1 bg-teal-100 border-2 border-teal-300 text-gray-900 text-center py-3 rounded-lg font-bold">
                                    {numberOfDays} {numberOfDays === 1 ? 'Day' : 'Days'}
                                </div>
                                <button
                                    type="button"
                                    onClick={incrementDays}
                                    className="w-16 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors shadow-md"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Requirement Note */}
                        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                            <p className="text-sm text-gray-700">
                                <strong className="text-blue-900">ℹ️ Requirement (Restriction Based Rate):</strong>
                                <br />
                                This defines the minimum stay duration required for this rate plan.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-6 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        {editingPlan ? 'Updating...' : 'Saving...'}
                                    </>
                                ) : (
                                    editingPlan ? 'Update Rate Plan' : 'Create Rate Plan'
                                )}
                            </Button>
                            {editingPlan && (
                                <Button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-6 bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg rounded-lg transition-colors"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Log Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Rate Plans Log</h2>
                        {loading && <Loader2 className="h-5 w-5 animate-spin text-teal-600" />}
                    </div>

                    {ratePlans.length === 0 && !loading ? (
                        <Card className="border-2 border-gray-200">
                            <CardContent className="p-8 text-center">
                                <p className="text-gray-500 text-lg">No rate plans created yet. Create your first plan above!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="grid grid-cols-5 gap-2">
                                <div className="bg-teal-500 p-3 rounded-lg font-bold text-white text-center">
                                    Plan / Package Name 
                                </div>
                                <div className="bg-teal-500 p-3 rounded-lg font-bold text-white text-center">
                                    Plan Types
                                </div>
                                <div className="bg-teal-500 p-3 rounded-lg font-bold text-white text-center">
                                    Days
                                </div>
                                <div className="bg-teal-500 p-3 rounded-lg font-bold text-white text-center">
                                    Status
                                </div>
                                <div className="bg-teal-500 p-3 rounded-lg font-bold text-white text-center">
                                    Actions
                                </div>
                            </div>

                            {/* Table Rows */}
                            {ratePlans.map((plan, index) => (
                                <div key={plan._id} className="grid grid-cols-5 gap-2">
                                    <div className={`p-3 rounded-lg text-center font-semibold ${index % 2 === 0 ? 'bg-teal-100' : 'bg-teal-200'
                                        }`}>
                                        {plan.planName}
                                    </div>
                                    <div className={`p-3 rounded-lg text-center ${index % 2 === 0 ? 'bg-teal-100' : 'bg-teal-200'
                                        }`}>
                                        {getSelectedPlanTypesText(plan.planTypes)}
                                    </div>
                                    <div className={`p-3 rounded-lg text-center font-semibold ${index % 2 === 0 ? 'bg-teal-100' : 'bg-teal-200'
                                        }`}>
                                        {plan.numberOfDays}
                                    </div>
                                    <div className={`p-3 rounded-lg text-center ${index % 2 === 0 ? 'bg-teal-100' : 'bg-teal-200'
                                        }`}>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${plan.isActive
                                            ? 'bg-green-500 text-white'
                                            : 'bg-red-500 text-white'
                                            }`}>
                                            {plan.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className={`p-3 rounded-lg text-center flex items-center justify-center gap-2 ${index % 2 === 0 ? 'bg-teal-100' : 'bg-teal-200'
                                        }`}>
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(plan)}
                                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openDeleteDialog(plan)}
                                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </form>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Rate Plan</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-700">
                            Are you sure you want to delete the rate plan <strong className="text-gray-900">"{planToDelete?.planName}"</strong>?
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
    )
}

export default RatePlans
