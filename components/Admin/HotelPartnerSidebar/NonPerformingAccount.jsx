"use client"
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const NonPerformingAccount = () => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header Alert */}
            <div className="bg-cyan-400 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Non-Performing Account</h1>
                    <p className="text-sm text-gray-700">(Commonly known as a Non-Performing Asset or NPA)</p>
                </div>
                <div className="bg-red-600 px-6 py-2 rounded-lg">
                    <p className="text-white font-bold">Not Bookable</p>
                    <div className="relative">
                        <select className="bg-red-600 text-white font-bold appearance-none pr-6 focus:outline-none cursor-pointer">
                            <option>▼</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reopening Section */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-4">
                    {/* Reopening a "Closed" Date */}
                    <div className="bg-yellow-400 p-4 rounded-lg">
                        <h2 className="text-lg font-bold text-gray-900">
                            Reopening a "Closed" Date (Release from Stop Sell)
                        </h2>
                    </div>

                    {/* Reopen Again Button */}
                    <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg">
                        Reopen Again
                    </Button>

                    {/* Go to Rates and Availability */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Go to Rates and Availability &gt;&gt;</h3>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="font-bold text-gray-900 mb-2">
                                If Closed Manually: Go to Rates and Availability Calendar.
                            </p>
                            <p className="text-sm text-gray-700 mb-3">
                                Select the dates you want to reopen, click Edit, and ensure the status is set to Open.
                            </p>

                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                <li>
                                    <strong>Inventory Check:</strong> Even if the property is "Open," if the "Rooms to Sell" count is 0, you will still not receive bookings.
                                </li>
                                <li>
                                    <strong>Rate Plans:</strong> Ensure you have an active Rate Plan (e.g., Standard Rate) attached to your room types (without a past end date).
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="shadow-md">
                <CardContent className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-3">Common Reasons for Non-Performing Status:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Property manually closed for specific dates</li>
                            <li>No available inventory (Rooms to Sell = 0)</li>
                            <li>No active rate plans attached to room types</li>
                            <li>Rate plans with expired end dates</li>
                            <li>System restrictions or stop-sell applied</li>
                        </ul>
                    </div>

                    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4">
                        <p className="text-sm text-gray-700">
                            <strong>Important:</strong> After reopening, it may take 24-48 hours for your property to become fully bookable across all platforms. Ensure all settings are correctly configured.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default NonPerformingAccount
