"use client"
import React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const FraudLegalDisputeResponse = () => {
    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header with Close Button */}
            <div className="relative bg-white border-2 border-gray-300 rounded-lg p-6">
                <button className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2">
                    <X className="h-6 w-6" />
                </button>

                <div className="bg-yellow-400 inline-block px-6 py-2 rounded-full mb-6">
                    <p className="font-bold text-gray-900">
                        flagged your account as "Fraud" and "Legal Dispute,"
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        Potential Official Response from OTA Management
                    </h2>

                    <div>
                        <p className="text-sm font-bold text-gray-900">
                            Subject: RE: Formal Representation Regarding Account Status – (Property ID)
                        </p>
                        <p className="text-sm text-gray-700 mt-2">To [Your Name/Property Name],</p>
                    </div>

                    <p className="text-sm text-gray-700">
                        We are in receipt of your correspondence dated January 25, 2026].
                    </p>

                    <p className="text-sm text-gray-700">
                        Please be advised that the suspension of your account was not a decision taken lightly. It is the result of repeated violations of our <strong>Terms of Use (Section 4: Host Obligations)</strong> and a failure to uphold the safety and financial standards required by our platform.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-bold text-gray-900 mb-3">
                            Regarding your request for reinstatement, we note the following non-negotiable points:
                        </p>

                        <ul className="space-y-3 text-sm text-gray-700">
                            <li>
                                <strong>• Financial Liability:</strong> As of this date, your account shows an outstanding balance of ₹ [Amount]. This includes unpaid commissions and guest refund penalties. Reinstatement will not be considered until this balance is cleared in full.
                            </li>
                            <li>
                                <strong>• Behavioral Violations:</strong> We have received documented evidence of "Misbehavior with Guests" and "Non-Responsiveness." Our platform operates on trust; behavior that compromises guest safety or brand reputation results in permanent termination.
                            </li>
                            <li>
                                <strong>• Legal Standing:</strong> Due to the "Legal Dispute" and "Fraud" flags, this matter has been forwarded to our legal counsel. We are currently reviewing the "Multiple Cancellation" logs and "Fake Listing" reports. If substantiated, this could result in significant financial loss to RishikeshRent.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <p className="text-sm font-bold text-gray-900 mb-3">Next Steps:</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>
                                <strong>Immediate Payment:</strong> Clear all dues within <strong>48 hours</strong> to avoid further legal escalation (or account deletion).
                            </li>
                            <li>
                                <strong>Formal Documentation:</strong> If you dispute the "Fraud" or "Misbehavior" claims, you must provide signed affidavits or digital evidence (CCTV/chat logs) within <strong>5 business days</strong>.
                            </li>
                        </ol>
                    </div>

                    <p className="text-sm text-gray-700">
                        Failure to comply will result in the permanent blacklisting of your property and the initiation of legal proceedings for breach of contract.
                    </p>

                    <div className="mt-6">
                        <p className="text-sm font-bold text-gray-900">Regards,</p>
                        <p className="text-sm font-bold text-gray-900 mt-2">Compliance Team</p>
                        <p className="text-sm font-bold text-gray-900">www.rishikeshrent.com</p>
                    </div>

                    {/* How to Prepare Section */}
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            💡 How you should prepare for this response:
                        </h3>
                        <p className="text-sm text-gray-700 mb-3">
                            If you receive a message like the one above, you need to be ready with <strong>three things immediately</strong>:
                        </p>

                        <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                            <li>
                                <strong>A Payment Receipt:</strong> They will likely ignore any excuses regarding money. Paying the debt is your only "lever" to get them to talk.
                            </li>
                            <li>
                                <strong>Evidence for the "Misbehavior" claim:</strong> If a guest was actually the aggressor, do you have WhatsApp screenshots or CCTV footage? You'll need to "prove the negative."
                            </li>
                            <li>
                                <strong>The "Third-Party" Defense:</strong> If the cancellations were due to a software sync error (Channel Manager) rather than your own choice, gather those technical logs now.
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FraudLegalDisputeResponse
