"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const Restrictions = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            commissionRate: 10
        }
    })

    const [commissionRate, setCommissionRate] = useState(10)

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your save logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Restrictions</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Key Restrictions Section */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <div className="bg-yellow-400 p-3 rounded-lg">
                            <h2 className="text-lg font-bold text-gray-900">Key Restrictions & Considerations Update</h2>
                        </div>

                        {/* Set OTA Commission Rate */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-3">
                                Set OTA Commission Rate
                            </Label>

                            {/* Commission Rate Buttons */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setCommissionRate(0)}
                                    className={`py-3 px-4 rounded-lg font-bold transition-colors ${commissionRate === 0
                                            ? 'bg-gray-700 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    0%
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCommissionRate(15)}
                                    className={`py-3 px-4 rounded-lg font-bold transition-colors ${commissionRate === 15
                                            ? 'bg-gray-700 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    15%
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCommissionRate(30)}
                                    className={`py-3 px-4 rounded-lg font-bold transition-colors ${commissionRate === 30
                                            ? 'bg-gray-700 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    30%
                                </button>
                                <button
                                    type="button"
                                    className="py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-colors"
                                >
                                    ...
                                </button>
                            </div>

                            {/* Save Button */}
                            <Button
                                type="button"
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
                            >
                                Save
                            </Button>
                        </div>

                        {/* Information Section */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-2">
                                Typical Commission Rates: OTA, Aggregators, and Booking Platforms
                            </h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                <li>Standard OTA Commission: Typically ranges from 15% to 25%.</li>
                                <li>Premium Listings or Featured Placements: May incur higher commissions, up to 30% or more.</li>
                                <li>Direct Bookings via Hotel Website: Zero commission (0%).</li>
                                <li>
                                    Wholesale/Contracted Rates: Aggregators may negotiate lower commissions (around 10-15%) for bulk bookings or contracted rates.
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Commission Log Table */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Commission Log Rate</h2>

                    {/* Table */}
                    <Card className="shadow-md">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-orange-400">
                                            <th className="p-3 text-left font-bold text-gray-900 border-r-2 border-white">
                                                Update Date
                                            </th>
                                            <th className="p-3 text-center font-bold text-gray-900 border-r-2 border-white">
                                                Value
                                            </th>
                                            <th className="p-3 text-center font-bold text-gray-900 border-r-2 border-white">
                                                %
                                            </th>
                                            <th className="p-3 text-center font-bold text-gray-900">
                                                <Edit className="h-5 w-5 inline" /> Edit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 4, 5].map((row, index) => (
                                            <tr
                                                key={row}
                                                className={index % 2 === 0 ? 'bg-orange-200' : 'bg-orange-100'}
                                            >
                                                <td className="p-3 border-r border-gray-300">-</td>
                                                <td className="p-3 text-center border-r border-gray-300">-</td>
                                                <td className="p-3 text-center border-r border-gray-300">-</td>
                                                <td className="p-3 text-center">
                                                    <button className="p-1 hover:bg-gray-100 rounded">
                                                        <Edit className="h-5 w-5 text-gray-700" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}

export default Restrictions
