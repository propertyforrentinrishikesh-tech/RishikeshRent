"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const Deals = () => {
    const [activeTab, setActiveTab] = useState('deals')
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            startDate: '',
            endDate: '',
            discountPercent: '',
            commissionPercent: '',
            applyAllRooms: false,
            applyAllPackages: false
        }
    })

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your save logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Promotions and Marketing</h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveTab('deals')}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'deals'
                            ? 'bg-cyan-400 text-gray-900'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Deals / Discount
                </button>
                <button
                    onClick={() => setActiveTab('preferred')}
                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'preferred'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Preferred Programs
                </button>
            </div>

            {/* Deals/Discount Tab Content */}
            {activeTab === 'deals' && (
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-600">
                                Activate "Early Bird" or "Mobile-only" discounts.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Date Range Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Date Range</h2>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="text"
                                        placeholder="DD/MM/YYYY"
                                        {...register('startDate')}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full bg-orange-400 text-gray-900 placeholder-gray-700 font-semibold text-center"
                                    />
                                    <span className="text-lg font-bold text-gray-900">To</span>
                                    <Input
                                        type="text"
                                        placeholder="DD/MM/YYYY"
                                        {...register('endDate')}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full bg-gray-200 text-gray-900 placeholder-gray-700 font-semibold text-center"
                                    />
                                </div>
                            </div>

                            {/* % Value OF Discount Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">% Value OF Discount</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    higher discount or higher commission.
                                </p>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="text"
                                        placeholder="Discount %"
                                        {...register('discountPercent')}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full bg-orange-400 text-gray-900 placeholder-gray-700 font-semibold text-center"
                                    />
                                    <span className="text-lg font-bold text-gray-900">Or</span>
                                    <Input
                                        type="text"
                                        placeholder="Commission %"
                                        {...register('commissionPercent')}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full bg-gray-200 text-gray-900 placeholder-gray-700 font-semibold text-center"
                                    />
                                </div>
                            </div>

                            {/* Apply For All Section */}
                            <div>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-4 bg-black text-white rounded-lg appearance-none font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer"
                                    >
                                        <option>Apply For All</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Checkboxes */}
                                <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="applyAllRooms"
                                            {...register('applyAllRooms')}
                                            className="h-5 w-5"
                                        />
                                        <Label
                                            htmlFor="applyAllRooms"
                                            className="text-sm font-semibold text-gray-900 cursor-pointer"
                                        >
                                            Apply For All Rooms
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="applyAllPackages"
                                            {...register('applyAllPackages')}
                                            className="h-5 w-5"
                                        />
                                        <Label
                                            htmlFor="applyAllPackages"
                                            className="text-sm font-semibold text-gray-900 cursor-pointer"
                                        >
                                            Apply For All Packages
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                                <p className="text-sm text-gray-700">
                                    <strong>Inverting the price for the guest (Discount) or paying more to the platform (Commission).</strong>
                                </p>
                            </div>

                            {/* Data Save Button */}
                            <Button
                                type="submit"
                                className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-full transition-colors shadow-lg"
                            >
                                Data Save
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Preferred Programs Tab Content */}
            {activeTab === 'preferred' && (
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <p className="text-sm text-gray-600">
                                higher discount or higher commission.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Date Range Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Date Range</h2>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="text"
                                        placeholder="DD/MM/YYYY"
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full bg-orange-400 text-gray-900 placeholder-gray-700 font-semibold text-center"
                                    />
                                    <span className="text-lg font-bold text-gray-900">To</span>
                                    <Input
                                        type="text"
                                        placeholder="DD/MM/YYYY"
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full bg-gray-200 text-gray-900 placeholder-gray-700 font-semibold text-center"
                                    />
                                </div>
                            </div>

                            {/* % Value OF Discount Section */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">% Value OF Discount</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    higher discount or higher commission.
                                </p>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="text"
                                        placeholder="Discount %"
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full bg-orange-400 text-gray-900 placeholder-gray-700 font-semibold text-center"
                                    />
                                    <span className="text-lg font-bold text-gray-900">Or</span>
                                    <Input
                                        type="text"
                                        placeholder="Commission %"
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full bg-gray-200 text-gray-900 placeholder-gray-700 font-semibold text-center"
                                    />
                                </div>
                            </div>

                            {/* Apply For All Section */}
                            <div>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-4 bg-black text-white rounded-lg appearance-none font-semibold focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer"
                                    >
                                        <option>Apply For All</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Checkboxes */}
                                <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="applyAllRoomsPreferred"
                                            className="h-5 w-5"
                                        />
                                        <Label
                                            htmlFor="applyAllRoomsPreferred"
                                            className="text-sm font-semibold text-gray-900 cursor-pointer"
                                        >
                                            Apply For All Rooms
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="applyAllPackagesPreferred"
                                            className="h-5 w-5"
                                        />
                                        <Label
                                            htmlFor="applyAllPackagesPreferred"
                                            className="text-sm font-semibold text-gray-900 cursor-pointer"
                                        >
                                            Apply For All Packages
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                                <p className="text-sm text-gray-700">
                                    <strong>Inverting the price for the guest (Discount) or paying more to the platform (Commission).</strong>
                                </p>
                            </div>

                            {/* Data Save Button */}
                            <Button
                                type="submit"
                                className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-full transition-colors shadow-lg"
                            >
                                Data Save
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Log Data Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Log Data</h2>

                {/* Log Data Rows */}
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                        <div key={row} className="grid grid-cols-3 gap-3">
                            <div className="bg-yellow-400 h-12 rounded"></div>
                            <div className="bg-yellow-400 h-12 rounded"></div>
                            <div className="bg-yellow-400 h-12 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Deals
