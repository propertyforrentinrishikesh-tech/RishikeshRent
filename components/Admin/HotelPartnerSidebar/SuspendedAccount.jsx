"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SuspendedAccount = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            suspendedReason: '',
            titleLine: '',
            detailDescription: ''
        }
    })

    const [selectedReason, setSelectedReason] = useState('')

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your appeal logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header Alert */}
            <div className="bg-cyan-400 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Suspended</h1>
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

            {/* Warning Message */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-800">
                    <strong>www.rishikeshrent.com</strong> takes manual action against your account due to a violation of our policies.
                </p>
            </div>

            {/* Reopen Again Button */}
            <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg">
                Reopen Again
            </Button>

            {/* Identify the Cause Section */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Identify the Cause</h2>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-bold text-gray-900 mb-2">
                            Before trying to reopen, you must find out why the action was taken.
                        </p>
                        <p className="text-sm text-gray-700">
                            Check your email (including spam) for a suspension notice.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Posted by Admin - Date: DD/MM/YY
                        </p>
                    </div>

                    {/* Reasons List */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-3">Reasons range from protecting data:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>
                                <strong>High Cancellation Rate:</strong> Frequently cancelling guest bookings (overbooking).
                            </li>
                            <li>
                                <strong>Safety/Quality Complaints:</strong> Serious or repeated reports from guests about the property condition.
                            </li>
                            <li>
                                <strong>Fraud Alerts:</strong> Creating duplicate listings or having inconsistent ownership documentation.
                            </li>
                            <li>
                                <strong>Terms Violation:</strong> Encouraging guests to book offline to avoid commissions (circumvention).
                            </li>
                        </ol>
                    </div>

                    {/* Reopening by Platform */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                        <h3 className="font-bold text-gray-900 mb-2">Reopening by Platform</h3>
                        <p className="text-sm text-gray-700">
                            <strong>Permanent Removal:</strong> If you were "Removed," you must file an appeal through the www.rishikeshrent.com Help Center. You will need to provide reservation codes and evidence (photos, receipts) that the complaints against you were not justified or have been fixed.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Appeal Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Card className="shadow-md border-l-4 border-cyan-500">
                    <CardContent className="p-6 space-y-4">
                        {/* Select Suspended Reasons */}
                        <div>
                            <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Suspended Reasons
                            </Label>
                            <div className="relative">
                                <select
                                    {...register('suspendedReason', { required: true })}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="w-full px-4 py-4 bg-cyan-400 text-gray-900 rounded-lg appearance-none font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-600"
                                >
                                    <option value="">Select reason...</option>
                                    <option value="cancellation">High Cancellation Rate</option>
                                    <option value="complaints">Safety/Quality Complaints</option>
                                    <option value="fraud">Fraud Alerts</option>
                                    <option value="terms">Terms Violation</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700 pointer-events-none" />
                            </div>
                        </div>

                        {/* Type Title Line */}
                        <div>
                            <Input
                                type="text"
                                placeholder="Type Title Line"
                                {...register('titleLine', { required: true })}
                                className="w-full px-4 py-4 bg-cyan-400 text-gray-900 placeholder-gray-700 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-600"
                            />
                        </div>

                        {/* Detail Description */}
                        <div>
                            <textarea
                                placeholder="Detail Description"
                                {...register('detailDescription', { required: true })}
                                rows={8}
                                className="w-full px-4 py-4 bg-cyan-400 text-gray-900 placeholder-gray-700 rounded-lg font-semibold resize-none focus:outline-none focus:ring-2 focus:ring-cyan-600"
                            />
                        </div>

                        {/* Upload Evidence */}
                        <div>
                            <Button
                                type="button"
                                className="w-full py-4 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-bold text-lg rounded-lg"
                            >
                                Upload Evidence
                            </Button>
                            <p className="text-sm text-gray-600 text-center mt-2">
                                Image / Mp3 / Video / Pdf Formate
                            </p>
                        </div>

                        {/* Make Appeal Button */}
                        <Button
                            type="submit"
                            className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-lg transition-colors shadow-lg"
                        >
                            Make Appeal
                        </Button>
                    </CardContent>
                </Card>
            </form>

            {/* Additional Help */}
            <Card className="shadow-md">
                <CardContent className="p-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900 mb-3">Tips for a Successful Appeal:</h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>Be honest and transparent about what happened</li>
                            <li>Provide concrete evidence (photos, receipts, communication logs)</li>
                            <li>Explain what steps you've taken to prevent future issues</li>
                            <li>Include reservation codes and dates for reference</li>
                            <li>Respond promptly to any follow-up questions</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SuspendedAccount
