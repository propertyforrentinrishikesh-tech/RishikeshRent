"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ReinstatementProcess = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            propertyId: '',
            accountEmail: '',
            phoneNumber: ''
        }
    })

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your reinstatement logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header Alert */}
            <div className="bg-cyan-400 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">The Reinstatement Process</h1>
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
                    {/* Introduction */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Check your Inbox &gt; Rishikeshrent.com Messages</strong> for a specific notification regarding the suspension.
                        </p>
                    </div>

                    {/* Process Steps */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">1. Identify the Root Cause</h2>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Check your email (including spam) for any account-related messages (Check your inbox).</li>
                            <li>Log into your extranet and look for banners or notifications.</li>
                            <li>Investigate issues: Missing tax documents, expired IDs, duplicate listings, Rishikeshrent.com.</li>
                            <li>Negative reviews: Repeated low ratings for cleanliness or service.</li>
                            <li>Property Breaches: Suspending may identify a potential fraud.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">2. Fix the Underlying Issue</h2>
                        <p className="text-sm text-gray-700 mb-3">
                            Before you can request reinstatement, you must address the root cause. For instance:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li><strong>Proof of Identity:</strong> New photos of government IDs, business permits.</li>
                            <li><strong>Compliance Documents:</strong> Updated tax certificates or local tourism licenses.</li>
                            <li><strong>Operational Improvements:</strong> Evidence of renovations, new staff training, or quality upgrades.</li>
                            <li>
                                <strong>Documentation:</strong> Receipts for repairs, utility bills to prove address, or screenshots of the property's real condition.
                            </li>
                        </ul>
                    </div>

                    {/* Subject Section */}
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Subject: Urgent: Reinstatement Request
                        </h2>
                        <p className="text-sm text-gray-700">
                            (Property Name / ID) - (Account Email)
                        </p>
                    </div>

                    {/* Email Template */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-3">Email Body:</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p>
                                <strong>I am writing to formally request the reinstatement of our account (listing [Property Name / ID]) on Rishikeshrent.com.</strong>
                            </p>
                            <p>
                                <strong>State the suspension. I have taken the following steps to resolve the issue:</strong>
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>[Step 1: e.g., Updated my billing information]</li>
                                <li>[Step 2: e.g., Completed the property verification process]</li>
                                <li>[Step 3: e.g., Provided updated tax documents]</li>
                            </ul>
                            <p>
                                <strong>I acknowledge and have reviewed the Rishikeshrent.com terms and conditions and am committed to maintaining full compliance going forward.</strong>
                            </p>
                            <p>
                                <strong>Please let me know if any further documentation is required to resolve this matter.</strong>
                            </p>
                            <p className="mt-4">
                                I look forward to a swift resolution so we can resume serving our guests.
                            </p>
                            <p className="text-blue-600">
                                <strong>www.rishikeshrent.com</strong> and <strong>directly message the account with the subject line as mentioned.</strong>
                            </p>
                            <p className="text-red-600 font-bold">
                                Please send it as a attachment in a prepared dispute. Via
                            </p>
                        </div>
                    </div>

                    {/* Official Form Section */}
                    <div className="border-t-2 border-gray-200 pt-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Official Reinstatement Submission Form
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Section 1: Account Information */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Section 1: Account Information</h3>
                                <p className="text-sm text-gray-600 mb-4">Fill in Your Rishikeshrent.com Account Name</p>

                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700">Property ID / Listing ID:</Label>
                                        <Input
                                            type="text"
                                            {...register('propertyId', { required: true })}
                                            className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700">Account Email Address:</Label>
                                        <Input
                                            type="email"
                                            {...register('accountEmail', { required: true })}
                                            className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold text-gray-700">Phone Number:</Label>
                                        <Input
                                            type="tel"
                                            {...register('phoneNumber', { required: true })}
                                            className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Reason for Appeal */}
                                <div className="mt-6 bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
                                    <p className="text-sm font-bold text-gray-900 mb-2">*Reason for Appeal*</p>
                                    <p className="text-xs text-gray-600">
                                        Briefly explain why you believe the suspension should be revoked. For instance:
                                    </p>
                                </div>

                                {/* Areas to Fix */}
                                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-bold text-gray-900 mb-3">Areas to Fix:</h4>
                                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                        <li>We have updated our payment method and uploaded our current information to resolve the issue.</li>
                                        <li>We have resolved the compliance issue and are now fully verified.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Upload Now Button */}
                            <Button
                                type="button"
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-lg"
                            >
                                Upload Now
                            </Button>

                            {/* Request Release Steps */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-gray-900 mb-3">Request Release: Your Steps to Get Back In:</h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                    <li><strong>Missing Notification Documents [ ]</strong></li>
                                    <li><strong>Proof of Compliance (tax forms, business license) [ ]</strong></li>
                                    <li><strong>Updated Property Photos (if quality was flagged) [ ]</strong></li>
                                    <li><strong>Written Explanation of Corrective Actions [ ]</strong></li>
                                    <li><strong>Individual Entry/Invoices Flagging</strong></li>
                                </ol>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-lg font-bold text-xl"
                            >
                                Reinstatement Submission Appeal
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ReinstatementProcess
