"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const OTATerminationLetter = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">OTA Termination Letter</h1>
                <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">Date: [Insert Date]</p>
                </div>
            </div>

            {/* Letter Content */}
            <Card className="shadow-md border-l-4 border-blue-500">
                <CardContent className="p-8 space-y-6">
                    {/* Header Section */}
                    <div className="space-y-2">
                        <p className="text-sm text-gray-700">To: The Account Manager / Legal Department</p>
                        <p className="text-sm text-gray-700">www.rishikeshrent.com</p>
                        <p className="text-sm text-gray-700">Rishikesh Rent Platform</p>
                        <p className="text-sm text-gray-700">Booking.com Customer Service / Compliance Team, First Floor</p>
                        <p className="text-sm text-gray-700">Herengracht 597, 1017 CE Amsterdam</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-gray-700">From: [Legal Company / Partnership] for</p>
                        <p className="text-sm text-gray-700">Property ID: [Insert Property ID Number]</p>
                        <p className="text-sm text-gray-700">Property Name: [Your Hotel Name]</p>
                    </div>

                    {/* Subject */}
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
                        <p className="font-bold text-gray-900">
                            Subject: Urgent Request for Account Reinstatement
                        </p>
                    </div>

                    {/* Letter Body */}
                    <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                        <p>Dear Sir/Madam,</p>

                        <p>
                            I/We write on behalf of <strong>[Your Hotel Name]</strong> (listed as property ID <strong>[Insert ID]</strong>) on your platform. Our account was recently suspended due to <strong>[Insert Reason]</strong> (e.g., "a billing dispute," "alleged rate parity violation," etc.).
                        </p>

                        <p>
                            We are submitting this letter to formally request the <strong>immediate reinstatement</strong> of our property listing on Rishikeshrent.com.
                        </p>

                        <p>
                            We are extremely sorry for the inconvenience caused and would like to assure you that we have taken all necessary steps to rectify the situation. We have:
                        </p>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="font-semibold text-gray-900 mb-2">As part of this reinstatement process, please review the following:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>
                                    <strong>Proof of Payment / Billing Correction:</strong> Attached are copies of our recent bank transfer (Transaction ID: [Insert ID]) showing that the outstanding balance has been settled.
                                </li>
                                <li>
                                    <strong>Rate Parity Compliance:</strong> We confirm that our rates on all OTAs (Expedia, Agoda, etc.) and our direct website are now aligned. [Attach screenshots if needed.]
                                </li>
                                <li>
                                    <strong>Updated Documentation:</strong> We have uploaded new photos, updated our property description, and ensured all compliance documents (tax IDs, business licenses) are current.
                                </li>
                            </ul>
                        </div>

                        <p>
                            We fully acknowledge our responsibility to adhere to Rishikeshrent.com's Terms and Conditions. We have reviewed the platform policies and commit to maintaining strict compliance going forward.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                            <p className="font-semibold text-gray-900 mb-2">We respectfully request:</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>
                                    <strong>Immediate Review:</strong> That your team reviews our submitted evidence and documentation at the earliest.
                                </li>
                                <li>
                                    <strong>Expedited Reinstatement:</strong> Given the financial impact of being offline, we kindly ask for an expedited review process.
                                </li>
                                <li>
                                    <strong>Clear Communication:</strong> If any additional information is needed, please contact us immediately via:
                                    <ul className="list-disc list-inside ml-6 mt-2">
                                        <li>Email: [Insert Your Email]</li>
                                        <li>Phone: [Insert Phone Number]</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>

                        <p>
                            We value our partnership with Rishikeshrent.com and are eager to continue providing excellent service to our mutual guests.
                        </p>

                        <p>Thank you for your prompt attention to this matter.</p>

                        <div className="mt-6">
                            <p>Sincerely,</p>
                            <p className="mt-2">[Your Name / Title (e.g., General Manager / Owner / Authorized Representative)]</p>
                            <p>[Legal Company Name / Partnership Name]</p>
                        </div>

                        <div className="border-t-2 border-gray-200 pt-4 mt-6">
                            <p className="font-semibold text-gray-900 mb-2">Important Data Before Sending:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Attach proof of payment (bank slip, transaction receipt, etc.)</li>
                                <li>Include screenshots showing rate parity compliance across all OTAs and your direct website.</li>
                                <li>
                                    Attach updated property photos, tax documents, or business licenses if those were flagged.
                                </li>
                                <li>
                                    Keep a copy of this letter and all attachments for your records.
                                </li>
                                <li>
                                    Send this letter via email to Rishikeshrent.com's official support channel or upload it through the platform's messaging system.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold text-lg">
                            Copy Template
                        </Button>
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg">
                            Edit & Update
                        </Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg">
                            Submit Request
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default OTATerminationLetter
