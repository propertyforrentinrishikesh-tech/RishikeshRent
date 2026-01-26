"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const OverdueCommission = () => {
    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header Alert */}
            <div className="bg-cyan-400 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Overdue Commission Invoice</h1>
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

            {/* Invoices & Payments Section */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-4">
                    <div className="bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-500">
                        <h2 className="text-lg font-bold text-gray-900">Invoices & Payments.</h2>
                    </div>

                    {/* Reopen Again Button */}
                    <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg">
                        Reopen Again
                    </Button>

                    {/* Go to Reservations and Finance */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-gray-900">Go to Reservations and Finance &gt;&gt;</h3>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="font-bold text-gray-900 mb-3">
                                If you have an outstanding balance, your property will show as " Closed/Bookable" or "Action Required."
                            </p>

                            <ul className="space-y-3 text-sm text-gray-700">
                                <li>
                                    <strong>Where to find it:</strong> Go to the Finance tab › Invoices.
                                </li>
                                <li>
                                    <strong>What to look for:</strong> Look for any invoice with a status marked as <strong>"Outstanding"</strong> or <strong>"Overdue."</strong>
                                </li>
                                <li>
                                    <strong>How to fix:</strong> *You can pay immediately via credit card or bank transfer (details are on the invoice itself).

                                    <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                                        <li>
                                            Once paid, it can take <strong>24–48 hours</strong> for the system to automatically reopen your property.
                                        </li>
                                        <li>
                                            Tip: If you've paid but are still closed, send a proof of payment via the Inbox tab › Booking.com messages.
                                            <span className="inline-block ml-2">📧</span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Check Overdues Button */}
                    <Button className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg mt-6">
                        Check Overdues
                    </Button>
                </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="shadow-md">
                <CardContent className="p-6">
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                        <h3 className="font-bold text-gray-900 mb-3">Important Payment Information:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Payment processing may take 24-48 hours to reflect in the system</li>
                            <li>Keep proof of payment for verification purposes</li>
                            <li>Contact support if property remains closed after payment</li>
                            <li>Regular invoice checks help avoid service interruptions</li>
                        </ul>
                    </div>

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                            <strong>Pro Tip:</strong> Set up automatic payment reminders to avoid overdue invoices and ensure uninterrupted bookings.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OverdueCommission
