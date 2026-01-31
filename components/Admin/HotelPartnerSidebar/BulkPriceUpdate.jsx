"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Minus, ChevronDown, Calendar, Loader2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const BulkPriceUpdate = ({ propertyData }) => {
    // Form States
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [selectedRoom, setSelectedRoom] = useState('')
    const [totalRooms, setTotalRooms] = useState(0)
    const [availableRooms, setAvailableRooms] = useState(0)
    const [minStay, setMinStay] = useState(1)
    const [minStayEnabled, setMinStayEnabled] = useState(false)
    const [status, setStatus] = useState('open')

    // Pricing States
    const [epPlan, setEpPlan] = useState({ person1: '', person2: '' })
    const [cpPlan, setCpPlan] = useState({ person1: '', person2: '' })
    const [mapPlan, setMapPlan] = useState({ person1: '', person2: '' })
    const [apPlan, setApPlan] = useState({ person1: '', person2: '' })

    // UI States
    const [currentPricing, setCurrentPricing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [expandedPlans, setExpandedPlans] = useState({
        ep: true,
        cp: false,
        map: false,
        ap: false
    })

    // Summary Table States
    const [allPricingData, setAllPricingData] = useState([])
    const [loadingSummary, setLoadingSummary] = useState(false)
    const [expandedCategories, setExpandedCategories] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [selectedCategoryData, setSelectedCategoryData] = useState(null)

    // Log property data

    // Get selected room data
    const selectedRoomData = propertyData?.rooms?.find(r => r.roomType === selectedRoom)

    // Update total/available rooms when room is selected
    useEffect(() => {
        if (selectedRoomData) {
            setTotalRooms(selectedRoomData.numberOfRooms)
            setAvailableRooms(selectedRoomData.numberOfRooms)
        }
    }, [selectedRoomData])

    // Auto-fetch pricing data when dates and room are selected (like B2C Price)
    useEffect(() => {
        if (startDate && endDate && selectedRoom && propertyData?._id) {
            fetchAllPricingForDateRange()
        }
    }, [startDate, endDate, selectedRoom])

    const fetchAllPricingForDateRange = async () => {
        if (!startDate || !endDate || !selectedRoom || !propertyData?._id) return

        setLoadingSummary(true)
        try {
            const response = await fetch(
                `/api/room-pricing?propertyId=${propertyData._id}&roomType=${selectedRoom}&startDate=${startDate}&endDate=${endDate}`
            )
            const data = await response.json()

            if (data.success) {
                setAllPricingData(data.data)

                // Also populate form with first entry if available
                if (data.data.length > 0) {
                    const pricing = data.data[0]
                    setCurrentPricing(pricing)
                    setEpPlan({ person1: pricing.epPlan.person1 || '', person2: pricing.epPlan.person2 || '' })
                    setCpPlan({ person1: pricing.cpPlan.person1 || '', person2: pricing.cpPlan.person2 || '' })
                    setMapPlan({ person1: pricing.mapPlan.person1 || '', person2: pricing.mapPlan.person2 || '' })
                    setApPlan({ person1: pricing.apPlan.person1 || '', person2: pricing.apPlan.person2 || '' })
                    setTotalRooms(pricing.totalRooms)
                    setAvailableRooms(pricing.availableRooms)
                    const minStayValue = pricing.restrictions?.minStay || 1
                    setMinStay(minStayValue)
                    setMinStayEnabled(minStayValue > 1)
                    setStatus(pricing.status)
                }
            }
        } catch (error) {
            console.error('Error fetching all pricing:', error)
        } finally {
            setLoadingSummary(false)
        }
    }

    const handleUpdate = async () => {
        // Validation
        if (!startDate || !endDate || !selectedRoom) {
            toast.error('Please select start date, end date, and room category')
            return
        }

        if (new Date(endDate) < new Date(startDate)) {
            toast.error('End date must be after start date')
            return
        }

        // Check if at least one pricing plan has values
        const hasEP = epPlan.person1 || epPlan.person2
        const hasCP = cpPlan.person1 || cpPlan.person2
        const hasMAP = mapPlan.person1 || mapPlan.person2
        const hasAP = apPlan.person1 || apPlan.person2

        if (!hasEP && !hasCP && !hasMAP && !hasAP) {
            toast.error('Please enter at least one pricing plan')
            return
        }

        setSaving(true)
        try {
            const pricingData = {
                propertyId: propertyData._id,
                roomType: selectedRoom,
                startDate,
                endDate,
                pricingType: 'bulk',
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
                totalRooms,
                availableRooms,
                status,
                restrictions: {
                    minStay: minStayEnabled ? minStay : 1,
                    maxStay: null,
                    closedToArrival: false,
                    closedToDeparture: false,
                    stopSell: status === 'closed'
                },
                createdBy: propertyData._id
            }

            const response = await fetch('/api/room-pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pricingData)
            })

            const data = await response.json()

            if (data.success) {
                toast.success(`Bulk pricing updated successfully for ${data.data?.datesUpdated || 'all'} dates!`)
                fetchAllPricingForDateRange() // Refresh summary table

                // Clear only pricing inputs, keep dates and room selected
                setEpPlan({ person1: '', person2: '' })
                setCpPlan({ person1: '', person2: '' })
                setMapPlan({ person1: '', person2: '' })
                setApPlan({ person1: '', person2: '' })
                setMinStayEnabled(false)
                setMinStay(1)
            } else {
                toast.error(data.message || 'Failed to update pricing')
            }
        } catch (error) {
            console.error('Error updating pricing:', error)
            toast.error('Failed to update pricing')
        } finally {
            setSaving(false)
        }
    }

    const togglePlan = (plan) => {
        setExpandedPlans(prev => ({ ...prev, [plan]: !prev[plan] }))
    }

    const formatCurrency = (amount) => {
        return amount ? `₹${parseFloat(amount).toLocaleString('en-IN')}` : 'Not set'
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white">Date Range Bulk Price Update</h1>
                <p className="text-white font-semibold mt-2">Setting your base rates for entire upcoming year</p>
            </div>

            {/* Date and Room Selection */}
            <Card>
                <CardContent className="p-6 flex items-center w-full gap-2">
                    {/* Date Selection */}
                    <div className="w-60">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Calendar className="inline h-4 w-4 mr-2" />
                            Select Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="w-60">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Calendar className="inline h-4 w-4 mr-2" />
                            Select End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Room Category Selection */}
                    <div className="w-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Room Category
                        </label>
                        <Select
                            value={selectedRoom}
                            onValueChange={(value) => setSelectedRoom(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category..." />
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
                </CardContent>
            </Card>

            {/* Show pricing section only if dates and room are selected */}
            {startDate && endDate && selectedRoom && (
                <>
                    {/* Date Range Info */}
                    <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-blue-900">Bulk Update Date Range</h3>
                                    <p className="text-blue-800 text-sm mt-1">
                                        Updating pricing from <strong>{new Date(startDate).toLocaleDateString('en-IN')}</strong> to <strong>{new Date(endDate).toLocaleDateString('en-IN')}</strong>
                                    </p>
                                    <p className="text-blue-700 text-xs mt-2">
                                        This will create separate pricing entries for each date in the range.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* No Pricing Alert */}
                    {!loading && !currentPricing && (
                        <Card className="border-2 border-yellow-200 bg-yellow-50">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-6 w-6 text-yellow-600 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg text-yellow-900">No Pricing Set</h3>
                                        <p className="text-yellow-800 text-sm mt-1">
                                            No pricing found for this date and room category. Please set pricing below.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Room Availability Section */}
                    {!loading && (
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                {/* Fixed Total Room */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Total Rooms (Fixed)
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedRoomData?.numberOfRooms || 0}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                                    />
                                </div>

                                {/* Available Rooms Counter */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setAvailableRooms(Math.max(0, availableRooms - 1))}
                                        className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                                    >
                                        <Minus className="h-5 w-5" />
                                    </button>
                                    <div className="flex-1 bg-cyan-400 text-white text-center py-3 rounded-lg font-bold">
                                        Available Rooms: {availableRooms}
                                    </div>
                                    <button
                                        onClick={() => setAvailableRooms(Math.min(totalRooms, availableRooms + 1))}
                                        className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Open/Close Toggle */}
                                {/* <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setStatus('open')}
                                        className={`py-3 rounded-lg font-semibold transition-colors ${status === 'open'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    >
                                        Open
                                    </button>
                                    <button
                                        onClick={() => setStatus('closed')}
                                        className={`py-3 rounded-lg font-semibold transition-colors ${status === 'closed'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                            }`}
                                    >
                                        Closed
                                    </button>
                                </div> */}
                            </CardContent>
                        </Card>
                    )}
                    {/* Pricing Plans */}
                    {
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">Update Pricing Plans</h2>

                            {/* EP Basis */}
                            <Card className="bg-blue-600">
                                <CardContent className="p-4">
                                    <button
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

                    {/* Minimum Stay Restriction */}
                    {
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                {/* Checkbox to enable/disable */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="minStayEnabled"
                                        checked={minStayEnabled}
                                        onChange={(e) => setMinStayEnabled(e.target.checked)}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="minStayEnabled" className="text-base font-semibold text-gray-900 cursor-pointer">
                                        Requirement (Restriction-based Price) ( Optional )
                                    </label>
                                </div>

                                {minStayEnabled && (
                                    <>
                                        <p className="text-sm text-gray-600">
                                            In a B2C hotel setting, Price Based on Minimum Length of Stay (MLOS). Your pricing engine automatically adjusts based on the stay duration
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setMinStay(Math.max(1, minStay - 1))}
                                                className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                                            >
                                                <Minus className="h-5 w-5" />
                                            </button>
                                            <div className="flex-1 bg-cyan-400 text-white text-center py-3 rounded-lg font-bold">
                                                Minimum Length of Stay: {minStay} {minStay === 1 ? 'night' : 'nights'}
                                            </div>
                                            <button
                                                onClick={() => setMinStay(minStay + 1)}
                                                className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-600 italic">
                                            This isn't just a restriction (like "you must stay 2 nights"); it's a reward system (like "stay more nights to unlock a lower daily rate").
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    }

                    {/* Update Button */}
                    {
                        <Button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="w-full py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-lg transition-colors"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Pricing'
                            )}
                        </Button>
                    }
                </>
            )}

            {/* Help Text */}
            {!startDate || !endDate || !selectedRoom ? (
                <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="p-6 text-center">
                        <p className="text-blue-900 font-semibold">
                            👆 Please select start date, end date, and room category to set bulk pricing
                        </p>
                    </CardContent>
                </Card>
            ) : null}

            {/* Pricing Summary Table */}
            {startDate && endDate && allPricingData.length > 0 && (
                <Card className="mt-8">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedRoom} - Pricing Summary
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {new Date(startDate).toLocaleDateString('en-IN')} to {new Date(endDate).toLocaleDateString('en-IN')} ({allPricingData.length} entries)
                                </p>
                            </div>
                            {loadingSummary && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-green-200">
                                        <th className="border border-gray-400 px-4 py-3 text-left font-bold text-gray-900">
                                            Room Category
                                        </th>
                                        <th className="border border-gray-400 px-4 py-3 text-center font-bold text-gray-900">
                                            Total Room
                                        </th>
                                        <th className="border border-gray-400 px-4 py-3 text-center font-bold text-gray-900">
                                            Available
                                        </th>
                                        <th className="border border-gray-400 px-4 py-3 text-center font-bold text-gray-900">
                                            Date
                                        </th>
                                        <th className="border border-gray-400 px-4 py-3 text-center font-bold text-gray-900">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allPricingData.map((pricing, index) => (
                                        <React.Fragment key={pricing._id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-400 px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">
                                                            {pricing.roomType}
                                                        </span>
                                                        <button
                                                            onClick={() => setExpandedCategories(prev => ({
                                                                ...prev,
                                                                [pricing._id]: !prev[pricing._id]
                                                            }))}
                                                            className="text-gray-black bg-red-400 px-2 py-[1px] flex items-center rounded-md hover:text-gray-900 hover:bg-red-500 transition-colors duration-300 text-xl font-bold"
                                                        >
                                                            {expandedCategories[pricing._id] ? '-' : '+'}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="border border-gray-400 px-4 py-3 text-center">
                                                    {pricing.totalRooms}
                                                </td>
                                                <td className="border border-gray-400 px-4 py-3 text-center">
                                                    {pricing.availableRooms}
                                                </td>
                                                <td className="border border-gray-400 px-4 py-3 text-center">
                                                    {new Date(pricing.date).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="border border-gray-400 px-4 py-3 text-center">
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedCategoryData(pricing)
                                                            setShowModal(true)
                                                        }}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>

                                            {/* Expanded Row */}
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
                                                    </tr>
                                                    <tr className="bg-orange-100">
                                                        <td className="border border-gray-400 px-8 py-2 font-semibold">
                                                            EP Plan Price
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                            {formatCurrency(pricing.epPlan.person1)}
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                            {formatCurrency(pricing.epPlan.person2)}
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-orange-100">
                                                        <td className="border border-gray-400 px-8 py-2 font-semibold">
                                                            CP Plan Price
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                            {formatCurrency(pricing.cpPlan.person1)}
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                            {formatCurrency(pricing.cpPlan.person2)}
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-orange-100">
                                                        <td className="border border-gray-400 px-8 py-2 font-semibold">
                                                            MAP Plan Price
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                            {formatCurrency(pricing.mapPlan.person1)}
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                            {formatCurrency(pricing.mapPlan.person2)}
                                                        </td>
                                                    </tr>
                                                    <tr className="bg-orange-100">
                                                        <td className="border border-gray-400 px-8 py-2 font-semibold">
                                                            AP Plan Price
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                            {formatCurrency(pricing.apPlan.person1)}
                                                        </td>
                                                        <td className="border border-gray-400 px-4 py-2 text-center">
                                                            {formatCurrency(pricing.apPlan.person2)}
                                                        </td>
                                                    </tr>
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
            {showModal && selectedCategoryData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full min-h-[50vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">
                                    {selectedCategoryData.roomType} - Pricing Details
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white px-4 py-1 rounded-md bg-red-500 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-blue-100 mt-2">
                                Date: {new Date(selectedCategoryData.date).toLocaleDateString('en-IN')}
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Room Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Total Rooms</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {selectedCategoryData.totalRooms}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Available Rooms</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {selectedCategoryData.availableRooms}
                                    </p>
                                </div>
                            </div>

                            {/* Pricing Plans Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
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
                                                {formatCurrency(selectedCategoryData.epPlan.person1)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                {formatCurrency(selectedCategoryData.epPlan.person2)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                CP Plan (Room + Breakfast)
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                {formatCurrency(selectedCategoryData.cpPlan.person1)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                {formatCurrency(selectedCategoryData.cpPlan.person2)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                MAP Plan (Breakfast + Dinner)
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                {formatCurrency(selectedCategoryData.mapPlan.person1)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                {formatCurrency(selectedCategoryData.mapPlan.person2)}
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-3 font-semibold">
                                                AP Plan (All Meals)
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                {formatCurrency(selectedCategoryData.apPlan.person1)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                {formatCurrency(selectedCategoryData.apPlan.person2)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-bold text-gray-900 mb-2">Additional Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Status:</span>
                                        <span className={`ml-2 font-semibold ${selectedCategoryData.status === 'open' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {selectedCategoryData.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Min Stay:</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                            {selectedCategoryData.restrictions?.minStay || 1} night(s)
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-600">Last Updated:</span>
                                        <span className="ml-2 font-semibold text-gray-900">
                                            {new Date(selectedCategoryData.updatedAt).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Close Button */}
                            <Button
                                onClick={() => setShowModal(false)}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 mt-4"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BulkPriceUpdate
