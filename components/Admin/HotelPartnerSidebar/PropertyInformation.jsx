"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const PropertyInformation = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your update logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Property Information</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Property Information Section */}
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Information</h2>

                        {/* Property Name */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">Property Name</Label>
                            <div className="col-span-2">
                                <Button
                                    type="button"
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
                        </div>

                        {/* Official Email */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">Official Email</Label>
                            <div className="col-span-2">
                                <Button
                                    type="button"
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">Contact Number</Label>
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
                        </div>

                        {/* Pan Number */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">Pan Number</Label>
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 rounded-lg font-semibold"
                                >
                                    Upload Document
                                </Button>
                            </div>
                        </div>

                        {/* GST Number */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">GST Number</Label>
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 rounded-lg font-semibold"
                                >
                                    Upload Document
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Registration Document Section */}
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Registration Document</h2>

                        {/* Upload Document Button */}
                        <div className="space-y-3">
                            <Button
                                type="button"
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg"
                            >
                                Upload Document
                            </Button>
                        </div>

                        {/* Hotel Registration Document */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">Hotel Registration Document</Label>
                            <Button
                                type="button"
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg"
                            >
                                Upload Document
                            </Button>
                        </div>

                        {/* Any Other Document */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">Any Other Document</Label>
                            <Button
                                type="button"
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg"
                            >
                                Upload Document
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit & Update Button */}
                <Button
                    type="submit"
                    className="w-full max-w-xs py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
                >
                    Edit & Update
                </Button>
            </form>
        </div>
    )
}

export default PropertyInformation
