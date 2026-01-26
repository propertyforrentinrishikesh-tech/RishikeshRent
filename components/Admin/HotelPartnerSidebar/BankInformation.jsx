"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const BankInformation = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            accountNumber: '',
            holderName: '',
            ifscCode: '',
            bankAddress: '',
            accountNumber2: '',
            holderName2: '',
            ifscCode2: '',
            bankAddress2: ''
        }
    })

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your update logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bank Information</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Primary Bank Information */}
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Bank Information</h2>

                        {/* Account Number */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">Account Number</Label>
                            <div className="col-span-2">
                                <Button
                                    type="button"
                                    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
                        </div>

                        {/* A/C Holder Name */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">A/C Holder Name</Label>
                            <div className="col-span-2">
                                <Button
                                    type="button"
                                    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
                        </div>

                        {/* IFSC Code */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">IFSC Code</Label>
                            <div className="col-span-2 flex gap-2">
                                <Button
                                    type="button"
                                    className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-3 rounded-lg font-semibold whitespace-nowrap"
                                >
                                    Choose Upload Document
                                </Button>
                            </div>
                        </div>

                        {/* Bank Address */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">Bank Address</Label>
                            <div className="col-span-2">
                                <Button
                                    type="button"
                                    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2nd Alternate Info */}
                <Card className="shadow-md border-l-4 border-yellow-500">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Bank Information</h2>
                            <h3 className="text-lg font-bold text-gray-700">2nd Alternate Info</h3>
                        </div>

                        {/* Account Number */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">Account Number</Label>
                            <div className="col-span-2">
                                <Button
                                    type="button"
                                    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
                        </div>

                        {/* A/C Holder Name */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">A/C Holder Name</Label>
                            <div className="col-span-2">
                                <Button
                                    type="button"
                                    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
                        </div>

                        {/* IFSC Code */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">IFSC Code</Label>
                            <div className="col-span-2 flex gap-2">
                                <Button
                                    type="button"
                                    className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-3 rounded-lg font-semibold whitespace-nowrap"
                                >
                                    Choose Upload Document
                                </Button>
                            </div>
                        </div>

                        {/* Bank Address */}
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <Label className="text-sm font-semibold text-gray-700">Bank Address</Label>
                            <div className="col-span-2">
                                <Button
                                    type="button"
                                    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold"
                                >
                                    Type Here
                                </Button>
                            </div>
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

export default BankInformation
