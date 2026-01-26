"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const PermanentContractTermination = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        console.log('Form Data:', data)
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-white">Request for Permanent Contract Termination</h1>
                    <div className="bg-green-500 px-6 py-2 rounded-lg">
                        <p className="text-white font-bold">Terminate Contract</p>
                        <div className="relative">
                            <select className="bg-green-500 text-white font-bold appearance-none pr-6 focus:outline-none cursor-pointer">
                                <option>▼</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Case Information */}
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Case ID: [Number]</h2>
                    <h3 className="text-lg font-bold text-white">[Hotel Name]</h3>
                    <p className="text-white font-semibold">Request Draft Date :</p>
                </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-4">
                <div className="flex-1 bg-cyan-400 p-4 rounded-lg">
                    <p className="font-bold text-gray-900 text-center">Financial Issues</p>
                </div>
                <div className="flex-1 bg-cyan-400 p-4 rounded-lg">
                    <p className="font-bold text-gray-900 text-center">Security Hold</p>
                </div>
                <div className="flex-1 bg-cyan-400 p-4 rounded-lg">
                    <p className="font-bold text-gray-900 text-center">Approved</p>
                </div>
                <div className="flex-1 bg-cyan-400 p-4 rounded-lg">
                    <p className="font-bold text-gray-900 text-center">Closed/Snoozed</p>
                </div>
            </div>

            {/* View Complete Detail */}
            <div className="bg-cyan-400 p-4 rounded-lg cursor-pointer flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">View Complete Detail</h2>
                <ChevronDown className="h-6 w-6 text-gray-900" />
            </div>

            {/* Main Content */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-bold text-gray-900 mb-2">Posted By Admin : Date DD/MM/YY</p>
                    </div>

                    {/* Closing the Property Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            Closing the Property (But Keeping the Account)
                        </h3>
                        <p className="text-sm text-gray-700 mb-4">
                            Use this if you want to stop selling rooms for a long time (e.g., selling the building or renovation) but <strong>might</strong> want to reactivate the account back later.
                        </p>

                        <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
                            <p className="text-sm font-bold text-gray-900">
                                Subject: Permanent Closure of Availability – Property ID: [Your ID Number]
                            </p>
                        </div>
                    </div>

                    {/* Letter Template */}
                    <div className="space-y-4 text-sm text-gray-700">
                        <p>To the Partner Support Team,</p>

                        <p>
                            Please be advised that <strong>[Hotel Name]</strong> will be closing its operations indefinitely.
                        </p>

                        <p>
                            I have zeroed out the inventory in the calendar, but I would like to request that the property status be set to <strong>"Permanently Closed"</strong> on the platform to prevent any future booking attempts.
                        </p>

                        <p>
                            I have ensured all past commissions are paid and all guest stays are completed. Please confirm when the "Closed" status is reflected on the public listing.
                        </p>

                        <div className="mt-6">
                            <p>Sincerely,</p>
                            <p className="mt-2 font-bold">Admin Dept.</p>
                            <p className="font-bold">www.rishikeshrent.com</p>
                        </div>
                    </div>

                    {/* Important Steps */}
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                        <h3 className="font-bold text-gray-900 mb-3">Important Steps to Take Before Sending:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>
                                <strong>Export Your Data:</strong> Once the account is closed, you may lose access to your guest history and tax invoices. Download your <strong>Reservation Statements</strong> for 2025 and 2026 now.
                            </li>
                            <li>
                                <strong>Check Outstanding Invoices:</strong> Go to the "Finance" tab in the Extranet. If you owe even $1, Booking.com may delay the closure or send the bill to a collection agency.
                            </li>
                            <li>
                                <strong>Message Upcoming Guests:</strong> If you are canceling existing bookings, you <strong>must</strong> message the guests individually before the platform shuts down your communication access.
                            </li>
                        </ul>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-3">What Happens After Closure:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Your property listing will be removed from search results</li>
                            <li>Existing bookings must be honored or properly canceled</li>
                            <li>You may retain login access for historical data (varies by platform)</li>
                            <li>Reopening may require a new verification process</li>
                            <li>Outstanding financial obligations must be settled</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold">
                            Save Draft
                        </Button>
                        <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold">
                            Submit Termination Request
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Final Warning */}
            <Card className="shadow-md bg-red-50 border-l-4 border-red-500">
                <CardContent className="p-6">
                    <h3 className="font-bold text-red-900 mb-3">⚠️ Important Warning:</h3>
                    <p className="text-sm text-red-800">
                        Permanent contract termination is irreversible in most cases. Make sure you have:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-800 mt-2">
                        <li>Downloaded all reservation data and invoices</li>
                        <li>Settled all outstanding financial obligations</li>
                        <li>Notified all guests with upcoming bookings</li>
                        <li>Considered the impact on your business reputation</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default PermanentContractTermination
