"use client"
import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Upload, Trash2, Loader2, Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import toast from 'react-hot-toast'

const PlanPriceUpdate = ({ propertyData }) => {
    // Form States
    const [selectedPlan, setSelectedPlan] = useState('')
    const [selectedPlanType, setSelectedPlanType] = useState('')
    const [selectedRoom, setSelectedRoom] = useState('')
    const [image, setImage] = useState({ url: '', key: '' })
    const [sideTagLine, setSideTagLine] = useState('')
    const [description, setDescription] = useState('')

    // Data States
    const [ratePlans, setRatePlans] = useState([])
    const [planPricings, setPlanPricings] = useState([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    // Pricing States
    const [epPlan, setEpPlan] = useState({ person1: '', person2: '' })
    const [cpPlan, setCpPlan] = useState({ person1: '', person2: '' })
    const [mapPlan, setMapPlan] = useState({ person1: '', person2: '' })
    const [apPlan, setApPlan] = useState({ person1: '', person2: '' })
    const [expandedPlans, setExpandedPlans] = useState({
        ep: true,
        cp: false,
        map: false,
        ap: false
    })
    const [expandedCategories, setExpandedCategories] = useState({})

    // Modal States
    const [showModal, setShowModal] = useState(false)
    const [selectedPackageData, setSelectedPackageData] = useState(null)

    // Edit/Delete States
    const [editingPricing, setEditingPricing] = useState(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [packageToDelete, setPackageToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)

    // Refs
    const fileInputRef = useRef(null)

    // Fetch rate plans on component mount
    useEffect(() => {
        if (propertyData?._id) {
            fetchRatePlans()
            fetchPlanPricings()
        }
    }, [propertyData])

    const fetchRatePlans = async () => {
        try {
            const response = await fetch(
                `/api/rate-plans?propertyId=${propertyData._id}&activeOnly=true`
            )
            const data = await response.json()

            if (data.success) {
                setRatePlans(data.data)
            }
        } catch (error) {
            console.error('Error fetching rate plans:', error)
            toast.error('Failed to fetch rate plans')
        }
    }

    const fetchPlanPricings = async () => {
        setLoading(true)
        try {
            const response = await fetch(
                `/api/plan-pricing?propertyId=${propertyData._id}`
            )
            const data = await response.json()

            if (data.success) {
                setPlanPricings(data.data)
            }
        } catch (error) {
            console.error('Error fetching plan pricings:', error)
            toast.error('Failed to fetch plan pricings')
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            })
            const data = await res.json()

            if (res.ok && data.url) {
                setImage({ url: data.url, key: data.key || '' })
                toast.success('Image uploaded!')
            } else {
                toast.error('Cloudinary upload failed: ' + (data.error || 'Unknown error'))
            }
        } catch (err) {
            toast.error('Cloudinary upload error: ' + err.message)
        }
        setUploading(false)
    }

    const handleDeleteImage = () => {
        setImage({ url: '', key: '' })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        toast.success('Image removed')
    }

    const resetForm = () => {
        setSelectedPlan('')
        setSelectedPlanType('')
        setSelectedRoom('')
        setImage({ url: '', key: '' })
        setSideTagLine('')
        setDescription('')
        setEpPlan({ person1: '', person2: '' })
        setCpPlan({ person1: '', person2: '' })
        setMapPlan({ person1: '', person2: '' })
        setApPlan({ person1: '', person2: '' })
        setEditingPricing(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const getSelectedPlanData = () => {
        return ratePlans.find(plan => plan._id === selectedPlan)
    }

    const getPlanTypes = () => {
        const plan = getSelectedPlanData()
        if (!plan) return []

        const types = []
        if (plan.planTypes.ep) types.push({ value: 'ep', label: 'EP (Room Only)' })
        if (plan.planTypes.cp) types.push({ value: 'cp', label: 'CP (+ Breakfast)' })
        if (plan.planTypes.map) types.push({ value: 'map', label: 'MAP (B+D)' })
        if (plan.planTypes.ap) types.push({ value: 'ap', label: 'AP (All Meals)' })
        return types
    }

    const togglePlan = (planType) => {
        setExpandedPlans(prev => ({
            ...prev,
            [planType]: !prev[planType]
        }))
    }

    const formatCurrency = (amount) => {
        return amount ? `₹${parseFloat(amount).toLocaleString('en-IN')}` : '₹0'
    }

    const handleEdit = (pricing) => {
        setEditingPricing(pricing)
        setSelectedPlan(pricing.ratePlanId._id || pricing.ratePlanId)
        setSelectedRoom(pricing.roomType)
        setImage(pricing.image || { url: '', key: '' })
        setSideTagLine(pricing.sideTagLine || '')
        setDescription(pricing.description || '')
        setEpPlan(pricing.epPlan || { person1: '', person2: '' })
        setCpPlan(pricing.cpPlan || { person1: '', person2: '' })
        setMapPlan(pricing.mapPlan || { person1: '', person2: '' })
        setApPlan(pricing.apPlan || { person1: '', person2: '' })

        // Set plan type after a small delay to ensure plan is set first
        setTimeout(() => {
            setSelectedPlanType(pricing.planType || 'ep')
        }, 0)

        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEdit = () => {
        resetForm()
        setEditingPricing(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const openDeleteDialog = (pricing) => {
        setPackageToDelete(pricing)
        setShowDeleteDialog(true)
    }

    const cancelDelete = () => {
        setPackageToDelete(null)
        setShowDeleteDialog(false)
    }

    const confirmDelete = async () => {
        if (!packageToDelete) return

        setDeleting(true)
        try {
            const response = await fetch(`/api/plan-pricing?pricingId=${packageToDelete._id}&propertyId=${propertyData._id}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (data.success) {
                toast.success('Package deleted successfully!')
                fetchPlanPricings()
                cancelDelete()
            } else {
                toast.error(data.message || 'Failed to delete package')
            }
        } catch (error) {
            console.error('Error deleting package:', error)
            toast.error('Failed to delete package')
        } finally {
            setDeleting(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!selectedPlan) {
            toast.error('Please select a plan/package')
            return
        }

        if (!selectedPlanType) {
            toast.error('Please select a plan type')
            return
        }

        if (!selectedRoom) {
            toast.error('Please select a room category')
            return
        }

        if (!image.url) {
            toast.error('Please upload an image')
            return
        }

        if (!sideTagLine.trim()) {
            toast.error('Please enter a title tag line')
            return
        }


        setSaving(true)
        try {
            const pricingData = {
                propertyId: propertyData._id,
                ratePlanId: selectedPlan,
                roomType: selectedRoom,
                planType: selectedPlanType,
                image,
                sideTagLine: sideTagLine.trim(),
                description: description.trim(),
                epPlan: {
                    person1: parseFloat(epPlan.person1) || 0,
                    person2: parseFloat(epPlan.person2) || 0,
                    extraPerson: 0
                },
                cpPlan: {
                    person1: parseFloat(cpPlan.person1) || 0,
                    person2: parseFloat(cpPlan.person2) || 0,
                    extraPerson: 0
                },
                mapPlan: {
                    person1: parseFloat(mapPlan.person1) || 0,
                    person2: parseFloat(mapPlan.person2) || 0,
                    extraPerson: 0
                },
                apPlan: {
                    person1: parseFloat(apPlan.person1) || 0,
                    person2: parseFloat(apPlan.person2) || 0,
                    extraPerson: 0
                },
                createdBy: propertyData._id
            }

            // Add pricingId and propertyId to body for PUT request
            if (editingPricing) {
                pricingData.pricingId = editingPricing._id
                pricingData.propertyId = propertyData._id
            }

            const url = '/api/plan-pricing'
            const method = editingPricing ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pricingData)
            })

            const data = await response.json()

            if (data.success) {
                toast.success(editingPricing ? 'Package updated successfully!' : 'Package created successfully!')
                resetForm()
                fetchPlanPricings()
                setEditingPricing(null)
            } else {
                toast.error(data.message || `Failed to ${editingPricing ? 'update' : 'create'} package`)
            }
        } catch (error) {
            console.error('Error saving plan package:', error)
            toast.error('Failed to save plan package')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white">Plan Package Creator</h1>
                <p className="text-white font-semibold mt-2">Create promotional packages with images and descriptions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Edit Mode Indicator */}
                {editingPricing && (
                    <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Edit className="h-5 w-5 text-blue-600" />
                                <span className="text-blue-800 font-bold">
                                    Editing Package: {editingPricing.sideTagLine}
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
                        {/* Select Plan / Package */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Plan / Package *
                            </Label>
                            <Select
                                value={selectedPlan}
                                onValueChange={(value) => {
                                    setSelectedPlan(value)
                                    setSelectedPlanType('') // Reset plan type when plan changes
                                }}
                            >
                                <SelectTrigger className="w-full h-14 text-lg border-2 border-gray-800 rounded-full px-6">
                                    <SelectValue placeholder="Select Plan / Package" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ratePlans.map((plan) => (
                                        <SelectItem key={plan._id} value={plan._id}>
                                            {plan.planName} ({plan.numberOfDays} days)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Select Plan Type */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Plan Type *
                            </Label>
                            <Select
                                value={selectedPlanType}
                                onValueChange={setSelectedPlanType}
                                disabled={!selectedPlan}
                            >
                                <SelectTrigger className="w-full h-14 text-lg border-2 border-gray-800 rounded-full px-6">
                                    <SelectValue placeholder="Select Plan Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getPlanTypes().map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Select Room Category Available */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Room Category Available *
                            </Label>
                            <Select
                                value={selectedRoom}
                                onValueChange={setSelectedRoom}
                            >
                                <SelectTrigger className="w-full h-14 text-lg bg-cyan-400 text-black font-bold rounded-full px-6 border-2 border-cyan-600">
                                    <SelectValue placeholder="Select Room Category Available" />
                                </SelectTrigger>
                                <SelectContent>
                                    {propertyData?.rooms?.map((room, index) => (
                                        <SelectItem key={index} value={room.roomType}>
                                            {room.roomType} ({room.numberOfRooms} rooms)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Upload Primary Image */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Primary Image *
                            </Label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                className="hidden"
                                id="plan-image-input"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-14 text-lg bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-full border-2 border-gray-500"
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 mr-2" />
                                        Upload Primary Image
                                    </>
                                )}
                            </Button>

                            {/* Image Preview */}
                            {image.url && (
                                <div className="mt-4 relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <Image
                                        src={image.url}
                                        alt="Package Image Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleDeleteImage}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                                        title="Remove image"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Title Tag Line */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Title Tag Line *
                            </Label>
                            <Input
                                type="text"
                                placeholder="Title Tag Line Type Here"
                                value={sideTagLine}
                                onChange={(e) => setSideTagLine(e.target.value)}
                                className="w-full h-14 text-lg border-2 border-gray-800 rounded-full px-6"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </Label>
                            <div className="relative">
                                <textarea
                                    placeholder="Minimum 50 Words Applicable"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={6}
                                    className="w-full text-lg border-2 border-gray-800 rounded-3xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                                <div className="absolute bottom-3 right-4 text-sm text-gray-500">
                                    {description.length} characters
                                </div>
                            </div>
                        </div>
                        {/* Pricing Plans */}
                        {
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-900">Update Pricing Plans</h2>

                                {/* EP Basis */}
                                <Card className="bg-blue-600">
                                    <CardContent className="p-4">
                                        <button
                                            type="button"
                                            onClick={() => togglePlan('ep')}
                                            className="w-full flex items-center justify-between mb-3"
                                        >
                                            <h3 className="text-white font-bold text-lg">EP Plan (Room Only)</h3>
                                            <ChevronDown
                                                className={`h-5 w-5 text-white transition-transform ${expandedPlans.ep ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {expandedPlans.ep && (
                                            <div className="space-y-2">
                                                <input
                                                    type="number"
                                                    placeholder="Price For 1 Person (₹)"
                                                    value={epPlan.person1}
                                                    onChange={(e) => setEpPlan({ ...epPlan, person1: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price For 2 Persons (₹)"
                                                    value={epPlan.person2}
                                                    onChange={(e) => setEpPlan({ ...epPlan, person2: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* CP Basis */}
                                <Card className="bg-blue-600">
                                    <CardContent className="p-4">
                                        <button
                                            type="button"
                                            onClick={() => togglePlan('cp')}
                                            className="w-full flex items-center justify-between mb-3"
                                        >
                                            <h3 className="text-white font-bold text-lg">CP Plan (Room + Breakfast)</h3>
                                            <ChevronDown
                                                className={`h-5 w-5 text-white transition-transform ${expandedPlans.cp ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {expandedPlans.cp && (
                                            <div className="space-y-2">
                                                <input
                                                    type="number"
                                                    placeholder="Price For 1 Person (₹)"
                                                    value={cpPlan.person1}
                                                    onChange={(e) => setCpPlan({ ...cpPlan, person1: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price For 2 Persons (₹)"
                                                    value={cpPlan.person2}
                                                    onChange={(e) => setCpPlan({ ...cpPlan, person2: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* MAP Basis */}
                                <Card className="bg-blue-600">
                                    <CardContent className="p-4">
                                        <button
                                            type="button"
                                            onClick={() => togglePlan('map')}
                                            className="w-full flex items-center justify-between mb-3"
                                        >
                                            <h3 className="text-white font-bold text-lg">MAP Plan (Breakfast + Dinner)</h3>
                                            <ChevronDown
                                                className={`h-5 w-5 text-white transition-transform ${expandedPlans.map ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {expandedPlans.map && (
                                            <div className="space-y-2">
                                                <input
                                                    type="number"
                                                    placeholder="Price For 1 Person (₹)"
                                                    value={mapPlan.person1}
                                                    onChange={(e) => setMapPlan({ ...mapPlan, person1: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price For 2 Persons (₹)"
                                                    value={mapPlan.person2}
                                                    onChange={(e) => setMapPlan({ ...mapPlan, person2: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* AP Basis */}
                                <Card className="bg-blue-600">
                                    <CardContent className="p-4">
                                        <button
                                            type="button"
                                            onClick={() => togglePlan('ap')}
                                            className="w-full flex items-center justify-between mb-3"
                                        >
                                            <h3 className="text-white font-bold text-lg">AP Plan (All Meals)</h3>
                                            <ChevronDown
                                                className={`h-5 w-5 text-white transition-transform ${expandedPlans.ap ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {expandedPlans.ap && (
                                            <div className="space-y-2">
                                                <input
                                                    type="number"
                                                    placeholder="Price For 1 Person (₹)"
                                                    value={apPlan.person1}
                                                    onChange={(e) => setApPlan({ ...apPlan, person1: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Price For 2 Persons (₹)"
                                                    value={apPlan.person2}
                                                    onChange={(e) => setApPlan({ ...apPlan, person2: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        }

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={saving}
                            className="w-full h-16 text-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transition-all"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                                    {editingPricing ? 'Updating Package...' : 'Creating Package...'}
                                </>
                            ) : (
                                editingPricing ? 'Update Package' : 'Create Package'
                            )}
                        </Button>

                        {/* Cancel Edit Button - Only show when editing */}
                        {editingPricing && (
                            <Button
                                type="button"
                                onClick={cancelEdit}
                                disabled={saving}
                                className="w-full h-16 text-xl bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-full shadow-lg transition-all mt-4"
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </form>

            {/* Created Packages Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Created Packages</h2>
                    {loading && <Loader2 className="h-5 w-5 animate-spin text-white" />}
                </div>
            </div>

            {/* Packages Table */}
            {planPricings.length === 0 && !loading ? (
                <Card className="border-2 border-gray-200">
                    <CardContent className="p-8 text-center">
                        <p className="text-gray-500 text-lg">No packages created yet. Create your first package above!</p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-indigo-200">
                                        <th className="border border-gray-400 px-4 py-3 text-left font-bold text-gray-900">
                                            Package Name
                                        </th>
                                        <th className="border border-gray-400 px-4 py-3 text-center font-bold text-gray-900">
                                            Rate Plan
                                        </th>
                                        <th className="border border-gray-400 px-4 py-3 text-center font-bold text-gray-900">
                                            Room Category
                                        </th>
                                        <th className="border border-gray-400 px-4 py-3 text-center font-bold text-gray-900">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {planPricings.map((pricing) => (
                                        <React.Fragment key={pricing._id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-400 px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">
                                                            {pricing.sideTagLine}
                                                        </span>
                                                        <button
                                                            onClick={() => setExpandedCategories(prev => ({
                                                                ...prev,
                                                                [pricing._id]: !prev[pricing._id]
                                                            }))}
                                                            className="text-gray-black bg-indigo-400 px-2 py-[1px] flex items-center rounded-md hover:text-gray-900 hover:bg-indigo-500 transition-colors duration-300 text-xl font-bold"
                                                        >
                                                            {expandedCategories[pricing._id] ? '-' : '+'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-400 px-4 py-3 text-center">
                                                    {pricing.ratePlanId?.planName || 'N/A'}
                                                </td>
                                                <td className="border border-gray-400 px-4 py-3 text-center">
                                                    {pricing.roomType}
                                                </td>
                                                <td className="border border-gray-400 px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            onClick={() => handleEdit(pricing)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() => openDeleteDialog(pricing)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                setSelectedPackageData(pricing)
                                                                setShowModal(true)
                                                            }}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                                                        >
                                                            View
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded Row - Pricing Details */}
                                            {expandedCategories[pricing._id] && (
                                                <>
                                                    <tr>
                                                        <td className="border border-gray-400 px-8 py-2 font-bold">
                                                            Plan Price
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center font-bold">
                                                            1P
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center font-bold">
                                                            2P
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2"></td>
                                                    </tr>
                                                    {(pricing.epPlan?.person1 > 0 || pricing.epPlan?.person2 > 0) && (
                                                        <tr className="bg-purple-100">
                                                            <td className="border border-gray-400 px-8 py-2 font-semibold">
                                                                EP Plan Price
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                                {formatCurrency(pricing.epPlan.person1)}
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                                {formatCurrency(pricing.epPlan.person2)}
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2"></td>
                                                        </tr>
                                                    )}
                                                    {(pricing.cpPlan?.person1 > 0 || pricing.cpPlan?.person2 > 0) && (
                                                        <tr className="bg-purple-100">
                                                            <td className="border border-gray-400 px-8 py-2 font-semibold">
                                                                CP Plan Price
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                                {formatCurrency(pricing.cpPlan.person1)}
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                                {formatCurrency(pricing.cpPlan.person2)}
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2"></td>
                                                        </tr>
                                                    )}
                                                    {(pricing.mapPlan?.person1 > 0 || pricing.mapPlan?.person2 > 0) && (
                                                        <tr className="bg-purple-100">
                                                            <td className="border border-gray-400 px-8 py-2 font-semibold">
                                                                MAP Plan Price
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                                {formatCurrency(pricing.mapPlan.person1)}
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                                {formatCurrency(pricing.mapPlan.person2)}
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2"></td>
                                                        </tr>
                                                    )}
                                                    {(pricing.apPlan?.person1 > 0 || pricing.apPlan?.person2 > 0) && (
                                                        <tr className="bg-purple-100">
                                                            <td className="border border-gray-400 px-8 py-2 font-semibold">
                                                                AP Plan Price
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                                {formatCurrency(pricing.apPlan.person1)}
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2 text-center">
                                                                {formatCurrency(pricing.apPlan.person2)}
                                                            </td>
                                                            <td className="border border-gray-400 px-4 py-2"></td>
                                                        </tr>
                                                    )}
                                                </>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modal for Detailed View */}
            {showModal && selectedPackageData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto z-50">
                        <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedPackageData.sideTagLine}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white px-4 py-1 rounded-md bg-red-500 text-2xl font-bold hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-indigo-100 mt-2">
                                {selectedPackageData.ratePlanId?.planName} - {selectedPackageData.roomType}
                            </p>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Package Image */}
                            {selectedPackageData.image?.url && (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                                    <Image
                                        src={selectedPackageData.image.url}
                                        alt={selectedPackageData.sideTagLine}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="bg-indigo-50 p-4 rounded-lg">
                                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700">{selectedPackageData.description}</p>
                            </div>

                            {/* Pricing Plans Table */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">Pricing Details</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-indigo-100">
                                                <th className="border border-gray-300 px-4 py-3 text-left font-bold">
                                                    Plan Type
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center font-bold">
                                                    1 Person
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center font-bold">
                                                    2 Persons
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                    EP Plan (Room Only)
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {formatCurrency(selectedPackageData.epPlan?.person1)}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {formatCurrency(selectedPackageData.epPlan?.person2)}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                    CP Plan (Room + Breakfast)
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {formatCurrency(selectedPackageData.cpPlan?.person1)}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {formatCurrency(selectedPackageData.cpPlan?.person2)}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                    MAP Plan (Breakfast + Dinner)
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {formatCurrency(selectedPackageData.mapPlan?.person1)}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {formatCurrency(selectedPackageData.mapPlan?.person2)}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                    AP Plan (All Meals)
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {formatCurrency(selectedPackageData.apPlan?.person1)}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-3 text-center">
                                                    {formatCurrency(selectedPackageData.apPlan?.person2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold text-gray-900 mb-2">Additional Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Rate Plan:</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                            {selectedPackageData.ratePlanId?.planName}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                            {selectedPackageData.ratePlanId?.numberOfDays} days
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Room Category:</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                            {selectedPackageData.roomType}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Created:</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                            {new Date(selectedPackageData.createdAt).toLocaleDateString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Close Button */}
                            <Button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Package</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this package? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {packageToDelete && (
                        <div className="py-4">
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Package:</strong> {packageToDelete.sideTagLine}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <strong>Rate Plan:</strong> {packageToDelete.ratePlanId?.planName}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Room:</strong> {packageToDelete.roomType}
                            </p>
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
        </div>
    )
}

export default PlanPriceUpdate
