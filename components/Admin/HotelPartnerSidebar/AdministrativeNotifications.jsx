"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload } from 'lucide-react'

const AdministrativeNotifications = () => {
    const [uploadedVideo, setUploadedVideo] = useState(false)
    const [uploadedCode, setUploadedCode] = useState(false)

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-orange-500 p-4 rounded-lg">
                <h1 className="text-2xl font-bold text-white">"Administrative" folder/Notifications</h1>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 px-6 py-2 rounded-lg">
                        <p className="text-white font-bold">Status</p>
                    </div>
                    <div className="bg-green-500 px-6 py-2 rounded-lg">
                        <p className="text-white font-bold">"Closed/Not Bookable."</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-6">
                    {/* The "Ready to Open" Checklist */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            1. The "Ready to Open" Checklist
                        </h2>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                            <p className="text-sm text-gray-700">
                                <strong className="text-gray-900">We</strong> has a strict automated check. If any of these are missing, your status will remain "Closed/Not Bookable."
                            </p>
                        </div>

                        {/* Open for Bookings Button */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                                <p className="text-sm text-gray-700 mb-3">
                                    <strong>• The "Open for Bookings" Button:</strong> in the <strong>Extranet</strong>, look for a large banner on the Home page that says <strong>"Set my property live"</strong> or <strong>"Open for bookings."</strong> You must click this manually.
                                </p>
                            </div>

                            {/* Verification Section */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                                <p className="text-sm text-gray-700 mb-4">
                                    <strong>• Verification (Location/ID):</strong> often sends a physical letter with a code to your property address or requires a video upload of the property to prove it exists. Your account won't be bookable until this is verified.
                                </p>

                                {/* Upload Video */}
                                <div className="mb-4">
                                    <Button
                                        onClick={() => setUploadedVideo(true)}
                                        className={`w-full max-w-md py-4 rounded-lg font-bold text-lg ${uploadedVideo
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-green-500 hover:bg-green-600'
                                            } text-white`}
                                    >
                                        <Upload className="inline mr-2 h-5 w-5" />
                                        Upload Video
                                    </Button>
                                    <p className="text-sm text-gray-600 mt-2 ml-2">Property Verification Video</p>
                                </div>

                                {/* Upload Code */}
                                <div className="bg-yellow-200 p-4 rounded-lg">
                                    <Button
                                        onClick={() => setUploadedCode(true)}
                                        className={`w-full max-w-md py-4 rounded-lg font-bold text-lg ${uploadedCode
                                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                                : 'bg-yellow-500 hover:bg-yellow-600'
                                            } text-gray-900`}
                                    >
                                        <Upload className="inline mr-2 h-5 w-5" />
                                        Upload Code
                                    </Button>
                                    <p className="text-sm text-gray-700 mt-2 ml-2">Code From Verification Letter</p>
                                </div>
                            </div>

                            {/* Inventory & Rates */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                                <p className="text-sm text-gray-700 mb-3">
                                    <strong>• Inventory & Rates:</strong> You must have <strong>at least one room type</strong> with:
                                </p>
                                <ul className="list-disc list-inside ml-6 space-y-2 text-sm text-gray-700">
                                    <li>
                                        <strong>Price:</strong> A rate assigned to a "Rate Plan."
                                    </li>
                                    <li>
                                        <strong>Availability:</strong> At least "1" unit available in the calendar for future dates.
                                    </li>
                                </ul>
                            </div>

                            {/* Go To Rates Button */}
                            <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg">
                                Go To Rates and Availability
                            </Button>

                            {/* KYC Section */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                                <p className="text-sm text-gray-700 mb-3">
                                    <strong>• KYP (Know Your Partner):</strong> Check <strong>Inbox &gt; Booking.com Messages</strong>. If you haven't filled out your tax forms or business details, they will keep you offline for compliance.
                                </p>
                            </div>

                            {/* Complete KYC Button */}
                            <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg">
                                Complete your KYC Form
                            </Button>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="border-t-2 border-gray-200 pt-6">
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                            <h3 className="font-bold text-gray-900 mb-3">Important Reminders:</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                <li>All verification steps must be completed before your property becomes bookable</li>
                                <li>Keep your verification letter and code in a safe place</li>
                                <li>Video verification should clearly show your property's exterior and key features</li>
                                <li>Ensure at least one room type has pricing and availability set</li>
                                <li>Complete KYC/KYP forms promptly to avoid delays</li>
                            </ul>
                        </div>

                        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                                <strong>Pro Tip:</strong> After completing all steps, it may take 24-48 hours for your property status to update to "Open/Bookable." Check your extranet dashboard regularly for status updates.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdministrativeNotifications
