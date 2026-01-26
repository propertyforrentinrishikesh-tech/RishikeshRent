"use client"
import React, { useState } from 'react'
import { Eye, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

const PaymentDetailsPayouts = () => {
    const [selectedPayments, setSelectedPayments] = useState([])
    const [selectedInvoices, setSelectedInvoices] = useState([])

    const payments = [
        { id: 1, bookingCode: '', amount: '', tax: '', commission: '', bookingDate: '', transferDate: '', transferId: '' },
        { id: 2, bookingCode: '', amount: '', tax: '', commission: '', bookingDate: '', transferDate: '', transferId: '' },
        { id: 3, bookingCode: '', amount: '', tax: '', commission: '', bookingDate: '', transferDate: '', transferId: '' },
        { id: 4, bookingCode: '', amount: '', tax: '', commission: '', bookingDate: '', transferDate: '', transferId: '' },
        { id: 5, bookingCode: '', amount: '', tax: '', commission: '', bookingDate: '', transferDate: '', transferId: '' }
    ]

    const invoices = [
        {
            id: 1,
            document: 'Tax payment overview',
            number: '3500477948',
            date: 'Sep 4 2025',
            period: 'Aug 1 - Aug 31',
            status: 'Overdue (due by Sep 17 2025)',
            amount: '₹ 484.00'
        },
        {
            id: 2,
            document: 'Commission',
            number: '1638927923',
            date: 'Sep 3 2025',
            period: 'Aug 1 - Aug 31',
            status: 'Overdue (due by Sep 16 2025)',
            amount: '₹ 600.00'
        },
        {
            id: 3,
            document: 'Tax payment overview',
            number: '3003842027',
            date: 'Jul 4 2025',
            period: 'Jun 1 - Jun 30',
            status: 'Overdue (due by Jul 17 2025)',
            amount: '₹ 2,831.40'
        },
        {
            id: 4,
            document: 'Commission',
            number: '1632481036',
            date: 'Jul 3 2025',
            period: 'Jun 1 - Jun 30',
            status: 'Overdue (due by Jul 16 2025)',
            amount: '₹ 3,510.00'
        }
    ]

    const togglePayment = (id) => {
        setSelectedPayments(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleInvoice = (id) => {
        setSelectedInvoices(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-orange-500 p-4 rounded-lg">
                <div>
                    <h1 className="text-2xl font-bold text-white">Finance &gt; Reservation Statements.</h1>
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

            {/* Payment Details Section */}
            <Card className="shadow-md border-l-4 border-yellow-500">
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">"Payment Details" or "Payouts"</h2>
                        <p className="text-sm text-gray-700 mb-6">
                            This shows the specific batch of reservations that make up a single deposit in your bank account.
                        </p>

                        {/* Payment Table */}
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                                        <th className="p-3 text-left bg-green-500 text-white font-bold">S No.</th>
                                        <th className="p-3 text-left font-semibold text-gray-700">Booking Code</th>
                                        <th className="p-3 text-center font-semibold text-gray-700" colSpan={3}>
                                            Amount With Tax And Commission
                                        </th>
                                        <th className="p-3 text-center font-semibold text-gray-700" colSpan={2}>
                                            Booking And Transfer Date
                                        </th>
                                        <th className="p-3 text-center font-semibold text-gray-700">Transfer ID Number</th>
                                        <th className="p-3 text-center font-semibold text-gray-700">Actions</th>
                                    </tr>
                                    <tr className="bg-gray-50 border-b border-gray-300">
                                        <th className="p-3"></th>
                                        <th className="p-3"></th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600">Amount</th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600">Tax</th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600">Commission</th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600">Date</th>
                                        <th className="p-3 text-center text-xs font-semibold text-gray-600">Date</th>
                                        <th className="p-3"></th>
                                        <th className="p-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment, index) => (
                                        <tr
                                            key={payment.id}
                                            className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                }`}
                                        >
                                            <td className="p-3 bg-green-500 text-white font-bold text-center">
                                                {payment.id}
                                            </td>
                                            <td className="p-3 text-sm">{payment.bookingCode || '-'}</td>
                                            <td className="p-3 text-sm text-center bg-yellow-100">{payment.amount || '-'}</td>
                                            <td className="p-3 text-sm text-center bg-yellow-100">{payment.tax || '-'}</td>
                                            <td className="p-3 text-sm text-center bg-yellow-100">{payment.commission || '-'}</td>
                                            <td className="p-3 text-sm text-center bg-yellow-100">{payment.bookingDate || '-'}</td>
                                            <td className="p-3 text-sm text-center bg-yellow-100">{payment.transferDate || '-'}</td>
                                            <td className="p-3 text-sm text-center bg-cyan-200">{payment.transferId || '-'}</td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-1 hover:bg-gray-200 rounded">
                                                        <Eye className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                    <button className="p-1 hover:bg-gray-200 rounded">
                                                        <Download className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Download PDF */}
                        <div className="mt-4">
                            <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold">
                                <FileText className="inline mr-2 h-4 w-4" />
                                Download all pdf
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Outstanding Invoice Section */}
            <Card className="shadow-md border-l-4 border-blue-500">
                <CardContent className="p-6 space-y-6">
                    {/* Collapsible Header */}
                    <div className="bg-cyan-400 p-4 rounded-lg flex items-center justify-between cursor-pointer">
                        <h2 className="text-xl font-bold text-gray-900">Outstanding Invoice</h2>
                        <span className="text-2xl font-bold">▼</span>
                    </div>

                    {/* Invoice Details */}
                    <div className="space-y-4">
                        <p className="text-sm text-gray-700">
                            We produce your invoices based on the check-out dates of your reservations.
                        </p>
                        <p className="text-sm text-gray-700">
                            Legal company name: <span className="text-blue-600">Hotel Maya Residency Sonprayag</span>
                        </p>

                        {/* Outstanding Balances */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Outstanding balances</h3>

                            {/* Invoice Table */}
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                                            <th className="p-3 text-left">
                                                <Checkbox />
                                            </th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Document name</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Number</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Date</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Period</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Status</th>
                                            <th className="p-3 text-right font-semibold text-gray-700">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice, index) => (
                                            <tr
                                                key={invoice.id}
                                                className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                    }`}
                                            >
                                                <td className="p-3">
                                                    <Checkbox
                                                        checked={selectedInvoices.includes(invoice.id)}
                                                        onCheckedChange={() => toggleInvoice(invoice.id)}
                                                    />
                                                </td>
                                                <td className="p-3 text-sm">{invoice.document}</td>
                                                <td className="p-3 text-sm">
                                                    <span className="text-blue-600">{invoice.number}</span>
                                                    <FileText className="inline h-4 w-4 ml-1 text-gray-400" />
                                                </td>
                                                <td className="p-3 text-sm">{invoice.date}</td>
                                                <td className="p-3 text-sm">{invoice.period}</td>
                                                <td className="p-3 text-sm">
                                                    <div className="flex gap-2">
                                                        <a href="#" className="text-blue-600 hover:underline">PDF ⬇</a>
                                                        {invoice.document === 'Commission' && (
                                                            <>
                                                                <span>|</span>
                                                                <a href="#" className="text-blue-600 hover:underline">View statement</a>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3 text-sm">
                                                    <span className="text-red-600">{invoice.status}</span>
                                                </td>
                                                <td className="p-3 text-sm text-right font-semibold">{invoice.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Total and Proceed */}
                            <div className="mt-4 flex justify-between items-center">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold">
                                    Proceed to pay
                                </Button>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Total amount due: ₹ 7,425.40</p>
                                    <p className="text-lg font-bold text-gray-900">Amount to be paid: ₹ 7,425.40</p>
                                </div>
                            </div>

                            {/* Payment Instructions */}
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">
                                    If you'd like to pay via bank transfer, refer to the{' '}
                                    <a href="#" className="text-blue-600 hover:underline">payment instructions</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentDetailsPayouts
