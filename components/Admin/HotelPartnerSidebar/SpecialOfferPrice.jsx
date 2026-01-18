"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Minus, ChevronDown, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SpecialOfferPrice = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            roomCategory: '',
            preTotalRoom: '',
            noOfRooms: 0,
            status: 'open',
            epPlan: { person1: '', person2: '' },
            cpPlan: { person1: '', person2: '' },
            mapPlan: { person1: '', person2: '' },
            apPlan: { person1: '', person2: '' },
            minLengthOfStay: 1
        }
    })

    const [noOfRooms, setNoOfRooms] = useState(0)
    const [minStay, setMinStay] = useState(1)

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your update logic here
    }

    const incrementRooms = () => {
        const newValue = noOfRooms + 1
        setNoOfRooms(newValue)
        setValue('noOfRooms', newValue)
    }

    const decrementRooms = () => {
        const newValue = Math.max(0, noOfRooms - 1)
        setNoOfRooms(newValue)
        setValue('noOfRooms', newValue)
    }

    const incrementStay = () => {
        const newValue = minStay + 1
        setMinStay(newValue)
        setValue('minLengthOfStay', newValue)
    }

    const decrementStay = () => {
        const newValue = Math.max(1, minStay - 1)
        setMinStay(newValue)
        setValue('minLengthOfStay', newValue)
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Special Offer Price Update</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Selection Section */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        {/* Select Room Category */}
                        <div>
                            <Label htmlFor="roomCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Room Category
                            </Label>
                            <div className="relative">
                                <select
                                    id="roomCategory"
                                    {...register('roomCategory', { required: 'Room category is required' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select category...</option>
                                    <option value="deluxe">Deluxe Room</option>
                                    <option value="suite">Suite</option>
                                    <option value="premium">Premium Room</option>
                                    <option value="standard">Standard Room</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.roomCategory && (
                                <p className="text-red-500 text-sm mt-1">{errors.roomCategory.message}</p>
                            )}
                        </div>

                        {/* Pre Fix Total Room */}
                        <div>
                            <Label htmlFor="preTotalRoom" className="block text-sm font-semibold text-gray-700 mb-2">
                                Pre Fix Total Rooms
                            </Label>
                            <Input
                                id="preTotalRoom"
                                type="text"
                                readOnly
                                {...register('preTotalRoom')}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                                placeholder="Total rooms will appear here"
                            />
                        </div>

                        {/* No Of Rooms Counter */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={decrementRooms}
                                className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors shadow-md"
                            >
                                <Minus className="h-5 w-5" />
                            </button>
                            <div className="flex-1 bg-cyan-400 text-white text-center py-3 rounded-lg font-bold shadow-md">
                                No Of Rooms: {noOfRooms}
                            </div>
                            <button
                                type="button"
                                onClick={incrementRooms}
                                className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors shadow-md"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Open/Close Toggle */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setValue('status', 'open')}
                                className={`py-3 rounded-lg font-semibold transition-colors ${watch('status') === 'open'
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Open
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue('status', 'close')}
                                className={`py-3 rounded-lg font-semibold transition-colors ${watch('status') === 'close'
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                            >
                                Close
                            </button>
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

                {/* Requirement Note */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                        <strong>Requirement (Restriction based Plan / Optional):</strong>
                        <br />
                        In EP/CP/MAP/AP, First Enter Minimum value of Price (INR/Rs), then press Enter, then Enter Maximum value of Price (INR/Rs), then press Enter. After that, select the price range you want to apply to certain dates and click "Update".
                    </p>
                </div>

                {/* Minimum Length of Stay */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={decrementStay}
                        className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors shadow-md"
                    >
                        <Minus className="h-5 w-5" />
                    </button>
                    <div className="flex-1 bg-cyan-400 text-white text-center py-3 rounded-lg font-bold shadow-md">
                        Minimum Length of Stay: {minStay}
                    </div>
                    <button
                        type="button"
                        onClick={incrementStay}
                        className="w-16 h-12 bg-cyan-400 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors shadow-md"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                {/* Incremental Reduction Note */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                        <strong>No Last minute restriction this "you want to apply" or "not want to apply"</strong> If you want to apply an incremental reduction based on stay duration, please select the date range and click "Update".
                    </p>
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

            {/* Room Category Table */}
            <Card className="shadow-md">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Room Category Header */}
                        <div className="bg-green-400 p-3 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-900">Room Category</h3>
                                <div className="flex gap-2">
                                    <button className="px-4 py-1 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 transition-colors">
                                        Add 30/JAN/YYY
                                    </button>
                                    <button className="px-4 py-1 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 transition-colors">
                                        Add Date 30/JAN/YYY
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Category Type 1 */}
                        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-gray-800">Category Type 1</h4>
                                <div className="flex gap-4 text-sm items-center">
                                    <span className="font-semibold">Total Room</span>
                                    <span className="font-semibold">For Sold</span>
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <Minus className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* EP Plan Price */}
                            <div className="bg-white p-3 rounded-lg mb-2 border border-gray-200">
                                <div className="font-semibold text-gray-700 mb-2">EP Plan Price</div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>1 Person</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>2 Person</span>
                                    </div>
                                    <div className="flex gap-1 justify-end">
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* CP Plan Price */}
                            <div className="bg-white p-3 rounded-lg mb-2 border border-gray-200">
                                <div className="font-semibold text-gray-700 mb-2">CP Plan Price</div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>1 Person</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>2 Person</span>
                                    </div>
                                    <div className="flex gap-1 justify-end">
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* MAP Plan Price */}
                            <div className="bg-white p-3 rounded-lg mb-2 border border-gray-200">
                                <div className="font-semibold text-gray-700 mb-2">MAP Plan Price</div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>1 Person</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>2 Person</span>
                                    </div>
                                    <div className="flex gap-1 justify-end">
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* AP Plan Price */}
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="font-semibold text-gray-700 mb-2">AP Plan Price</div>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>1 Person</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>2 Person</span>
                                    </div>
                                    <div className="flex gap-1 justify-end">
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </button>
                                        <button className="p-1 hover:bg-gray-100 rounded">
                                            <Edit className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category Type 2 */}
                        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-800">Category Type 2</h4>
                                <div className="flex gap-4 text-sm items-center">
                                    <span className="font-semibold">Total Room</span>
                                    <span className="font-semibold">For Sold</span>
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <Plus className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Category Type 3 */}
                        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-800">Category Type 3</h4>
                                <div className="flex gap-4 text-sm items-center">
                                    <span className="font-semibold">Total Room</span>
                                    <span className="font-semibold">For Sold</span>
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <Plus className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Category Type 4 */}
                        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-800">Category Type 4</h4>
                                <div className="flex gap-4 text-sm items-center">
                                    <span className="font-semibold">Total Room</span>
                                    <span className="font-semibold">For Sold</span>
                                    <button className="p-1 hover:bg-gray-200 rounded">
                                        <Plus className="h-4 w-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SpecialOfferPrice
