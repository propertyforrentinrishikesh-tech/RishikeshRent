"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ReinstatementTimelines = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            caseId: '',
            hotelName: '',
            requestDate: ''
        }
    })

    const onSubmit = (data) => {
        console.log('Form Data:', data)
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-orange-500 p-4 rounded-lg">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reinstatement Timelines</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 px-6 py-2 rounded-lg">
                        <p className="text-white font-bold">Status</p>
                    </div>
                    <div className="bg-green-500 px-6 py-2 rounded-lg">
                        <p className="text-white font-bold">"High Policies"</p>
                    </div>
                </div>
            </div>

            {/* Admin Reply Section */}
            <Card className="shadow-md border-l-4 border-red-500">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Admin Reply</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700">Case ID: [Number]</Label>
                                <Input
                                    type="text"
                                    {...register('caseId')}
                                    className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="bg-green-500 px-4 py-2 rounded text-white font-bold text-center">
                                    Verification Number
                                </div>
                                <div className="bg-green-500 px-4 py-2 rounded text-white font-bold text-center">
                                    Security Hold
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700">[Hotel Name]</Label>
                                <Input
                                    type="text"
                                    {...register('hotelName')}
                                    className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="bg-yellow-400 px-4 py-2 rounded text-gray-900 font-bold text-center">
                                    Pending/ Response
                                </div>
                                <div className="bg-orange-500 px-4 py-2 rounded text-white font-bold text-center">
                                    Approved
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700">Request Draft Date :</Label>
                                <Input
                                    type="text"
                                    {...register('requestDate')}
                                    className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="bg-red-500 px-4 py-2 rounded text-white font-bold text-center flex items-center justify-center">
                                Closed/Snoozed
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Main Content */}
            <Card className="shadow-md border-l-4 border-blue-500">
                <CardContent className="p-6 space-y-6">
                    <p className="text-sm text-gray-700">
                        <strong>Reminder:</strong> You can file a <strong>new appeal</strong> once your case has a closure, commission issue or "security verification."
                    </p>

                    {/* Regarding Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            Regarding the reason for the initial suspension:
                        </h3>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                            <li>
                                <strong>If it was financial:</strong> We have submitted the billing balance of [Amount] as of [Date]. Please confirm receipt and update our account status.
                            </li>
                            <li>
                                <strong>If it was compliance:</strong> We have uploaded our "Know Your Partner" (KYP) forms and business licenses (attached).
                            </li>
                            <li>
                                <strong>If it was service/quality:</strong> We have updated our "Know Your Partner" (KYP) forms and business licenses (attached).
                            </li>
                        </ul>
                    </div>

                    {/* View Complete Message */}
                    <div className="bg-cyan-400 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-900">View Complete Message</h3>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                            Here is very optimistic if you have already submitted your appeal and are now in the "waiting period" for the decision to appear on your account. Here's what to expect:
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-3">1. The Waiting Timeline (What to Expect)</h4>
                            <p className="text-sm text-gray-700 mb-2">
                                Most platforms will not give you an exact date, but here's the <strong>3 business days</strong> to process an appeal:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-4">
                                <li>
                                    <strong>Day 1-3:</strong> Your case is assigned to a "Trust & Safety" or "Finance" specialist.
                                </li>
                                <li>
                                    <strong>Day 3-5:</strong> They review your documentation (bank slip, compliance docs, guest testimonials).
                                </li>
                                <li>
                                    <strong>Day 5-7:</strong> You will receive an automated email saying your billing is "Live" or asking for more pieces of information.
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-3">2. While You Wait: The Pre-Opening Checklist</h4>
                            <p className="text-sm text-gray-700 mb-2">
                                To ensure you don't lose time once the account is reopened, log into your <strong>Extranet</strong> and check these three things:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-4">
                                <li>
                                    <strong>• Update Your Rates:</strong> Ensure all your pricing is current for the next 30 days (or don't receive bookings immediately).
                                </li>
                                <li>
                                    <strong>• Check Your Availability:</strong> Ensure your property hasn't "Closed Out" during the billing suspension. Check the calendar and make sure your availability hasn't "Closed Out" during the suspension.
                                </li>
                                <li>
                                    <strong>• Clean Your Inbox:</strong> Respond to any pending guest messages that arrived while the billing was suspended (you don't want to start with a low response rate).
                                </li>
                            </ul>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                            <h4 className="font-bold text-gray-900 mb-3">3. If You Don't Hear Back in 5 Days</h4>
                            <p className="text-sm text-gray-700 mb-2">
                                If your account is suspended and you've had time to submit your appeal, you can send a new, <strong>polite follow-up</strong> as soon as possible. Sometimes a suspension can temporarily block your ability to reach specific, so you may need to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 ml-4">
                                <li>
                                    <strong>One Time:</strong> Send a follow-up email to the same address (with your case number in the subject line).
                                </li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>Checking Status: Case Closure (If you succeed):</strong> [Detail Name] is still showing as Inactive. We have now submitted documents. Please confirm if there is any issue or time in the range of reopening. We are ready to receive guests.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-3">One Time:</h4>
                            <p className="text-sm text-gray-700">
                                Once you are reopened, try not to get a <strong>new, positive review</strong> as soon as possible. Sometimes a suspension can temporarily block your ranking in search results, and a fresh 5-star review can help you climb back up.
                            </p>
                        </div>
                    </div>

                    {/* Final Buttons */}
                    <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                            "Feel satisfied" response, don't panic.
                        </Button>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold">
                        Appeal for Reinstatement
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default ReinstatementTimelines
