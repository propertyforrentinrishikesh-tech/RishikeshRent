"use client"
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const PayoutSettings = () => {
    const [expandedSections, setExpandedSections] = useState({
        bankDetails: true,
        invoiceDetails: true,
        gstDetails: true
    })

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Payout Settings</h1>
                <p className="text-sm text-gray-600">Frequency of your payouts</p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <div className="col-span-3 space-y-3">
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-900">Bank details</h3>
                        <p className="text-xs text-gray-600">Receiving payouts from Booking.com</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                        <h3 className="font-semibold text-gray-900">General finance</h3>
                        <p className="text-xs text-gray-600">Invoice details</p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Goods and Services Tax</span>
                        <Check className="h-4 w-4 text-green-600" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-9 space-y-6">
                    {/* Bank Details Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('bankDetails')}
                        >
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Bank details</h2>
                                <p className="text-sm text-gray-600">Receiving payouts from Booking.com</p>
                            </div>
                            {expandedSections.bankDetails ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>

                        {expandedSections.bankDetails && (
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-gray-700">
                                    We'll transfer your payouts to this bank account
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                                    <p className="text-sm text-gray-700">
                                        You currently don't have any bank details entered in our records.
                                    </p>
                                </div>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
                                    Edit bank details
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* General Finance Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('invoiceDetails')}
                        >
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">General finance</h2>
                            </div>
                            {expandedSections.invoiceDetails ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>

                        {expandedSections.invoiceDetails && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Invoice details</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Here's where you can view and edit your invoice details.
                                    </p>
                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-4">
                                        <p className="text-sm text-gray-700">
                                            You'll also receive your invoices by email. Note that changes to your invoice details can't be made during the billing cycle (between the 1st and 7th of each month).
                                        </p>
                                    </div>

                                    {/* Invoice Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                                        <div>
                                            <p className="text-sm text-gray-600">Legal company name</p>
                                            <p className="font-semibold text-gray-900">Hotel Maya Residency Sonprayag</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">For the attention of</p>
                                            <p className="font-semibold text-gray-900">Hotel Maya Residency Sonprayag</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-semibold text-gray-900">Tilwari Nanyar Sonprayag Rd</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Zip/Postal code</p>
                                            <p className="font-semibold text-gray-900">246471</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">City</p>
                                            <p className="font-semibold text-gray-900">Sonprayag</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Country/Region</p>
                                            <p className="font-semibold text-gray-900">India</p>
                                        </div>
                                    </div>

                                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
                                        Edit details
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* GST Section */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                            className="bg-gray-50 p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection('gstDetails')}
                        >
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Goods and Services Tax</h2>
                            </div>
                            {expandedSections.gstDetails ? (
                                <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                        </div>

                        {expandedSections.gstDetails && (
                            <div className="p-6 space-y-6">
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                                    <p className="text-sm text-gray-700">
                                        Due to regulations established by the Indian government, we need your GST registration and PAN details. By submitting this information you confirm that your PAN and state registration are accurate.
                                    </p>
                                    <p className="text-sm text-gray-700 mt-2">
                                        Your commission will be calculated based on the interest in your GST registration number. We'll take this into account from the moment you enter these details into our system. Note that it is not possible to apply any changes with a retroactive effect. This may have implications on the taxes we collect and pay to the tax authorities, that are applicable to your reservations (i.e. GST or TCS)
                                    </p>
                                </div>

                                {/* GST Details Grid */}
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Are you registered for GST purposes?</p>
                                            <p className="font-semibold text-gray-900">No</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">PAN</p>
                                            <p className="font-semibold text-gray-900">JVIPS1019E</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Important info:</p>
                                            <p className="font-semibold text-gray-900">0.1%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Is the fourth character of your PAN a 'P' or an 'H'?</p>
                                            <p className="font-semibold text-gray-900">Yes</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Enter your 12-digit Aadhaar number</p>
                                        <p className="font-semibold text-gray-900">601855802064</p>
                                    </div>
                                </div>

                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
                                    Edit details
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayoutSettings
