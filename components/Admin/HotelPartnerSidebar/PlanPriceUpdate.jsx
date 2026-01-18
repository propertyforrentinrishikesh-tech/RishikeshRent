"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDown, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PlanPriceUpdate = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            selectPlan: '',
            roomCategory: '',
            sideTagLine: '',
            requirement: '',
            epPlan: { person1: '', person2: '' },
            cpPlan: { person1: '', person2: '' },
            mapPlan: { person1: '', person2: '' },
            apPlan: { person1: '', person2: '' }
        }
    })

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your update logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Plan Price Update</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Selection Section */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        {/* Select Plan Type */}
                        <div>
                            <Label htmlFor="selectPlan" className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Plan Type
                            </Label>
                            <div className="relative">
                                <select
                                    id="selectPlan"
                                    {...register('selectPlan', { required: 'Plan type is required' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select plan...</option>
                                    <option value="plan1">Plan 1</option>
                                    <option value="plan2">Plan 2</option>
                                    <option value="plan3">Plan 3</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.selectPlan && (
                                <p className="text-red-500 text-sm mt-1">{errors.selectPlan.message}</p>
                            )}
                        </div>

                        {/* Select Room Category (Unique) */}
                        <div>
                            <Label htmlFor="roomCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Room Category (Unique)
                            </Label>
                            <div className="relative">
                                <select
                                    id="roomCategory"
                                    {...register('roomCategory', { required: 'Room category is required' })}
                                    className="w-full px-4 py-3 bg-cyan-400 text-white rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-600 font-semibold"
                                >
                                    <option value="">Select category...</option>
                                    <option value="deluxe">Deluxe Room</option>
                                    <option value="suite">Suite</option>
                                    <option value="premium">Premium Room</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                            </div>
                            {errors.roomCategory && (
                                <p className="text-red-500 text-sm mt-1">{errors.roomCategory.message}</p>
                            )}
                        </div>

                        {/* Update Package (Single) */}
                        <div>
                            <Label htmlFor="sideTagLine" className="block text-sm font-semibold text-gray-700 mb-2">
                                Update Package (Single)
                            </Label>
                            <Input
                                id="sideTagLine"
                                type="text"
                                placeholder="Side Tag Line Type Here"
                                {...register('sideTagLine')}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                            />
                        </div>

                        {/* Requirement */}
                        <div>
                            <Label htmlFor="requirement" className="block text-sm font-semibold text-gray-700 mb-2">
                                Requirement
                            </Label>
                            <textarea
                                id="requirement"
                                {...register('requirement')}
                                rows={3}
                                placeholder="Requirement for Management"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Plans - Blue Theme */}
                <div className="space-y-4">
                    {/* EP Basis */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white shadow-lg border-2 border-blue-200">
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Price For 1 Person"
                                        {...register('epPlan.person1')}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Price For 2 Person"
                                        {...register('epPlan.person2')}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                            <h3 className="text-white font-bold text-lg">On EP Basis</h3>
                        </div>
                    </div>

                    {/* CP Basis */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white shadow-lg border-2 border-blue-200">
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Price For 1 Person"
                                        {...register('cpPlan.person1')}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Price For 2 Person"
                                        {...register('cpPlan.person2')}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                            <h3 className="text-white font-bold text-lg">On CP Basis</h3>
                        </div>
                    </div>

                    {/* MAP Basis */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white shadow-lg border-2 border-blue-200">
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Price For 1 Person"
                                        {...register('mapPlan.person1')}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Price For 2 Person"
                                        {...register('mapPlan.person2')}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                            <h3 className="text-white font-bold text-lg">On MAP Basis</h3>
                        </div>
                    </div>

                    {/* AP Basis */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-white shadow-lg border-2 border-blue-200">
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <Input
                                        type="text"
                                        placeholder="Price For 1 Person"
                                        {...register('apPlan.person1')}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Price For 2 Person"
                                        {...register('apPlan.person2')}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-gray-300"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                            <h3 className="text-white font-bold text-lg">On AP Basis</h3>
                        </div>
                    </div>
                </div>

                {/* Update Button */}
                <Button
                    type="submit"
                    className="w-full py-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg rounded-lg transition-colors shadow-lg"
                >
                    Update
                </Button>
            </form>

            {/* Update Price Chart Section */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-800">Update Price Chart</h2>
            </div>

            {/* Price Package Table */}
            <Card className="shadow-md">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Price Package / Title Header */}
                        <div className="bg-green-400 p-3 rounded-lg shadow-sm">
                            <h3 className="font-bold text-gray-900">Price Package / Title</h3>
                        </div>

                        {/* Room Category */}
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <h4 className="font-semibold text-gray-800">Room Category</h4>
                        </div>

                        {/* Pricing Plans Table */}
                        <div className="space-y-2">
                            {/* EP Plan Price */}
                            <div className="grid grid-cols-4 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200">
                                <div className="font-semibold text-gray-700">EP Plan Price</div>
                                <div className="text-center">1 Person</div>
                                <div className="text-center">2 Person</div>
                                <div className="flex gap-2 justify-end">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Edit className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* CP Plan Price */}
                            <div className="grid grid-cols-4 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200">
                                <div className="font-semibold text-gray-700">CP Plan Price</div>
                                <div className="text-center">1 Person</div>
                                <div className="text-center">2 Person</div>
                                <div className="flex gap-2 justify-end">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Edit className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* MAP Plan Price */}
                            <div className="grid grid-cols-4 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200">
                                <div className="font-semibold text-gray-700">MAP Plan Price</div>
                                <div className="text-center">1 Person</div>
                                <div className="text-center">2 Person</div>
                                <div className="flex gap-2 justify-end">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Edit className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* AP Plan Price */}
                            <div className="grid grid-cols-4 gap-3 items-center bg-white p-3 rounded-lg border border-gray-200">
                                <div className="font-semibold text-gray-700">AP Plan Price</div>
                                <div className="text-center">1 Person</div>
                                <div className="text-center">2 Person</div>
                                <div className="flex gap-2 justify-end">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Edit className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Plan 2, 3, 4 */}
                        <div className="space-y-2">
                            <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                                <span className="font-semibold text-gray-800">Plan 2</span>
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                                <span className="font-semibold text-gray-800">Plan 3</span>
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                                <span className="font-semibold text-gray-800">Plan 4</span>
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PlanPriceUpdate
