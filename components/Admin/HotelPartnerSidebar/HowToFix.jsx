"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const HowToFix = () => {
    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header Alert */}
            <div className="bg-cyan-400 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">How to Fix:</h1>
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

            {/* Reopen Again Button */}
            <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg">
                Reopen Again
            </Button>

            {/* Main Content */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-6">
                    {/* Initial Instructions */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700">
                            <strong>Check your Inbox &gt; Rishikeshrent.com Messages</strong> for a specific notification regarding the suspension.
                        </p>
                    </div>

                    {/* Common Triggers */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            suspend without sending an email or an extranet notification. Look for these common triggers:
                        </h2>

                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <div>
                                    <strong>Rate Parity Violations:</strong> You are selling the room cheaper on your own website or another OTA. 🔍
                                </div>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <div>
                                    <strong>Recurring Negative Reviews:</strong> A "cluster" of complaints about the same issue (e.g., "broken AC" or "cleanliness") often triggers an auto-suspension. 😞
                                </div>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <div>
                                    <strong>High Cancellation Rate:</strong> If you've cancelled too many guest bookings recently.
                                </div>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <div>
                                    <strong>Missing Compliance/Tax Info:</strong> In 2026, many regions require updated digital tax IDs or local business licenses to remain active.
                                </div>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                <div>
                                    <strong>Overbookings:</strong> Frequent "no-room" situations signal a sync error to the platform. 🔄
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Section 1: Rates & Availability */}
                    <div className="border-t-2 border-gray-200 pt-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            1 Reopening by Platform &gt;&gt; <span className="text-blue-600">Rates & Availability</span>
                        </h3>

                        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 rounded-full font-bold text-lg flex items-center justify-between px-6">
                            <span>Reopen Property</span>
                            <span>&gt;&gt;</span>
                        </Button>
                    </div>

                    {/* Section 2: Reservations and Finance */}
                    <div className="border-t-2 border-gray-200 pt-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            2 Outstanding Dues &gt;&gt; <span className="text-blue-600">Reservations and Finance</span>
                        </h3>
                        <p className="text-sm text-gray-700 mb-4">
                            <strong>Financial Reconciliation:</strong> They ensure that you have no outstanding commission payments or "chargeback" disputes pending from previous guests.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Best Payment Methods for Instant Reopening:</p>
                        </div>

                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-full font-bold text-lg flex items-center justify-between px-6 mb-4">
                            <span>Pay Outstanding Dues</span>
                            <span>&gt;&gt;</span>
                        </Button>

                        <p className="text-sm text-gray-700 mb-3">
                            <strong>Attach the PDF or photo of your bank slip.</strong>
                        </p>
                        <p className="text-sm text-gray-700 mb-4">
                            <strong>Submit a "Proof of Bank Payment Internal Check and Reopen Approval</strong>
                        </p>

                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-full font-bold text-lg mb-6">
                            Upload Payment Bank Slip Evidence
                        </Button>

                        {/* Evidence Slip Requirements */}
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                            <h4 className="font-bold text-gray-900 mb-3">3. Requirements for the "Evidence" Slip</h4>
                            <p className="text-sm text-gray-700 mb-3">
                                The internal team will reject the proof if it's missing details. Ensure your screenshot or scan shows:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                <li><strong>The Recipient's Name:</strong></li>
                                <li><strong>The Amount & Currency:</strong> Must match the outstanding balance</li>
                                <li>
                                    <strong>The Reference Code:</strong> This is usually your Property ID. If you forget to include it in the transfer, highlight the "Transaction ID" on the slip.
                                </li>
                                <li>
                                    <strong>The Date:</strong> It must show as "Completed" or "Success," not "Pending."
                                </li>
                            </ul>
                        </div>

                        {/* Submit Data Button */}
                        <Button className="w-full max-w-xs mt-6 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg">
                            Submit Data
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default HowToFix
