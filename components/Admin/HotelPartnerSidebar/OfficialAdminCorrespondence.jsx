"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const OfficialAdminCorrespondence = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            propertyName: ''
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
                    <h1 className="text-2xl font-bold text-white">Official/Admin Correspondence</h1>
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
                <CardContent className="p-6">
                    <p className="text-sm text-gray-700">
                        <strong>You must address the core issue with the legal/support team. Below are the traffic contact details and a structured legal-style notice you can use to initiate a formal settlement of the dispute.</strong>
                    </p>
                </CardContent>
            </Card>

            {/* Key Official Contacts */}
            <Card className="shadow-md">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">📧 Key Official Contacts</h2>
                    <p className="text-sm text-gray-700 mb-4">
                        Once you have the registered details for <strong>Adventure Asia / RishikeshRent</strong>, you should send your correspondence to the following emails simultaneously (CC them all):
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                        <li>
                            <strong>Primary Admin:</strong> <span className="text-blue-600">contact@rishikeshrent.com</span>
                        </li>
                        <li>
                            <strong>Official Support:</strong> <span className="text-blue-600">info@rishikeshrent.com</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Quick Note Template */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-6">
                    <div className="bg-yellow-400 p-4 rounded-lg">
                        <h2 className="text-xl font-bold text-gray-900">Or Making A Quick Note :</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-700 font-bold">To, The Administration/Legal Department,</p>
                            <p className="text-sm text-gray-700">www.rishikeshrent.com</p>
                            <p className="text-sm text-gray-700">Rishikesh.</p>
                        </div>

                        <div className="bg-blue-100 p-4 rounded-lg">
                            <p className="text-sm font-bold text-gray-900">
                                Subject: Formal Representation Regarding Account Status & Dispute Resolution
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label className="text-sm font-semibold text-gray-700">[ Type Your Property Name ]</Label>
                                <Input
                                    type="text"
                                    {...register('propertyName', { required: true })}
                                    className="w-full mt-2 px-4 py-3 border-2 border-gray-300 rounded-lg bg-cyan-100"
                                />
                            </div>

                            <div className="space-y-4 text-sm text-gray-700">
                                <p>Dear Management,</p>

                                <p>
                                    This letter serves as an official response to the notice of account termination/suspension of <strong>[Your Property/Account Name]</strong> on the grounds of policy violations, outstanding invoices, and guest-related complaints.
                                </p>

                                <p>
                                    We acknowledge the seriousness of the points raised. In the interest of maintaining a professional partnership and resolving all pending issues, we submit this disclosure:
                                </p>

                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div>
                                        <p className="font-bold text-gray-900">1. Financial Reconciliation:</p>
                                        <p>
                                            We request a definitive "Statement of Account" (SOA) as of <strong>January 25, 2026</strong>, detailing all outstanding commissions and penalties. We are prepared to settle all verified dues within <strong>48 hours</strong> of receiving this document.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-gray-900">2. Addressing Behavioral & Service Claims:</p>
                                        <p>
                                            We take note of the "Misbehavior with Guests" and "Fraud" allegations. We request the specific booking IDs or incident dates associated with these claims so we may conduct an internal inquiry and provide a factual rebuttal or a formal offer of corrective action (e.g., staff retraining, property upgrades).
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-gray-900">3. Mediation of Legal Dispute:</p>
                                        <p>
                                            We note the "Legal Dispute" status on our profile. We propose an <strong>Administrative Hearing or Virtual Meeting</strong> with your compliance team to resolve these grievances outside of formal litigation, as per the dispute resolution clause in our Terms of Use.
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-bold text-gray-900">4. Stay of Action:</p>
                                        <p>
                                            Pending the outcome of this correspondence, we request a temporary stay on any further legal or blacklisting actions, allowing us to demonstrate our commitment to compliance.
                                        </p>
                                    </div>
                                </div>

                                <p>
                                    We await your formal reply within <strong>3 business days</strong> to proceed with the necessary settlements.
                                </p>

                                <div className="mt-6">
                                    <p>For [Your Business Name],</p>
                                    <p className="mt-2">(Signature)</p>
                                    <p className="mt-2">[Your Name] Proprietor/Authorized Signatory Contact: [Your Phone Number]</p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg"
                            >
                                Submit Data
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="shadow-md bg-blue-50">
                <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Important Notes:</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                        <li>Keep copies of all correspondence for your records</li>
                        <li>Send via registered email with read receipts</li>
                        <li>Follow up within 3-5 business days if no response</li>
                        <li>Maintain professional tone throughout all communications</li>
                        <li>Document all interactions with timestamps</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default OfficialAdminCorrespondence
