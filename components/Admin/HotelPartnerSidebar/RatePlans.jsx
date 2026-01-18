"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Minus, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const RatePlans = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            planName: '',
            planType: '',
            selectedPlans: {
                ep: false,
                cp: false,
                map: false,
                ap: false
            },
            noOfDays: 0
        }
    })

    const [noOfDays, setNoOfDays] = useState(0)
    const [selectedPlans, setSelectedPlans] = useState({
        ep: false,
        cp: false,
        map: false,
        ap: false
    })

    const [planLogs, setPlanLogs] = useState([
        { id: 1, name: '', type: '', days: '' },
        { id: 2, name: '', type: '', days: '' },
        { id: 3, name: '', type: '', days: '' },
        { id: 4, name: '', type: '', days: '' },
        { id: 5, name: '', type: '', days: '' }
    ])

    const togglePlan = (plan) => {
        const newSelectedPlans = {
            ...selectedPlans,
            [plan]: !selectedPlans[plan]
        }
        setSelectedPlans(newSelectedPlans)
        setValue('selectedPlans', newSelectedPlans)
    }

    const incrementDays = () => {
        const newValue = noOfDays + 1
        setNoOfDays(newValue)
        setValue('noOfDays', newValue)
    }

    const decrementDays = () => {
        const newValue = Math.max(0, noOfDays - 1)
        setNoOfDays(newValue)
        setValue('noOfDays', newValue)
    }

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your save logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Rate Plans</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Create Plan / Package Section */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <div className="bg-yellow-400 p-3 rounded-lg">
                            <h2 className="text-lg font-bold text-gray-900">Create Plan / Package</h2>
                            <p className="text-xs text-gray-700">What are common examples of available promotions</p>
                        </div>

                        {/* Type Here Input */}
                        <div>
                            <Label htmlFor="planName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Create Plan / Package
                            </Label>
                            <Input
                                id="planName"
                                type="text"
                                placeholder="Type Here"
                                {...register('planName', { required: 'Plan name is required' })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.planName && (
                                <p className="text-red-500 text-sm mt-1">{errors.planName.message}</p>
                            )}
                        </div>

                        {/* Plan Based On Type */}
                        <div>
                            <div className="bg-yellow-400 p-3 rounded-lg mb-3">
                                <h3 className="font-bold text-gray-900">Plan Based On Type</h3>
                                <p className="text-xs text-gray-700">Select the standard breakfasts or extended promotions</p>
                            </div>

                            {/* Plan Type Buttons */}
                            <div className="grid grid-cols-4 gap-3">
                                <button
                                    type="button"
                                    onClick={() => togglePlan('ep')}
                                    className={`py-3 px-4 rounded-lg font-bold transition-colors ${selectedPlans.ep
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                                        }`}
                                >
                                    EP
                                </button>
                                <button
                                    type="button"
                                    onClick={() => togglePlan('cp')}
                                    className={`py-3 px-4 rounded-lg font-bold transition-colors ${selectedPlans.cp
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                                        }`}
                                >
                                    CP
                                </button>
                                <button
                                    type="button"
                                    onClick={() => togglePlan('map')}
                                    className={`py-3 px-4 rounded-lg font-bold transition-colors ${selectedPlans.map
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                                        }`}
                                >
                                    MAP
                                </button>
                                <button
                                    type="button"
                                    onClick={() => togglePlan('ap')}
                                    className={`py-3 px-4 rounded-lg font-bold transition-colors ${selectedPlans.ap
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                                        }`}
                                >
                                    AP
                                </button>
                            </div>
                        </div>

                        {/* No Of Days Counter */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={decrementDays}
                                className="w-16 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors shadow-md"
                            >
                                <Minus className="h-5 w-5" />
                            </button>
                            <div className="flex-1 bg-white border-2 border-gray-300 text-gray-900 text-center py-3 rounded-lg font-bold">
                                No Of Days: {noOfDays}
                            </div>
                            <button
                                type="button"
                                onClick={incrementDays}
                                className="w-16 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-xl transition-colors shadow-md"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Requirement Note */}
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-xs text-gray-700">
                                <strong>Requirement (Restriction Based Rate)</strong>
                            </p>
                        </div>

                        {/* Data Save Button */}
                        <Button
                            type="submit"
                            className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
                        >
                            Data Save
                        </Button>
                    </CardContent>
                </Card>

                {/* Plan Log Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Plan Log</h2>

                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-2">
                        <div className="bg-cyan-300 p-3 rounded-lg font-bold text-gray-900 text-center">
                            Plan / Package Name
                        </div>
                        <div className="bg-cyan-300 p-3 rounded-lg font-bold text-gray-900 text-center">
                            Plan Type
                        </div>
                        <div className="bg-cyan-300 p-3 rounded-lg font-bold text-gray-900 text-center">
                            Day's
                        </div>
                        <div className="bg-cyan-300 p-3 rounded-lg font-bold text-gray-900 text-center">
                            <Edit className="h-5 w-5 inline" /> Edit
                        </div>
                    </div>

                    {/* Table Rows */}
                    {planLogs.map((log, index) => (
                        <div key={log.id} className="grid grid-cols-4 gap-2">
                            <div className={`p-3 rounded-lg text-center ${index % 2 === 0 ? 'bg-cyan-200' : 'bg-cyan-400'
                                }`}>
                                {log.name || '-'}
                            </div>
                            <div className={`p-3 rounded-lg text-center ${index % 2 === 0 ? 'bg-cyan-200' : 'bg-cyan-400'
                                }`}>
                                {log.type || '-'}
                            </div>
                            <div className={`p-3 rounded-lg text-center ${index % 2 === 0 ? 'bg-cyan-200' : 'bg-cyan-400'
                                }`}>
                                {log.days || '-'}
                            </div>
                            <div className={`p-3 rounded-lg text-center ${index % 2 === 0 ? 'bg-cyan-200' : 'bg-cyan-400'
                                }`}>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                    <Edit className="h-5 w-5 text-gray-700" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    )
}

export default RatePlans
