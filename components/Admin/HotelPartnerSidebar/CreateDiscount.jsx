"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CreateDiscount = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            couponCode: '',
            amount: '',
            percentage: '',
            startDate: '',
            endDate: ''
        }
    })

    const [discounts, setDiscounts] = useState([
        { id: 1, sno: 1, couponCode: 'Rishikeshcraft01', amount: '-', percentage: '10', dateRange: '2025-10-15 to 2025-10-31', status: 'active' },
        { id: 2, sno: 2, couponCode: 'Rishikeshcraft10', amount: '-', percentage: '20', dateRange: '2025-10-15 to 2025-10-31', status: 'active' },
        { id: 3, sno: 3, couponCode: 'Rishikeshcraft04', amount: '-', percentage: '10', dateRange: '2025-10-15 to 2025-10-31', status: 'active' },
        { id: 4, sno: 4, couponCode: 'Rishikeshcraft02', amount: '-', percentage: '10', dateRange: '2025-10-15 to 2025-10-31', status: 'active' },
        { id: 5, sno: 5, couponCode: 'Rishikeshcraft07', amount: '-', percentage: '20', dateRange: '2025-10-15 to 2025-11-30', status: 'active' },
        { id: 6, sno: 6, couponCode: 'Rishikeshcraft05', amount: '-', percentage: '10', dateRange: '2025-10-15 to 2025-10-31', status: 'active' }
    ])

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your discount creation logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Discount</h1>
                <p className="text-sm text-gray-600">For Offer And Increase Sales</p>
            </div>

            {/* Create Discount Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        {/* Coupon Code and Amount Row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="couponCode" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Create Discount Coupon Code
                                </Label>
                                <Input
                                    id="couponCode"
                                    type="text"
                                    placeholder="Coupon Code"
                                    {...register('couponCode')}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Amount
                                </Label>
                                <Input
                                    id="amount"
                                    type="text"
                                    placeholder="Amount"
                                    {...register('amount')}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                                />
                            </div>
                            <div>
                                <Label htmlFor="percentage" className="block text-sm font-semibold text-gray-700 mb-2">
                                    %
                                </Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-semibold">Or</span>
                                    <Input
                                        id="percentage"
                                        type="text"
                                        placeholder="% Value"
                                        {...register('percentage')}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date Range Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Coupon Code Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    {...register('startDate')}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <Label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Coupon Code End Date
                                </Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    {...register('endDate')}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Add Data Button */}
                        <Button
                            type="submit"
                            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold"
                        >
                            Add Data
                        </Button>
                    </CardContent>
                </Card>
            </form>

            {/* Discounts Table */}
            <div className="space-y-4">
                <p className="text-sm text-gray-600">View all active, upcoming, and expired discounts.</p>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                <th className="p-3 text-left font-semibold text-gray-700">S.No.</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Coupon Code</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Amount</th>
                                <th className="p-3 text-left font-semibold text-gray-700">% Value</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Date Range</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                                <th className="p-3 text-center font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.map((discount, index) => (
                                <tr
                                    key={discount.id}
                                    className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                >
                                    <td className="p-3 text-sm">{discount.sno}</td>
                                    <td className="p-3 text-sm font-semibold">{discount.couponCode}</td>
                                    <td className="p-3 text-sm">{discount.amount}</td>
                                    <td className="p-3 text-sm">{discount.percentage}</td>
                                    <td className="p-3 text-sm">{discount.dateRange}</td>
                                    <td className="p-3 text-sm">
                                        <span className="text-green-600 font-semibold">{discount.status}</span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                                            </label>
                                            <Button
                                                size="sm"
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CreateDiscount
