"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const SuspendedTerminatedPolicy = () => {
    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-orange-500 p-4 rounded-lg">
                <div>
                    <h1 className="text-2xl font-bold text-white">Suspended* / Terminated* / Policy</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 px-6 py-2 rounded-lg">
                        <p className="text-white font-bold">Status</p>
                    </div>
                    <div className="bg-green-500 px-6 py-2 rounded-lg">
                        <p className="text-white font-bold">"Closed/Not Bookable."</p>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-4">
                    <p className="text-sm text-gray-700">
                        <strong>Read up the platform's policies and detailed liability guidelines, so account status of "Suspended" or "Terminated" typically means the platform has taken a more serious enforcement action against your listing.</strong>
                    </p>
                </CardContent>
            </Card>

            {/* Steps Section */}
            <div className="space-y-6">
                {/* Step 1 */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">1. Financial & Operational Breaches</h2>
                        <p className="text-sm text-gray-700">
                            <strong>Outstanding Invoices:</strong> Repeated failure to pay commissions or service fees is the most common reason for suspension. OTAs operate on a "pay-to-play" model. If the platform doesn't get paid, they will suspend your listing until the balance is cleared.
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Overbooking & No-Shows:</strong> If you consistently fail to honor confirmed bookings, this is often flagged as poor performance.
                        </p>
                        <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                            Check Outstanding Invoices
                        </Button>
                    </CardContent>
                </Card>

                {/* Step 2 */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">2. Behavioral & Guest Safety Issues</h2>
                        <p className="text-sm text-gray-700">
                            <strong>Severe Guest Complaints:</strong> If multiple guests report safety concerns, harassment, or serious service issues, the platform may suspend your listing to protect future guests.
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Fraud, Fake Listings, or Misrepresentation:</strong> If there are indications of fraud (e.g., photos that don't match the actual property), OTAs will often act swiftly and suspend the account.
                        </p>
                        <div className="flex gap-4">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                                Check Guest Reviews
                            </Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                                Update Property Information
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Step 3 */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">3. Legal & Administrative Conflicts</h2>
                        <p className="text-sm text-gray-700">
                            <strong>Policy Disputes:</strong> If the platform believes you've violated their Terms of Service ("ToS Dispute"), standard support teams are usually barred from assisting with you. Your account is frozen to enforce a settlement or legal resolution.
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Circumvention:</strong> Encouraging guests to book directly (outside the OTA platform) or manipulating reviews is a serious violation and often leads to immediate suspension.
                        </p>
                        <div className="flex gap-4">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                                Review ToS Compliance
                            </Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                                File Compliance Appeal
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Step 4 */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">4: Next Steps: How to Respond</h2>
                        <p className="text-sm text-gray-700">
                            If you believe your suspension is unjust or you're ready to settle the matter, follow this escalation path:
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Step 1: Audit and Settlement</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Before appealing, you must clear any <strong>Outstanding Invoices</strong>. An OTA will almost never discuss re-instatement if you owe them money.
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mb-3">
                                    <li>
                                        Go to <strong>Finance &gt; Invoices</strong> and pay all overdue amounts. Upload proof of payment (bank slip, transaction ID, etc.) if you've already paid.
                                    </li>
                                </ul>
                                <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                                    Submit Bank Transfer Slip
                                </Button>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Step 2: Formal Written Appeal</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Send a formal email to the platform's <strong>Legal Department</strong>. Check your termination notice for the specific contact or use the general legal/compliance email.
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                                    <li>
                                        <strong>Subject Line:</strong> "Urgent: Appeal for Reinstatement – Property ID [Your ID] – [Your Property Name]"
                                    </li>
                                    <li>
                                        <strong>Attach:</strong> Proof that you have taken steps to resolve issues (bank slip, photos of improvements, updated compliance docs, guest testimonials, etc.).
                                    </li>
                                    <li>
                                        <strong>Acknowledge Mistakes:</strong> If you violated a policy, own up to it. Provide a remediation outline and show you've taken corrective action (e.g., new staff training, property upgrades, updated rate parity, etc.).
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Step 3: Legal Mediation</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    If the Legal Dept. says, "sorry, we have a legal representative."
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-700 ml-4 mb-3">
                                    <li>
                                        <strong>Review the Terms of Use:</strong> Check the "Dispute Resolution" clause in the <strong>OTA Contract</strong>. Some platforms require arbitration or mediation before you can file a lawsuit.
                                    </li>
                                    <li>
                                        <strong>Negotiate:</strong> You have the right to request a settlement (e.g., paying a penalty, accepting a probationary period, etc.).
                                    </li>
                                </ul>
                                <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                                    Contact Us
                                </Button>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                                <h3 className="font-bold text-gray-900 mb-2">Step 4: Last Resort</h3>
                                <p className="text-sm text-gray-700">
                                    If your Account is suspended and you've had time action to recovering guest funds, you can request a formal legal review. This is the final step of the escalation, so use it only when all other avenues have been exhausted.
                                </p>
                            </div>
                        </div>

                        <Button className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold">
                            Request File
                        </Button>
                    </CardContent>
                </Card>

                {/* Final Note */}
                <Card className="shadow-md bg-blue-50">
                    <CardContent className="p-6">
                        <p className="text-sm text-gray-700 mb-4">
                            <strong>Note: If the Suspension is due to "Fraud" or "Guest Misbehavior,"</strong> be prepared for a permanent ban. In such cases, the platform may not reinstate your account, and ongoing violations could lead to legal action.
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold">
                            Check Our Policy
                        </Button>
                        <p className="text-sm text-gray-600 mt-3 text-center">
                            www.rishikeshrent.com - Know Policy in
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SuspendedTerminatedPolicy
