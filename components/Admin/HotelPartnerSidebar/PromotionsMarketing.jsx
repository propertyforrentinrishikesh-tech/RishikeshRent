"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PromotionsMarketing = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            startDate: '',
            endDate: '',
            discountPercentage: '',
            commissionPercentage: '',
            applyFor: 'all'
        }
    })

    const [selectedTab, setSelectedTab] = useState('deals')
    const [applyFor, setApplyFor] = useState('all')

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your promotion logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Promotions and Marketing</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setSelectedTab('deals')}
                    className={`px-6 py-3 font-bold rounded-t-lg transition-colors ${selectedTab === 'deals'
                            ? 'bg-cyan-400 text-gray-900'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                >
                    Deals / Discount
                    <p className="text-xs font-normal">Activate "Early Bird" or "Mobile-only" discount.</p>
                </button>
                <button
                    onClick={() => setSelectedTab('programs')}
                    className={`px-6 py-3 font-bold rounded-t-lg transition-colors ${selectedTab === 'programs'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                >
                    Preferred Programs
                    <p className="text-xs font-normal">Attract more guests by offering a larger discount or higher commission.</p>
                </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6 space-y-6">
                        {/* Preferred Programs Header */}
                        <div className="bg-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500">
                            <h2 className="text-lg font-bold text-gray-900">Preferred Programs</h2>
                            <p className="text-sm text-gray-700">Higher discount or higher commission.</p>
                        </div>

                        {/* Date Range */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Date Range</h3>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="text"
                                    placeholder="DD/MM/YYYY"
                                    {...register('startDate')}
                                    className="flex-1 px-4 py-3 bg-orange-400 text-white placeholder-white rounded-lg font-semibold"
                                />
                                <span className="font-bold text-gray-900">To</span>
                                <Input
                                    type="text"
                                    placeholder="DD/MM/YYYY"
                                    {...register('endDate')}
                                    className="flex-1 px-4 py-3 bg-orange-200 text-gray-900 placeholder-gray-700 rounded-lg font-semibold"
                                />
                            </div>
                        </div>

                        {/* % Value Of Discount */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">% Value OF Discount</h3>
                            <p className="text-sm text-gray-600 mb-4">Higher discount or higher commission.</p>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="text"
                                    placeholder="Discount %"
                                    {...register('discountPercentage')}
                                    className="flex-1 px-4 py-3 bg-orange-400 text-white placeholder-white rounded-lg font-semibold"
                                />
                                <span className="font-bold text-gray-900">Or</span>
                                <Input
                                    type="text"
                                    placeholder="Commission %"
                                    {...register('commissionPercentage')}
                                    className="flex-1 px-4 py-3 bg-orange-200 text-gray-900 placeholder-gray-700 rounded-lg font-semibold"
                                />
                            </div>
                        </div>

                        {/* Apply For All */}
                        <div>
                            <div className="relative">
                                <select
                                    {...register('applyFor')}
                                    onChange={(e) => setApplyFor(e.target.value)}
                                    className="w-full px-4 py-3 bg-black text-white rounded-lg appearance-none font-semibold cursor-pointer"
                                >
                                    <option value="all">Apply For All</option>
                                    <option value="rooms">Apply For All Rooms</option>
                                    <option value="packages">Apply For All Packages</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                            </div>

                            {/* Conditional Options */}
                            {applyFor === 'all' && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="allRooms" className="w-4 h-4" />
                                        <label htmlFor="allRooms" className="text-sm font-semibold text-gray-900">
                                            Apply For All Rooms
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="allPackages" className="w-4 h-4" />
                                        <label htmlFor="allPackages" className="text-sm font-semibold text-gray-900">
                                            Apply For All Packages
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info Text */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-700">
                                <strong>Inverting the prices for the guest (Discount) or paying more to the platform (Commission)</strong>
                            </p>
                        </div>

                        {/* Data Save Button */}
                        <Button
                            type="submit"
                            className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
                        >
                            Data Save
                        </Button>
                    </CardContent>
                </Card>

                {/* Log Data Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Log Data</h2>

                    {/* Log Table */}
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6].map((row) => (
                            <div
                                key={row}
                                className="grid grid-cols-3 gap-2 bg-yellow-400 p-4 rounded-lg"
                            >
                                <div className="bg-yellow-400 h-8"></div>
                                <div className="bg-yellow-400 h-8"></div>
                                <div className="bg-yellow-400 h-8"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PromotionsMarketing
