"use client"
import React, { useState } from 'react'
import { Plus, Minus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const B2CPrice = () => {
    const [selectedTable, setSelectedTable] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [totalRooms, setTotalRooms] = useState(0)
    const [minStay, setMinStay] = useState(1)
    const [priceFor1Person, setPriceFor1Person] = useState('')
    const [priceFor2Person, setPriceFor2Person] = useState('')

    // Pricing plans state
    const [epPlan, setEpPlan] = useState({ person1: '', person2: '' })
    const [cpPlan, setCpPlan] = useState({ person1: '', person2: '' })
    const [mapPlan, setMapPlan] = useState({ person1: '', person2: '' })
    const [apPlan, setApPlan] = useState({ person1: '', person2: '' })

    const [updateDate, setUpdateDate] = useState('')

    // Category types data
    const categoryTypes = [
        { id: 1, name: 'Category Type 1', totalRooms: 0, forSold: 0 },
        { id: 2, name: 'Category Type 2', totalRooms: 0, forSold: 0 },
        { id: 3, name: 'Category Type 3', totalRooms: 0, forSold: 0 },
        { id: 4, name: 'Category Type 4', totalRooms: 0, forSold: 0 },
    ]

    const handleUpdate = () => {
        console.log('Updating prices...')
        // Add your update logic here
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-gray-100 p-4 rounded-lg">
                <h1 className="text-2xl font-bold text-gray-900">Date Range B2C Price Chart</h1>
            </div>

            {/* Selection Section */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    {/* Date Range Selection */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Your Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Select Room Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Room Category
                        </label>
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Select category...</option>
                                <option value="deluxe">Deluxe Room</option>
                                <option value="suite">Suite</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Pre Fix Total Room */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Pre Fix Total Room
                        </label>
                        <input
                            type="text"
                            readOnly
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                            placeholder="Total rooms will appear here"
                        />
                    </div>

                    {/* Total Rooms Counter */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setTotalRooms(Math.max(0, totalRooms - 1))}
                            className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                        >
                            <Minus className="h-5 w-5" />
                        </button>
                        <div className="flex-1 bg-cyan-400 text-white text-center py-3 rounded-lg font-bold">
                            No Of Rooms: {totalRooms}
                        </div>
                        <button
                            onClick={() => setTotalRooms(totalRooms + 1)}
                            className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Open/Close Toggle */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors">
                            Open
                        </button>
                        <button className="py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors">
                            Close
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Plans */}
            <div className="space-y-4">
                {/* EP Basis */}
                <Card className="bg-blue-600">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-bold text-lg">On EP Basis</h3>
                            <ChevronDown className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Price For 1 Person"
                                value={epPlan.person1}
                                onChange={(e) => setEpPlan({ ...epPlan, person1: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Price For 2 Person"
                                value={epPlan.person2}
                                onChange={(e) => setEpPlan({ ...epPlan, person2: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* CP Basis */}
                <Card className="bg-blue-600">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-bold text-lg">On CP Basis</h3>
                            <ChevronDown className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Price For 1 Person"
                                value={cpPlan.person1}
                                onChange={(e) => setCpPlan({ ...cpPlan, person1: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Price For 2 Person"
                                value={cpPlan.person2}
                                onChange={(e) => setCpPlan({ ...cpPlan, person2: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* MAP Basis */}
                <Card className="bg-blue-600">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-bold text-lg">On MAP Basis</h3>
                            <ChevronDown className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Price For 1 Person"
                                value={mapPlan.person1}
                                onChange={(e) => setMapPlan({ ...mapPlan, person1: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Price For 2 Person"
                                value={mapPlan.person2}
                                onChange={(e) => setMapPlan({ ...mapPlan, person2: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* AP Basis */}
                <Card className="bg-blue-600">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-bold text-lg">On AP Basis</h3>
                            <ChevronDown className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Price For 1 Person"
                                value={apPlan.person1}
                                onChange={(e) => setApPlan({ ...apPlan, person1: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Price For 2 Person"
                                value={apPlan.person2}
                                onChange={(e) => setApPlan({ ...apPlan, person2: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Note */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                    <strong>Note:</strong> In EP/CP/MAP/AP, First Enter Minimum value of Price (INR/Rs), then press
                    Enter, then Enter Maximum value of Price (INR/Rs), then press Enter. After that, select the price range you want to apply to certain dates and click "Update".
                </p>
            </div>

            {/* Minimum Length of Stay */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setMinStay(Math.max(1, minStay - 1))}
                    className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                >
                    <Minus className="h-5 w-5" />
                </button>
                <div className="flex-1 bg-cyan-400 text-white text-center py-3 rounded-lg font-bold">
                    Minimum Length of Stay: {minStay}
                </div>
                <button
                    onClick={() => setMinStay(minStay + 1)}
                    className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>

            {/* Incremental Reduction Note */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                    <strong>Incremental Reduction Based On Stay Duration:</strong> If you want to apply an incremental reduction based on stay duration, please select the date range and click "Update".
                </p>
            </div>

            {/* Update Button */}
            <Button
                onClick={handleUpdate}
                className="w-full py-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg rounded-lg transition-colors"
            >
                Update
            </Button>

            {/* Update Price Chart Section */}
            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Update Price Chart</h2>
                <div className="flex gap-4">
                    <input
                        type="date"
                        value={updateDate}
                        onChange={(e) => setUpdateDate(e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Category Table */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Room Category Header */}
                        <div className="bg-green-200 p-3 rounded-lg">
                            <h3 className="font-bold text-gray-900">Room Category</h3>
                        </div>

                        {/* Table Headers */}
                        <div className="grid grid-cols-3 gap-4 font-semibold text-gray-700">
                            <div>Category Type</div>
                            <div className="text-center">Total Room</div>
                            <div className="text-center">For Sold</div>
                        </div>

                        {/* EP Plan Price */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-semibold mb-2">EP Plan Price</div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>1 Person</div>
                                <div className="text-center">2 Person</div>
                                <div></div>
                            </div>
                        </div>

                        {/* CP Plan Price */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-semibold mb-2">CP Plan Price</div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>1 Person</div>
                                <div className="text-center">2 Person</div>
                                <div></div>
                            </div>
                        </div>

                        {/* MAP Plan Price */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-semibold mb-2">MAP Plan Price</div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>1 Person</div>
                                <div className="text-center">2 Person</div>
                                <div></div>
                            </div>
                        </div>

                        {/* AP Plan Price */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-semibold mb-2">AP Plan Price</div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>1 Person</div>
                                <div className="text-center">2 Person</div>
                                <div></div>
                            </div>
                        </div>

                        {/* Category Types */}
                        {categoryTypes.map((category) => (
                            <div key={category.id} className="grid grid-cols-3 gap-4 items-center py-2 border-t">
                                <div className="font-medium">{category.name}</div>
                                <div className="text-center">
                                    <button className="px-4 py-1 bg-gray-200 rounded">
                                        Total Room
                                    </button>
                                </div>
                                <div className="text-center">
                                    <button className="px-4 py-1 bg-gray-200 rounded">
                                        For Sold
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default B2CPrice