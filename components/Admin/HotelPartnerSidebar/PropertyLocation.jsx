"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PropertyLocation = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            apartmentNumber: '',
            firstAddressLine: '',
            secondAddressLine1: '',
            secondAddressLine2: '',
            cityLocation: '',
            pinCode: '',
            googleLocationCode: '',
            googleBusinessCode: '',
            ownerName: '',
            email: '',
            contactNumber: '',
            panNumber: '',
            aadharNumber: ''
        }
    })

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your update logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-blue-600">G</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Where is your property?</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Property Location Section */}
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6 space-y-4">
                        {/* Apartment Number */}
                        <div>
                            <Input
                                type="text"
                                placeholder="Apartment or floor number (optional)"
                                {...register('apartmentNumber')}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white"
                            />
                        </div>

                        {/* 1st Address Line */}
                        <div>
                            <Input
                                type="text"
                                placeholder="1st Address Line"
                                {...register('firstAddressLine', { required: true })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white"
                            />
                        </div>

                        {/* 2nd Address Line */}
                        <div>
                            <Input
                                type="text"
                                placeholder="2nd Address Line"
                                {...register('secondAddressLine1')}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white"
                            />
                        </div>

                        {/* 2nd Address Line (2) */}
                        <div>
                            <Input
                                type="text"
                                placeholder="2nd Address Line"
                                {...register('secondAddressLine2')}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white"
                            />
                        </div>

                        {/* City Location */}
                        <div>
                            <select
                                {...register('cityLocation', { required: true })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white appearance-none"
                            >
                                <option value="">City Location</option>
                                <option value="rishikesh">Rishikesh</option>
                                <option value="haridwar">Haridwar</option>
                                <option value="dehradun">Dehradun</option>
                            </select>
                        </div>

                        {/* Pin Code */}
                        <div>
                            <Input
                                type="text"
                                placeholder="Pin Code"
                                {...register('pinCode', { required: true })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white"
                            />
                        </div>

                        {/* Google Location Code */}
                        <div>
                            <Input
                                type="text"
                                placeholder="Google Location Code"
                                {...register('googleLocationCode')}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white"
                            />
                            <p className="text-xs text-blue-600 mt-2">
                                ⓘ <a href="#" className="underline">Place URL https://www.google.com/maps/ For Eg: 19....</a>
                            </p>
                            <p className="text-xs text-blue-600">
                                ⓘ <a href="#" className="underline">For finding https://support.google.com/maps/ answer=18539?hl=en&co=GENIE.Platform%3DAndroid</a>
                            </p>
                        </div>

                        {/* Google Business Profile Code */}
                        <div>
                            <Input
                                type="text"
                                placeholder="Google Business Profile Code"
                                {...register('googleBusinessCode')}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white"
                            />
                            <p className="text-xs text-blue-600 mt-2">
                                ⓘ <a href="#" className="underline">Follow URL https://www.google.com/business/ answer/3038063?hl=en</a>
                            </p>
                        </div>

                        {/* Edit & Update Button */}
                        <Button
                            type="submit"
                            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
                        >
                            Edit & Update
                        </Button>
                    </CardContent>
                </Card>

                {/* Personal Information Section */}
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

                        <div className="grid grid-cols-3 gap-6">
                            {/* Left Column - Form Fields */}
                            <div className="col-span-2 space-y-4">
                                {/* Owner Name */}
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <Label className="text-sm font-semibold text-gray-700">Owner Name</Label>
                                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold">
                                        Type Here
                                    </Button>
                                </div>

                                {/* Email */}
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <Label className="text-sm font-semibold text-gray-700">Email</Label>
                                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold">
                                        Type Here
                                    </Button>
                                </div>

                                {/* Contact Number */}
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <Label className="text-sm font-semibold text-gray-700">Contact Number</Label>
                                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold">
                                        Type Here
                                    </Button>
                                </div>

                                {/* Pan Number */}
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <Label className="text-sm font-semibold text-gray-700">Pan Number</Label>
                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold">
                                            Type Here
                                        </Button>
                                        <Button className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg font-semibold">
                                            Upload Image
                                        </Button>
                                    </div>
                                </div>

                                {/* Aadhar Number */}
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <Label className="text-sm font-semibold text-gray-700">Aadhar Number</Label>
                                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold">
                                        Type Here
                                    </Button>
                                </div>
                            </div>

                            {/* Right Column - Profile Photo */}
                            <div className="col-span-1 flex flex-col items-center justify-center">
                                <div className="w-40 h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">Profile Photo</span>
                                </div>
                                <Label className="text-sm font-semibold text-gray-700">Profile Photo</Label>
                            </div>
                        </div>

                        {/* Edit & Update Button */}
                        <Button
                            type="button"
                            className="w-full mt-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
                        >
                            Edit & Update
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

export default PropertyLocation
