"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Descriptions = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            roomAbout: '',
            selectedRoom: '',
            description: '',
            propertyAbout: '',
            highlight: '',
            anySpecial: '',
            howToConnect: ''
        }
    })

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your save logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Content and Property Profile</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Descriptions Section */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <div className="bg-yellow-400 p-3 rounded-lg">
                            <h2 className="text-lg font-bold text-gray-900">Descriptions</h2>
                            <p className="text-xs text-gray-700">Provide detailed information</p>
                        </div>

                        {/* Room About / Description */}
                        <div>
                            <Label htmlFor="roomAbout" className="block text-sm font-semibold text-gray-700 mb-2">
                                Room About / Description
                            </Label>
                            <div className="relative mb-3">
                                <select
                                    id="selectedRoom"
                                    {...register('selectedRoom', { required: 'Room selection is required' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select Room</option>
                                    <option value="deluxe">Deluxe Room</option>
                                    <option value="suite">Suite</option>
                                    <option value="premium">Premium Room</option>
                                    <option value="standard">Standard Room</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.selectedRoom && (
                                <p className="text-red-500 text-sm mt-1">{errors.selectedRoom.message}</p>
                            )}

                            <Label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </Label>
                            <textarea
                                id="description"
                                {...register('description')}
                                rows={4}
                                placeholder="Enter room description..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
                            />
                        </div>

                        {/* Add More Button */}
                        <Button
                            type="button"
                            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            + Add More
                        </Button>

                        {/* Property About */}
                        <div>
                            <Label htmlFor="propertyAbout" className="block text-sm font-semibold text-gray-700 mb-2">
                                Property About
                            </Label>
                            <div className="relative">
                                <select
                                    id="propertyAbout"
                                    {...register('propertyAbout')}
                                    className="w-full px-4 py-3 bg-yellow-300 border-2 border-yellow-400 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 font-semibold text-gray-900"
                                >
                                    <option value="">Select property...</option>
                                    <option value="hotel">Hotel</option>
                                    <option value="resort">Resort</option>
                                    <option value="guesthouse">Guest House</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700 pointer-events-none" />
                            </div>
                        </div>

                        {/* Highlight */}
                        <div>
                            <Label htmlFor="highlight" className="block text-sm font-semibold text-gray-700 mb-2">
                                Highlight
                            </Label>
                            <div className="relative">
                                <select
                                    id="highlight"
                                    {...register('highlight')}
                                    className="w-full px-4 py-3 bg-yellow-300 border-2 border-yellow-400 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 font-semibold text-gray-900"
                                >
                                    <option value="">Select highlight...</option>
                                    <option value="beachfront">Beachfront</option>
                                    <option value="cityCenter">City Center</option>
                                    <option value="mountainView">Mountain View</option>
                                    <option value="spa">Spa & Wellness</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700 pointer-events-none" />
                            </div>
                        </div>

                        {/* Any Special */}
                        <div>
                            <Label htmlFor="anySpecial" className="block text-sm font-semibold text-gray-700 mb-2">
                                Any Special
                            </Label>
                            <div className="relative">
                                <select
                                    id="anySpecial"
                                    {...register('anySpecial')}
                                    className="w-full px-4 py-3 bg-yellow-300 border-2 border-yellow-400 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 font-semibold text-gray-900"
                                >
                                    <option value="">Select special feature...</option>
                                    <option value="petFriendly">Pet Friendly</option>
                                    <option value="familyRooms">Family Rooms</option>
                                    <option value="freeWifi">Free WiFi</option>
                                    <option value="freeParking">Free Parking</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700 pointer-events-none" />
                            </div>
                        </div>

                        {/* How To Connect */}
                        <div>
                            <Label htmlFor="howToConnect" className="block text-sm font-semibold text-gray-700 mb-2">
                                How To Connect
                            </Label>
                            <div className="relative">
                                <select
                                    id="howToConnect"
                                    {...register('howToConnect')}
                                    className="w-full px-4 py-3 bg-yellow-300 border-2 border-yellow-400 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 font-semibold text-gray-900"
                                >
                                    <option value="">Select connection method...</option>
                                    <option value="phone">Phone</option>
                                    <option value="email">Email</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="website">Website</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700 pointer-events-none" />
                            </div>
                        </div>

                        {/* Data Save Button */}
                        <Button
                            type="submit"
                            className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg mt-6"
                        >
                            Data Save
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

export default Descriptions
