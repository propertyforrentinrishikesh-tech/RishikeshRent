"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const Photos = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            selectedRoom: ''
        }
    })

    const [roomStatus, setRoomStatus] = useState({
        room: 'change',
        primary: 'change',
        bathroom: 'change'
    })

    const onSubmit = (data) => {
        // console.log('Form Data:', data)
        // Add your save logic here
    }

    const handleStatusChange = (section, status) => {
        setRoomStatus(prev => ({
            ...prev,
            [section]: status
        }))
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Content and Property Profile</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Photos Section */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <div className="bg-cyan-400 p-3 rounded-lg">
                            <h2 className="text-lg font-bold text-gray-900">Photos</h2>
                            <p className="text-xs text-gray-700">Upload high-quality images</p>
                        </div>

                        {/* Choose Room */}
                        <div>
                            <Label htmlFor="selectedRoom" className="block text-sm font-semibold text-gray-700 mb-2">
                                Choose Room
                            </Label>
                            <div className="relative">
                                <select
                                    id="selectedRoom"
                                    {...register('selectedRoom', { required: 'Room selection is required' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select room...</option>
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
                        </div>

                        {/* Room Photo Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-gray-700">Room</Label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange('room', 'change')}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${roomStatus.room === 'change'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                    >
                                        Change / Edit / Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Primary Photo Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-gray-700">Primary</Label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange('primary', 'change')}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${roomStatus.primary === 'change'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                    >
                                        Change / Edit / Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bathroom Photo Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-gray-700">Bathroom</Label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleStatusChange('bathroom', 'change')}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${roomStatus.bathroom === 'change'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            }`}
                                    >
                                        Change / Edit / Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <Button
                            type="button"
                            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
                        >
                            Save
                        </Button>

                        {/* Property Section */}
                        <div className="pt-4 border-t-2 border-gray-200">
                            <Label htmlFor="property" className="block text-sm font-semibold text-gray-700 mb-2">
                                Property
                            </Label>
                            <div className="relative">
                                <select
                                    id="property"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select property...</option>
                                    <option value="exterior">Exterior</option>
                                    <option value="lobby">Lobby</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="pool">Swimming Pool</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

export default Photos
